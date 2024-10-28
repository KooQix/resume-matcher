# Resume Matcher Application

The Resume Matcher Application is a full-stack project that allows users to upload their resumes and add job listings. The application uses the Mistral AI API to determine how well a resume matches a job listing and provides a summary of the reasoning.

## Project Structure

-   **Backend**: A FastAPI application that handles resume uploads, job listing management, and match analysis using the Mistral AI API.
-   **Frontend**: A Next.js application that provides a user interface for interacting with the API.
-   **Docker Compose**: Used to containerize and run both the backend and frontend applications.

## Features

-   **Resume Upload**: Users can upload their resumes through the frontend interface.
-   **Job Listing Management**: Users can add job listings with details such as URL, title, company, and description.
-   **Match Analysis**: The backend uses Mistral AI API to analyze the resume against the job listing and provides a match score along with a summary of the reasoning.

## Getting Started

### Prerequisites

-   Docker
-   Docker Compose

### Installation

1. **Clone the repository**

2. **Environment Variables**:

Create a `.env` file in the root directory and add the following environment variables:

```bash
cp .env.example .env
```

Update the `.env` file with the necessary details. The environment variables must match the ones used in backend/.env (otherwise docker-compose will not work).

### Running the Application

1. **Start the application using Docker Compose**:

```bash
docker-compose up -d --build
```

2. **Access the application**:
    - Frontend: `http://localhost:3000`
    - Backend API documentation: `http://localhost:8000/docs`

## Usage

1. **Upload Resume**: Use the frontend interface to upload your resume.
2. **Add Job Listing**: Add job listings through the frontend with the necessary details.
3. **Check Match**: View the match score and reasoning for your resume against a job listing.

## Frontend

The frontend is built with Next.js and provides a user-friendly interface for interacting with the API. It includes pages for uploading resumes, adding job listings, and viewing match results.

An example of a listing page is shown [here](docs/listing-example.pdf).

## Backend

The backend is built with FastAPI and handles all API requests, data processing, and interaction with the Mistral AI API.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Some possible improvements

-   **Fetch listings**: Currently, the user has to manually add job listings. It would be beneficial to fetch job listings from popular job boards like Indeed, Glassdoor, etc. This can be done using web scraping or APIs provided by these platforms.
-   **Improving UI**: The actual UI is very basic and could be improved to provide a better user experience.
-   **User Authentication**: Implement user authentication to secure the application. As of now, the application supports only 1 user. Some modifications are needed to support multiple users.
-   **Listing filtering**: Add the ability to filter job listings based on different criteria on the frontend.
-   **Load more listings**: As of now, the application displays only a limited number of job listings. Implement a load more feature to display additional listings.
-   **Multi-language support**: English is well supported, but the application could be improved to support multiple languages.
