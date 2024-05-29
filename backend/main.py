from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from controller.Login import router as login_router
from controller.RegisterUser import router as register_router
from controller.Profile import router as profile_router
from controller.ProjectController import router as project_router
from model.dao.UserDao import get_users
from DataSource import get_db
import DataSource as ds
from model.schemas.UserSchemas import User

ds.Base.metadata.create_all(bind=ds.engine)

app = FastAPI()

#url allowed to query
origins = [
    "http://localhost",
    "http://localhost:5173",
]


#add origins to router
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(login_router)
app.include_router(register_router)
app.include_router(profile_router)
app.include_router(project_router)


@app.get("/")
def read_root():
    return{"Hello": "World"}

@app.get("/users")
def getAllusers(db: Session = Depends(get_db)):
    return get_users(db=db)


