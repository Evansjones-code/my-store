from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime


# --- Product Schemas ---

class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    category: str = "General"
    image_url: Optional[str] = None


class ProductCreate(ProductBase):
    pass


class ProductResponse(ProductBase):
    id: int

    class Config:
        from_attributes = True  # Allows Pydantic to serialize SQLAlchemy ORM models


# --- Order Schemas ---

class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int


class OrderItemResponse(BaseModel):
    id: int
    product_id: int
    product_name: str
    price: float
    quantity: int

    class Config:
        from_attributes = True


class OrderCreate(BaseModel):
    customer_name: str
    customer_email: EmailStr
    items: List[OrderItemCreate]


class OrderResponse(BaseModel):
    id: int
    customer_name: str
    customer_email: str
    total_amount: float
    status: str
    created_at: datetime
    items: List[OrderItemResponse]

    class Config:
        from_attributes = True