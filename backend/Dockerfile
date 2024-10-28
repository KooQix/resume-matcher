# PyTorch supports 3.10 at the time of writing
FROM python:3.12

# Path: /app
WORKDIR /app

RUN apt update && apt upgrade -y

RUN apt install apt-utils -y \
	&& apt-get autoremove -y \
	&& rm -rf /var/lib/apt/lists/*

# Path: /app/requirements.txt
COPY requirements.txt .

RUN pip install -r requirements.txt


COPY . .

RUN mkdir uploads


# Enable print logs
ENV PYTHONUNBUFFERED=0

# Internal port, FastAPI default is 8000
EXPOSE 8000

# Path: /app/src
WORKDIR /app/src

CMD ["python3", "main.py", "--test-mode=false"]
