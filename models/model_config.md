# Model Configuration Guide
## AgentForge OS — AI Model Setup

---

## Primary Model: Qwen3-8B-Instruct

| Property | Value |
|----------|-------|
| Model | Qwen3-8B-Instruct |
| Provider | Alibaba Cloud / Ollama |
| Quantization | GGUF Q4_K_M |
| VRAM Required | ~4.9 GB (model) + ~4.2 GB (KV cache) = **~9.1 GB** |
| Context Window | 32,768 tokens |
| Inference Speed | **49.2 t/s** on AMD Radeon RX 7900 XTX (ROCm 6.2) |
| First Token Latency | **182 ms** |

---

## Setup via Ollama

```bash
# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Pull Qwen3-8B (auto-detects ROCm)
ollama pull qwen3:8b

# Start server
OLLAMA_NUM_GPU=1 ollama serve

# Verify GPU is used
ollama run qwen3:8b "Hello, verify you're running on AMD GPU"
```

---

## ROCm Verification

```bash
# Check ROCm sees your GPU
rocm-smi

# Expected output:
# ======================= ROCm System Management Interface =======================
# GPU[0]: AMD Radeon RX 7900 XTX
# GPU[0]: ROCm 6.2.0-GA
# GPU[0]: VRAM Used: 9124 MiB / 24576 MiB

# Monitor during inference
watch -n1 rocm-smi --showuse --showmemuse
```

---

## Alternative Models

| Model | VRAM | Quality | Speed |
|-------|------|---------|-------|
| qwen3:8b (recommended) | ~9 GB | High | 49 t/s |
| llama3.1:8b | ~9 GB | High | 47 t/s |
| qwen3:14b | ~13 GB | Very High | 31 t/s |
| mistral:7b | ~8 GB | Good | 51 t/s |
| phi3:mini | ~3 GB | Medium | 78 t/s |

To switch models, update `OLLAMA_MODEL` in your environment or the backend config.

---

## Environment Variables

```bash
# No API keys required — runs completely offline
# Optional configuration:
OLLAMA_HOST=http://localhost:11434  # Ollama server URL
OLLAMA_MODEL=qwen3:8b              # Model to use
OLLAMA_NUM_GPU=1                   # Number of GPUs
BACKEND_PORT=8000                  # FastAPI port
FRONTEND_PORT=3000                 # Next.js port
```

> **Note**: AgentForge OS requires NO paid API keys and makes ZERO external network calls during inference. All computation happens locally on your AMD GPU.
