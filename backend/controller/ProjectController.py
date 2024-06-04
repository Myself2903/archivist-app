from fastapi import APIRouter, HTTPException, Depends, Body, status
from model.schemas.ProjectSchemas import Project, ProjectCreate
from sqlalchemy.orm import Session
from DataSource import get_db  
from security.Oauth import get_current_user, oauth2_scheme, Token, get_token_data
from model.dao.ProjectDao import *
from typing import Annotated
from typing import Optional

router = APIRouter(prefix="/profile/projects")

@router.get("/",response_model=list[Project])
def get_users_projects(
        token:  Annotated[Token, Depends(oauth2_scheme)],
        db: Session = Depends(get_db)
    ):
    
    user = get_current_user(db=db, token=token)
    return get_projects_by_user(db=db, user_id=user.id)


@router.get("/verify_access", response_model=bool)
def verify_project_access_no_token(project_id: int, db: Session = Depends(get_db)):
    return get_project(db=db, project_id=project_id).public_access

@router.get("/verify_access/token", response_model=bool)
def verify_project_access(
                    project_id: int, 
                    token:  Annotated[Token, Depends(oauth2_scheme)],
                    db: Session = Depends(get_db)):
    
    project = get_project(db=db, project_id=project_id)
    token_data = get_token_data(token=token) 
    
    return project.owner_id == int(token_data.id) or project.public_access


@router.get("/active_state",response_model=list[Project])
def get_users_projects_by_active_state(
        token:  Annotated[Token, Depends(oauth2_scheme)],
        active_state: bool = True,
        db: Session = Depends(get_db)
    ):
    
    user = get_current_user(db=db, token=token)
    return get_projects_by_user_and_active_state(db=db, user_id=user.id,active_state=active_state)


@router.post("/create", response_model=Project)
def create_user_project(
        token:  Annotated[Token, Depends(oauth2_scheme)],
        project: ProjectCreate, 
        db: Session = Depends(get_db)
    ):
    user = get_current_user(db=db, token=token)

    return create_project(db=db, project=project, user_id=user.id)


@router.put("/update", response_model=Project)
def update_user_project(
        token:  Annotated[Token, Depends(oauth2_scheme)],
        current_project_id: int,
        project_update: ProjectUpdate = Body(...),
        db: Session = Depends(get_db)
    ):

    user = get_current_user(db=db, token=token)
    
    try:
        project_db = update_project(
                db=db, 
                current_project_id=current_project_id, 
                user=user,
                project_update=project_update
        )
    except PermissionDeniedException as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="user not allowed to edit project")

    return project_db


@router.delete("/delete", response_model=None)
def delete_user_project(
        id_project: int,
        token: Annotated[str, Depends(oauth2_scheme)], 
        db: Session = Depends(get_db)
    ):

    user = get_current_user(db=db, token=token)
    
    try:
        delete_project(db=db, user=user, id_project=id_project)
    except PermissionDeniedException as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="user not allowed to edit project")
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="project not found")
    
    raise HTTPException(status_code=204, detail="Project deleted")