from sqlalchemy import Column, Integer, String, Enum
from sqlalchemy.orm import relationship
from DataSource import Base
from utils.EntityType import EntityType
from model.entity.Project import ProjectDB

# SQLAlchemy User definition for data base entity
class UserDB(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True)
    name = Column(String)
    surname = Column(String)
    mail = Column(String, index=True, unique=True)
    password = Column(String)
    entity = Column(Enum(EntityType))

    projects = relationship("ProjectDB", back_populates="owner")
