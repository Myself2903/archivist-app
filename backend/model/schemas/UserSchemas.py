from pydantic import BaseModel
from utils.EntityType import EntityType
from model.schemas.ProjectSchemas import Project


class UserBase(BaseModel):
    username: str
    name: str
    surname: str
    mail:str
    entity: EntityType

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    projects: list[Project] = []
    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    username: str | None = None
    name: str | None = None
    surname: str | None = None
    mail: str | None = None
    password: str | None = None
    entity: EntityType | None = None