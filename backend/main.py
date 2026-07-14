import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import socketio
from config import settings
from database import init_db, db_helper

# Create a FastAPI App
app = FastAPI(title="OSD Hackathon Security API")

# Configure CORS for FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Setup python-socketio AsyncServer
sio = socketio.AsyncServer(async_mode='asgi', cors_allowed_origins='*')

# Wrap FastAPI app with Socket.io ASGI application
# This automatically mounts Socket.io's handler on /socket.io/
socket_app = socketio.ASGIApp(sio, other_asgi_app=app)

# Database startup/shutdown events
@app.on_event("startup")
async def startup_db_client():
    init_db()

@app.on_event("shutdown")
async def shutdown_db_client():
    if db_helper.client:
        db_helper.client.close()
        print("MongoDB connection closed.")

# Socket.io connection handlers
@sio.event
async def connect(sid, environ):
    print("New client connected:", sid)

@sio.event
async def disconnect(sid):
    print("Client disconnected:", sid)

# Basic Route for testing
@app.get("/")
async def root():
    return "OSD Hackathon Security API is running..."

# Import routers after defining 'sio' to avoid import errors (since routers import 'sio')
from routes.auth import router as auth_router
from routes.alerts import router as alerts_router
from routes.contacts import router as contacts_router
from routes.emergency import router as emergency_router
from routes.faces import router as faces_router
from routes.settings import router as settings_router

# Register routers
app.include_router(auth_router)
app.include_router(alerts_router)
app.include_router(contacts_router)
app.include_router(emergency_router)
app.include_router(faces_router)
app.include_router(settings_router)

if __name__ == "__main__":
    uvicorn.run("main:socket_app", host="0.0.0.0", port=settings.PORT, reload=True)
