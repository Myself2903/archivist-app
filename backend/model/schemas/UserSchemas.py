from pydantic import BaseModel
from utils.EntityType import EntityType

class UserBase(BaseModel):
    username: str
    name: str
    surname: str
    mail:str
    entity: EntityType

class UserCreate(UserBase):
    password: str

class User(UserBase):
    class Config:
        from_attributes = True