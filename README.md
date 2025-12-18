# TERUTERU
LAFTEL API 기반 사용자 맞춤형(날씨/성향) 애니메이션 추천 웹 서비스

<br/>

## 🚀Summary
OTT 서비스의 자체적 추천 서비스는 사용자에게 상당한 피로도를 유발합니다.  
기존 OTT 서비스의 **Cold Start** 문제를 해결하기 위해 개인의 **사용자 성향**(MBTI)과 실시간 **날씨** 데이터를 결합한 애니메이션 추천 서비스를 개발했습니다.
각 작품들의 장르와 태그 정보를 날씨와 성향에 맞춰 분류하여 모델링을 진행하고, 추천 알고리즘을 통해 사용자에게 맞춤 서비스를 제공합니다.

<br/>

## 📅Development Period
**24.10.11 - 24.12.11**

<br/>

## 👩🏻‍💻Team
|                                      공지연                                       |                                      김유빈                                       |
|:------------------------------------------------------------------------------:|:------------------------------------------------------------------------------:|
|      기획팀장, 데이터 수집, 전처리, 모델링 추천 시스템,<br/>프론트엔드, UI/UX, 백엔드 일부(알고리즘 API설계)       |                 백엔드 총괄, 사용자 인증/인가, <br/>프론트엔드, 기획, UI/UX, 모델링                  |
|                  [JiyeonGong](https://github.com/JiyeonGong)                   |                     [Im-Ubin](https://github.com/Im-Ubin)                      |
| <img src="https://avatars.githubusercontent.com/u/137162910?v=4" width="160"/> | <img src="https://avatars.githubusercontent.com/u/122139510?v=4" width="160"/> |

<br/>

## ⚙️TECH
![Java](https://img.shields.io/badge/java-%23ED8B00.svg?style=for-the-badge&logo=openjdk&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)

![Flask](https://img.shields.io/badge/flask-%23000.svg?style=for-the-badge&logo=flask&logoColor=white)
![Spring](https://img.shields.io/badge/springboot-%236DB33F.svg?style=for-the-badge&logo=spring&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)
![openapi initiative](https://img.shields.io/badge/openapiinitiative-%23000000.svg?style=for-the-badge&logo=openapiinitiative&logoColor=white)

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Context-API](https://img.shields.io/badge/Context--Api-000000?style=for-the-badge&logo=react)

<br/>

## 🔎Introduction

이 프로젝트는 한국의 정식 애니메이션 OTT 플랫폼인 LAFTEL에서 애니메이션 데이터를 수집하고, 
이를 활용하여 사용자의 성향(MBTI)과 실시간 날씨 정보를 고려한 추천 결과를 제공하는 애니메이션 추천 웹 서비스 입니다.
애니메이션 시장이 과거에 비해 많은 주목을 받고 있는 상황에서, 영화 추천 시스템은 많은 웹 서비스에서 전문적으로 제공되고 있는 것에 비해, 
애니메이션 추천 시스탬은 다소 섬세하지 못하고 정제되지 못하는 아쉬운 점들을 해결하기 위해 개인의 성향과 날씨를 고려한 애니메이션 추천 시스템을 만들기로 결정했습니다.

OTT 서비스를 사용하면서 영화 관람 전 작품을 고르는데 더 많은 시간을 소비하는 이른바 '넷플리스 증후군(Netflix Syndrome)'을 겪는 이용자들이 크게 늘고있습니다. 
이는 모든 OTT 서비스의 가장 큰 문제점으로 COLD START를 원인으로 둘 수 있는데요, 
우리는 이러한 COLD START 문제를 해결하기 위해 날씨와 심리적 요인을 고려한 추천 시스템을 도입하여 다른 웹 서비스와 차별점을 두었습니다.

위 프로젝트는 작품 관람 시간보다 콘텐츠 정보가 나열돼 있는 목록을 더 많이 보게 되는 불필요한 행위를 감소시켜 사용자의 만족도를 향상시킵니다.
인기도 기반 추천 알고리즘을 변형하여 시스템에 도입하고, 평점이 높은 애니메이션 작품을 우선하여 추천할 수 있도록 설계하여 정교한 추천 알고리즘을 통해 사용자에게 적합한 작품을 제공합니다. 
사용자의 취향과 선호도를 반영한 추천 시스템으로, 작품 시청 만족도가 향상되는 효과를 기대해봅니다.

<br/>

## Details

<img width="500" alt="스크린샷 2025-04-28 오후 9 00 37" src="https://github.com/user-attachments/assets/717d6be2-6286-4537-beeb-d688fdf5772a" /><br/>
프로젝트 전반 동적 웹 사용을 통해 사용자의 관심과 흥미를 끌어올립니다.  
이번 주에 가장 추천하는 애니메이션을 슬라이드를 통해 확인 가능하며, 좌측에 존재하는 로그인 바를 통해 언제든지 편리하게 상단으로 이동할 수 있습니다.

<br/>

<img width="500" alt="스크린샷 2025-04-28 오후 9 01 29" src="https://github.com/user-attachments/assets/c05fe564-0501-488f-ba38-43dc8bfdd4ba" /><br/>
상단에 위치한 MBTI 버튼을 눌러 간편하게 자신의 성향에 맞는 애니메이션을 추천받을 수 있습니다.  
**평점이 4.3 이상**인 애니메이션을 추천하도록 설계하고 추천 시스템 알고리즘을 변형하여 추천의 퀄리티를 높였습니다.  
추천된 작품이 만족스럽지 않다면 새로고침 버튼을 통해 새로운 추천 목록을 확인할 수 있습니다.

<br/>

<img width="500" alt="스크린샷 2025-04-28 오후 9 01 44" src="https://github.com/user-attachments/assets/c47e23f9-55b5-4c40-9662-d0df1a7227aa" /><br/>
날씨 기반 추천 시스템은 사용자가 위치한 지역의 날씨를 실시간으로 받아와 날씨에 맞는 애니메이션을 추천합니다.  
성향 기반 추천 시스템과 동일한 알고리즘과 방법으로 설계하였습니다.

<br/>

<img width="500" alt="스크린샷 2025-04-28 오후 9 02 25" src="https://github.com/user-attachments/assets/e766a4b5-daa2-4450-b410-f6991f5479b5" /><br/>
작품의 포스터를 클릭하면 작품의 상세 정보를 볼 수 있습니다.  
작품의 줄거리, 태그, 장르, 평점, 제작사, 방영시기, 감독, 캐스팅 정보를 알 수 있습니다.  
좋아요 버튼을 통해 찜 목록에 작품을 추가할 수 있으며, ‘라프텔에서 보기’ 버튼을 통해 해당 작품의 라프텔 페이지로 이동합니다.

<br/>

<img width="500" alt="스크린샷 2025-04-28 오후 9 02 54" src="https://github.com/user-attachments/assets/0e78f9ed-0722-4432-88a7-a7faab27c0b0" /><br/>
찜 목록에 추가한 작품은 보관함에서 볼 수 있습니다. 추가일 순, 이름 순으로 정렬할 수 있습니다.  
찜 목록에서 추가된 애니메이션을 관리(추가/삭제)할 수 있습니다.

<br/>

<img width="500" alt="스크린샷 2025-04-28 오후 9 03 51" src="https://github.com/user-attachments/assets/d8ce02c3-b0cb-4fdd-a0a6-579c750a0bfe" /><br/>
‘테루테루(Teru-Teru)’는 날씨와 사용자의 성향을 결합하여 애니메이션을 추천해주는 **생성형 AI 챗봇**입니다. 
MBTI를 선택하고 추천받고싶은 애니메이션에 대한 질문을 입력하면 현재 날씨를 고려하여 각 정보를 결합하여 애니메이션을 추천합니다.  
라프텔에 존재하는 애니메이션을 우선적으로 추천하며, 추가적으로 검색을 통해 추가적인 추천 리스트를 제공하기도 합니다.

<br/>

<img width="500" alt="스크린샷 2025-04-28 오후 9 03 19" src="https://github.com/user-attachments/assets/c18b0f9c-3a2a-44f8-a415-96ee660051b8" /><br/>
문의 게시판을 통해 추가하고싶은 애니메이션이나 오류 등을 신고할 수 있습니다.

<br/>

## Thanks To 
<img width="273" alt="스크린샷 2025-01-05 오후 4 58 26" src="https://github.com/user-attachments/assets/23b54343-3508-4de0-8ff2-6082acb6d0a5" /><br/>
이 프로젝트는 교내 프로젝트 경진대회에서 금상을 수상하는 쾌거를 거두었습니다. 
도움을 주신 많은 분들께 감사의 인사를 드립니다.
언제나 힘이 되어 주시는 교수님들,
늘 저희에게 현실적 조언과 더불어 따뜻한 말과 웃음과 가르침을 주신 배종혁 강사님,
보이지 않는 곳에서 활약하며 하나하나 전부 챙겨주신 인재양성 사업단 선생님들(김자경 선생님),
매의 눈으로 프로젝트의 완성도를 높여주시고 칭찬을 아끼지 않아주신 공난희 멘토님,
선배로서, 우리의 히든 팀원(?)으로서 많은 조언과 도움을 준 김지성씨 :),

그리고 나의 가장 듬직하고 사랑스럽고 멋있는 짝꿍 유빈님!!!
서툰 기획임에도 불구하고 열심히 따라와주고 무엇이든 말하는대로 만들어주는 멋진 나의 짝꿍, 당신이 있어서 너무 고맙고 행복했습니다 :)
