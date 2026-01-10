from fastapi import FastAPI
from app.database import Base, engine
from app.routers import products, categories, sales

Base.metadata.create_all(bind=engine)

app = FastAPI(title="SmartMart API")

app.include_router(products.router)
app.include_router(categories.router)
app.include_router(sales.router)

@app.get("/")
def root():
    return {"status": "SmartMart API running"}
