from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import SessionLocal
from schemas import CategoryCreate
from crud import create_category, get_categories

router = APIRouter(prefix="/categories")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/")
def add_category(category: CategoryCreate, db: Session = Depends(get_db)):
    return create_category(db, category.dict())

@router.get("/")
def list_categories(db: Session = Depends(get_db)):
    return get_categories(db)
