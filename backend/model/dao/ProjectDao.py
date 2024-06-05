from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from model.entity.Project import ProjectDB
from model.schemas.ProjectSchemas import ProjectCreate, ProjectUpdate
from model.schemas.UserSchemas import User
from utils.Exceptions import PermissionDeniedException, ProjectNotActiveException
from model.dao.DependencyDao import create_dependency
from model.schemas.DependencySchemas import DependencyCreate
from datetime import datetime

def create_project(db: Session, project: ProjectCreate, user_id: int):
    db_project = ProjectDB(**project.dict(), owner_id=user_id)
    db.add(db_project)
    db.commit()
    db.refresh(db_project)

    #create default org chart
    root_dependency = DependencyCreate(name="Gerencia", project_id=db_project.id)
    root_dependency_db = create_dependency(db=db, dependency=root_dependency)
    
    sub_dependencies = [DependencyCreate(name=f'Dependencia {i+1}', project_id=db_project.id, father_id=root_dependency_db.id) for i in range(3)]
    
    for dep in sub_dependencies:
        create_dependency(db=db, dependency=dep)
    
    return db_project

def get_project(db: Session, project_id: int):
    return db.query(ProjectDB).filter(ProjectDB.id == project_id).first()

def get_projects_by_user(db:Session, user_id:int):
    return db.query(ProjectDB).filter(ProjectDB.owner_id == user_id).all()

def get_projects_by_user_and_active_state(db:Session, user_id:int, active_state:bool):
    return db.query(ProjectDB).filter(
        ProjectDB.owner_id == user_id,
        ProjectDB.active == active_state
    ).all()

def get_projects(db:Session, skip:int=0, limit:int=100):
    return db.query(ProjectDB).offset(skip).limit(limit).all()

#verify a user owns project
def check_ownership(owner_id: int, user_id:int):
    if owner_id != user_id:
         raise PermissionDeniedException()

#verify project state as active
def check_project_active(db: Session, project_id: int):
    if not get_project(db, project_id).active:
        raise ProjectNotActiveException()


def update_project(db: Session, current_project_id: int, user: User, project_update: ProjectUpdate):
    update_data = project_update.model_dump(exclude_unset=True)
    update_data["last_edition_date"] = datetime.utcnow()
    project_db = get_project(db, current_project_id)

    #project owner is the only allowed to update its config
    check_ownership(owner_id=project_db.owner_id, user_id=user.id)

    for key, value in update_data.items():
            setattr(project_db, key, value)

    db.commit()
    db.refresh(project_db)
    return project_db


def delete_project(db:Session, id_project: int, user:User):
    project_db = get_project(db, id_project)

    #project owner is the only allowed to delete project
    check_ownership(owner_id=project_db.owner_id, user_id=user.id)
    setattr(project_db, "active", False)
    db.commit()
    db.refresh(project_db)


