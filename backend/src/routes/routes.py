
from fastapi import APIRouter

from routes import resume, listings


router = APIRouter(responses={404: {"ERROR": "Not found"}})


router.include_router(router=resume.router, prefix="/resume")
router.include_router(router=listings.router, prefix="/listings")



