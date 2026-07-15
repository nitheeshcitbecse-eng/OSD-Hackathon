from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks, status
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import asyncio
from database import get_db
from config import settings
from models import serialize_mongo_doc
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

router = APIRouter(prefix="/api/emergency", tags=["emergency"])

# Request payload model for activation
class EmergencyActivatePayload(BaseModel):
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    triggeredBy: Optional[str] = None

async def send_email_notifications(contacts, message_body):
    if not settings.SMTP_USER or not settings.SMTP_PASSWORD:
        print("SMTP is not fully configured. Simulating Email delivery.")
        for contact in contacts:
            email = contact.get("email")
            if email:
                print(f"[SIMULATED EMAIL] To {contact.get('name')} ({email}): {message_body}")
        return

    # Helper function to send single Email safely
    def send_one(to_email, name):
        try:
            msg = MIMEMultipart()
            msg['From'] = settings.SMTP_USER
            msg['To'] = to_email
            msg['Subject'] = "CRITICAL ALERT: Emergency Triggered"
            
            body = f"Hello {name},\n\n{message_body}\n\nBest regards,\nAI Security Guardian"
            msg.attach(MIMEText(body, 'plain'))
            
            # Connect to SMTP server
            server = smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT)
            server.starttls()
            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            text = msg.as_string()
            server.sendmail(settings.SMTP_USER, to_email, text)
            server.quit()
            print(f"Email Sent to {to_email}")
        except Exception as err:
            print(f"Error sending Email to {to_email}: {err}")

    # Run blocking SMTP calls in executors/threads
    loop = asyncio.get_running_loop()
    for contact in contacts:
        email = contact.get("email")
        if email:
            await loop.run_in_executor(None, send_one, email, contact.get("name", "User"))

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
        
        # 4. Schedule Email alerts in the background task
        background_tasks.add_task(send_email_notifications, contacts, message_body)
        
        return {
            "message": "Emergency activated. Contacts notified.",
            "log": serialized_log
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
