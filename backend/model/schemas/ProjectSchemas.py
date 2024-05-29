from pydantic import BaseModel
from datetime import datetime

class ProjectBase(BaseModel):
    name: str
    active: bool = True
    enterprise: str
    creation_date: datetime = datetime.utcnow()
    last_edition_date: datetime = datetime.utcnow()
    public_access: bool = False

class ProjectCreate(ProjectBase):
    pass

class Project(ProjectBase):
    id: int
    owner_id: int

    class Config:
        from_attributes = True

class ProjectUpdate(BaseModel):
    id: int | None = None
    name: str | None = None
    active: bool | None = None
    enterprise: str | None = None
    creation_date: datetime | None = None
    last_edition_date: datetime | None = None
    public_access: bool | None = None