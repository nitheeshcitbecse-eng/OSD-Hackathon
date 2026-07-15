from motor.motor_asyncio import AsyncIOMotorClient
from config import settings

class Database:
    client: AsyncIOMotorClient = None
    db = None

db_helper = Database()

def init_db():
    db_helper.client = AsyncIOMotorClient(settings.MONGODB_URI)
    # Extract DB name from MONGODB_URI if possible, otherwise use osd_hackathon
    # mongodb://127.0.0.1:27017/osd_hackathon -> osd_hackathon
    db_name = settings.MONGODB_URI.split("/")[-1]
    if "?" in db_name:
        db_name = db_name.split("?")[0]
    if not db_name:
        db_name = "osd_hackathon"
    db_helper.db = db_helper.client[db_name]
    print(f"MongoDB Connected Successfully to database: {db_name}")

def get_db():
    if db_helper.db is None:
        init_db()
    return db_helper.db
