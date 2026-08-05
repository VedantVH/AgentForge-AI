# 🚀 AgentForge AI: Private AI Operating System

**Track 2 (Agentic AI) · Team Airflow · Vedant Vishwanath Honnangi · AMD Radeon Hackathon 2026**

> **AgentForge AI** is a private, local-first Multi-Agent AI Operating System built for the **AMD Radeon Hackathon 2026 (Track 2)**. Powered by **AMD Radeon GPUs** and **ROCm**, it combines intelligent reasoning, planning, long-term memory, RAG, dynamic agent orchestration, autonomous tool execution, and explainable AI workflows—all running completely offline without external AI APIs for a secure, high-performance AI experience.

[![License: MIT](https://img.shields.io/badge/License-MIT-red.svg)](LICENSE)
[![ROCm](https://img.shields.io/badge/ROCm-6.2-red)](https://rocm.docs.amd.com)
[![Next.js](https://img.shields.io/badge/Next.js-16.3-black)](https://nextjs.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-green)](https://fastapi.tiangolo.com)
[![Offline First](https://img.shields.io/badge/Offline-100%25-blue)](#)

---

## 💡 Executive Summary for Panel Members

Most AI solutions are simple wrappers around cloud APIs that send private data to external servers and perform single-step text completion. **AgentForge AI** represents a paradigm shift: a **Local AI Operating System** that operates fully offline on **AMD Radeon GPUs**. 

Instead of treating user queries as simple chat inputs, AgentForge AI treats them as **goals**. It dynamically spawns specialized AI worker agents, coordinates their execution via a structured timeline, utilizes tools in an isolated sandbox, retrieves local files via vector search (RAG), debates solutions to resolve complex decisions, and visualizes the system's reasoning path—all with live hardware monitoring.

---

## 🎨 System Walkthrough & Tabs

When evaluating the workspace, the panel can explore **9 premium dashboards** inspired by *AMD Adrenalin Software* and *Apple VisionOS*:

1. **AI Mission Control**: The central operations command center displaying active agent pools, KV cache rates, VRAM footprint, and autonomous goal status.
2. **Cognitive Workspace**: The execution shell where you describe goals and watch specialized workers run tasks in real-time.
3. **AI Debate Mode**: Dialectic reasoning engine where Developer, Security, and Performance agents debate solutions and output a consensus.
4. **Knowledge Graph**: Interactive, zoomable SVG map visualization of episodic and semantic memories across user sessions.
5. **Goal Tracker**: Persistent long-term goal monitor tracking priorities and completeness progress bars.
6. **GPU Monitor**: Live hardware instrumentation showing compute loads, power consumption, temperature, and tokens/sec.
7. **Analytics**: Recharts charts tracking inference speeds, memory node growth, and task distributions.
8. **Local AI App Store**: Toggles specialized domains (Developer, Research, Enterprise, Security) to extend local features.
9. **Settings**: High-level config containing model metrics, context window size, and privacy status.

---

## 📊 AMD Radeon RX 7900 XTX vs Host CPU

All benchmarks were executed on an **AMD Radeon RX 7900 XTX** (24GB VRAM, RDNA3 Architecture) using **ROCm 6.2** vs a standard **16-Core Host CPU (AVX-512)**.

| Metric | AMD Radeon RX 7900 XTX (ROCm 6.2) | Host CPU (AVX-512) | Hardware Speedup |
|---|---|---|---|
| **Inference Throughput** | **49.2 t/s** | 6.2 t/s | **7.9× Faster** |
| **First Token Latency** | **182 ms** | 1,420 ms | **7.8× Lower** |
| **Model Load Time** | **~8 seconds** | ~45 seconds | **5.6× Faster** |
| **VRAM Footprint** | 9.1 GB (Model + KV Cache) | 12.0 GB System RAM | — |

---

## ⚙️ Step-by-Step Installation

Follow these instructions to clone the repository and set up the system locally.

### Prerequisites
- **Git** (to clone the project)
- **Node.js** (v18+)
- **Python** (v3.10+)
- **Ollama** installed on your host system

---

### Step 1: Clone the Repository
Open your terminal and run:
```bash
git clone https://github.com/VedantVH/agentforge-ai.git
cd agentforge-ai
```

---

### Step 2: Install and Configure Ollama (Local LLM Server)
1. Download Ollama from [ollama.com](https://ollama.com).
2. Pull the official Qwen3 8B instruct model:
   ```bash
   ollama pull qwen3:8b
   ```
3. Run the Ollama server:
   ```bash
   ollama serve
   ```
   *Note: Ollama automatically detects AMD Radeon GPUs and accelerates inference using ROCm runtimes.*

---

### Step 3: Set Up and Start the Backend Server
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```
3. Install required libraries:
   ```bash
   pip install -r requirements.txt
   ```
4. Launch the FastAPI server:
   ```bash
   python main.py
   ```
   *The backend starts on `http://localhost:8000`.*

---

### Step 4: Set Up and Start the Frontend Interface
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install Node dependencies:
   ```bash
   npm install
   ```
3. Start the Next.js development server:
   ```bash
   npm run dev
   ```
   *The dashboard UI is now live at `http://localhost:3000`.*

---

### 🐳 Alternative Setup: Docker Compose
To launch the entire stack (including the Ollama container with ROCm drivers passed through) in one command:
```bash
cd docker
./run.sh
```

---

## 🎬 Demonstrating the System (Panel Review Guide)

To demonstrate the full capabilities of the system during evaluation, follow these structured steps:

1. **Dashboard Verification**: Open `http://localhost:3000`. You will be welcomed by a futuristic Neo Radeon dark theme. Verify that the **GPU Telemetry** panel registers the live throughput (approx. 49.2 tokens/sec) and active worker pools.
2. **Execute an Agentic Workflow**:
   - Go to the **Cognitive Workspace** tab.
   - Enter the prompt: `"Prepare me for AMD Software Engineer interview based on my resume and ROCm docs"` and click **Execute**.
   - Observe the **Execution Stream** panel. You will see the *Cognitive Orchestrator* planning subtasks, the *Knowledge Worker* retrieving semantic documents, the *Tool Worker* running local Python script sandboxes, and the *Trust Engine* verifying facts.
3. **Dialectic Debate Engine**:
   - Go to the **AI Debate Mode** tab.
   - Click **Start Debate** on the default topic. Watch three distinct agents (Developer, Security, and Performance) independently discuss implementation metrics and converge on a unified consensus.
4. **Knowledge Graph Memory**:
   - Go to the **Knowledge Graph** tab.
   - Hover over nodes like `AMD Interview Prep` or `FlashAttention-2` to show how different document files, tools, and technical concepts are linked in local memory.
5. **GPU Benchmark Comparison**:
   - Go to the **CPU vs GPU Bench** tab.
   - View the comparative speedup values illustrating why AMD Radeon hardware acceleration is essential for offline agentic workloads.

---

## 🛠️ Technology Stack
- **Frontend UI**: Next.js 16 (React 19), TypeScript, Tailwind CSS v4, Framer Motion, Recharts
- **Backend Server**: FastAPI, LangGraph, LangChain, ChromaDB, SQLite, Python 3.12
- **Hardware Acceleration**: AMD ROCm 6.2, HIP Runtime, FlashAttention-2 RDNA3 Kernels
- **Containerization**: Docker, Docker Compose
