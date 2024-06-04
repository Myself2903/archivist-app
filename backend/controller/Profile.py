from fastapi import APIRouter, HTTPException, Depends, Body
from DataSource import get_db
from model.dao.UserDao import delete_user, update_user
from model.schemas.UserSchemas import User, UserUpdate
from typing import Annotated
from security.Oauth import get_current_user, oauth2_scheme, Token
from sqlalchemy.orm import Session

router = APIRouter(prefix="/profile")

@router.get("", response_model= User)
def getUserData(
            token: Annotated[Token, Depends(oauth2_scheme)], 
            db: Session = Depends(get_db)
        ):
      return get_current_user(db=db, token=token)

@router.put("/update", response_model= User)
def updateProfile(
            token: Annotated[Token, Depends(oauth2_scheme)], 
            user_update: UserUpdate = Body(...),
            db: Session = Depends(get_db)
    ):
        
        user = get_current_user(db=db, token=token)
        user_db = update_user(db=db, user_db=user, user_update=user_update)
        
        if isinstance(user_db, str):
            # Si la actualización falló y se devuelve un mensaje de error
            raise HTTPException(status_code=400, detail=user_db)
        elif user_db is None:
            raise HTTPException(status_code=404, detail="User not found")
        
        return user_db

@router.delete("/delete", response_model=None)
def deleteProfile(token: Annotated[str, Depends(oauth2_scheme)], db: Session = Depends(get_db)):
    user = get_current_user(db=db, token=token)
    delete_user(db=db, id_user=user.id)
    raise HTTPException(status_code=204, detail="user deleted")
