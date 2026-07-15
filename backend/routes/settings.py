from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime
from database import get_db
from models import SettingsUpdate, serialize_mongo_doc

router = APIRouter(prefix="/api/settings", tags=["settings"])

DEFAULT_SETTINGS = {
    "alertSensitivity": 80,
    "nightMode": False,
    "autoEmergencyTimer": 10,
    "sirenVolume": 100,
    "updatedAt": datetime.utcnow()
}

@router.get("")
async def get_settings(db=Depends(get_db)):
    try:
        settings_doc = await db.settings.find_one()
        if not settings_doc:
            # Create default settings
            result = await db.settings.insert_one(DEFAULT_SETTINGS.copy())
            settings_doc = DEFAULT_SETTINGS.copy()
            settings_doc["_id"] = result.inserted_id
            
        return serialize_mongo_doc(settings_doc)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("")
async def update_settings(payload: SettingsUpdate, db=Depends(get_db)):
    try:
        # Extract fields to update
        update_data = {k: v for k, v in payload.model_dump(exclude_unset=True).items() if v is not None}
        update_data["updatedAt"] = datetime.utcnow()
        
        settings_doc = await db.settings.find_one()
        
        if not settings_doc:
            # Create new setting document combining defaults and updates
            doc_to_create = DEFAULT_SETTINGS.copy()
            doc_to_create.update(update_data)
            result = await db.settings.insert_one(doc_to_create)
            doc_to_create["_id"] = result.inserted_id
            return serialize_mongo_doc(doc_to_create)
        else:
            updated_doc = await db.settings.find_one_and_update(
                {"_id": settings_doc["_id"]},
                {"$set": update_data},
                return_document=True
            )
            return serialize_mongo_doc(updated_doc)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
