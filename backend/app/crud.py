from sqlalchemy.orm import Session
from app.models import Product, Category, Sale

def create_product(db: Session, data):
    product = Product(**data)
    db.add(product)
    db.commit()
    return product

def get_products(db: Session):
    return db.query(Product).all()

def create_category(db: Session, data):
    category = Category(**data)
    db.add(category)
    db.commit()
    return category

def get_categories(db: Session):
    return db.query(Category).all()

def create_sale(db: Session, data):
    sale = Sale(**data)
    db.add(sale)
    db.commit()
    return sale

def get_sales(db: Session):
    return db.query(Sale).all()