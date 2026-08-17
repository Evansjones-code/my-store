import redis
import os

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

# decode_responses=True converts Redis byte responses automatically into UTF-8 strings
r_client = redis.Redis.from_url(REDIS_URL, decode_responses=True)