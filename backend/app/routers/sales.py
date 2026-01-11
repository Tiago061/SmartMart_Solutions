from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from datetime import datetime
import csv
import codecs
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.schemas import SaleCreate
from app.crud import create_sale, get_sales
from app.csv_utils import read_csv

router = APIRouter(prefix="/sales")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Endpoints existentes
@router.post("/")
def add_sale(sale: SaleCreate, db: Session = Depends(get_db)):
    return create_sale(db, sale.dict())

@router.get("/")
def list_sales(db: Session = Depends(get_db)):
    sales = get_sales(db)
    total_profit = sum(s.total_price for s in sales)
    return {
        "sales": sales,
        "total_profit": total_profit
    }

# Novo endpoint CSV
@router.post("/upload-csv")
def upload_sales_csv(file: UploadFile = File(...), db: Session = Depends(get_db)):
    # 1. Lê o CSV usando a lógica robusta para evitar erros de colunas
    file.file.seek(0)
    stream = codecs.iterdecode(file.file, 'utf-8-sig')
    reader = csv.DictReader(stream)
    reader.fieldnames = [n.strip().lower() for n in reader.fieldnames]
    
    inserted = []
    for row in reader:
        try:
            
            date_str = row.get("date", "").strip()
          
            month_int = datetime.strptime(date_str, "%Y-%m-%d").month
            
            
            sale_data = {
                "product_id": int(row["product_id"]),
                "month": month_int, 
                "quantity": int(row["quantity"]),
                "total_price": float(row["total_price"])
            }
            
            new_sale = create_sale(db, sale_data)
            inserted.append(new_sale)
            
        except Exception as e:
            print(f"Erro ao processar linha {row}: {e}")
            continue
            
    return {"status": "success", "imported": len(inserted)}