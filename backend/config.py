import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PORT: int = 5000
    MONGODB_URI: str = "mongodb://127.0.0.1:27017/osd_hackathon"
    JWT_SECRET: str = "your_jwt_secret_key_here"
    


    # Cloudinary Configuration
    CLOUDINARY_URL: str = ""

    # SMTP Configuration
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""


    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"

settings = Settings()
