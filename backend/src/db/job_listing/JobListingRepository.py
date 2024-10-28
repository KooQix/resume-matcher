

from db.PostgreSQLDatabase import PostgreSQLDatabase
from db.job_listing.JobListing import JobListing


class JobListingRepository:
    __TABLE_NAME__ = "job_listings"


    @staticmethod
    def create(job_listing: JobListing) -> JobListing:
        """Create a new job listing.

        Args:
            job_listing (JobListing): The job listing to create.

        Returns:
            JobListing: The created job listing.
        """

        # If a job listing with the same url already exists, raise an error
        if JobListingRepository.fetch_by_url(job_listing.url):
            raise ValueError(f"Job listing with url {job_listing.url} already exists.")

        with PostgreSQLDatabase.get_cursor(commit=True) as cursor:
            cursor.execute(
                f"INSERT INTO {JobListingRepository.__TABLE_NAME__} (url, title, company, description, response, apply, applied) VALUES (%s, %s, %s, %s, %s, %s, %s) RETURNING *",
                (job_listing.url, job_listing.title, job_listing.company, job_listing.description, job_listing.response, job_listing.apply, job_listing.applied)
            )

            res = cursor.fetchone()

            if res is None:
                raise SystemError("Failed to create job listing.")

            return JobListing(**res)
        

    @staticmethod
    def update(job_listing: JobListing) -> JobListing:
        """Update a job listing.

        Args:
            job_listing (JobListing): The job listing to update.

        Returns:
            JobListing: The updated job listing.
        """

        assert job_listing.id is not None, "Job listing id is required for update."

        with PostgreSQLDatabase.get_cursor(commit=True) as cursor:
            cursor.execute(
                f"UPDATE {JobListingRepository.__TABLE_NAME__} SET response = %s, apply = %s, applied = %s WHERE id = %s RETURNING *",
                (job_listing.response, job_listing.apply, job_listing.applied, job_listing.id)
            )

            res = cursor.fetchone()

            if res is None:
                raise SystemError("An error occurred while retrieving the updated job listing.")

            return JobListing(**res)
        
    @staticmethod
    def fetch_by_id(id: int):
        """Fetch a job listing by id.

        Args:
            id (int): The id of the job listing.

        Returns:
            JobListing: The job listing.
        """

        with PostgreSQLDatabase.get_cursor() as cursor:
            cursor.execute(
                f"SELECT * FROM {JobListingRepository.__TABLE_NAME__} WHERE id = %s",
                (id,)
            )

            res = cursor.fetchone()

            if res is None:
                return None
            
            return JobListing(**res)
    
    @staticmethod
    def fetchall(offset: int = 0, limit: int = 100):
        """Fetch all the job listings.

        Args:
            limit (int, optional): Limit number to fetch. Defaults to 100.

        Returns:
            List[JobListing]: The list of job listings.
        """
        with PostgreSQLDatabase.get_cursor() as cursor:
            cursor.execute(
                f"SELECT * FROM {JobListingRepository.__TABLE_NAME__} ORDER BY created_at DESC LIMIT %s OFFSET %s",
                (limit, offset)
            )

            return [JobListing(**row) for row in cursor.fetchall()]
        
    @staticmethod
    def fetch_not_applied(offset: int = 0, limit: int = 100):
        """Fetch all the listings that have not been applied yet.

        Args:
            limit (int, optional): Limit number to fetch. Defaults to 100.

        Returns:
            List[JobListing]: The list of job listings.
        """
        with PostgreSQLDatabase.get_cursor() as cursor:
            cursor.execute(
                f"SELECT * FROM {JobListingRepository.__TABLE_NAME__} WHERE applied = FALSE ORDER BY created_at DESC  LIMIT %s OFFSET %s",
                (limit, offset)
            )

            return [JobListing(**row) for row in cursor.fetchall()]
        

    @staticmethod
    def fetch_applied(offset: int = 0, limit: int = 100):
        """Fetch all the listings that have been applied.

        Args:
            limit (int, optional): Limit number to fetch. Defaults to 100.

        Returns:
            List[JobListing]: The list of job listings.
        """
        with PostgreSQLDatabase.get_cursor() as cursor:
            cursor.execute(
                f"SELECT * FROM {JobListingRepository.__TABLE_NAME__} WHERE applied = TRUE ORDER BY created_at DESC LIMIT %s OFFSET %s",
                (limit, offset)
            )

            return [JobListing(**row) for row in cursor.fetchall()]
        

    @staticmethod
    def fetch_not_processed(offset: int = 0, limit: int = 100):
        """Fetch all the listings that have not been processed yet, e.g. response is null.
        
        Returns:
            List[JobListing]: The list of job listings.
        """

        with PostgreSQLDatabase.get_cursor() as cursor:
            cursor.execute(
                f"SELECT * FROM {JobListingRepository.__TABLE_NAME__} WHERE response IS NULL ORDER BY created_at DESC LIMIT %s OFFSET %s",
                (limit, offset)
            )

            return [JobListing(**row) for row in cursor.fetchall()]
        

    @staticmethod
    def fetch_by_url(url: str):
        """Fetch a job listing by url.

        Args:
            url (str): The url of the job listing.

        Returns:
            JobListing: The job listing.
        """

        with PostgreSQLDatabase.get_cursor() as cursor:
            cursor.execute(
                f"SELECT * FROM {JobListingRepository.__TABLE_NAME__} WHERE url = %s",
                (url,)
            )

            res = cursor.fetchone()

            if res is None:
                return None
            
            return JobListing(**res)

    @staticmethod
    def delete(id: int):
        """Delete a job listing by id.

        Args:
            id (int): The id of the job listing.
        """

        with PostgreSQLDatabase.get_cursor(commit=True) as cursor:
            cursor.execute(
                f"DELETE FROM {JobListingRepository.__TABLE_NAME__} WHERE id = %s",
                (id,)
            )

        