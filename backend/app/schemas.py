from pydantic import BaseModel

class CategoryCreate(BaseModel):
    name: str

class ProductCreate(BaseModel):
    name: str
    price: float
    category_id: int

class SaleCreate(BaseModel):
    product_id: int
    month: int
    quantity: int
    total_price: float