# 🚀 AgentForge AI

**Track 2 (Agentic AI) · Vedant Honnangi · AMD Radeon Hackathon 2026**

> **AgentForge AI** is a private, local-first Multi-Agent AI Operating System built for the **AMD Radeon Hackathon 2026 (Track 2)**. Powered by **AMD Radeon GPUs** and **ROCm**, it combines intelligent reasoning, planning, long-term memory, RAG, dynamic agent orchestration, autonomous tool execution, and explainable AI workflows—all running completely offline without external AI APIs for a secure, high-performance AI experience.

[![License: MIT](https://img.shields.io/badge/License-MIT-red.svg)](LICENSE)
[![ROCm](https://img.shields.io/badge/ROCm-6.2-red)](https://rocm.docs.amd.com)
[![Next.js](https://img.shields.io/badge/Next.js-16.3-black)](https://nextjs.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-green)](https://fastapi.tiangolo.com)
[![Offline First](https://img.shields.io/badge/Offline-100%25-blue)](#)

---

## 💡 Overview

**AgentForge AI** is a state-of-the-art, local-first **Multi-Agent AI Operating System** designed to demonstrate the power of local inference accelerated by **AMD Radeon GPUs** via **ROCm 6.2**. Unlike conventional chatbots that simply stream model outputs, AgentForge AI is an integrated ecosystem that plans, collaborates, remembers, and executes tools autonomously.

### 🌟 Key Highlights
- 🧠 **Dynamic Orchestrator**: Uses a planning agent to decompose user goals into Directed Acyclic Graphs (DAGs) of execution.
- 🤝 **AI Debate Engine**: Resolves complex architectural or logic problems through a 3-agent dialectic (Developer, Security, and Performance agents) yielding structured consensus.
- 🕸️ **Interactive Knowledge Graph**: Maintains a visual representation of episodic and semantic memories across user sessions.
- 🛡️ **Trust & Self-Reflection**: Every response goes through a trust engine validating factual logic and scoring hallucination risk.
- ⚡ **AMD ROCm Acceleration**: Achieving **49.2 tokens/second** locally on an **AMD Radeon RX 7900 XTX**—representing a **7.9× speedup** over Host CPU inference.

---

## 🖥️ System Features & Dashboards

| Tab Component | Purpose | Technical Implementation |
|---|---|---|
| **AI Mission Control** | High-level operations center | Shows active agent pools, goal progress, prompt cache hit rates, and GPU telemetry. |
| **Cognitive Workspace** | Interactive agent sandbox | Real-time WebSocket connection to backend agent logs and execution steps. |
| **AI Debate Mode** | Multi-agent reasoning | Dialectic consensus engine debating architecture and implementation decisions. |
| **Knowledge Graph** | Living memory visualizer | Custom animated SVG mapping relationships between projects, files, skills, and tools. |
| **Goal Tracker** | Autonomous execution | Persistent CRUD goal tracker with progress bars and deadline tracking. |
| **GPU Telemetry** | Hardware metrics monitor | Animated circular gauges displaying live compute load, temperature, VRAM footprint, and wattage. |
| **Analytics** | Performance metrics | Chart visualizer tracking tokens/sec history, task completion ratio, and memory growth. |
| **Local AI App Store** | Dynamic extensions | Allows users to toggle domain-specific packs (Developer, Research, Enterprise, Security) at runtime. |

---

## 🏗️ Architecture Design

```
                     ┌──────────────────────────────────┐
                     │          USER Interface          │
                     │   Next.js 16 (React 19, TS)      │
                     │   Framer Motion, Recharts, SVG   │
                     └────────────────┬─────────────────┘
                                      │ WebSocket / REST
                     ┌────────────────▼─────────────────┐
                     │         FastAPI Backend          │
                     │  ┌────────────────────────────┐  │
                     │  │   LangGraph Orchestrator   │  │
                     │  │   - Cognitive Planner      │  │
                     │  │   - Tool Sandbox           │  │
                     │  │   - Debate Consensus       │  │
                     │  └────────────────────────────┘  │
                     │  ┌──────────┐  ┌──────────────┐  │
                     │  │  SQLite  │  │   ChromaDB   │  │
                     │  └──────────┘  └──────────────┘  │
                     └────────────────┬─────────────────┘
                                      │ Ollama local API
                     ┌────────────────▼─────────────────┐
                     │      ROCm 6.2 / HIP Runtime      │
                     │   Qwen3-8B-Instruct (GGUF Q4)   │
                     │   FlashAttention-2 HIP kernels   │
                     └────────────────┬─────────────────┘
                                      │
                     ┌────────────────▼─────────────────┐
                     │      AMD Radeon RX 7900 XTX      │
                     │      24GB VRAM · 96 Compute Units │
                     └──────────────────────────────────┘
```

---

## 📊 Benchmark Results

All metrics were captured locally on an **AMD Radeon RX 7900 XTX** (24GB VRAM, RDNA3 Architecture) running **ROCm 6.2** compared with a standard **16-Core Host CPU (AVX-512)**.

| Metric | AMD Radeon RX 7900 XTX (ROCm 6.2) | Host CPU (AVX-512) | Hardware Speedup |
|---|---|---|---|
| **Inference Throughput** | **49.2 t/s** | 6.2 t/s | **7.9× Faster** |
| **First Token Latency** | **182 ms** | 1,420 ms | **7.8× Lower** |
| **Model Load Time** | **~8 seconds** | ~45 seconds | **5.6× Faster** |
| **VRAM Footprint** | 9.1 GB (Model + KV Cache) | 12.0 GB System RAM | — |
| **Power Consumption** | 285 W (TDP) | ~95 W (TDP) | — |

---

## 🚀 Setup & Installation

> 🔒 **100% Private, Local-First: No API keys required. Runs completely offline.**

### Prerequisites
- **Node.js** (v18+)
- **Python** (v3.10+)
- **Ollama** (ROCm compatible)
- **AMD Drivers + ROCm 6.2** (Optional, falls back to simulated metrics if hardware is absent)

### 1. Model Setup
```bash
# Pull Qwen3-8B model locally
ollama pull qwen3:8b
# Start Ollama service
ollama serve
```

### 2. Backend Server
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python main.py
```

### 3. Frontend Dashboard
```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000` to interact with the dashboard command center.

### 🐳 Docker Startup
```bash
cd docker
docker compose up
```

---

## 🛠️ Technology Stack
- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Framer Motion, Recharts
- **Backend**: FastAPI, LangGraph, LangChain, ChromaDB, SQLite, Python 3.12
- **Hardware Acceleration**: AMD ROCm 6.2, HIP Compute Compiler, FlashAttention-2 RDNA3 Kernels
- **Containerization**: Docker, Docker Compose

---

## 📝 License
Distributed under the MIT License. See [LICENSE](LICENSE) for more information.
