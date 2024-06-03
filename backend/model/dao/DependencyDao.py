from sqlalchemy.orm import Session
from model.entity.Dependency import DependencyDB
from model.schemas.DependencySchemas import DependencyCreate, DependencyUpdate
from utils.Exceptions import DeleteRootDependencyException, MultipleRootDependencyException, NotFoundException, SelfDependenceException
from model.dao.ProjectDao import check_project_active

#dependency by id
def get_dependency(db: Session, dependency_id: int):
    return db.query(DependencyDB).filter(DependencyDB.id == dependency_id).first()

def get_dependencies_by_project(db: Session, project_id: int):
    return db.query(DependencyDB).filter(DependencyDB.project_id == project_id).all()

#get all dependencies
def get_dependencies(db:Session, skip:int=0, limit:int=100):
    return db.query(DependencyDB).offset(skip).limit(limit).all()

#gets projects root dependency
def get_root_dependency_by_project(db: Session, project_id: int):
    return db.query(DependencyDB).filter(
        DependencyDB.project_id == project_id,
        DependencyDB.father_id == None    
    ).first()

#verify conditions when creating or updating a dependency
def check_father_dependency_data(father_id: int, project_id: int, db: Session):
    #check if father_id ommited (creating a root dependency)
    if father_id is None:  
        if get_root_dependency_by_project(db=db, project_id=project_id):
            raise MultipleRootDependencyException()

        return True
    
    #if its not a root directory, checks that father exist in same project
    try:    
        if get_dependency(db=db, dependency_id=father_id).project_id != project_id:
            raise NotFoundException("Father not found in same project")
        
    except Exception as e:
        raise NotFoundException("Father not found in same project")
    

def create_dependency(db: Session, dependency: DependencyCreate):
    db_dependency = DependencyDB(**dependency.dict())
    
    check_project_active(db=db, project_id=db_dependency.project_id)

    check_father_dependency_data(
                        db=db, 
                        father_id=db_dependency.father_id,
                        project_id=db_dependency.project_id
    )

    db.add(db_dependency)
    db.commit()
    db.refresh(db_dependency)
    return db_dependency


def update_dependency(db: Session, current_dependency_id:int, dependency_update: DependencyUpdate):
    
    update_data = dependency_update.model_dump(exclude_unset=True)
    dependency_db = get_dependency(db, current_dependency_id)
    
    try:
        #avoid self reference error
        if update_data["father_id"] == dependency_db.id:
            raise SelfDependenceException()

        check_father_dependency_data(
                            db=db, 
                            father_id=update_data["father_id"],
                            project_id=dependency_db.project_id
        )
    except KeyError as e:
        pass

    for key, value in update_data.items():
            setattr(dependency_db, key, value)

    db.commit()
    db.refresh(dependency_db)
    return dependency_db


def delete_dependency(db:Session, id_dependency: int):
    dependency_db = get_dependency(db, id_dependency)
    if not dependency_db:
        raise NotFoundException
    
    #root dependency cannot be deleted
    if dependency_db.father_id is not None:
        db.delete(dependency_db)
        db.commit()
    else:
        raise DeleteRootDependencyException()
    