from sqlalchemy.orm import Session
from model.entity.User import UserDB
from model.schemas.UserSchemas import User, UserCreate


def get_user(db: Session, user_id: int):
    return db.query(UserDB).filter(UserDB.id == user_id).first()

def get_user_by_email(db:Session, mail:str):
    return db.query(UserDB).filter(UserDB.mail == mail).first()

def get_users(db:Session, skip:int=0, limit:int=100):
    return db.query(UserDB).offset(skip).limit(limit).all()

def create_user(db: Session, user: UserCreate):
    fake_hashed_password = user.password + "notreallyhashed"
    db_user = UserDB(**user.model_dump())
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
