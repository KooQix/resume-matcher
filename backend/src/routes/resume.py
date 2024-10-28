import os
from fastapi import APIRouter, File, UploadFile
from fastapi.responses import FileResponse, JSONResponse

from db.job_listing.JobListingRepository import JobListingRepository
import utils

router = APIRouter(tags=["resume"], responses={404: {"ERROR": "Not found"}})


@router.get("/")
def get_resume():
    """Returns a message indicating if a resume file has been uploaded."""
    file_location = f"{utils.ROOT_DIR}/uploads/resume.pdf"

    return {"message": os.path.exists(file_location)}


@router.post("/upload")
async def upload_resume(file: UploadFile = File(...)):
    """Upload a resume file.
    
    Args:
        file (UploadFile, optional): The resume file to upload. Defaults to File(...).
        
    Returns:
        Dict[str, str]: The filename of the uploaded file.
    """
    if file.content_type != "application/pdf":
        return JSONResponse(status_code=400, content={"error": "Only PDF files are supported."})
    
    try:
        file_location = f"{utils.ROOT_DIR}/uploads/resume.pdf"

        # If resume file already exists, delete it
        if os.path.exists(file_location):
            os.remove(file_location)

        with open(file_location, "wb") as file_object:
            file_object.write(file.file.read())

        return {"message": "Resume uploaded successfully."}
    
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@router.get("/download")
async def download_resume():
    """Download a resume file.

    Args:
        filename (str): The filename of the resume file to download.

    Returns:
        FileResponse: The response with the resume file.
    """
    file_location = f"{utils.ROOT_DIR}/uploads/resume.pdf"

    if not os.path.exists(file_location):
        return JSONResponse(status_code=404, content={"error": "File not found."})
    
    try:
        return FileResponse(file_location, media_type="application/pdf")

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


