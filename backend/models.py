from pydantic import BaseModel, Field, EmailStr
from typing import Optional
from datetime import datetime

def serialize_mongo_doc(doc) -> Optional[dict]:
    if doc is None:
        return None
    doc = dict(doc)
    if "_id" in doc:
        doc["id"] = str(doc["_id"])
        del doc["_id"]
    return doc

# User Models
class UserSignup(BaseModel):
    email: EmailStr
    password: str
    name: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    name: Optional[str] = None
    createdAt: datetime

# Alert Models
class AlertCreate(BaseModel):
    imageUrl: str
    confidenceScore: float
    riskLevel: Optional[str] = "medium"
    location: Optional[str] = "Front Door"

class AlertResponse(BaseModel):
    id: str
    imageUrl: str
    confidenceScore: float
    riskLevel: str
    resolved: bool
    location: str
    timestamp: datetime

# Contact Models
class ContactCreate(BaseModel):
    name: str
    phoneNumber: str
    email: Optional[str] = None
    notifyOnCritical: Optional[bool] = True

class ContactUpdate(BaseModel):
    name: Optional[str] = None
    phoneNumber: Optional[str] = None
    email: Optional[str] = None
    notifyOnCritical: Optional[bool] = None

class ContactResponse(BaseModel):
    id: str
    name: str
    phoneNumber: str
    email: Optional[str] = None
    notifyOnCritical: bool
    createdAt: datetime


# Face Models
class FaceCreate(BaseModel):
    name: str
    imageUrl: str

class FaceResponse(BaseModel):
    id: str
    name: str
    imageUrl: str
    createdAt: datetime

# Settings Models
class SettingsUpdate(BaseModel):
    alertSensitivity: Optional[int] = Field(None, ge=0, le=100)
    nightMode: Optional[bool] = None
    autoEmergencyTimer: Optional[int] = None
    sirenVolume: Optional[int] = Field(None, ge=0, le=100)

class SettingsResponse(BaseModel):
    id: str
    alertSensitivity: int
    nightMode: bool
    autoEmergencyTimer: int
    sirenVolume: int
    updatedAt: datetime
