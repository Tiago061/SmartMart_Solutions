from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.schemas import SaleCreate
from app.crud import create_sale, get_sales

router = APIRouter(prefix="/sales")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/")
def add_sale(sale: SaleCreate, db: Session = Depends(get_db)):
    return create_sale(db, sale.dict())

@router.get("/")
def list_sales(db: Session = Depends(get_db)):
    sales = get_sales(db)
    profit = sum(s.total_price for s in sales)
    return {
        "sales": sales,
        "total_profit": profit
    }
