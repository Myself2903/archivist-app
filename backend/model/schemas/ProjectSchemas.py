from pydantic import BaseModel
from datetime import datetime
from model.schemas.UserSchemas import User

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
    owner: User

    class Config:
        from_attributes = True

class ProjectUpdate(BaseModel):
    name: str | None = None
    active: bool | None = None
    enterprise: str | None = None
    creation_date: datetime | None = None
    last_edition_date: datetime | None = None
    public_access: bool | None = None