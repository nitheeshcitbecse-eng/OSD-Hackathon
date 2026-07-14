from fastapi import APIRouter, HTTPException, Depends, status
from bson import ObjectId
from datetime import datetime
from database import get_db
from models import FaceCreate, serialize_mongo_doc

router = APIRouter(prefix="/api/family-faces", tags=["faces"])

@router.get("")
async def get_faces(db=Depends(get_db)):
    try:
        cursor = db.faces.find().sort("createdAt", -1)
        faces = await cursor.to_list(length=1000)
        return [serialize_mongo_doc(face) for face in faces]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("", status_code=201)
async def create_face(payload: FaceCreate, db=Depends(get_db)):
    try:
        if not payload.name or not payload.imageUrl:
            raise HTTPException(status_code=400, detail="Name and Image URL are required")
            
        face_doc = {
            "name": payload.name,
            "imageUrl": payload.imageUrl,
            "createdAt": datetime.utcnow()
        }
        
        result = await db.faces.insert_one(face_doc)
        face_doc["_id"] = result.inserted_id
        return serialize_mongo_doc(face_doc)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{id}")
async def delete_face(id: str, db=Depends(get_db)):
    try:
        if not ObjectId.is_valid(id):
            raise HTTPException(status_code=400, detail="Invalid face record ID format")
            
        result = await db.faces.find_one_and_delete({"_id": ObjectId(id)})
        if not result:
            raise HTTPException(status_code=404, detail="Face record not found")
            
        return {"message": "Face record deleted successfully", "id": id}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
