from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.schemas import ProductCreate
from app.crud import create_product, get_products
from app.csv_utils import read_csv

router = APIRouter(prefix="/products")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/")
def add_product(product: ProductCreate, db: Session = Depends(get_db)):
    return create_product(db, product.dict())

@router.get("/")
def list_products(db: Session = Depends(get_db)):
    return get_products(db)

@router.post("/upload-csv")
def upload_products_csv(file: UploadFile = File(...), db: Session = Depends(get_db)):
    rows = read_csv(file)
    inserted = []
    for row in rows:
        inserted.append(
            create_product(db, {
                "name": row["name"],
                "price": float(row["price"]),
                "category_id": int(row["category_id"])
            })
        )
    return inserted
