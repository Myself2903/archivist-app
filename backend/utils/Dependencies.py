import DataSource as ds

# Dependency
def get_db():
    db = ds.SessionLocal()
    try:
        yield db
    finally:
        db.close()
