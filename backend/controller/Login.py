from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm
from security.Auth import verifyLogin
from utils.Dependencies import get_db
from sqlalchemy.orm import Session

router = APIRouter() #fastAPI instance

@router.post("/login")
def login(db: Session = Depends(get_db), form: OAuth2PasswordRequestForm = Depends()):
    response = verifyLogin(db, form)
    return response


