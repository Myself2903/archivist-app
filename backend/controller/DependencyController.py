from fastapi import APIRouter, HTTPException, Depends, Body, status
from model.schemas.DependencySchemas import Dependency, DependencyCreate
from sqlalchemy.orm import Session
from model.dao.DependencyDao import *
from DataSource import get_db  
from utils.Exceptions import PermissionDeniedException, MultipleRootDependencyException, ProjectNotActiveException, NotFoundException

router = APIRouter(prefix="/project/org_chart")

@router.get("", response_model=list[Dependency])
def get_project_dependencies(project_id: int, db: Session = Depends(get_db)):
    return get_dependencies_by_project(db=db,project_id=project_id)

@router.post("/create")
def create_new_dependency(
                        dependency: DependencyCreate,                         
                        db: Session = Depends(get_db)
    ):

    try:
        return create_dependency(db=db,dependency=dependency)
    
    except MultipleRootDependencyException as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="cannot create multiple root dependencies")
    
    except ProjectNotActiveException as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Project is not active")
    
    except NotFoundException as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Father dependency not found")
   
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.put("/update", response_model=Dependency)
def update_project_dependency(
                            current_dependency_id: int,
                            dependency_update: DependencyUpdate = Body(...),
                            db:Session = Depends(get_db)
    ):
    
    try:
        dependency_db = update_dependency(
                db=db, 
                current_dependency_id=current_dependency_id,
                dependency_update=dependency_update
        )
    except PermissionDeniedException as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="user not allowed to edit project")
    
    except MultipleRootDependencyException as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="cannot create multiple root dependencies")
    
    except NotFoundException as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Father dependency not found")
    
    except SelfDependenceException as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Self reference in father_id")
    
    except Exception as e:
        raise HTTPException(status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
        
    return dependency_db

@router.delete("/delete", response_model=None)
def delete_project_dependency(id_dependency: int, db: Session = Depends(get_db)):
    try:
        delete_dependency(db=db, id_dependency=id_dependency)

    except NotFoundException as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="dependency not found")
    
    except DeleteRootDependencyException:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="cannot delete root dependency")

    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
    
    raise HTTPException(status_code=204, detail="dependency deleted")