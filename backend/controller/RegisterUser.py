from fastapi import APIRouter, HTTPException, Depends
from model.dao.UserDao import *
from model.schemas.UserSchemas import UserCreate, User  
from DataSource import get_db  
from sqlalchemy.orm import Session

router = APIRouter()

@router.post("/register", response_model=User)
def registerUser(user: UserCreate, db: Session = Depends(get_db)):
    db_user = get_user_by_mail(db, mail=user.mail)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return create_user(db=db, user=user)
    
    
