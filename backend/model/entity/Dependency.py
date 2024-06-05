from DataSource import Base
from sqlalchemy import Column, Integer, Boolean, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship, backref

class DependencyDB(Base):
    __tablename__ = "dependencies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)

    project_id = Column(Integer, ForeignKey("projects.id"))
    project = relationship("ProjectDB", back_populates="dependencies")

    father_id = Column(Integer, ForeignKey("dependencies.id"), nullable=True)
    children = relationship("DependencyDB", 
                            backref=backref('father', remote_side=[id]),
                            cascade="all, delete-orphan")