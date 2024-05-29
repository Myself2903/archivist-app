from DataSource import Base
from sqlalchemy import Column, Integer, Boolean, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

class ProjectDB(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    active = Column(Boolean, default=True)
    enterprise = Column(String)
    creation_date = Column(DateTime)
    last_edition_date = Column(DateTime, default=datetime.utcnow())
    public_access = Column(Boolean, default=False)
    
    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("UserDB", back_populates="projects")