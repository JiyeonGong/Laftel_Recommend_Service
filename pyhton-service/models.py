from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import relationship
from sqlalchemy import ForeignKey

db = SQLAlchemy()

# Series 테이블 모델 정의
class Series(db.Model):
    __tablename__ = 'series'
    series_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    episodes = relationship('Episode', backref='series', cascade="all, delete-orphan")

# Episode 테이블 모델 정의
class Episode(db.Model):
    __tablename__ = 'episodes'
    episode_id = db.Column(db.Integer, primary_key=True)
    series_id = db.Column(db.Integer, ForeignKey('series.series_id'), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    content = db.Column(db.Text, nullable=True)
    rating = db.Column(db.Integer, nullable=True)
    avg_rating = db.Column(db.Numeric(2, 1), nullable=True)
    img_url = db.Column(db.String(2083), nullable=True)
    air_year_quarter = db.Column(db.String(50), nullable=True)
    genres = relationship('Genre', secondary='episode_genres', backref='episodes')
    tags = relationship('Tag', secondary='episode_tags', backref='episodes')

# Genre 테이블 모델 정의
class Genre(db.Model):
    __tablename__ = 'genres'
    genre_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False, unique=True)

# Tag 테이블 모델 정의
class Tag(db.Model):
    __tablename__ = 'tags'
    tag_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False, unique=True)

# EpisodeGenres 매핑 테이블 모델 정의
class EpisodeGenre(db.Model):
    __tablename__ = 'episode_genres'
    episode_id = db.Column(db.Integer, ForeignKey('episodes.episode_id'), primary_key=True)
    genre_id = db.Column(db.Integer, ForeignKey('genres.genre_id'), primary_key=True)

# EpisodeTags 매핑 테이블 모델 정의
class EpisodeTag(db.Model):
    __tablename__ = 'episode_tags'
    episode_id = db.Column(db.Integer, ForeignKey('episodes.episode_id'), primary_key=True)
    tag_id = db.Column(db.Integer, ForeignKey('tags.tag_id'), primary_key=True)

