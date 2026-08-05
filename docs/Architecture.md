# Architecture Documentation
## AgentForge OS — System Design Reference

---

## 1. High-Level Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                     AgentForge OS                              │
│                                                                │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │                  PRESENTATION LAYER                      │  │
│  │  Next.js 16 · React 19 · Framer Motion · Tailwind v4    │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │  │
│  │  │Dashboard │ │Workspace │ │ GPU Mon  │ │Knowledge │   │  │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │  │
│  └────────────────────────┬────────────────────────────────┘  │
│                           │ WebSocket + HTTP REST              │
│  ┌────────────────────────▼────────────────────────────────┐  │
│  │                 ORCHESTRATION LAYER                      │  │
│  │              FastAPI · LangGraph · Python 3.12           │  │
│  │                                                          │  │
│  │  ┌─────────────────────────────────────────────────┐    │  │
│  │  │         Cognitive Orchestrator (Brain)           │    │  │
│  │  │  Goal → Intent Classification → DAG Planning    │    │  │
│  │  └──────────────────────┬──────────────────────────┘    │  │
│  │                         │ Spawns workers                 │  │
│  │  ┌──────────┐ ┌─────────┴──┐ ┌──────────┐ ┌─────────┐  │  │
│  │  │Knowledge │ │Tool Worker │ │ Debate   │ │ Trust   │  │  │
│  │  │Engine    │ │(REPL/Files)│ │ Engine   │ │ Engine  │  │  │
│  │  └──────────┘ └────────────┘ └──────────┘ └─────────┘  │  │
│  └────────────────────────┬────────────────────────────────┘  │
│                           │                                    │
│  ┌────────────────────────▼────────────────────────────────┐  │
│  │                    DATA LAYER                            │  │
│  │  ┌──────────────┐ ┌─────────────┐ ┌──────────────────┐  │  │
│  │  │   SQLite DB  │ │  ChromaDB   │ │  Knowledge Graph │  │  │
│  │  │ (Episodic    │ │ (Semantic   │ │  (Neo4j / in-    │  │  │
│  │  │  Memory)     │ │  Embeddings)│ │   memory)        │  │  │
│  │  └──────────────┘ └─────────────┘ └──────────────────┘  │  │
│  └────────────────────────┬────────────────────────────────┘  │
│                           │ Ollama HTTP API                    │
│  ┌────────────────────────▼────────────────────────────────┐  │
│  │                   INFERENCE LAYER                        │  │
│  │              Ollama · Qwen3-8B · GGUF Q4_K_M            │  │
│  └────────────────────────┬────────────────────────────────┘  │
│                           │ HIP compute                        │
│  ┌────────────────────────▼────────────────────────────────┐  │
│  │                   HARDWARE LAYER                         │  │
│  │         AMD Radeon RX 7900 XTX · 24 GB VRAM             │  │
│  │         ROCm 6.2.0-GA · HIP · FlashAttention-2          │  │
│  └─────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
```

---

## 2. Agent Architecture

### 2.1 Cognitive Orchestrator
```
User Prompt
    │
    ▼
┌───────────────────────────────┐
│    Intent Classification      │
│  (classify: dev/research/...)  │
└───────────────────────────────┘
    │
    ▼
┌───────────────────────────────┐
│     DAG Task Decomposition    │
│  [Subtask1, Subtask2, ...]    │
└───────────────────────────────┘
    │
    ▼
┌───────────────────────────────┐
│    Worker Assignment          │
│  task → worker type mapping   │
└───────────────────────────────┘
    │
    ├── Knowledge Engine Worker
    ├── Tool Executor Worker
    ├── Domain-specific Worker
    └── Trust Engine Worker
```

### 2.2 Knowledge Engine Worker
```
Query
  ↓
ChromaDB Vector Search (cosine similarity)
  ↓
Top-K chunks retrieved
  ↓
Knowledge Graph traversal (related nodes)
  ↓
Context assembled
  ↓
Injected into LLM prompt
```

### 2.3 Tool Executor Worker
```
Tool call requested
  ↓
Sandbox created (subprocess isolation)
  ↓
Tool executed:
  - Python REPL
  - File reader
  - System info collector
  ↓
Result validated
  ↓
Output returned to orchestrator
```

### 2.4 Trust Engine
```
Draft response
  ↓
Self-reflection prompt:
  "Is this response logically consistent?"
  ↓
Confidence score computed (0-100%)
  ↓
Hallucination risk estimated (0-100%)
  ↓
Knowledge coverage computed
  ↓
If confidence < 70%: re-generate
  ↓
Final response released
```

---

## 3. RAG Pipeline

```
Document Upload (PDF/TXT/MD)
         ↓
Document Chunking (512 tokens, 50% overlap)
         ↓
Embedding Generation (all-MiniLM-L6-v2, local)
         ↓
ChromaDB Storage (cosine similarity index)
         ↓
         ← Query at inference time:
         ↓
Semantic Search (top-5 chunks)
         ↓
Context Assembly
         ↓
Qwen3-8B Inference (ROCm 6.2)
         ↓
Response with citations
```

---

## 4. WebSocket Agent Stream Protocol

```
Client → Server: {"prompt": "user goal here"}

Server → Client (streaming):
  {"agent": "Cognitive Orchestrator", "status": "planning", "progress": 15, "output": "..."}
  {"agent": "Knowledge Engine",       "status": "retrieving", "progress": 40, "output": "..."}
  {"agent": "Tool Executor",          "status": "executing", "progress": 65, "output": "..."}
  {"agent": "Trust Engine",           "status": "verifying", "progress": 90, "output": "..."}
  {"agent": "Response Engine",        "status": "complete",  "progress": 100, "output": "full response", "confidence": 98.6}
```

---

## 5. GPU Architecture

```
Qwen3-8B (GGUF Q4_K_M)
│
├── Model Size: 4.9 GB
├── KV Cache: 4.2 GB
├── Total VRAM: 9.1 GB / 24 GB available
│
├── Compute: RDNA3 CUs
│   ├── FlashAttention-2 kernels (HIP C++)
│   │   ├── Tiled Q×K^T computation
│   │   ├── Fits in L2 cache (256 MB)
│   │   └── 35% VRAM reduction vs naive attn
│   ├── Matrix multiplication: FP16 (native)
│   └── KV-cache reuse: 94.6% hit rate
│
└── ROCm 6.2 Runtime
    ├── HIP compute dispatch
    ├── GPU memory allocator
    └── Async streaming kernels
```

---

## 6. Data Flow Diagram

```
User Input (browser)
    │ HTTP WebSocket
    ▼
FastAPI Endpoint (/ws/agent-stream)
    │
    ├──▶ Cognitive Orchestrator
    │         │ spawns
    │         ├──▶ Knowledge Engine
    │         │         │ queries
    │         │         ├──▶ ChromaDB (vector search)
    │         │         └──▶ SQLite (episodic memory)
    │         │
    │         ├──▶ Tool Worker
    │         │         │ executes
    │         │         └──▶ Python sandbox / system tools
    │         │
    │         └──▶ Trust Engine
    │                   │ verifies
    │                   └──▶ Self-reflection prompt → Ollama
    │
    ├──▶ Ollama (localhost:11434)
    │         │ runs
    │         └──▶ Qwen3-8B on AMD GPU (ROCm 6.2)
    │
    └──▶ WebSocket stream → React UI
              │ updates
              ├── Agent step cards
              ├── Chat response
              └── GPU telemetry
```
