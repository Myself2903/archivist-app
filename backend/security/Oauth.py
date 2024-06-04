from datetime import datetime, timedelta, timezone
from fastapi import HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from jwt.exceptions import InvalidTokenError
from sqlalchemy.orm import Session
from model.dao.UserDao import *
from pydantic import BaseModel
from typing import Annotated
import jwt

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    id: str | None = None

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token") #OAuth protocol instance
crypt = CryptContext(schemes=["bcrypt"], deprecated="auto")

SECRET_KEY  = '40sasldkjwd2123bvquweo0pimsañpoqweim' 
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_DAYS = 1


def verify_password(plain_password, hashed_password):
     return crypt.verify(plain_password, hashed_password)

def get_password_hash(password):
    return crypt.hash(password)

def authenticate_user(db:Session, username: str, password: str):
    user = get_user_by_mail(db, username)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not verify_password(password, user.password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect Password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

###########################################################
###################### get User Data ######################
###########################################################

credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

def get_token_data(token):
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        id: str = payload.get("sub")
        if id is None:
            raise credentials_exception
        
        return TokenData(id=str(id))

    except InvalidTokenError:
        raise credentials_exception

def get_current_user(db: Session, token: Annotated[str, Depends(oauth2_scheme)]):
    token_data = get_token_data(token)
    
    user = get_user(db, user_id=token_data.id)
    
    if user is None:
        raise credentials_exception
    return user