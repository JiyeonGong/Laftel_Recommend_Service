import json
import requests
import random
from datetime import datetime
from flask import Flask, request, jsonify, session
from flask_cors import CORS
from flask_session import Session  # Flask-Session 추가

app = Flask(__name__)
app.secret_key = 'your_secret_key'  # 세션을 사용하기 위해 필요한 키
CORS(app)

# Flask-Session 설정
app.config['SESSION_TYPE'] = 'filesystem'  # 세션 데이터를 파일 시스템에 저장
app.config['SESSION_PERMANENT'] = False
Session(app)

# 계절과 날씨 데이터를 기반으로 한 애니메이션 장르 분류 정보
anime_genre_season_weather = {
    "봄": {
        "비": ["드라마", "로맨스", "치유", "음악", "미스터리", "추리"],
        "맑은 하늘": ["일상", "모험", "판타지", "아이돌", "음식", "스포츠"],
        "구름": ["악역영애", "드라마", "성인", "무협", "판타지", "개그"]
    },
    "여름": {
        "비": ["스릴러", "재난", "공포", "범죄", "미스터리", "음악"],
        "맑은 하늘": ["모험", "스포츠", "판타지", "아이돌", "음악", "일상", "액션"],
        "구름": ["무협", "특촬", "개그", "범죄", "드라마"]
    },
    "가을": {
        "비": ["미스터리", "추리", "드라마", "범죄", "음악", "성인"],
        "맑은 하늘": ["치유", "음식", "일상", "판타지", "모험"],
        "구름": ["시대물", "드라마", "악역영애", "스릴러", "무협"]
    },
    "겨울": {
        "비": ["스릴러", "공포", "재난", "범죄"],
        "눈": ["드라마", "로맨스", "아동", "치유", "음악", "모험"],
        "맑은 하늘": ["판타지", "일상", "스포츠", "아이돌"],
        "구름": ["시대물", "악역영애", "액션", "미스터리", "범죄", "무협"]
    }
}

# JSON 데이터 로드 함수
def load_anime_data(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        data = json.load(file)
    return data

# 계절 판별 함수
def get_current_season():
    today = datetime.now()
    month_day = (today.month, today.day)

    if (2, 4) <= month_day <= (5, 4):
        return "봄"
    elif (5, 5) <= month_day <= (8, 6):
        return "여름"
    elif (8, 7) <= month_day <= (11, 6):
        return "가을"
    else:
        return "겨울"

# 날씨 데이터 가져오기 (OpenWeatherMap API 사용)
def get_weather(api_key, city_name):
    url = f"http://api.openweathermap.org/data/2.5/weather?q={city_name}&appid={api_key}&lang=kr"
    response = requests.get(url)
    if response.status_code == 200:
        weather_data = response.json()
        weather_main = weather_data['weather'][0]['main'].lower()

        if weather_main in ["thunderstorm", "drizzle", "rain"]:
            weather_condition = "비"
        elif "clear" in weather_main:
            weather_condition = "맑은 하늘"
        elif "cloud" in weather_main:
            weather_condition = "구름"
        elif "snow" in weather_main:
            weather_condition = "눈"
        else:
            weather_condition = None  # 기타 경우는 제외

        print(f"현재 {city_name}의 날씨 상태: {weather_condition}")
        return weather_condition
    else:
        print(f"Error fetching weather data: {response.status_code}")
        return None

# MBTI 데이터 로드 함수
def load_mbti_data():
    try:
        with open('mbti_genre_tags.json', 'r', encoding='utf-8') as f:
            mbti_data = json.load(f)
    except FileNotFoundError:
        print("MBTI 데이터 파일을 찾을 수 없습니다.")
        mbti_data = {}
    return mbti_data

# MBTI 유효성 체크 함수
def is_valid_mbti(mbti_input):
    valid_mbti_types = [
        "INTJ", "INTP", "ENTJ", "ENTP",
        "INFJ", "INFP", "ENFJ", "ENFP",
        "ISTJ", "ISFJ", "ESTJ", "ESFJ",
        "ISTP", "ISFP", "ESTP", "ESFP"
    ]
    return mbti_input.upper() in valid_mbti_types

# 애니메이션 추천 함수 (날씨 기반)
def recommend_anime_weather(season, weather, anime_data):
    # 계절과 날씨에 맞는 장르 목록 가져오기
    weather_genres = anime_genre_season_weather.get(season, {}).get(weather, [])
    if not weather_genres:
        return []

    # 장르와 일치하는 애니메이션 필터링, 'GL 백합'과 'BL'을 제외
    recommendations = []
    for series_list in anime_data.values():  # anime_data.values()를 사용하여 모든 시리즈의 애니메이션을 가져옵니다.
        for series in series_list:
            anime_genres = series.get("genre", [])
            if any(genre in anime_genres for genre in weather_genres) and not ("GL 백합" in anime_genres or "BL" in anime_genres):
                recommendations.append(series)

    # 전체 추천 결과에서 무작위로 5개 선택 (무작위 추천)
    if len(recommendations) > 5:
        recommendations = random.sample(recommendations, 5)

    return recommendations

# 애니메이션 추천 함수 (MBTI 기반)
def recommend_anime_mbti(mbti, anime_data, mbti_data):
    # MBTI 기반 선호 장르와 태그 가져오기
    mbti_upper = mbti.upper()
    preferred_genres = mbti_data.get(mbti_upper, {}).get("Preferred_Genre", [])
    preferred_tags = mbti_data.get(mbti_upper, {}).get("Preferred_Tags", [])

    if not preferred_genres and not preferred_tags:
        return []

    # 장르와 일치하는 애니메이션 필터링, 'GL 백합'과 'BL'을 제외
    recommendations = []
    for series_list in anime_data.values():  # anime_data.values()를 사용하여 모든 시리즈의 애니메이션을 가져옵니다.
        for series in series_list:
            anime_genres = series.get("genre", [])
            anime_tags = series.get("tags", [])

            matches_mbti_genre = any(genre in anime_genres for genre in preferred_genres)
            matches_mbti_tag = any(tag in anime_tags for tag in preferred_tags)

            # MBTI 기반 장르나 태그와 일치
            if (matches_mbti_genre or matches_mbti_tag) and not ("GL 백합" in anime_genres or "BL" in anime_genres):
                recommendations.append(series)

    # 전체 추천 결과에서 무작위로 5개 선택 (무작위 추천)
    if len(recommendations) > 5:
        recommendations = random.sample(recommendations, 5)

    return recommendations

# 애니메이션 추천 API 엔드포인트 (날씨 기반)
@app.route('/api/weather_recommendations', methods=['POST'])
def get_weather_recommendations():
    data = request.json
    city_name = data.get('city')
    api_key = data.get('api_key')
    file_path = "grouped_by_series_id_no_production.json"

    # JSON 데이터 로드
    anime_data = load_anime_data(file_path)

    # 현재 계절과 날씨 가져오기
    current_season = get_current_season()
    current_weather = get_weather(api_key, city_name)

    if not current_weather:
        return jsonify({"error": "날씨 데이터를 가져올 수 없습니다."}), 500

    # 애니메이션 추천 실행 (날씨 기반)
    recommended_animes = recommend_anime_weather(current_season, current_weather, anime_data)

    # 추천 결과 반환
    response_data = [
        {"name": anime.get("name"), "avg_rating": anime.get("avg_rating"), "genre": anime.get("genre")}
        for anime in recommended_animes
    ]

    return jsonify(response_data)

# 애니메이션 추천 API 엔드포인트 (MBTI 기반)
@app.route('/api/mbti_recommendations', methods=['POST'])
def get_mbti_recommendations():
    data = request.json
    user_mbti = data.get('mbti')
    file_path = "grouped_by_series_id_no_production.json"

    # JSON 데이터 로드
    anime_data = load_anime_data(file_path)
    mbti_data = load_mbti_data()  # 수정된 부분: 함수 호출 시 매개변수 제거

    # MBTI 입력 검증
    if not user_mbti or not is_valid_mbti(user_mbti):
        return jsonify({"error": "유효한 MBTI를 입력해주세요. (예: INFP, ENTP 등)"}), 400

    # 애니메이션 추천 실행 (MBTI 기반)
    recommended_animes = recommend_anime_mbti(user_mbti, anime_data, mbti_data)

    # 추천 결과 반환
    response_data = [
        {"name": anime.get("name"), "avg_rating": anime.get("avg_rating"), "genre": anime.get("genre")}
        for anime in recommended_animes
    ]

    return jsonify(response_data)

if __name__ == '__main__':
    app.run(port=5001, debug=True)
