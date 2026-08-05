# Use ROCm-compatible Python base
FROM rocm/dev-ubuntu-22.04:6.2

WORKDIR /app

# System deps
RUN apt-get update && apt-get install -y \
    python3.11 python3.11-venv python3-pip nodejs npm curl \
    && rm -rf /var/lib/apt/lists/*

# Backend
COPY backend/requirements.txt /app/backend/requirements.txt
RUN pip install --no-cache-dir -r /app/backend/requirements.txt

# Frontend
COPY frontend/package*.json /app/frontend/
RUN cd /app/frontend && npm install

# Copy source
COPY backend/ /app/backend/
COPY frontend/ /app/frontend/

# Build frontend
RUN cd /app/frontend && npm run build

EXPOSE 3000 8000

CMD ["sh", "-c", "cd /app/backend && python main.py & cd /app/frontend && npm start"]
