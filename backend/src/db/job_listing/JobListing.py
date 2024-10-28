from typing import Optional
from pydantic import BaseModel
from datetime import datetime


class JobListing(BaseModel):
    
    id: Optional[int] = None
    url: str
    title: str
    company: str
    description: str

    response: Optional[str] = None
    apply: Optional[bool] = None
    applied: Optional[bool] = False

    created_at: Optional[datetime] = None


class JobListingUpdate(BaseModel):
    applied: bool
