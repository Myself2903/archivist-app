from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm
from DataSource import get_db
from typing import Annotated
from security.Oauth import *
from sqlalchemy.orm import Session

router = APIRouter() #fastAPI instance

# @router.post("/login", response_model=User)
# def login(db: Session = Depends(get_db), form: OAuth2PasswordRequestForm = Depends()): 
#     return verifyLogin(db, form)


@router.post("/token")
def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: Session = Depends(get_db) 
) -> Token:
    user = authenticate_user(db, form_data.username, form_data.password)
    access_token_expires = timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS)
    access_token = create_access_token(
        data={"sub": user.id}, expires_delta=access_token_expires
    )
    return Token(access_token=access_token, token_type="bearer")

@router.put("/logout")
def logout(
    token: Annotated[Token, Depends(oauth2_scheme)],
)-> Token:
    
    access_token_expires = timedelta(days=-1)
    access_token = create_access_token(
        data={"sub": -1}, expires_delta=access_token_expires
    )
    return Token(access_token=access_token, token_type="bearer")