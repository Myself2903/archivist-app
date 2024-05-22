from fastapi import HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import jwt, JWTError
from passlib.context import CryptContext
from datetime import datetime, timedelta
from model.dao.UserDao import *
from sqlalchemy.orm import Session
import secrets

SECRET_KEY  = '40sasldkjwd2123bvquweo0pimsañpoqweim' 
ALGORITHM = "HS256"
ACCES_TOKEN_DURATION = 10
VERIFY_TOKEN_DURATION = 30

oauth2 = OAuth2PasswordBearer(tokenUrl="login") #OAuth protocol instance
crypt = CryptContext(schemes=["bcrypt"])
        
def auth_user(db:Session, token: str = Depends(oauth2)): #check token auth
    exception = HTTPException(
                    status_code = status.HTTP_401_UNAUTHORIZED, 
                    detail="Credenciales de autenticación inválidas", 
                    headers={"WWW-Authenticate": "Bearer"}
                )
    try:
        id = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM]).get("id")
        if id is None:
            raise exception
        
    except JWTError:
        raise exception

    
    return get_user(db=db,user_id=id)


def verifyLogin(db: Session, form: OAuth2PasswordRequestForm = Depends()):
        user = get_user_by_email(db=db, mail=form.username) #search email in data base. username is convention from OAuth library

        #User not found
        if not user or user[2] == 1:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        
        #check password
        if not crypt.verify(form.password, user[1]):   #query return two values touple. [1] is the password 
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Incorrect Password")
            
        #acces token sent when login
        access_token = {
            "id": user.id,
            "password": user.password,
            "exp": datetime.utcnow() + timedelta(days=ACCES_TOKEN_DURATION)
        }

        print(user)

        return {"access_token": jwt.encode(access_token, SECRET_KEY , algorithm=ALGORITHM), "token_type": "bearer"} #acces token encryption


async def verifyUser(token: dict = Depends()):
    exception = HTTPException(
                    status_code = status.HTTP_401_UNAUTHORIZED, 
                    detail="Credenciales de autenticación inválidas", 
                    headers={"WWW-Authenticate": "Bearer"}
                )
    
    try:
        data = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        
        if data is None:
            raise exception
       
    except JWTError:
        raise exception

    raise HTTPException(status_code=status.HTTP_202_ACCEPTED, detail="usuario validado")

def genVerifyToken(iduser:int ):
     token = {
          "id": iduser,
          "verifyToken": secrets.token_hex(16),
          "exp": datetime.utcnow()+ timedelta(minutes=VERIFY_TOKEN_DURATION)
     }

     return jwt.encode(token, SECRET_KEY , algorithm=ALGORITHM)