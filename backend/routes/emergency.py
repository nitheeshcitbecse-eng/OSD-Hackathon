from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks, status
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import asyncio
from database import get_db
from config import settings
from models import serialize_mongo_doc

router = APIRouter(prefix="/api/emergency", tags=["emergency"])

# Request payload model for activation
class EmergencyActivatePayload(BaseModel):
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    triggeredBy: Optional[str] = None

# Initialize Twilio client conditionally
twilio_client = None
if settings.TWILIO_ACCOUNT_SID and settings.TWILIO_AUTH_TOKEN:
    try:
        from twilio.rest import Client
        twilio_client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
    except Exception as e:
        print("Failed to initialize Twilio client:", e)

async def send_sms_notifications(contacts, message_body):
    if not twilio_client or not settings.TWILIO_PHONE_NUMBER:
        print("Twilio is not fully configured. Simulating SMS delivery.")
        for contact in contacts:
            print(f"[SIMULATED SMS] To {contact.get('name')} ({contact.get('phoneNumber')}): {message_body}")
        return

    # Helper function to send single SMS safely
    def send_one(to_number):
        try:
            message = twilio_client.messages.create(
                body=message_body,
                from_=settings.TWILIO_PHONE_NUMBER,
                to=to_number
            )
            print(f"SMS Sent to {to_number}: {message.sid}")
        except Exception as err:
            print(f"Error sending SMS to {to_number}: {err}")

    # Run blocking Twilio client calls in executors/threads to prevent blocking the main event loop
    loop = asyncio.get_running_loop()
    for contact in contacts:
        phone = contact.get("phoneNumber")
        if phone:
            await loop.run_in_executor(None, send_one, phone)

@router.post("/activate")
async def activate_emergency(
    payload: EmergencyActivatePayload, 
    background_tasks: BackgroundTasks, 
    db=Depends(get_db)
):
    try:
        latitude = payload.latitude
        longitude = payload.longitude
        triggered_by = payload.triggeredBy or "User"
        
        gps_location = f"Latitude: {latitude}, Longitude: {longitude}" if (latitude is not None and longitude is not None) else "Location Unavailable"
        
        # 1. Create a critical Alert log in the DB
        emergency_log = {
            "imageUrl": "https://images.unsplash.com/photo-1582139329536-e7284fece509?q=80&w=300&auto=format&fit=crop",
            "confidenceScore": 100.0,
            "riskLevel": "critical",
            "location": f"Emergency Button Pressed ({gps_location})",
            "resolved": False,
            "timestamp": datetime.utcnow()
        }
        
        result = await db.alerts.insert_one(emergency_log)
        emergency_log["_id"] = result.inserted_id
        serialized_log = serialize_mongo_doc(emergency_log)
        
        # 2. Broadcast via socket to all frontend clients
        try:
            from main import sio
            await sio.emit('emergency-activated', {
                "log": serialized_log,
                "gps": {"latitude": latitude, "longitude": longitude},
                "triggeredBy": triggered_by
            })
            print("Emergency activated event broadcasted!")
        except Exception as socket_err:
            print("Failed to broadcast emergency event via socket:", socket_err)
            
        # 3. Find emergency contacts to notify
        cursor = db.contacts.find({"notifyOnCritical": True})
        contacts = await cursor.to_list(length=500)
        
        # Construct message body
        maps_lat = latitude if latitude is not None else 0
        maps_lon = longitude if longitude is not None else 0
        message_body = f"CRITICAL ALERT: Emergency triggered by {triggered_by}. Coordinates: https://www.google.com/maps/search/?api=1&query={maps_lat},{maps_lon}"
        
        # 4. Schedule Twilio SMS alerts in the background task
        background_tasks.add_task(send_sms_notifications, contacts, message_body)
        
        return {
            "message": "Emergency activated. Contacts notified.",
            "log": serialized_log
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
