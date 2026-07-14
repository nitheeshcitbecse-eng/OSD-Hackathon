from fastapi import APIRouter, HTTPException, Depends, status
from bson import ObjectId
from datetime import datetime
from database import get_db
from models import ContactCreate, ContactUpdate, serialize_mongo_doc

router = APIRouter(prefix="/api/contacts", tags=["contacts"])

@router.get("")
async def get_contacts(db=Depends(get_db)):
    try:
        cursor = db.contacts.find()
        contacts = await cursor.to_list(length=1000)
        return [serialize_mongo_doc(c) for c in contacts]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("", status_code=201)
async def create_contact(payload: ContactCreate, db=Depends(get_db)):
    try:
        if not payload.name or not payload.phoneNumber:
            raise HTTPException(status_code=400, detail="Name and Phone Number are required")
            
        contact_doc = {
            "name": payload.name,
            "phoneNumber": payload.phoneNumber,
            "notifyOnCritical": payload.notifyOnCritical,
            "createdAt": datetime.utcnow()
        }
        
        result = await db.contacts.insert_one(contact_doc)
        contact_doc["_id"] = result.inserted_id
        return serialize_mongo_doc(contact_doc)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{id}")
async def update_contact(id: str, payload: ContactUpdate, db=Depends(get_db)):
    try:
        if not ObjectId.is_valid(id):
            raise HTTPException(status_code=400, detail="Invalid contact ID format")
            
        # Extract fields to update that are not None
        update_data = {k: v for k, v in payload.model_dump(exclude_unset=True).items() if v is not None}
        
        if not update_data:
            # If nothing to update, just return the existing contact
            existing = await db.contacts.find_one({"_id": ObjectId(id)})
            if not existing:
                raise HTTPException(status_code=404, detail="Contact not found")
            return serialize_mongo_doc(existing)
            
        result = await db.contacts.find_one_and_update(
            {"_id": ObjectId(id)},
            {"$set": update_data},
            return_document=True
        )
        if not result:
            raise HTTPException(status_code=404, detail="Contact not found")
            
        return serialize_mongo_doc(result)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{id}")
async def delete_contact(id: str, db=Depends(get_db)):
    try:
        if not ObjectId.is_valid(id):
            raise HTTPException(status_code=400, detail="Invalid contact ID format")
            
        result = await db.contacts.find_one_and_delete({"_id": ObjectId(id)})
        if not result:
            raise HTTPException(status_code=404, detail="Contact not found")
            
        return {"message": "Contact deleted successfully", "id": id}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
