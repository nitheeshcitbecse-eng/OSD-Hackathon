from fastapi import APIRouter, UploadFile, File, HTTPException
import cloudinary
import cloudinary.uploader
from config import settings

router = APIRouter(prefix="/api/upload", tags=["upload"])

# Configure Cloudinary using settings
if settings.CLOUDINARY_URL:
    try:
        # Parse cloudinary://api_key:api_secret@cloud_name
        url_str = settings.CLOUDINARY_URL
        if url_str.startswith("cloudinary://"):
            url_str = url_str[len("cloudinary://"):]
            credentials, cloud_name = url_str.split("@")
            api_key, api_secret = credentials.split(":")
            
            cloudinary.config(
                cloud_name=cloud_name,
                api_key=api_key,
                api_secret=api_secret
            )
            print(f"Cloudinary configured successfully for cloud: {cloud_name}")
        else:
            print("Invalid CLOUDINARY_URL format.")
    except Exception as e:
        print("Failed to configure Cloudinary:", e)
else:
    print("CLOUDINARY_URL is not set in settings/env.")

@router.post("", status_code=200)
async def upload_image(file: UploadFile = File(...)):
    if not settings.CLOUDINARY_URL:
        raise HTTPException(
            status_code=500,
            detail="Cloudinary is not configured. Please set CLOUDINARY_URL."
        )
    
    # Verify file type is an image
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file must be an image.")

    try:
        # Read the file contents
        contents = await file.read()
        
        # Upload using the Cloudinary SDK
        upload_result = cloudinary.uploader.upload(
            contents,
            folder="osd_hackathon"
        )
        
        # Extract the secure URL
        secure_url = upload_result.get("secure_url")
        if not secure_url:
            raise Exception("Cloudinary did not return a secure URL.")
            
        return {"imageUrl": secure_url}
    except Exception as e:
        print("Cloudinary upload error:", e)
        raise HTTPException(status_code=500, detail=f"Failed to upload image: {str(e)}")
