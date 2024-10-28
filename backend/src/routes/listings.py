from fastapi import APIRouter, BackgroundTasks
from fastapi.responses import JSONResponse

from db.job_listing.JobListing import JobListing, JobListingUpdate
from db.job_listing.JobListingRepository import JobListingRepository
import process


router = APIRouter(tags=["listings"], responses={404: {"ERROR": "Not found"}})


@router.post("/")
def create_listing(job_listing: JobListing):
    """Create a new job listing.

    Args:
        job_listing (JobListing): The job listing.

    Returns:
        JobListing: The created job listing.
    """
    try:
        return JobListingRepository.create(job_listing)
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@router.get("/")
def get_all_listings(offset: int = 0):
    """Get all the job listings.
    
    Returns:
        List[JobListing]: The list of job listings.
    """
    try:
        return JobListingRepository.fetchall(offset)
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@router.get("/not-applied")
def get_not_applied_listings(offset: int = 0):
    """Get all the job listings that have not been applied yet.
    
    Returns:
        List[JobListing]: The list of job listings.
    """
    try:
        return JobListingRepository.fetch_not_applied(offset)
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
    

@router.get("/applied")
def get_applied_listings(offset: int = 0):
    """Get all the job listings that have been applied.

    Returns:
        List[JobListing]: The list of job listings.
    """
    try:
        return JobListingRepository.fetch_applied(offset=offset)
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
    

@router.get("/not-processed")
def get_not_processed_listings(offset: int = 0):
    """Get all the job listings that have not been processed yet, e.g. response is null.

    Returns:
        List[JobListing]: The list of job listings.
    """
    try:
        return JobListingRepository.fetch_not_processed(offset)
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
    

@router.put("/{id}")
def update_listing(id: int, job_listing_update: JobListingUpdate):
    """Update a job listing by id.

    Args:
        id (int): The id of the job listing.
        job_listing (JobListing): The job listing.

    Returns:
        JobListing: The updated job listing.
    """
    try:
        job_listing = JobListingRepository.fetch_by_id(id)
        job_listing.applied = job_listing_update.applied
        
        return JobListingRepository.update(job_listing)
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.delete("/{id}")
def delete_listing(id: int):
    """Delete a job listing by id.

    Args:
        id (int): The id of the job listing.

    Returns:
        Dict: The message.
    """
    try:
        JobListingRepository.delete(id)
        return {"message": "Listing deleted."}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
    

@router.get("/process")
async def process_listings(background_tasks: BackgroundTasks):
    """Process all the job listings.
    
    Returns:
        List[JobListing]: The list of job listings.
    """
    try:
        listings_to_process = JobListingRepository.fetch_not_processed()

        if not listings_to_process:
            return {"message": "No listings to process."}
        
        # Check if the resume has been uploaded
        process.process_listings_requirements()
        
        # Process the listings in the background, so that the API does not block while processing
        background_tasks.add_task(process.process_listings, listings_to_process)

        return {"message": "Processing job listings..."}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
    

@router.get("/processing")
def is_processing_listings():
    """Check if the job listings are being processed.
    
    Returns:
        Dict: The message.
    """
    return {"processing": process.processing_listing}