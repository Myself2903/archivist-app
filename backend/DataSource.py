import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker


load_dotenv()

# Conection Data
user = os.getenv('POSTGRES_USER')
password = os.getenv('POSTGRES_PASSWORD')
host = os.getenv('POSTGRES_HOST')
port = os.getenv('POSTGRES_PORT')
db_name = os.getenv('POSTGRES_DB')

#Data Base URL
DB_CONNECTION = f"postgresql+psycopg2://{user}:{password}@{host}:{port}/{db_name}"

engine = create_engine(DB_CONNECTION)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()