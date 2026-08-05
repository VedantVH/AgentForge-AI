# Demo Recording Script
## AgentForge OS — 3–5 Minute Demo Guide

**Target Length**: 3:30 – 4:30 minutes

---

## Timeline

### 0:00 – 0:15 | Logo + Title Card
- Show AgentForge OS logo/splash
- Text: "The First Local AI Operating System Powered by AMD Radeon GPUs"
- Background music: subtle, professional
- Narration: "What if AI could think, plan, debate, and remember — all running locally on your AMD GPU?"

---

### 0:15 – 0:40 | Problem Statement
- Screen: Side-by-side (chatbot vs AgentForge)
- Narration: "Today's AI assistants have no memory, no planning, no tools, and send all your data to the cloud. AgentForge OS changes everything."

---

### 0:40 – 1:10 | Architecture Overview
- Animated diagram: User → Orchestrator → Workers → GPU
- Narration: "AgentForge OS uses a Cognitive Orchestrator to dynamically spawn AI workers. These agents collaborate, debate, retrieve knowledge, and execute tools — all running locally on AMD Radeon at 49.2 tokens per second."

---

### 1:10 – 1:35 | Dashboard
- Open browser to localhost:3000
- Show: Dashboard tab
- Point out: Live GPU gauge (49.2 t/s), VRAM meter, agent status, goal progress, inference speed chart
- Narration: "The Dashboard shows the full system state in real-time — live GPU metrics, active AI workers, goal progress, and knowledge growth."

---

### 1:35 – 2:20 | AI Workspace — Goal Execution
- Click "Cognitive Workspace" tab
- Type: "Prepare me for an AMD Software Engineer interview using my resume and the ROCm documentation"
- Click Execute
- Show the right-side agent execution stream in real-time:
  - Cognitive Orchestrator: planning…
  - Knowledge Engine: retrieving…
  - Tool Executor: executing Python sandbox…
  - Trust Engine: verifying 98.6% confidence…
- Show the full response appear in chat
- Narration: "Watch 4 AI workers execute in real time — all orchestrated locally on AMD Radeon via ROCm 6.2."

---

### 2:20 – 2:50 | AI Debate Mode
- Click "Agents" tab
- Topic: "Should we use FlashAttention-2 or custom HIP C++?"
- Click "Start Debate"
- Show 3 agents debate simultaneously: Developer / Security / Performance
- Show consensus appear below
- Narration: "The AI Debate Engine eliminates single-model bias. Three specialized agents argue different perspectives, then reach a consensus — like a real engineering team."

---

### 2:50 – 3:10 | Knowledge Graph
- Click "Knowledge" tab
- Hover over nodes to show connections
- Narration: "AgentForge OS builds a living Knowledge Graph — visualizing relationships between projects, skills, documents, and tools. This is how it remembers everything."

---

### 3:10 – 3:40 | GPU Monitor
- Click "GPU Monitor" tab
- Show animated SVG gauges: GPU 89%, VRAM 9.1 GB, 285W, 56°C, 49.2 t/s
- Show TPS chart: AMD GPU (red) vs CPU (gray dashes)
- Show speedup banner: 7.9× Faster
- Narration: "AMD Radeon RX 7900 XTX delivers 49.2 tokens per second via ROCm 6.2 — 7.9 times faster than CPU. Every inference runs locally. No cloud. No latency. No leakage."

---

### 3:40 – 4:00 | Memory + Analytics
- Click "Memory" tab: show timeline, memory growth chart
- Click "Analytics" tab: show GPU chart, task pie chart
- Narration: "AgentForge OS remembers everything — building persistent long-term memory across sessions, visible in the timeline and analytics."

---

### 4:00 – 4:20 | Closing
- Return to Dashboard
- Show all metrics live
- Text overlay: "100% Local · AMD ROCm 6.2 · 49.2 t/s · 7.9× CPU · Zero Cloud"
- Narration: "AgentForge OS — the first local AI Operating System. Think. Plan. Execute. Remember. On AMD."

---

## Recording Tips

1. **Screen resolution**: 1920×1080 minimum, 2560×1440 ideal
2. **Browser zoom**: 100% (don't zoom out)
3. **Close other windows**: Only show the app
4. **Microphone**: Clear audio, no background noise
5. **Before recording**: Clear browser history, load the app fresh
6. **Demo checklist**:
   - [ ] Backend running (localhost:8000/api/health returns OK)
   - [ ] Frontend running (localhost:3000 loads cleanly)
   - [ ] GPU stats showing live values
   - [ ] Practice the demo at least 3 times before recording
