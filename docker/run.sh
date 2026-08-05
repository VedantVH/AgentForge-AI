#!/bin/bash
# AgentForge OS — One-command startup script
# Requires: Docker, Docker Compose, AMD ROCm drivers

set -e

echo "╔════════════════════════════════════════╗"
echo "║       AgentForge OS — Starting...      ║"
echo "║  AMD Radeon GPU + ROCm 6.2 AI System  ║"
echo "╚════════════════════════════════════════╝"

# Check ROCm
if ! command -v rocm-smi &> /dev/null; then
    echo "⚠️  Warning: rocm-smi not found. GPU acceleration may not work."
    echo "   Install ROCm: https://rocm.docs.amd.com"
else
    echo "✅ ROCm detected:"
    rocm-smi --showproductname | grep "AMD" || true
fi

# Pull model if not exists
echo ""
echo "🤖 Checking AI model..."
if command -v ollama &> /dev/null; then
    ollama pull qwen3:8b
    echo "✅ Model ready."
else
    echo "⚠️  Ollama not found. Will use Docker container."
fi

# Start with Docker Compose
echo ""
echo "🚀 Starting AgentForge OS..."
docker compose -f "$(dirname "$0")/docker-compose.yml" up -d

echo ""
echo "════════════════════════════════════════"
echo "✅ AgentForge OS is running!"
echo ""
echo "   🌐 Frontend:  http://localhost:3000"
echo "   🔌 Backend:   http://localhost:8000"
echo "   🤖 Ollama:    http://localhost:11434"
echo "════════════════════════════════════════"
echo ""
echo "Press Ctrl+C to stop, or run:"
echo "  docker compose down"
