from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from model.entity.User import UserDB
from model.schemas.UserSchemas import UserCreate, UserUpdate
import re
import bcrypt

def encryptPassword(password: str):
    hashPassword = password.encode()
    sal = bcrypt.gensalt()
    password = bcrypt.hashpw(hashPassword, sal).decode('utf-8') #decode to convert the encrypted password into a str
    return password

def create_user(db: Session, user: UserCreate):
    user.password = encryptPassword(user.password)
    db_user = UserDB(**user.model_dump())
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user(db: Session, user_id: int):
    return db.query(UserDB).filter(UserDB.id == user_id).first()

def get_user_by_mail(db:Session, mail:str):
    return db.query(UserDB).filter(UserDB.mail == mail).first()

def get_users(db:Session, skip:int=0, limit:int=100):
    return db.query(UserDB).offset(skip).limit(limit).all()

def update_user(db: Session, user_db: UserDB, user_update: UserUpdate):    
    update_data = user_update.model_dump(exclude_unset=True)

    if 'password' in update_data:
        update_data['password'] = encryptPassword(update_data['password'])

    try:
        for key, value in update_data.items():
            setattr(user_db, key, value)
        
        db.commit()
        db.refresh(user_db)
    except IntegrityError as e:
        db.rollback()
        error_info = str(e.orig)
        column_match = re.search(r"DETAIL:\s+Key\s+\((\w+)\)=\((.*?)\)\salready\sexists\.", error_info)

        if column_match:
            column_name = column_match.group(1)
            return f"{column_name} already exist."
        else:
            return "database integrity error"
    return user_db


def delete_user(db:Session, id_user: int):
    user_db = get_user(db, id_user)
    db.delete(user_db)
    db.commit()


