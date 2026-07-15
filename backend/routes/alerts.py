from fastapi import APIRouter, HTTPException, Depends, status
from bson import ObjectId
from datetime import datetime
from database import get_db
from models import AlertCreate, serialize_mongo_doc

# We will import the socketio server instance 'sio' from main later to broadcast events.
# Since python allows import referencing, we can import it inside the route handlers to avoid circular imports.

router = APIRouter(prefix="/api/alerts", tags=["alerts"])

@router.get("")
async def get_alerts(db=Depends(get_db)):
    try:
        cursor = db.alerts.find().sort("timestamp", -1)
        alerts = await cursor.to_list(length=1000)
        return [serialize_mongo_doc(alert) for alert in alerts]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/trigger", status_code=201)
async def trigger_alert(payload: AlertCreate, db=Depends(get_db)):
    try:
        alert_doc = {
            "imageUrl": payload.imageUrl,
            "confidenceScore": payload.confidenceScore,
            "riskLevel": payload.riskLevel,
            "resolved": False,
            "location": payload.location,
            "timestamp": datetime.utcnow()
        }
        
        result = await db.alerts.insert_one(alert_doc)
        alert_doc["_id"] = result.inserted_id
        serialized = serialize_mongo_doc(alert_doc)
        
        # Broadcast to WebSocket clients
        try:
            from main import sio
            await sio.emit('new-alert', serialized)
            print("Socket broadcasted new alert:", serialized["id"])
        except Exception as socket_err:
            print("Failed to broadcast alert via socket:", socket_err)
            
        return serialized
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{id}/resolve")
async def resolve_alert(id: str, db=Depends(get_db)):
    try:
        if not ObjectId.is_valid(id):
            raise HTTPException(status_code=400, detail="Invalid alert ID format")
            
        result = await db.alerts.find_one_and_update(
            {"_id": ObjectId(id)},
            {"$set": {"resolved": True}},
            return_document=True
        )
        if not result:
            raise HTTPException(status_code=404, detail="Alert not found")
            
        return serialize_mongo_doc(result)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
