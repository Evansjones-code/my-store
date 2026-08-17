from fastapi import FastAPI, Depends, status, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

from database import engine, Base, get_db
import models
import schemas

Base.metadata.create_all(bind=engine)

app = FastAPI(title="MyStore API (SQLite)")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Product Routes ---

@app.get("/products", response_model=List[schemas.ProductResponse])
def get_products(db: Session = Depends(get_db)):
    return db.query(models.Product).all()


@app.get("/products/{product_id}", response_model=schemas.ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail=f"Product with ID {product_id} not found"
        )
    return product


@app.post("/products", response_model=schemas.ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(product: schemas.ProductCreate, db: Session = Depends(get_db)):
    new_product = models.Product(**product.model_dump())
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return new_product


# --- Order Routes ---

@app.get("/orders", response_model=List[schemas.OrderResponse])
def get_orders(db: Session = Depends(get_db)):
    return db.query(models.Order).order_by(models.Order.id.desc()).all()


@app.post("/orders", response_model=schemas.OrderResponse, status_code=status.HTTP_201_CREATED)
def create_order(order_data: schemas.OrderCreate, db: Session = Depends(get_db)):
    if not order_data.items:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cart cannot be empty."
        )

    db_order_items = []
    total_amount = 0.0

    for item in order_data.items:
        product = db.query(models.Product).filter(models.Product.id == item.product_id).first()
        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Product with ID {item.product_id} not found."
            )

        item_total = product.price * item.quantity
        total_amount += item_total

        db_order_items.append(
            models.OrderItem(
                product_id=product.id,
                product_name=product.name,
                price=product.price,
                quantity=item.quantity,
            )
        )

    new_order = models.Order(
        customer_name=order_data.customer_name,
        customer_email=order_data.customer_email,
        total_amount=round(total_amount, 2),
        items=db_order_items,
    )

    db.add(new_order)
    db.commit()
    db.refresh(new_order)

    return new_order