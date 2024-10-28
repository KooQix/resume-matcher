import argparse
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from dotenv import load_dotenv

from db.PostgreSQLDatabase import PostgreSQLDatabase
from routes import routes


load_dotenv()

app = FastAPI()

#################### Enable CORS ####################

origins = ["*"]  # Default, all origins. Edit this array to customize your origins.

# If origins != *, set allow_credentials=True below
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router=routes.router)


# Init db
PostgreSQLDatabase.initialize(
    minconn=1,
    maxconn=10,
)

if __name__ == "__main__":
    args_parser = argparse.ArgumentParser(description="Run the API")

    args_parser.add_argument(
        "--test-mode",
        required=True,
        help="If True, the API will run in test mode, and load the test environment variables",
    )

    args = args_parser.parse_args()

    TEST_MODE = str(args.test_mode).lower() == "true"

    
    try:
        uvicorn.run(
            "main:app",
            port=8000,
            host="127.0.0.1" if TEST_MODE else "0.0.0.0",
            reload=TEST_MODE,
        )
    except Exception as e:
        print("An error occurred while running the API", e)
        exit(1)  # Docker will restart the container if it fails