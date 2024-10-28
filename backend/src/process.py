import os
import re
from typing import List
from mistralai import Mistral

from db.job_listing.JobListing import JobListing
from db.job_listing.JobListingRepository import JobListingRepository
from Resume import Resume
import utils

MISTRALAI_API_KEY = os.getenv("MISTRALAI_API_KEY")
assert MISTRALAI_API_KEY, "MISTRALAI_API_KEY is not set"

MODEL = "mistral-large-latest"

mistral_client = Mistral(api_key=MISTRALAI_API_KEY)


RESUME_FILE = f"{utils.ROOT_DIR}/uploads/resume.pdf"


processing_listing: bool = False

def process_listings_requirements():
    assert os.path.exists(RESUME_FILE), "Resume not uploaded yet"

async def process_listings(listings: List[JobListing]):
    global processing_listing

    assert not processing_listing, "Another process is already running."
    

    processing_listing = True

    try:
        resume = Resume(RESUME_FILE)
        resume_str = resume.read()

        for listing in listings:

            # Compare the resume and the offer (async way so that it does not block the API while it's processing)
            async_response = await mistral_client.chat.stream_async(
                model=MODEL,
                messages=[
                    {"role": "assistant", "content": f"You are looking for jobs matching your resume: {resume_str}"},
                    {"role": "user", "content": f"I want you to tell me wether this job offer corresponds to my experience and if I should apply or not. Compare my experience and skills with the job requirements and any other element you think is relevant. If yes, provide the key points of my experience matching the job, otherwise tell me no, I should focus my efforts on another offer. Please provide a clear 'In short: Yes apply/No don't apply. The job offer is: {listing.description}"}
                ]
            )

            response = ""

            async for chunk in async_response:
                response += chunk.data.choices[0].delta.content

            listing.response = response

            # Search for the conclusion "In short:" and extract the text after it. If it's like "No, you should focus your efforts on another offer.", then the conclusion is "No".
            # Set the apply field based on the conclusion (Yes/No or None, which is unclear)

            if "don't apply" in response:
                listing.apply = False
            elif "apply" in response:
                listing.apply = True

            # Else the conclusion is unclear, so we set the apply field to None

            JobListingRepository.update(listing)

    finally: 
        processing_listing = False
