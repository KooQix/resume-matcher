# Resume Matcher API

Welcome to the Resume Matcher API! This project is built using FastAPI and leverages the Mistral AI API to help users determine how well their resume matches a job listing. It also provides a summary of the reasoning behind the match.

## Features

-   **Resume Upload**: Users can upload their resumes in a supported format.
-   **Job Listing Management**: Users can add job listings with details such as URL, title, company, and description.
-   **Match Analysis**: The application uses Mistral AI API to analyze the resume against the job listing and provides a match score along with a summary of the reasoning.

## Getting Started

### Prerequisites

-   Python 3.8+
-   FastAPI
-   Mistral AI API access
-   Postgres database

### Installation

1. Clone the repository

2. Create and activate a virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # On Windows use venv\Scripts\activate
```

3. Install the dependencies:

```bash
pip install -r requirements.txt
```

4. Set the environment variables:

```bash
cp .env.example .env
```

Update the `.env` file with your Mistral AI API key and other details.

### Running the Application

1. Start the FastAPI server:

```bash
python3 src/main.py --test-mode=True
```

2. Access the API documentation at `http://127.0.0.1:8000/docs`.

## API Endpoints

The `requests.http` file contains sample requests for each of the API endpoints. You can use the [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) extension in Visual Studio Code to run these requests.
