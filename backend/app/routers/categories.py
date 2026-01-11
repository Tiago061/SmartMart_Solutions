from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.schemas import CategoryCreate
from app.crud import create_category, get_categories
from app.csv_utils import read_csv 

router = APIRouter(prefix="/categories", tags=["categories"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Endpoints existentes
@router.post("/")
def add_category(category: CategoryCreate, db: Session = Depends(get_db)):
    return create_category(db, category.dict())

@router.get("/")
def list_categories(db: Session = Depends(get_db)):
    return get_categories(db)

# Novo endpoint CSV
@router.post("/upload-csv")
def upload_categories_csv(file: UploadFile = File(...), db: Session = Depends(get_db)):
    rows = read_csv(file) # Use a função robusta acima
    inserted = []
    for row in rows:
        name = row.get("name") # Agora o nome está limpo
        if name:
            new_cat = create_category(db, {"name": name.strip()})
            inserted.append(new_cat)
    return {"message": f"Sucesso! {len(inserted)} categorias importadas."}
