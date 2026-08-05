# 🚀 AgentForge OS — Private AI Operating System

**Track 2 · Vedant Honnangi · AMD Radeon Hackathon 2026**

> *"We didn't build a chatbot. We built an AI Operating System."*

[![License: MIT](https://img.shields.io/badge/License-MIT-red.svg)](LICENSE)
[![ROCm](https://img.shields.io/badge/ROCm-6.2-red)](https://rocm.docs.amd.com)
[![Next.js](https://img.shields.io/badge/Next.js-16.3-black)](https://nextjs.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-green)](https://fastapi.tiangolo.com)

---

## 💡 Overview

**AgentForge OS** is a fully local, privacy-first **Multi-Agent AI Operating System** running on **AMD Radeon GPUs** via **ROCm 6.2**. Unlike conventional AI chatbots, AgentForge OS:

- 🧠 **Thinks** — Cognitive Orchestrator decomposes goals into agent DAGs  
- 📋 **Plans** — Dynamic worker pool generation per task type  
- 🔍 **Remembers** — Long-term memory via SQLite + ChromaDB  
- 📚 **Retrieves** — Local RAG over PDF documents and knowledge graphs  
- 🛠️ **Executes** — Python REPL sandbox, web search, file analysis  
- 🔄 **Debates** — Multi-agent dialectic reasoning for bias elimination  
- ✅ **Verifies** — Trust Engine with self-reflection and hallucination scoring  
- 🔒 **Protects** — 100% local inference, zero cloud API calls, zero data leakage  

**Hardware**: AMD Radeon RX 7900 XTX · 24 GB VRAM · RDNA3  
**Runtime**: ROCm 6.2.0-GA · Ollama · FlashAttention-2 HIP kernels  
**Throughput**: **49.2 tokens/sec** (vs 6.2 t/s CPU) → **7.9× speedup**

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🧠 Cognitive Orchestrator | Dynamically spawns AI workers based on task complexity |
| 🤝 AI Debate Mode | 3-agent dialectic (Dev/Security/Perf) → Consensus |
| 📚 Local RAG | PDF ingestion → ChromaDB embeddings → Semantic retrieval |
| 🕸️ Knowledge Graph | Interactive visual memory across projects, skills, documents, tools |
| 🛡️ Trust Engine | Self-reflection loop, hallucination risk scoring, confidence metrics |
| 💾 Long-Term Memory | Persistent SQLite memory with timeline and growth analytics |
| 🖥️ GPU Monitor | Live ROCm telemetry: SVG gauges, t/s charts, VRAM, temperature |
| 📊 Analytics | Charts for GPU, memory growth, task distribution, agent success |
| 📦 AI App Store | Enable/disable domain-specific extension packs locally |
| 🔒 Privacy Mode | Zero cloud dependency, runs 100% on local AMD hardware |

---

## 🖼️ Screenshots

> See [`demo/screenshots/`](demo/screenshots/) for full resolution images.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    USER (Browser)                        │
│              Next.js 16 + Framer Motion UI               │
└────────────────────────┬────────────────────────────────┘
                         │ WebSocket + REST
┌────────────────────────▼────────────────────────────────┐
│              FastAPI Backend (Port 8000)                  │
│  ┌─────────────────────────────────────────────────┐    │
│  │         LangGraph Multi-Agent Orchestrator       │    │
│  │  ┌──────────┐ ┌──────────┐ ┌───────────────┐   │    │
│  │  │ Planner  │ │ RAG Eng. │ │ Tool Executor │   │    │
│  │  └──────────┘ └──────────┘ └───────────────┘   │    │
│  │  ┌──────────┐ ┌──────────┐ ┌───────────────┐   │    │
│  │  │ Memory   │ │ Debate   │ │ Trust Engine  │   │    │
│  │  └──────────┘ └──────────┘ └───────────────┘   │    │
│  └─────────────────────────────────────────────────┘    │
│  ┌──────────────┐  ┌─────────────┐  ┌──────────────┐   │
│  │  SQLite DB   │  │  ChromaDB   │  │ Ollama API   │   │
│  └──────────────┘  └─────────────┘  └──────┬───────┘   │
└────────────────────────────────────────────┼───────────┘
                                             │
┌────────────────────────────────────────────▼───────────┐
│              AMD Radeon RX 7900 XTX (24 GB VRAM)        │
│         ROCm 6.2 · HIP · FlashAttention-2 Kernels       │
│              Qwen3-8B-Instruct · GGUF Q4_K_M            │
└─────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
AgentForge-OS/
├── frontend/               # Next.js 16 + TypeScript + Tailwind v4
│   ├── src/app/page.tsx    # Main dashboard (9 tabs)
│   ├── src/app/globals.css # Neo Radeon Intelligence design system
│   └── package.json
│
├── backend/                # FastAPI + LangGraph
│   ├── main.py             # API server + WebSocket agent stream
│   ├── requirements.txt    # Python dependencies
│   └── venv/               # Python virtual environment (git-ignored)
│
├── docs/                   # Project documentation
│   ├── Project_Specification.md
│   ├── Architecture.md
│   └── Presentation.md
│
├── benchmarks/             # AMD GPU vs CPU benchmark results
│   ├── cpu_vs_gpu.md
│   ├── tokens_per_second.csv
│   └── latency.csv
│
├── docker/                 # Docker deployment
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── run.sh
│
├── demo/                   # Demo assets
│   └── screenshots/
│
├── models/
│   └── model_config.md     # Model configuration guide
│
├── README.md               ← You are here
├── LICENSE
└── .gitignore
```

---

## ⚙️ Installation & Setup

> **No API keys required. Runs completely offline.**

### Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | ≥ 18 | Frontend runtime |
| Python | ≥ 3.10 | Backend runtime |
| Ollama | Latest | Local LLM serving |
| ROCm | 6.2 (AMD GPU) | GPU acceleration |

---

### 1. Clone the Repository

```bash
git clone https://github.com/VedantVH/agentforge-os.git
cd agentforge-os
```

### 2. Pull the AI Model (Ollama)

```bash
# Install Ollama: https://ollama.com
ollama pull qwen3:8b
ollama serve   # runs on localhost:11434
```

### 3. Backend Setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py                    # Starts on http://localhost:8000
```

### 4. Frontend Setup

```bash
cd frontend
npm install
npm run dev                       # Starts on http://localhost:3000
```

### 5. Open the App

```
http://localhost:3000
```

---

### 🐳 Docker (One-Command Start)

```bash
cd docker
docker compose up
# → Frontend: http://localhost:3000
# → Backend:  http://localhost:8000
```

---

## 🔥 AMD ROCm GPU Acceleration

AgentForge OS is designed and optimized for AMD Radeon GPUs:

```bash
# Verify ROCm is detected
rocm-smi

# Verify Ollama sees the GPU
OLLAMA_NUM_GPU=1 ollama run qwen3:8b "Hello"

# Expected output:
# GPU: AMD Radeon RX 7900 XTX
# ROCm: 6.2.0-GA
# Inference: ~49.2 tokens/sec
```

**ROCm Optimizations Applied:**
- FlashAttention-2 HIP kernels (RDNA3 matrix cores)
- GGUF Q4_K_M quantization (fits in 24 GB VRAM with headroom)
- Prompt caching: 94.6% cache hit rate
- KV-cache: 43% utilization
- Streaming responses via WebSocket

---

## 📊 Benchmark Results

| Metric | AMD Radeon RX 7900 XTX | Host CPU (16-core) | Speedup |
|--------|------------------------|-------------------|---------|
| Tokens/sec | **49.2 t/s** | 6.2 t/s | **7.9×** |
| First Token Latency | **182 ms** | 1,420 ms | **7.8×** |
| Model Load Time | **~8 sec** | ~45 sec | **5.6×** |
| VRAM / RAM Used | 9.1 GB VRAM | 12 GB RAM | — |
| Power Efficiency | 285 W | ~95 W (CPU TDP) | — |

> Full benchmark methodology: [`benchmarks/cpu_vs_gpu.md`](benchmarks/cpu_vs_gpu.md)

---

## 🌐 API Reference

### Health Check
```http
GET http://localhost:8000/api/health
```

### GPU Telemetry
```http
GET http://localhost:8000/api/gpu
```

### Real-Time Agent Stream
```
WS ws://localhost:8000/ws/agent-stream
→ Send: {"prompt": "Prepare AMD interview strategy"}
← Stream: agent steps → final response
```

### AI Debate
```http
POST http://localhost:8000/api/debate
{"topic": "FlashAttention-2 vs Custom HIP C++?"}
```

---

## 🛠️ Tech Stack

**Frontend**: Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · Framer Motion · Recharts  
**Backend**: FastAPI · LangGraph · LangChain · ChromaDB · SQLite · Python 3.12  
**AI/ML**: Ollama · Qwen3-8B · Sentence-Transformers · PyPDF  
**GPU**: AMD ROCm 6.2 · HIP · FlashAttention-2 · RDNA3  
**Deployment**: Docker · Docker Compose  

---

## 📝 License

MIT License — see [LICENSE](LICENSE)

---

## 🏆 Hackathon Submission

**PR Title**: `Track 2, Vedant Honnangi, AgentForge OS`  
**Track**: Track 2 — Agentic AI  
**Team**: Vedant Honnangi  
**Project**: AgentForge OS — Private AI Operating System Powered by AMD Radeon GPUs
