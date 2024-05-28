from sqlalchemy import Column, Integer, String, Enum
from sqlalchemy.orm import declarative_base
from DataSource import Base
from utils.EntityType import EntityType

# Definición del modelo de SQLAlchemy para la base de datos
class UserDB(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True)
    name = Column(String)
    surname = Column(String)
    mail = Column(String, index=True, unique=True)
    password = Column(String)
    entity = Column(Enum(EntityType))
