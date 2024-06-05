from pydantic import BaseModel
from typing import List, Optional

class DependencyBase(BaseModel):
    name: str

class DependencyCreate(DependencyBase):
    project_id: int
    father_id: int = None

class Dependency(DependencyBase):
    id: int
    project_id:int
    children: List['Dependency'] = []

    class Config:
        from_attributes = True

class DependencyUpdate(BaseModel):
    name: Optional[str] = None
    father_id: Optional[int] = None