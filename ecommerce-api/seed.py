import sys
from sqlalchemy.orm import Session
from database import engine, Base
import models


def get_db_session():
    try:
        from database import SessionLocal
        return SessionLocal()
    except ImportError:
        return Session(engine)


SAMPLE_PRODUCTS = [
    # --- Electronics ---
    {
        "name": "Wireless Noise-Canceling Headphones",
        "description": "Premium over-ear headphones with active noise cancellation and 30-hour battery life.",
        "price": 199.99,
        "category": "Electronics",
        "image_url": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop",
    },
    {
        "name": "Mechanical Gaming Keyboard",
        "description": "RGB backlit mechanical keyboard with tactile blue switches and custom macro support.",
        "price": 89.50,
        "category": "Electronics",
        "image_url": "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop",
    },
    {
        "name": "Ergonomic Wireless Mouse",
        "description": "Precision optical wireless mouse designed for all-day comfort and silent clicks.",
        "price": 45.00,
        "category": "Electronics",
        "image_url": "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&auto=format&fit=crop",
    },
    {
        "name": "Ultra-Wide Gaming Monitor 34\"",
        "description": "Curved 144Hz WQHD monitor with 1ms response time and HDR400 color clarity.",
        "price": 429.99,
        "category": "Electronics",
        "image_url": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&auto=format&fit=crop",
    },
    {
        "name": "4K Ultra HD Webcam",
        "description": "Pro streaming camera with dual noise-reducing microphones and autofocus.",
        "price": 79.99,
        "category": "Electronics",
        "image_url": "https://images.unsplash.com/photo-1588702547919-26089e690ecc?w=500&auto=format&fit=crop",
    },
    {
        "name": "Portable External SSD 1TB",
        "description": "High-speed USB 3.2 solid state drive with up to 1050MB/s read speeds in a rugged case.",
        "price": 119.00,
        "category": "Electronics",
        "image_url": "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500&auto=format&fit=crop",
    },

    # --- Audio & Wearables ---
    {
        "name": "Smart Fitness Watch",
        "description": "Track health metrics, heart rate, sleep quality, and GPS activity with a 7-day battery.",
        "price": 129.00,
        "category": "Wearables",
        "image_url": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop",
    },
    {
        "name": "True Wireless Earbuds",
        "description": "In-ear wireless earbuds with active noise transparency and touch controls.",
        "price": 69.99,
        "category": "Audio",
        "image_url": "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop",
    },
    {
        "name": "Portable Bluetooth Speaker",
        "description": "Waterproof IPX7 outdoor speaker with deep bass and 12-hour continuous playtime.",
        "price": 49.95,
        "category": "Audio",
        "image_url": "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&auto=format&fit=crop",
    },
    {
        "name": "USB Condenser Studio Microphone",
        "description": "Cardioid recording microphone with desktop tripod stand for podcasting and streaming.",
        "price": 59.99,
        "category": "Audio",
        "image_url": "https://images.unsplash.com/photo-1590658006821-04f4008d5717?w=500&auto=format&fit=crop",
    },

    # --- Accessories ---
    {
        "name": "Aluminum Laptop Stand",
        "description": "Elevated ergonomic desktop stand compatible with laptops from 10 to 17 inches.",
        "price": 29.99,
        "category": "Accessories",
        "image_url": "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&auto=format&fit=crop",
    },
    {
        "name": "USB-C Multi-Port Hub (8-in-1)",
        "description": "Expand your setup with 4K HDMI, 100W Power Delivery, SD reader, and 3 USB 3.0 ports.",
        "price": 39.99,
        "category": "Accessories",
        "image_url": "https://images.unsplash.com/photo-1544652478-6653e09f18a2?w=500&auto=format&fit=crop",
    },
    {
        "name": "Minimalist Leather Desk Pad",
        "description": "Water-resistant PU leather desk blotter to protect your surface and enhance tracking.",
        "price": 19.50,
        "category": "Accessories",
        "image_url": "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?w=500&auto=format&fit=crop",
    },
    {
        "name": "Magnetic Wireless Charging Stand",
        "description": "3-in-1 fast wireless charger for smartphone, smart watch, and wireless earbuds.",
        "price": 34.99,
        "category": "Accessories",
        "image_url": "data:image/webp;base64,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",
    },
    {
        "name": "Portable Power Bank 20,000mAh",
        "description": "High-capacity external battery with 22.5W fast charging output and LED power display.",
        "price": 38.00,
        "category": "Accessories",
        "image_url": "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQGrVRxE-zqKiiJ7BdDQGH3VNiUsb4A3hwF7BrtVcVtYrhMAEVAjxoYTw5Lr9CtwbGhKpy0C-YoXzJt6mAPZtVfkc-dHEmBiRXTW4GR_wIOWX5YfSL8ut58AH1QO1uJzB3R8CwurDY&usqp=CAc",
    },

    # --- Office & Setup ---
    {
        "name": "Smart LED Desk Lamp",
        "description": "Dimmable eye-care table light with multiple color modes and built-in USB charging port.",
        "price": 32.50,
        "category": "Office",
        "image_url": "https://images.unsplash.com/photo-1534073828943-f801091bb18c?w=500&auto=format&fit=crop",
    },
    {
        "name": "Ergonomic Memory Foam Wrist Rest",
        "description": "Keyboard and mouse wrist support pad designed to alleviate strain during long sessions.",
        "price": 16.99,
        "category": "Office",
        "image_url": "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop",
    },
    {
        "name": "Neoprene Cable Management Sleeves",
        "description": "4-pack flexible cord organizer sleeves with zip closures to tidy desk cables.",
        "price": 14.25,
        "category": "Office",
        "image_url": "https://images.unsplash.com/photo-1544652478-6653e09f18a2?w=500&auto=format&fit=crop",
    },
    {
        "name": "Vertical Dual Monitor Arm",
        "description": "Heavy-duty full-motion desktop mount for dual screens up to 32 inches each.",
        "price": 64.99,
        "category": "Office",
        "image_url": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&auto=format&fit=crop",
    },
    {
        "name": "Adjustable Metal Tablet Stand",
        "description": "Multi-angle foldable holder for iPads, e-readers, and secondary display tablets.",
        "price": 22.00,
        "category": "Accessories",
        "image_url": "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&auto=format&fit=crop",
    },
]


def seed_database():
    Base.metadata.create_all(bind=engine)
    db = get_db_session()

    try:
        # Check existing product count
        existing_count = db.query(models.Product).count()

        # Optional force reset if flag supplied or database is empty
        if len(sys.argv) > 1 and sys.argv[1] == "--reset":
            print("🧹 Clearing existing product entries...")
            db.query(models.Product).delete()
            db.commit()
            existing_count = 0

        if existing_count > 0:
            print(f"ℹ️ Database already contains {existing_count} product(s).")
            print("💡 Tip: Run 'python seed.py --reset' to replace existing data.")
            return

        print("🌱 Seeding database with 20 sample products...")
        products_to_add = [models.Product(**item) for item in SAMPLE_PRODUCTS]

        db.add_all(products_to_add)
        db.commit()

        print(f"✅ Successfully seeded {len(products_to_add)} products into SQLite!")

    except Exception as e:
        db.rollback()
        print(f"❌ Error seeding database: {e}")
        sys.exit(1)
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()