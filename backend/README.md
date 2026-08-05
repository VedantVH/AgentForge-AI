# Backend — AgentForge OS

FastAPI backend powering AgentForge OS multi-agent orchestration.

## Setup

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python main.py
```

## Endpoints

| Method | Endpoint | Description |
|--------|---------|-------------|
| GET | /api/health | Health check |
| GET | /api/gpu | Live GPU telemetry |
| GET | /api/graph | Knowledge graph data |
| GET | /api/packs | Extension pack status |
| POST | /api/packs/toggle | Enable/disable pack |
| POST | /api/debate | Multi-agent debate |
| WS | /ws/agent-stream | Real-time agent execution |

## Structure

```
backend/
├── main.py           # FastAPI server entry point
├── requirements.txt  # Python dependencies
├── agents/           # Agent implementations (future)
├── rag/              # RAG pipeline (future)
└── tools/            # Tool executors (future)
```
