from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from model.entity.Project import ProjectDB
from model.schemas.ProjectSchemas import ProjectCreate, ProjectUpdate
from model.schemas.UserSchemas import User
from datetime import datetime

def create_project(db: Session, project: ProjectCreate, user_id: int):
    db_project = ProjectDB(**project.dict(), owner_id=user_id)
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

def get_project(db: Session, project_id: int):
    return db.query(ProjectDB).filter(ProjectDB.id == project_id).first()

def get_projects_by_user(db:Session, user_id:int):
    return db.query(ProjectDB).filter(ProjectDB.owner_id == user_id).all()

def get_projects(db:Session, skip:int=0, limit:int=100):
    return db.query(ProjectDB).offset(skip).limit(limit).all()

############### Not enough permissions exception ###############
class PermissionDeniedException(Exception):
    def __init__(self, message="user not allowed to modify project"):
        self.message = message
        super().__init__(self.message)
################################################################

def check_ownership(owner_id: int, user_id:int):
    if owner_id != user_id:
         raise PermissionDeniedException()

def update_project(db: Session, current_project_id: int, user: User, project_update: ProjectUpdate):
    update_data = project_update.model_dump(exclude_unset=True)
    update_data["last_edition_date"] = datetime.utcnow()
    project_db = get_project(db, current_project_id)

    check_ownership(owner_id=project_db.owner_id, user_id=user.id)

    for key, value in update_data.items():
            setattr(project_db, key, value)

    db.commit()
    db.refresh(project_db)
    return project_db


def delete_project(db:Session, id_project: int, user:User):
    project_db = get_project(db, id_project)
    check_ownership(owner_id=project_db.owner_id, user_id=user.id)
    db.delete(project_db)
    db.commit()


