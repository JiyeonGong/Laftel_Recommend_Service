import json
import requests
import random
import openai 
import os
from dotenv import load_dotenv
from datetime import datetime
from flask import Flask, request, jsonify, session
from flask_cors import CORS
from flask_session import Session
from flask_sqlalchemy import SQLAlchemy
from models import Series, Episode, Genre, Tag, EpisodeGenre, EpisodeTag

app = Flask(__name__)
app.secret_key = 'your_secret_key'  # 세션을 사용하기 위해 필요한 키
CORS(app)

openai.api_key = os.getenv('REACT_APP_OPENAI_API_KEY')

# .env 파일 로드
load_dotenv()

# DB
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:1234@localhost/coding_ping'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Flask-Session
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SESSION_PERMANENT'] = False
Session(app)


# 계절과 날씨 데이터를 기반으로 한 애니메이션 장르 분류
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

# JSON 데이터파일 로드 함수
def load_anime_data(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        data = json.load(file)
    return data

def load_mbti_data(): # mbti
    try:
        with open('mbti_genre_tags.json', 'r', encoding='utf-8') as f:
            mbti_data = json.load(f)
    except FileNotFoundError:
        print("MBTI 데이터 파일을 찾을 수 없습니다.")
        mbti_data = {}
    return mbti_data

def load_rating_data(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        data = json.load(file)
    # 리스트 형태의 데이터를 딕셔너리로 변환 (series_id를 키로 사용)
    rating_dict = {item['id']: item for item in data}
    return rating_dict


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


# 날씨 데이터 가져오기 
def get_weather(api_key, latitude, longitude):
    url = f"http://api.openweathermap.org/data/2.5/weather?lat={latitude}&lon={longitude}&appid={api_key}&lang=kr"
    response = requests.get(url)
    if response.status_code == 200:
        weather_data = response.json()
        weather_main = weather_data.get('weather', [{}])[0].get('main', '').lower()
        city_name = weather_data.get('name', 'Unknown')

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

        return city_name, weather_condition
    else:
        print(f"Error fetching weather data: {response.status_code}")
        return None, None



# 애니메이션 추천 함수 (날씨 기반)
def recommend_anime_weather(season, weather, anime_data):
    # 계절과 날씨에 맞는 장르 목록 가져오기
    weather_genres = anime_genre_season_weather.get(season, {}).get(weather, [])
    if not weather_genres:
        return []

    # 장르와 일치하는 애니메이션 필터링, 'GL 백합'과 'BL'을 제외
    recommendations = []
    for series_list in anime_data.values():
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

    # 장르와 일치하는 애니메이션 필터링
    recommendations = []
    for series_list in anime_data.values():
        for series in series_list:
            anime_genres = series.get("genre", [])
            anime_tags = series.get("tags", [])

            matches_mbti_genre = any(genre in anime_genres for genre in preferred_genres)
            matches_mbti_tag = any(tag in anime_tags for tag in preferred_tags)

            # MBTI 기반 장르나 태그와 일치하되, 특정 장르는 제외.
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
    latitude = data.get('latitude')
    longitude = data.get('longitude')
    api_key = data.get('api_key')
    file_path = "grouped_by_series_id_no_production.json"

    if not latitude or not longitude or not api_key:
        return jsonify({"error": "위치 정보 또는 API 키가 누락되었습니다."}), 400

    # JSON 데이터 로드
    anime_data = load_anime_data(file_path)

    # 현재 계절과 날씨 가져오기
    current_season = get_current_season()
    city_name, current_weather = get_weather(api_key, latitude, longitude)

    if not current_weather or not city_name:
        return jsonify({"error": "날씨 데이터를 가져올 수 없습니다."}), 500

    # 애니메이션 추천 실행 (날씨 기반)
    recommended_animes = recommend_anime_weather(current_season, current_weather, anime_data)

    # 추천 결과 반환
    response_data = {
        "city": city_name,
        "weather": current_weather,
        "recommendations": [
            {"id": anime.get("id"), "name": anime.get("name"), "avg_rating": anime.get("avg_rating"), "genre": anime.get("genre"), "img_url": anime.get("img_url")}
            for anime in recommended_animes
        ]
    }

    return jsonify(response_data)





# 애니메이션 추천 API 엔드포인트 (MBTI 기반)
@app.route('/api/mbti_recommendations', methods=['POST'])
def get_mbti_recommendations():
    data = request.json
    user_mbti = data.get('mbti')
    file_path = "grouped_by_series_id_no_production.json"

    # JSON 데이터 로드
    anime_data = load_anime_data(file_path)
    mbti_data = load_mbti_data()  # 여기에서 함수 호출 시 오류가 발생하지 않도록 load_mbti_data가 정의된 위치 이후에 호출


    # 애니메이션 추천 실행 (MBTI 기반)
    recommended_animes = recommend_anime_mbti(user_mbti, anime_data, mbti_data)

    # 추천 결과 반환
    response_data = [
        {"id": anime.get("id"), "name": anime.get("name"), "avg_rating": anime.get("avg_rating"), "genre": anime.get("genre"), "img_url": anime.get("img_url")}
        for anime in recommended_animes
    ]

    return jsonify(response_data)


# 에피소드 모델 정의
class Episode(db.Model):
    __tablename__ = 'episodes'
    episode_id = db.Column(db.Integer, primary_key=True)
    series_id = db.Column(db.Integer, db.ForeignKey('series.series_id'), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    content = db.Column(db.Text, nullable=True)
    rating = db.Column(db.Integer, nullable=True)
    avg_rating = db.Column(db.Numeric(2, 1), nullable=True)
    img_url = db.Column(db.String(2083), nullable=True)
    air_year_quarter = db.Column(db.String(50), nullable=True)
       
    
# 에피소드 상세 정보 API 엔드포인트 추가
@app.route('/api/episode_detail', methods=['GET'])
def get_episode_detail():
    episode_id = request.args.get('id')  # React에서 전달받는 episode_id

    # 에피소드 찾기 (DB에서)
    episode = Episode.query.filter_by(episode_id=episode_id).first()

    if episode:
        # 에피소드 장르 쿼리 (EpisodeGenre 매핑 테이블을 통해 Genre 테이블의 데이터를 가져옴)
        genres = db.session.query(Genre.name).join(EpisodeGenre).filter(EpisodeGenre.episode_id == episode_id).all()
        genres_list = [genre[0] for genre in genres]  # 쿼리 결과를 리스트로 변환

        # 에피소드 태그 쿼리 (EpisodeTag 매핑 테이블을 통해 Tag 테이블의 데이터를 가져옴)
        tags = db.session.query(Tag.name).join(EpisodeTag).filter(EpisodeTag.episode_id == episode_id).all()
        tags_list = [tag[0] for tag in tags]  # 쿼리 결과를 리스트로 변환

        # 에피소드 데이터 구성
        episode_data = {
            "id": episode.episode_id,
            "name": episode.name,
            "content": episode.content,
            "rating": episode.rating,
            "avg_rating": str(episode.avg_rating) if episode.avg_rating is not None else "N/A",
            "img_url": episode.img_url,
            "air_year_quarter": episode.air_year_quarter if episode.air_year_quarter else "정보 없음",
            "genre": genres_list,
            "tags": tags_list
        }
        return jsonify(episode_data)

    # 에피소드가 없는 경우
    return jsonify({"error": "해당 에피소드를 찾을 수 없습니다."}), 404

# 평점 계산 함수
def calculate_steam_score(statistics):
    # 긍정 리뷰 수는 count_score_30부터 count_score_50까지의 합으로 정의
    positive_votes = sum(statistics.get(f"count_score_{i}", 0) for i in range(30, 55, 5))
    total_votes = statistics.get("count_score", 0)
    
    # 총 리뷰 수가 0인 경우를 방지
    if total_votes == 0:
        return 0

    # 기본 평균 계산
    average = positive_votes / total_votes
    # 스팀 알고리즘 기반 평점 계산
    score = average - (average - 3.0) * 2 ** (-np.log10(total_votes + 1))
    return score * 100



# 애니메이션 추천 함수 (날씨와 MBTI 결합 기반)
def recommend_anime_weather_mbti(season, weather, mbti, anime_data, mbti_data, rating_data):
    # 계절과 날씨에 맞는 장르 목록 가져오기
    weather_genres = anime_genre_season_weather.get(season, {}).get(weather, [])
    # MBTI 기반 선호 장르와 태그 가져오기
    mbti_upper = mbti.upper()
    preferred_genres = mbti_data.get(mbti_upper, {}).get("Preferred_Genre", [])
    preferred_tags = mbti_data.get(mbti_upper, {}).get("Preferred_Tags", [])

    # 장르와 일치하는 애니메이션 필터링
    recommendations = []
    for series_list in anime_data.values():
        for series in series_list:
            anime_genres = series.get("genre", [])
            anime_tags = series.get("tags", [])
            series_id = series.get("id")
            statistics = rating_data.get(series_id, {})

            # 스팀 알고리즘 기반 평점 계산
            steam_score = calculate_steam_score(statistics)
            series["steam_score"] = steam_score

            matches_weather_genre = any(genre in anime_genres for genre in weather_genres)
            matches_mbti_genre = any(genre in anime_genres for genre in preferred_genres)
            matches_mbti_tag = any(tag in anime_tags for tag in preferred_tags)

            # 날씨 기반 또는 MBTI 기반으로 장르나 태그와 일치하고 특정 장르는 제외.
            if (matches_weather_genre or matches_mbti_genre or matches_mbti_tag) and not ("GL 백합" in anime_genres or "BL" in anime_genres):
                recommendations.append(series)

     # 평점 순으로 정렬 후 상위 10개 선택 (다양성 확보를 위해 더 많은 후보를 선택)
    recommendations.sort(key=lambda x: x["steam_score"], reverse=True)
    top_recommendations = recommendations[:10]

    # 상위 10개의 애니메이션 중(정확히는 라프텔에서 감상 가능한 애니) 5개를 먼저 선정
    if len(top_recommendations) > 5:
        # 3개만 추천
        recommendations = random.sample(top_recommendations, 3)
    else:
        recommendations = top_recommendations

    return recommendations


# 애니메이션 추천 챗봇 API 엔드포인트 (날씨 + MBTI 기반)
@app.route('/api/chatbot', methods=['POST'])
def get_combined_recommendations():
    data = request.json
    latitude = data.get('latitude')
    longitude = data.get('longitude')
    api_key = data.get('api_key')
    user_mbti = data.get('mbti')
    anime_file_path = "grouped_by_series_id_no_production.json"
    rating_file_path = "laftel_statistics_output.json"

    #디버깅
    if not latitude or not longitude or not api_key or not user_mbti:
        return jsonify({"error": "필수 정보가 누락되었습니다."}), 400

    # JSON 데이터 로드
    anime_data = load_anime_data(anime_file_path)
    mbti_data = load_mbti_data()
    rating_data = load_rating_data(rating_file_path)

    # 현재 계절과 날씨 가져오기
    current_season = get_current_season()
    city_name, current_weather = get_weather(api_key, latitude, longitude)

    if not current_weather or not city_name:
        return jsonify({"error": "날씨 데이터를 가져올 수 없습니다."}), 500

    # 애니메이션 추천 실행 (날씨 및 MBTI 기반)
    recommended_animes = recommend_anime_weather_mbti(current_season, current_weather, user_mbti, anime_data, mbti_data, rating_data)

   # 추천 목록을 기반으로 GPT 프롬프트 생성
    anime_list = ", ".join([anime['name'] for anime in recommended_animes])
    prompt = (f"현재 위치는 {city_name}이며, 날씨는 {current_weather}입니다. 사용자 성향은 {user_mbti}입니다." 
              f"이런 날씨와 성향에 맞는 애니메이션 추천은 다음과 같습니다: {anime_list}. 이 애니메이션들을 사용자에게 추천해주세요. 추천을 시작할 때 'Laftel에서 감상 가능한 애니 중 이런 작품은 어떠세요?' 로 문장을 시작하세요.\n"
              f"{city_name}의 {current_weather}와 {user_mbti}에 맞는 추가적인 추천 애니메이션을 두 가지 더 추천하세요.추천을 시작할 때 'Laftel 외 추천 목록을 알려드려요.' 로 문장을 시작하세요\n"
              f"애니메이션 제목 사이에 <와 >를 추가해 가독성을 높여주세요."
              f"애니메이션을 추천한 이유를 설명하세요.\n"
              f"대화를 끝내기 전 추천 리스트를 제목만 따로 출력하세요.\n"
              )
    try:
        # OpenAI API 호출
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=2000,
            temperature=0.7
        )
        chatbot_response = response['choices'][0]['message']['content'].strip()
        
        # 응답 확인을 위한 로그 출력
        print(f"Chatbot Response: {chatbot_response}")
        
        if not chatbot_response:
            chatbot_response = "추천할 수 있는 애니메이션이 없습니다. 다른 질문을 해보세요."

    #디버깅
    except openai.OpenAIError as e:
        print(f"OpenAI 호출 중 오류 발생: {e}")
        return jsonify({"error": "OpenAI API 호출 중 오류가 발생했습니다.", "details": str(e)}), 500

    return jsonify({"response": chatbot_response})

        
if __name__ == '__main__':
    app.run(port=5001, debug=True)