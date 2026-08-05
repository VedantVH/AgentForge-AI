"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import {
  LayoutDashboard, Bot, Brain, Network, ListTodo, Zap, BarChart3, Settings,
  Send, RefreshCw, CheckCircle2, Clock, Shield, Cpu, Activity,
  HardDrive, Thermometer, FlameKindling, MessageSquareCode, Package, Target,
  FileText, Plus, Trash2, ChevronRight, Sparkles, TrendingUp, Lock,
  Database, Search, Globe, Terminal, AlertCircle, X, Bell, User,
  PlayCircle, Layers, Eye, MemoryStick, GitBranch, Gauge as GaugeIcon, BookOpen,
} from "lucide-react";
import {
  AreaChart, Area, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, PieChart, Pie, Cell, RadialBarChart, RadialBar,
} from "recharts";

// ─── Types ────────────────────────────────────────────────────────────────────
type NavId = "dashboard" | "workspace" | "memory" | "knowledge" | "tasks" | "agents" | "gpu" | "analytics" | "settings";

interface Message { role: "user"|"assistant"; content: string; agent?: string; ts?: string; }
interface AgentLog { agent: string; status: string; output: string; progress: number; icon?: string; }
interface Goal { id: string; title: string; status: string; progress: number; deadline: string; priority: "high"|"medium"|"low"; }
interface Pack { id: string; name: string; desc: string; installed: boolean; category: string; }
interface DebateTurn { agent: string; argument: string; color: string; bgColor: string; icon: React.ReactNode; }
interface MemoryEntry { id: string; date: string; title: string; type: string; summary: string; }

// ─── Constants ────────────────────────────────────────────────────────────────
const AGENT_STEPS: AgentLog[] = [
  { agent: "Cognitive Orchestrator", status: "planning",   output: "Decomposing goal → Generating dynamic worker DAG…",      progress: 15 },
  { agent: "Knowledge Engine",       status: "retrieving", output: "Vector search: 12 nodes matched from Knowledge Graph.",    progress: 40 },
  { agent: "Tool Executor",          status: "executing",  output: "Python sandbox: check_rocm_tps() → 49.2 t/s confirmed.", progress: 65 },
  { agent: "Trust Engine",           status: "verifying",  output: "Self-reflection: 98.6% confidence. Hallucination: 0.4%.", progress: 90 },
];

const MEMORY_ENTRIES: MemoryEntry[] = [
  { id:"m1", date:"Aug 5", title:"AMD ROCm 6.2 Research",  type:"Session", summary:"Discussed HIP kernel optimization and FlashAttention-2 benchmarks." },
  { id:"m2", date:"Aug 5", title:"Interview Prep Strategy", type:"Goal",    summary:"Created 7-day preparation plan targeting AMD hardware roles." },
  { id:"m3", date:"Aug 4", title:"Resume Analysis",         type:"Document",summary:"Extracted 14 skills, 3 projects, and 2 research highlights." },
  { id:"m4", date:"Aug 4", title:"Python REPL Benchmark",   type:"Tool",    summary:"Validated 49.2 t/s on RX 7900 XTX — 7.9× CPU speedup." },
  { id:"m5", date:"Aug 3", title:"FlashAttention-2 Study",  type:"Research",summary:"Reviewed tiling kernel mathematics for RDNA3 matrix cores." },
];

const INITIAL_DEBATE: DebateTurn[] = [
  { agent:"Developer Worker", bgColor:"rgba(58,160,255,0.08)", color:"#3AA0FF", icon:<Bot className="w-3.5 h-3.5"/>, argument:"FlashAttention-2 provides pre-tiled RDNA3 kernels, cutting VRAM overhead by 35% and boosting throughput." },
  { agent:"Security Worker",  bgColor:"rgba(237,28,36,0.08)",  color:"#ED1C24", icon:<Shield className="w-3.5 h-3.5"/>, argument:"Custom HIP C++ eliminates macro expansion risks, ensuring memory boundary isolation for enterprise use." },
  { agent:"Perf Worker",      bgColor:"rgba(255,106,0,0.08)",  color:"#FF6A00", icon:<Zap className="w-3.5 h-3.5"/>, argument:"Benchmarks: FlashAttention-2 → 49.2 t/s vs 41.0 t/s Custom HIP on AMD Radeon RX 7900 XTX." },
  { agent:"Consensus",        bgColor:"rgba(0,210,106,0.08)",  color:"#00D26A", icon:<CheckCircle2 className="w-3.5 h-3.5"/>, argument:"VERDICT: FlashAttention-2 in HIP-sandboxed container. Best of performance AND security." },
];

const GRAPH_NODES = [
  { id:"n1", x:260, y:180, label:"AMD Interview Prep", type:"project", color:"#ED1C24" },
  { id:"n2", x:100, y:320, label:"ROCm & HIP Dev",    type:"skill",   color:"#3AA0FF" },
  { id:"n3", x:420, y:320, label:"FlashAttention-2",  type:"skill",   color:"#3AA0FF" },
  { id:"n4", x: 60, y:460, label:"ROCm Dev Guide",   type:"doc",     color:"#FFC857" },
  { id:"n5", x:460, y:460, label:"Vedant Resume",    type:"doc",     color:"#FFC857" },
  { id:"n6", x:260, y:460, label:"Python REPL",      type:"tool",    color:"#00D26A" },
];
const GRAPH_EDGES = [
  ["n1","n2"],["n1","n3"],["n1","n5"],["n2","n4"],["n2","n6"],["n3","n6"],
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const now = () => new Date().toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"});
const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning"; if (h < 17) return "Good Afternoon"; return "Good Evening";
};

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Circular SVG gauge */
function Gauge({ pct, label, value, color = "#ED1C24", size = 110 }: {
  pct: number; label: string; value: string; color?: string; size?: number;
}) {
  const r = 40; const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg viewBox="0 0 100 100" className="w-full h-full gauge-ring">
          <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
          <motion.circle
            cx="50" cy="50" r={r} fill="none" stroke={color}
            strokeWidth="8" strokeLinecap="round"
            strokeDasharray={`${circ}`}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: circ - dash }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            style={{ filter: `drop-shadow(0 0 6px ${color}90)` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-white font-bold" style={{ fontSize: 13 }}>{value}</span>
        </div>
      </div>
      <span className="text-[11px] text-[#7A8396] font-mono text-center leading-tight">{label}</span>
    </div>
  );
}

/** Agent step row */
function AgentStep({ log, delay = 0 }: { log: AgentLog; delay?: number }) {
  const statusColors: Record<string,string> = {
    planning:"#3AA0FF", retrieving:"#FFC857", executing:"#FF6A00",
    verifying:"#00D26A", complete:"#00D26A", waiting:"#7A8396",
  };
  const col = statusColors[log.status] ?? "#7A8396";
  return (
    <motion.div
      initial={{ opacity:0, x:16 }} animate={{ opacity:1, x:0 }}
      transition={{ duration:0.4, delay }}
      className="agent-card p-4"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-[11px] font-semibold" style={{ color: col }}>{log.agent}</span>
        <span className="badge-blue" style={{ background:`${col}18`, color:col, borderColor:`${col}40` }}>{log.status}</span>
      </div>
      <p className="font-ai text-[11px] text-[#B8C0CC] leading-relaxed mb-3">{log.output}</p>
      <div className="w-full h-1 rounded-full" style={{ background:"rgba(255,255,255,0.06)" }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background:`linear-gradient(90deg, ${col} 0%, ${col}99 100%)`, boxShadow:`0 0 8px ${col}60` }}
          initial={{ width:0 }}
          animate={{ width:`${log.progress}%` }}
          transition={{ duration:0.8, ease:"easeOut", delay }}
        />
      </div>
    </motion.div>
  );
}

/** Neural network background SVG */
function NeuralBg() {
  return (
    <div className="neural-bg opacity-30">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="ng1"><stop offset="0%" stopColor="#ED1C24" stopOpacity="0.6"/><stop offset="100%" stopColor="#ED1C24" stopOpacity="0"/></radialGradient>
          <radialGradient id="ng2"><stop offset="0%" stopColor="#FF6A00" stopOpacity="0.4"/><stop offset="100%" stopColor="#FF6A00" stopOpacity="0"/></radialGradient>
          <radialGradient id="ng3"><stop offset="0%" stopColor="#3AA0FF" stopOpacity="0.3"/><stop offset="100%" stopColor="#3AA0FF" stopOpacity="0"/></radialGradient>
        </defs>
        {/* Nodes */}
        {[[15,20],[78,35],[45,70],[88,75],[30,85],[62,15]].map(([x,y],i)=>(
          <motion.circle key={i} cx={`${x}%`} cy={`${y}%`} r="3"
            fill={i%3===0?"#ED1C24":i%3===1?"#FF6A00":"#3AA0FF"} opacity="0.5"
            animate={{ r:[3,5,3], opacity:[0.3,0.7,0.3] }}
            transition={{ duration:3+i*0.7, repeat:Infinity, ease:"easeInOut" }}
          />
        ))}
        {/* Lines */}
        {[[15,20,78,35],[78,35,45,70],[45,70,88,75],[30,85,45,70],[62,15,78,35]].map(([x1,y1,x2,y2],i)=>(
          <motion.line key={i} x1={`${x1}%`} y1={`${y1}%`} x2={`${x2}%`} y2={`${y2}%`}
            stroke="rgba(237,28,36,0.15)" strokeWidth="0.5"
            animate={{ opacity:[0.1,0.4,0.1] }}
            transition={{ duration:4+i*0.5, repeat:Infinity, ease:"easeInOut", delay:i*0.3 }}
          />
        ))}
        {/* Glow blobs */}
        <motion.ellipse cx="10%" cy="20%" rx="180" ry="120" fill="url(#ng1)"
          animate={{ cx:["10%","15%","10%"], cy:["20%","25%","20%"] }}
          transition={{ duration:12, repeat:Infinity, ease:"easeInOut" }}
        />
        <motion.ellipse cx="85%" cy="75%" rx="140" ry="100" fill="url(#ng2)"
          animate={{ cx:["85%","80%","85%"], cy:["75%","70%","75%"] }}
          transition={{ duration:10, repeat:Infinity, ease:"easeInOut", delay:2 }}
        />
        <motion.ellipse cx="50%" cy="50%" rx="100" ry="80" fill="url(#ng3)"
          animate={{ opacity:[0.2,0.5,0.2] }}
          transition={{ duration:8, repeat:Infinity, ease:"easeInOut", delay:1 }}
        />
      </svg>
    </div>
  );
}

/** Knowledge Graph SVG */
function KnowledgeGraphSVG({ nodes, edges }: { nodes: typeof GRAPH_NODES; edges: typeof GRAPH_EDGES }) {
  const [hovered, setHovered] = useState<string|null>(null);
  const typeLabels: Record<string,string> = { project:"Project", skill:"Skill", doc:"Document", tool:"Tool" };
  return (
    <div className="relative w-full h-[480px] overflow-hidden">
      <svg className="absolute inset-0" width="100%" height="480" viewBox="0 0 560 520">
        {/* Edges */}
        {edges.map(([s,t],i)=>{
          const sn = nodes.find(n=>n.id===s)!;
          const tn = nodes.find(n=>n.id===t)!;
          const isActive = hovered===s||hovered===t;
          return (
            <motion.line key={i}
              x1={sn.x} y1={sn.y} x2={tn.x} y2={tn.y}
              stroke={isActive?"rgba(237,28,36,0.6)":"rgba(255,255,255,0.08)"}
              strokeWidth={isActive?1.5:0.8}
              animate={{ opacity: isActive?[0.6,1,0.6]:[0.4,0.6,0.4] }}
              transition={{ duration:2, repeat:Infinity, ease:"easeInOut", delay:i*0.15 }}
            />
          );
        })}
        {/* Nodes */}
        {nodes.map(n=>(
          <g key={n.id} onMouseEnter={()=>setHovered(n.id)} onMouseLeave={()=>setHovered(null)} className="cursor-pointer">
            <motion.circle cx={n.x} cy={n.y} r="28"
              fill="rgba(18,22,30,0.9)" stroke={hovered===n.id?n.color:"rgba(255,255,255,0.08)"}
              strokeWidth={hovered===n.id?2:1}
              animate={{ r: hovered===n.id?32:28, filter: hovered===n.id?`drop-shadow(0 0 12px ${n.color}60)`:undefined }}
              transition={{ duration:0.2 }}
            />
            <motion.circle cx={n.x} cy={n.y} r="8" fill={n.color} opacity="0.85"
              animate={{ r: hovered===n.id?10:8 }} transition={{ duration:0.2 }}
            />
            <text x={n.x} y={n.y+46} textAnchor="middle" fill="#B8C0CC" fontSize="10" fontFamily="var(--font-mono)">
              {n.label.length>18?n.label.slice(0,16)+"…":n.label}
            </text>
            <text x={n.x} y={n.y+58} textAnchor="middle" fill="#7A8396" fontSize="9" fontFamily="var(--font-mono)">
              {typeLabels[n.type]}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function AgentForgeOS() {
  const [activeNav, setActiveNav] = useState<NavId>("dashboard");
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<Message[]>([{
    role:"assistant", agent:"Cognitive Orchestrator",
    content:"Welcome to AgentForge OS — the first local AI Operating System powered by AMD Radeon GPUs & ROCm 6.2.\n\nI'm your AI brain. Type a goal and watch me dynamically spawn worker agents, retrieve knowledge, run tools, and verify results — all locally on AMD hardware.",
    ts: now(),
  }]);
  const [agentLogs, setAgentLogs] = useState<AgentLog[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [debateTurns, setDebateTurns] = useState<DebateTurn[]>(INITIAL_DEBATE);
  const [debateTopic, setDebateTopic] = useState("Optimize ROCm Kernel: FlashAttention-2 vs Custom HIP C++?");
  const [isDebating, setIsDebating] = useState(false);
  const [goals, setGoals] = useState<Goal[]>([
    { id:"g1", title:"Build AMD System Portfolio",           status:"In Progress", progress:75, deadline:"Aug 10", priority:"high" },
    { id:"g2", title:"ROCm 6.2 Interview Preparation",       status:"Completed",   progress:100, deadline:"Aug 6",  priority:"high" },
    { id:"g3", title:"FlashAttention-2 RDNA3 Integration",   status:"In Progress", progress:45, deadline:"Aug 12", priority:"medium" },
    { id:"g4", title:"Knowledge Graph RAG Implementation",   status:"Planned",     progress:10, deadline:"Aug 15", priority:"low" },
  ]);
  const [packs, setPacks] = useState<Pack[]>([
    { id:"p1", name:"Developer Pack",       desc:"Git analysis, Python REPL, Code review DAG, AST parser",        installed:true,  category:"Dev" },
    { id:"p2", name:"Research Pack",        desc:"ArXiv PDF parser, Literature matrix generator, Citation graph", installed:true,  category:"Research" },
    { id:"p3", name:"Enterprise Pack",      desc:"Local ChromaDB compliance, Zero-cloud proxy, Audit log",        installed:false, category:"Enterprise" },
    { id:"p4", name:"Cybersecurity Pack",   desc:"Subprocess threat inspect, Memory boundary check, CVE scanner", installed:false, category:"Security" },
  ]);
  const [newGoal, setNewGoal] = useState("");
  const [gpuStats, setGpuStats] = useState({
    tps:49.2, cpu_tps:6.2, vram:9.1, gpu_pct:89, temp:56, latency:182,
    kv_cache:43, cache_hit:94.6, power:285, speedup:7.9,
  });
  const [tpsHistory, setTpsHistory] = useState(() =>
    Array.from({length:12},(_,i)=>({t:`${i}s`, gpu:+(47+Math.random()*4).toFixed(1), cpu:6.2}))
  );
  const [cursorPos, setCursorPos] = useState({ x: -400, y: -400 });
  const chatEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Live GPU ticker
  useEffect(()=>{
    const id = setInterval(()=>{
      const tps = +(47.5 + Math.random()*4).toFixed(1);
      const vram = +(8.8 + Math.random()*0.6).toFixed(2);
      setGpuStats(p=>({...p, tps, vram, gpu_pct:+(84+Math.random()*13).toFixed(1), speedup:+(tps/6.2).toFixed(1), latency:Math.floor(175+Math.random()*15), kv_cache:+(40+Math.random()*6).toFixed(1) }));
      setTpsHistory(prev=>[...prev.slice(1),{t:now(),gpu:tps,cpu:6.2}]);
    },2000);
    return ()=>clearInterval(id);
  },[]);

  // Cursor glow
  useEffect(()=>{
    const fn = (e: MouseEvent) => setCursorPos({ x:e.clientX, y:e.clientY });
    window.addEventListener("mousemove",fn);
    return ()=>window.removeEventListener("mousemove",fn);
  },[]);

  // Auto scroll chat
  useEffect(()=>{ chatEndRef.current?.scrollIntoView({ behavior:"smooth" }); },[messages]);

  // Send message
  const sendMessage = useCallback(async(overridePrompt?: string)=>{
    const q = (overridePrompt??prompt).trim();
    if(!q||isProcessing) return;
    if(!overridePrompt) setPrompt("");
    setIsProcessing(true);
    setAgentLogs([]);
    setMessages(prev=>[...prev,{ role:"user", content:q, ts:now() }]);

    // Try WebSocket
    let ws: WebSocket|null = null;
    let connected = false;
    const wsTimeout = setTimeout(()=>{ if(!connected) runSimulation(q); },1500);

    try {
      ws = new WebSocket("ws://localhost:8000/ws/agent-stream");
      ws.onopen = ()=>{ connected=true; clearTimeout(wsTimeout); ws!.send(JSON.stringify({prompt:q})); };
      ws.onmessage = (ev)=>{
        const d = JSON.parse(ev.data);
        setAgentLogs(prev=>[...prev,d]);
        if(d.status==="complete"){
          setMessages(prev=>[...prev,{ role:"assistant", agent:"Response Engine", content:d.output??d.output, ts:now() }]);
          setIsProcessing(false); ws!.close();
        }
      };
      ws.onerror = ()=>{ clearTimeout(wsTimeout); if(!connected) runSimulation(q); };
    } catch { clearTimeout(wsTimeout); runSimulation(q); }
  },[prompt,isProcessing]);

  const runSimulation = useCallback(async(q:string)=>{
    for(let i=0;i<AGENT_STEPS.length;i++){
      await new Promise(r=>setTimeout(r,700));
      setAgentLogs(prev=>[...prev,AGENT_STEPS[i]]);
    }
    await new Promise(r=>setTimeout(r,400));
    setMessages(prev=>[...prev,{
      role:"assistant", agent:"Response Engine", ts:now(),
      content:`### AgentForge OS Response\n\n**Goal**: "${q}"\n\n**Execution**: AMD Radeon RX 7900 XTX · ROCm 6.2 · 100% Local\n\n**Orchestrator** spawned 3 dynamic workers:\n- Knowledge Engine → 12 graph nodes retrieved\n- Tool Executor → check_rocm_tps() = **49.2 t/s**\n- Trust Engine → Confidence: **98.6%** · Hallucination risk: **0.4%**\n\n**Result**: Task completed locally. Zero cloud API calls. Zero data leakage.`,
    }]);
    setIsProcessing(false);
  },[]);

  const runDebate = async()=>{
    if(isDebating) return;
    setIsDebating(true);
    try {
      const r = await fetch("http://localhost:8000/api/debate",{ method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({topic:debateTopic}), signal:AbortSignal.timeout(4000) });
      if(r.ok){ const d=await r.json(); if(Array.isArray(d?.turns)&&d.turns.length){ setDebateTurns(d.turns); setIsDebating(false); return; } }
    } catch {}
    // Local fallback
    setDebateTurns([
      { ...INITIAL_DEBATE[0], argument:`For: "${debateTopic}" — FlashAttention-2 pre-tiled RDNA3 kernels cut VRAM overhead by 35%.` },
      { ...INITIAL_DEBATE[1], argument:"Custom HIP C++ reduces macro expansion risks, ensuring enterprise-grade memory isolation." },
      { ...INITIAL_DEBATE[2], argument:`Benchmark on RX 7900 XTX: FlashAttention-2 → 49.2 t/s vs 41.0 t/s Custom HIP.` },
      { ...INITIAL_DEBATE[3], argument:"CONSENSUS: FlashAttention-2 inside HIP sandbox. Optimal for speed AND security at 49.2 t/s." },
    ]);
    setIsDebating(false);
  };

  // Analytics data
  const analyticsGpu = Array.from({length:8},(_,i)=>({ t:`${i*10}s`, tps:+(46+Math.random()*6).toFixed(1), latency:Math.floor(170+Math.random()*20) }));
  const memGrowth = [
    {week:"W1",nodes:24},{week:"W2",nodes:47},{week:"W3",nodes:89},{week:"W4",nodes:142},
  ];
  const taskDist = [
    {name:"Completed",value:40,color:"#00D26A"},{name:"In Progress",value:35,color:"#FF6A00"},
    {name:"Planned",value:25,color:"#3AA0FF"},
  ];

  // Sidebar nav
  const navItems: { id:NavId; label:string; icon:React.FC<{className?:string}> }[] = [
    { id:"dashboard",  label:"Dashboard",      icon:LayoutDashboard },
    { id:"workspace",  label:"AI Workspace",   icon:Bot },
    { id:"memory",     label:"Memory",         icon:MemoryStick },
    { id:"knowledge",  label:"Knowledge",      icon:Network },
    { id:"tasks",      label:"Tasks & Goals",  icon:ListTodo },
    { id:"agents",     label:"Agents",         icon:Sparkles },
    { id:"gpu",        label:"GPU Monitor",    icon:GaugeIcon },
    { id:"analytics",  label:"Analytics",      icon:BarChart3 },
    { id:"settings",   label:"Settings",       icon:Settings },
  ];

  const priorityColor = (p:string) => p==="high"?"#ED1C24":p==="medium"?"#FF6A00":"#3AA0FF";
  const statusBadge = (s:string) =>
    s==="Completed"?"badge-success":s==="In Progress"?"badge-orange":s==="Planned"?"badge-blue":"badge-warning";

  // ── Sidebar ──────────────────────────────────────────────────────────────────
  const Sidebar = (
    <motion.aside
      className="glass-sidebar flex flex-col h-full flex-shrink-0 z-20 relative"
      animate={{ width: sidebarExpanded ? 224 : 64 }}
      transition={{ type:"spring", stiffness:280, damping:26 }}
      onMouseEnter={()=>setSidebarExpanded(true)}
      onMouseLeave={()=>setSidebarExpanded(false)}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-[rgba(255,255,255,0.06)] overflow-hidden">
        <div className="w-8 h-8 rounded-xl gradient-amd flex items-center justify-center flex-shrink-0 glow-red">
          <Zap className="w-4 h-4 text-white" />
        </div>
        <AnimatePresence>
          {sidebarExpanded&&(
            <motion.div initial={{opacity:0,x:-8}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-8}} transition={{duration:0.18}} className="overflow-hidden whitespace-nowrap">
              <p className="font-heading font-bold text-sm text-white leading-none">AgentForge</p>
              <p className="font-ai text-[9px] text-[#ED1C24] mt-0.5 uppercase tracking-widest">OS v3.0</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 space-y-1 px-2 overflow-hidden">
        {navItems.map(({id,label,icon:Icon})=>{
          const active = activeNav===id;
          return (
            <motion.button key={id} onClick={()=>setActiveNav(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left overflow-hidden transition-colors ${active?"nav-active":"hover:bg-[rgba(255,255,255,0.04)]"}`}
              whileTap={{scale:0.97}}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 transition-colors ${active?"text-[#ED1C24]":"text-[#7A8396]"}`} />
              <AnimatePresence>
                {sidebarExpanded&&(
                  <motion.span initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.15}}
                    className={`font-body text-sm font-medium whitespace-nowrap ${active?"text-white":"text-[#B8C0CC]"}`}>
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </nav>

      {/* GPU mini-chip */}
      <div className="p-2 border-t border-[rgba(255,255,255,0.06)]">
        <div className={`p-3 rounded-xl transition-all ${sidebarExpanded?"glass":""}`} style={sidebarExpanded?{border:"1px solid rgba(237,28,36,0.2)"}:{}}>
          <div className={`flex items-center ${sidebarExpanded?"gap-2":"justify-center"}`}>
            <div className="w-2 h-2 rounded-full bg-[#00D26A] flex-shrink-0" style={{boxShadow:"0 0 6px #00D26A"}} />
            <AnimatePresence>
              {sidebarExpanded&&(
                <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                  <p className="font-mono text-[10px] text-[#00D26A]">ROCm Active</p>
                  <p className="font-mono text-[10px] text-[#7A8396]">{gpuStats.tps} t/s</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.aside>
  );

  // ── Top Bar ──────────────────────────────────────────────────────────────────
  const TopBar = (
    <header className="glass-topbar h-14 flex items-center justify-between px-6 flex-shrink-0 z-10 relative">
      <div className="flex items-center gap-3">
        <span className="font-heading text-sm font-semibold text-white capitalize">{activeNav.replace(/_/g," ")}</span>
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{background:"rgba(237,28,36,0.1)",border:"1px solid rgba(237,28,36,0.2)"}}>
          <div className="dot-live" />
          <span className="font-mono text-[10px] text-[#ED1C24] font-semibold">Qwen3-8B · ROCm 6.2</span>
        </div>
      </div>

      <div className="flex items-center gap-5">
        <div className="hidden lg:flex items-center gap-4">
          {[
            { icon:Zap, val:`${gpuStats.tps} t/s`, col:"#ED1C24" },
            { icon:HardDrive, val:`${gpuStats.vram} GB VRAM`, col:"#FF6A00" },
            { icon:TrendingUp, val:`${gpuStats.speedup}× CPU`, col:"#00D26A" },
            { icon:Clock, val:`${gpuStats.latency} ms`, col:"#FFC857" },
          ].map(({icon:Icon,val,col},i)=>(
            <div key={i} className="flex items-center gap-1.5">
              <Icon className="w-3 h-3" style={{color:col}} />
              <span className="font-mono text-[11px] font-semibold" style={{color:col}}>{val}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[rgba(255,255,255,0.06)] transition-colors">
            <Bell className="w-4 h-4 text-[#7A8396]" />
          </button>
          <div className="w-8 h-8 rounded-full gradient-amd flex items-center justify-center text-white text-xs font-bold">V</div>
        </div>
      </div>
    </header>
  );

  // ══════════════════════════════════════════════════════════════════════════════
  // TAB CONTENT
  // ══════════════════════════════════════════════════════════════════════════════

  const tabVariants = { hidden:{opacity:0,y:12}, visible:{opacity:1,y:0,transition:{duration:0.3,ease:[0.16,1,0.3,1]}} };

  // ── DASHBOARD ────────────────────────────────────────────────────────────────
  const DashboardTab = (
    <motion.div key="dashboard" variants={tabVariants} initial="hidden" animate="visible" className="p-6 space-y-6 overflow-y-auto h-full">
      {/* Hero */}
      <motion.div className="glass rounded-3xl p-8 relative overflow-hidden border-amd"
        initial={{opacity:0,scale:0.97}} animate={{opacity:1,scale:1}} transition={{duration:0.5}}>
        <div className="absolute inset-0 opacity-10" style={{background:"radial-gradient(ellipse at 80% 50%, #ED1C24 0%, transparent 60%)"}} />
        <div className="relative z-10">
          <p className="font-mono text-[#7A8396] text-sm mb-1">{greeting()},</p>
          <h1 className="font-heading font-bold text-5xl gradient-amd-text mb-2">Vedant</h1>
          <p className="font-body text-[#B8C0CC] text-sm mb-6">Your AI operating system is running — 3 agents active, 49.2 t/s on AMD ROCm 6.2.</p>
          <div className="flex items-center gap-3 flex-wrap">
            {[["Try interview prep","Prepare me for AMD SWE interview"],["Run GPU benchmark","Show GPU vs CPU benchmark"],["Search knowledge","What do I know about FlashAttention-2?"]].map(([label,q],i)=>(
              <motion.button key={i} onClick={()=>{setActiveNav("workspace");setTimeout(()=>sendMessage(q),100);}}
                className="font-body text-xs px-4 py-2 rounded-xl text-white transition-all"
                style={{background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.1)"}}
                whileHover={{background:"rgba(237,28,36,0.15)",borderColor:"rgba(237,28,36,0.3)"}}
                whileTap={{scale:0.97}}>
                {label} <ChevronRight className="inline w-3 h-3 ml-1" />
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* KPI Row */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label:"Inference Speed",  value:`${gpuStats.tps}`,    unit:"t/s",    color:"#ED1C24", icon:Zap,       sub:`${gpuStats.speedup}× faster than CPU` },
          { label:"VRAM Usage",       value:`${gpuStats.vram}`,   unit:"GB",     color:"#FF6A00", icon:HardDrive, sub:"of 24 GB · AMD RX 7900 XTX" },
          { label:"AI Memory Nodes",  value:"142",                 unit:"nodes",  color:"#3AA0FF", icon:Database,  sub:"+18 added this session" },
          { label:"Tasks Completed",  value:"40",                  unit:"goals",  color:"#00D26A", icon:CheckCircle2, sub:"3 in progress · 2 planned" },
        ].map(({label,value,unit,color,icon:Icon,sub},i)=>(
          <motion.div key={i} className="glass rounded-2xl p-5 card-hover"
            initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:i*0.07,duration:0.4}}>
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-[11px] text-[#7A8396] uppercase tracking-wider">{label}</span>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{background:`${color}18`,border:`1px solid ${color}30`}}>
                <Icon className="w-4 h-4" style={{color}} />
              </div>
            </div>
            <div className="flex items-baseline gap-1.5 mb-1">
              <span className="font-heading font-bold text-3xl text-white">{value}</span>
              <span className="font-mono text-xs text-[#7A8396]">{unit}</span>
            </div>
            <p className="font-body text-[11px] text-[#7A8396]">{sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Bottom panels */}
      <div className="grid grid-cols-3 gap-4">
        {/* Running Agents */}
        <div className="glass rounded-2xl p-5">
          <h3 className="font-heading font-semibold text-sm text-white mb-4 flex items-center gap-2">
            <Bot className="w-4 h-4 text-[#ED1C24]" /> Active Worker Pool
          </h3>
          <div className="space-y-2">
            {[
              {name:"Cognitive Orchestrator",role:"Brain · Planning",    col:"#ED1C24"},
              {name:"ROCm Engineer Worker",   role:"Execution · Tools",  col:"#FF6A00"},
              {name:"Trust & Reflection",     role:"Verification · Memory",col:"#00D26A"},
            ].map((a,i)=>(
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.05)"}}>
                <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{background:`${a.col}20`}}>
                  <div className="w-1.5 h-1.5 rounded-full agent-working" style={{background:a.col}} />
                </div>
                <div className="min-w-0">
                  <p className="font-body text-xs font-semibold text-white truncate">{a.name}</p>
                  <p className="font-mono text-[10px] text-[#7A8396]">{a.role}</p>
                </div>
                <span className="badge-success ml-auto flex-shrink-0">Active</span>
              </div>
            ))}
          </div>
        </div>

        {/* GPU Sparkline */}
        <div className="glass rounded-2xl p-5">
          <h3 className="font-heading font-semibold text-sm text-white mb-1 flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#ED1C24]" /> Inference Speed (Live)
          </h3>
          <p className="font-mono text-[10px] text-[#7A8396] mb-4">AMD Radeon RX 7900 XTX · ROCm 6.2</p>
          <div className="h-24 -mx-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={tpsHistory}>
                <defs>
                  <linearGradient id="tpsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ED1C24" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ED1C24" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="gpu" stroke="#ED1C24" strokeWidth={2} fill="url(#tpsGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-between mt-2">
            <span className="font-mono text-[10px] text-[#7A8396]">Min: 47.5 t/s</span>
            <span className="font-mono text-[10px] font-bold" style={{color:"#ED1C24"}}>{gpuStats.tps} t/s now</span>
            <span className="font-mono text-[10px] text-[#7A8396]">Max: 53.6 t/s</span>
          </div>
        </div>

        {/* Goal Progress */}
        <div className="glass rounded-2xl p-5">
          <h3 className="font-heading font-semibold text-sm text-white mb-4 flex items-center gap-2">
            <Target className="w-4 h-4 text-[#ED1C24]" /> Goal Progress
          </h3>
          <div className="space-y-3">
            {goals.slice(0,3).map((g,i)=>(
              <div key={g.id}>
                <div className="flex justify-between mb-1">
                  <span className="font-body text-xs text-[#B8C0CC] truncate mr-2">{g.title}</span>
                  <span className="font-mono text-[10px] flex-shrink-0" style={{color:priorityColor(g.priority)}}>{g.progress}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-[rgba(255,255,255,0.06)]">
                  <motion.div className="h-full rounded-full" initial={{width:0}} animate={{width:`${g.progress}%`}}
                    transition={{delay:i*0.1+0.3,duration:1,ease:"easeOut"}}
                    style={{background:`linear-gradient(90deg, ${priorityColor(g.priority)}, ${priorityColor(g.priority)}99)`}} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );

  // ── WORKSPACE ────────────────────────────────────────────────────────────────
  const WorkspaceTab = (
    <motion.div key="workspace" variants={tabVariants} initial="hidden" animate="visible" className="flex flex-1 overflow-hidden">
      {/* Chat */}
      <div className="flex-1 flex flex-col overflow-hidden border-r border-[rgba(255,255,255,0.06)]">
        <div className="px-6 py-4 border-b border-[rgba(255,255,255,0.06)] flex-shrink-0 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl gradient-amd flex items-center justify-center"><Brain className="w-4 h-4 text-white" /></div>
          <div>
            <p className="font-heading font-semibold text-sm text-white">Cognitive Workspace</p>
            <p className="font-mono text-[10px] text-[#7A8396]">Multi-agent reasoning · ROCm 6.2 · 100% Local</p>
          </div>
          {isProcessing&&<div className="ml-auto flex items-center gap-1.5"><div className="thinking-dot"/><div className="thinking-dot"/><div className="thinking-dot"/></div>}
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <AnimatePresence>
            {messages.map((m,i)=>(
              <motion.div key={i} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} className={`flex ${m.role==="user"?"justify-end":"justify-start"}`}>
                <div className={`max-w-[85%] ${m.role==="user"?"order-2":""}`}>
                  <div className="flex items-center gap-2 mb-1 px-1">
                    {m.role==="assistant"&&<div className="w-4 h-4 rounded-full gradient-amd flex items-center justify-center"><Sparkles className="w-2.5 h-2.5 text-white"/></div>}
                    <span className="font-mono text-[10px] text-[#7A8396]">{m.role==="user"?"You":m.agent??"AgentForge OS"}</span>
                    {m.ts&&<span className="font-mono text-[10px] text-[#4A5568]">{m.ts}</span>}
                  </div>
                  <div className={`rounded-2xl p-4 text-sm leading-relaxed whitespace-pre-wrap font-body ${
                    m.role==="user"
                      ?"text-white rounded-br-none"
                      :"text-[#B8C0CC] rounded-bl-none glass-sm"
                  }`}
                    style={m.role==="user"?{background:"linear-gradient(135deg,#ED1C24,#CC1119)",boxShadow:"0 4px 20px rgba(237,28,36,0.25)"}:{}}
                  >{m.content}</div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={chatEndRef}/>
        </div>

        {/* Input */}
        <div className="p-4 border-t border-[rgba(255,255,255,0.06)] flex-shrink-0">
          <div className="glass-sm rounded-2xl p-3 border-amd">
            <textarea ref={textareaRef} value={prompt} onChange={e=>setPrompt(e.target.value)}
              onKeyDown={e=>{ if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendMessage();} }}
              placeholder="Describe a goal… I'll spawn agents, query knowledge, and execute tools locally."
              className="w-full bg-transparent font-body text-sm text-white placeholder-[#4A5568] focus:outline-none resize-none h-16 px-1"
            />
            <div className="flex items-center justify-between pt-2 border-t border-[rgba(255,255,255,0.06)]">
              <div className="flex items-center gap-2">
                <Lock className="w-3 h-3 text-[#7A8396]"/>
                <span className="font-mono text-[10px] text-[#7A8396]">100% local · Zero cloud</span>
              </div>
              <motion.button onClick={()=>sendMessage()} disabled={isProcessing||!prompt.trim()}
                className="btn-amd flex items-center gap-2 px-4 py-2 rounded-xl text-white text-xs"
                whileTap={{scale:0.96}}>
                {isProcessing?<RefreshCw className="w-3.5 h-3.5 animate-spin"/>:<Send className="w-3.5 h-3.5"/>}
                Execute
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Agent Thinking Panel */}
      <div className="w-80 flex flex-col overflow-hidden flex-shrink-0">
        <div className="px-5 py-4 border-b border-[rgba(255,255,255,0.06)] flex items-center gap-2 flex-shrink-0">
          <Terminal className="w-4 h-4 text-[#ED1C24]" />
          <p className="font-heading font-semibold text-sm text-white">Agent Execution</p>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {agentLogs.length===0&&(
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="w-12 h-12 rounded-2xl gradient-amd flex items-center justify-center mb-3 opacity-40">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <p className="font-ai text-[11px] text-[#4A5568] leading-relaxed">Awaiting task…<br/>Agent stream appears here.</p>
            </div>
          )}
          <AnimatePresence>
            {agentLogs.map((log,i)=><AgentStep key={i} log={log} delay={i*0.05}/>)}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );

  // ── MEMORY ───────────────────────────────────────────────────────────────────
  const MemoryTab = (
    <motion.div key="memory" variants={tabVariants} initial="hidden" animate="visible" className="p-6 overflow-y-auto h-full space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading font-bold text-2xl text-white">AI Memory Timeline</h2>
          <p className="font-body text-sm text-[#7A8396] mt-1">Persistent long-term memory — everything AgentForge OS remembers.</p>
        </div>
        <div className="flex items-center gap-2">
          {["Day","Week","Month"].map(t=>(
            <button key={t} className="font-mono text-xs px-3 py-1.5 rounded-lg transition-all" style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.08)",color:"#B8C0CC"}}>{t}</button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[{label:"Total Memories",v:"142",col:"#ED1C24"},{label:"Sessions",v:"28",col:"#FF6A00"},{label:"Documents",v:"14",col:"#3AA0FF"},{label:"Tools Used",v:"9",col:"#00D26A"}].map(({label,v,col},i)=>(
          <div key={i} className="glass-sm rounded-2xl p-4 card-hover">
            <p className="font-mono text-[10px] text-[#7A8396] mb-2 uppercase tracking-wider">{label}</p>
            <p className="font-heading font-bold text-3xl" style={{color:col}}>{v}</p>
          </div>
        ))}
      </div>

      {/* Growth chart */}
      <div className="glass rounded-2xl p-5">
        <h3 className="font-heading font-semibold text-sm text-white mb-4">Memory Growth Over Time</h3>
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={memGrowth}>
              <defs>
                <linearGradient id="memGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3AA0FF" stopOpacity={0.3}/><stop offset="95%" stopColor="#3AA0FF" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3"/>
              <XAxis dataKey="week" tick={{fontSize:10,fontFamily:"var(--font-mono)",fill:"#7A8396"}}/>
              <YAxis tick={{fontSize:10,fontFamily:"var(--font-mono)",fill:"#7A8396"}}/>
              <Tooltip contentStyle={{background:"rgba(18,22,30,0.95)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:12,fontFamily:"var(--font-mono)",fontSize:11}}/>
              <Area type="monotone" dataKey="nodes" stroke="#3AA0FF" strokeWidth={2} fill="url(#memGrad)" dot={{fill:"#3AA0FF",r:4}} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Memory entries */}
      <div className="space-y-3 relative pl-8">
        <div className="timeline-line"/>
        {MEMORY_ENTRIES.map((m,i)=>{
          const typeCol: Record<string,string> = {Session:"#ED1C24",Goal:"#FF6A00",Document:"#FFC857",Tool:"#00D26A",Research:"#3AA0FF"};
          const col = typeCol[m.type]??"#7A8396";
          return (
            <motion.div key={m.id} initial={{opacity:0,x:-12}} animate={{opacity:1,x:0}} transition={{delay:i*0.06}} className="glass-sm rounded-xl p-4 card-hover relative">
              <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 flex items-center justify-center" style={{background:"var(--bg-base)",borderColor:col}}>
                <div className="w-1.5 h-1.5 rounded-full" style={{background:col}}/>
              </div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-heading font-semibold text-sm text-white">{m.title}</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px]" style={{color:col}}>{m.type}</span>
                  <span className="font-mono text-[10px] text-[#7A8396]">{m.date}</span>
                </div>
              </div>
              <p className="font-body text-xs text-[#B8C0CC] leading-relaxed">{m.summary}</p>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );

  // ── KNOWLEDGE ────────────────────────────────────────────────────────────────
  const KnowledgeTab = (
    <motion.div key="knowledge" variants={tabVariants} initial="hidden" animate="visible" className="p-6 overflow-y-auto h-full space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading font-bold text-2xl text-white">Knowledge Graph</h2>
          <p className="font-body text-sm text-[#7A8396] mt-1">Interactive living graph — hover nodes to explore relationships.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl input-glass w-56">
          <Search className="w-3.5 h-3.5 text-[#7A8396]" />
          <input placeholder="Search nodes…" className="bg-transparent text-xs text-white placeholder-[#4A5568] focus:outline-none flex-1" />
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 flex-wrap">
        {[{label:"Project",col:"#ED1C24"},{label:"Skill",col:"#3AA0FF"},{label:"Document",col:"#FFC857"},{label:"Tool",col:"#00D26A"}].map(({label,col})=>(
          <div key={label} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{background:col}}/>
            <span className="font-mono text-[11px] text-[#7A8396]">{label}</span>
          </div>
        ))}
      </div>

      <div className="glass rounded-3xl overflow-hidden">
        <KnowledgeGraphSVG nodes={GRAPH_NODES} edges={GRAPH_EDGES} />
      </div>

      {/* Relationships list */}
      <div className="glass rounded-2xl p-5">
        <h3 className="font-heading font-semibold text-sm text-white mb-4">Graph Relationships</h3>
        <div className="grid grid-cols-2 gap-2">
          {[
            ["AMD Interview Prep","ROCm & HIP Dev","Project → Skill","#3AA0FF"],
            ["AMD Interview Prep","FlashAttention-2","Project → Skill","#3AA0FF"],
            ["AMD Interview Prep","Vedant Resume","Project → Document","#FFC857"],
            ["ROCm & HIP Dev","ROCm Dev Guide","Skill → Document","#FFC857"],
            ["ROCm & HIP Dev","Python REPL","Skill → Tool","#00D26A"],
            ["FlashAttention-2","Python REPL","Skill → Tool","#00D26A"],
          ].map(([s,t,rel,col],i)=>(
            <div key={i} className="flex items-center gap-2 text-[11px] font-mono p-2.5 rounded-lg" style={{background:"rgba(255,255,255,0.03)"}}>
              <span className="text-[#ED1C24] truncate">{s}</span>
              <ChevronRight className="w-3 h-3 text-[#4A5568] flex-shrink-0"/>
              <span style={{color:col}} className="truncate">{t}</span>
              <span className="ml-auto text-[#4A5568] flex-shrink-0 text-[9px]">{rel}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  // ── TASKS ────────────────────────────────────────────────────────────────────
  const TasksTab = (
    <motion.div key="tasks" variants={tabVariants} initial="hidden" animate="visible" className="p-6 overflow-y-auto h-full space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading font-bold text-2xl text-white">Tasks & Goals</h2>
          <p className="font-body text-sm text-[#7A8396] mt-1">Autonomous goal tracking — monitored continuously by AgentForge OS.</p>
        </div>
      </div>

      {/* Add goal */}
      <div className="glass-sm rounded-2xl p-4 flex gap-3">
        <input value={newGoal} onChange={e=>setNewGoal(e.target.value)} onKeyDown={e=>{ if(e.key==="Enter"&&newGoal.trim()){ setGoals(p=>[...p,{id:`g${Date.now()}`,title:newGoal.trim(),status:"Planned",progress:0,deadline:"Aug 30",priority:"medium"}]); setNewGoal(""); } }}
          placeholder="Type a new goal and press Enter…" className="flex-1 input-glass px-4 py-2.5 text-sm" />
        <motion.button whileTap={{scale:0.95}} onClick={()=>{ if(!newGoal.trim()) return; setGoals(p=>[...p,{id:`g${Date.now()}`,title:newGoal.trim(),status:"Planned",progress:0,deadline:"Aug 30",priority:"medium"}]); setNewGoal(""); }}
          className="btn-amd flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-xs">
          <Plus className="w-4 h-4"/> Add Goal
        </motion.button>
      </div>

      {/* Goals */}
      <div className="space-y-3">
        <AnimatePresence>
          {goals.map((g,i)=>(
            <motion.div key={g.id} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,x:-20}} transition={{delay:i*0.05}}
              className="glass-sm rounded-2xl p-5 card-hover">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-8 rounded-full" style={{background:priorityColor(g.priority)}}/>
                  <div>
                    <p className="font-heading font-semibold text-sm text-white">{g.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={statusBadge(g.status)}>{g.status}</span>
                      <span className="font-mono text-[10px] text-[#4A5568]">Due {g.deadline}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold" style={{color:priorityColor(g.priority)}}>{g.progress}%</span>
                  <button onClick={()=>setGoals(p=>p.filter(x=>x.id!==g.id))} className="text-[#4A5568] hover:text-[#ED1C24] transition-colors">
                    <Trash2 className="w-3.5 h-3.5"/>
                  </button>
                </div>
              </div>
              <div className="h-2 rounded-full" style={{background:"rgba(255,255,255,0.06)"}}>
                <motion.div className="h-full rounded-full" initial={{width:0}} animate={{width:`${g.progress}%`}}
                  transition={{delay:i*0.07+0.2,duration:1,ease:"easeOut"}}
                  style={{background:`linear-gradient(90deg,${priorityColor(g.priority)},${priorityColor(g.priority)}88)`}}/>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );

  // ── AGENTS ───────────────────────────────────────────────────────────────────
  const AgentsTab = (
    <motion.div key="agents" variants={tabVariants} initial="hidden" animate="visible" className="p-6 overflow-y-auto h-full space-y-6">
      <div>
        <h2 className="font-heading font-bold text-2xl text-white">AI Debate Engine</h2>
        <p className="font-body text-sm text-[#7A8396] mt-1">Multi-agent dialectic reasoning — eliminates single-agent bias through structured debate.</p>
      </div>

      {/* Debate input */}
      <div className="glass-sm rounded-2xl p-4 flex gap-3">
        <input value={debateTopic} onChange={e=>setDebateTopic(e.target.value)}
          className="flex-1 input-glass px-4 py-2.5 text-sm" placeholder="Enter debate topic…"/>
        <motion.button whileTap={{scale:0.95}} onClick={runDebate} disabled={isDebating||!debateTopic.trim()}
          className="btn-amd flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-xs">
          {isDebating?<RefreshCw className="w-3.5 h-3.5 animate-spin"/>:<MessageSquareCode className="w-3.5 h-3.5"/>}
          {isDebating?"Debating…":"Start Debate"}
        </motion.button>
      </div>

      {/* 3-col debate */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        {debateTurns.slice(0,3).map((t,i)=>(
          <motion.div key={i} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:i*0.1}}
            className="glass-sm rounded-2xl p-5" style={{borderColor:`${t.color}30`}}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{background:`${t.color}18`,border:`1px solid ${t.color}30`,color:t.color}}>
                {t.icon}
              </div>
              <span className="font-mono text-[11px] font-semibold" style={{color:t.color}}>{t.agent}</span>
            </div>
            <p className="font-ai text-xs text-[#B8C0CC] leading-relaxed">{t.argument}</p>
          </motion.div>
        ))}
      </div>

      {/* Consensus */}
      {debateTurns[3]&&(
        <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:0.35}}
          className="glass rounded-2xl p-5" style={{borderColor:"rgba(0,210,106,0.3)",background:"rgba(0,210,106,0.04)"}}>
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-5 h-5 text-[#00D26A]"/>
            <span className="font-heading font-semibold text-sm text-[#00D26A]">Consensus Reached</span>
          </div>
          <p className="font-ai text-sm text-[#B8C0CC] leading-relaxed">{debateTurns[3].argument}</p>
        </motion.div>
      )}

      {/* Agent Timeline */}
      <div className="glass rounded-2xl p-5">
        <h3 className="font-heading font-semibold text-sm text-white mb-4">Agent Decision Timeline</h3>
        <div className="space-y-2">
          {[
            {step:"Request",   desc:"User prompt received and classified",    col:"#ED1C24",done:true},
            {step:"Planning",  desc:"Orchestrator builds execution DAG",       col:"#FF6A00",done:true},
            {step:"Memory",    desc:"Long-term context retrieved",             col:"#FFC857",done:true},
            {step:"Knowledge", desc:"Knowledge Graph nodes queried",           col:"#3AA0FF",done:true},
            {step:"Tool",      desc:"Python REPL executed: 49.2 t/s",         col:"#00D26A",done:true},
            {step:"Verify",    desc:"Trust engine: 98.6% confidence",         col:"#00D26A",done:true},
            {step:"Response",  desc:"Final output synthesized and delivered",  col:"#00D26A",done:true},
          ].map(({step,desc,col,done},i)=>(
            <div key={i} className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center" style={{background:done?`${col}20`:"rgba(255,255,255,0.04)",border:`1px solid ${done?col:"rgba(255,255,255,0.08)"}`}}>
                {done?<CheckCircle2 className="w-3.5 h-3.5" style={{color:col}}/>:<Clock className="w-3.5 h-3.5 text-[#4A5568]"/>}
              </div>
              <div className="flex items-center gap-2 flex-1">
                <span className="font-mono text-xs font-semibold w-20 flex-shrink-0" style={{color:done?col:"#4A5568"}}>{step}</span>
                <span className="font-body text-xs text-[#7A8396]">{desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  // ── GPU MONITOR ──────────────────────────────────────────────────────────────
  const GPUTab = (
    <motion.div key="gpu" variants={tabVariants} initial="hidden" animate="visible" className="p-6 overflow-y-auto h-full space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading font-bold text-2xl text-white">GPU Monitor</h2>
          <p className="font-body text-sm text-[#7A8396] mt-1">Live AMD Radeon RX 7900 XTX telemetry — ROCm 6.2 active.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{background:"rgba(0,210,106,0.1)",border:"1px solid rgba(0,210,106,0.25)"}}>
          <div className="dot-live"/>
          <span className="font-mono text-[11px] text-[#00D26A] font-semibold">ROCm 6.2.0-GA Active</span>
        </div>
      </div>

      {/* Gauge row */}
      <div className="glass rounded-3xl p-8">
        <div className="flex items-center justify-around flex-wrap gap-8">
          <Gauge pct={gpuStats.gpu_pct} label="GPU Compute Load" value={`${gpuStats.gpu_pct}%`} color="#ED1C24"/>
          <Gauge pct={(gpuStats.vram/24)*100} label="VRAM Usage" value={`${gpuStats.vram}G`} color="#FF6A00"/>
          <Gauge pct={Math.min(gpuStats.power/350*100,100)} label="Power Draw" value={`${gpuStats.power}W`} color="#FFC857"/>
          <Gauge pct={gpuStats.temp/85*100} label="Temperature" value={`${gpuStats.temp}°C`} color="#3AA0FF"/>
          <Gauge pct={gpuStats.tps/60*100} label="Tokens/sec" value={`${gpuStats.tps}`} color="#00D26A"/>
          <Gauge pct={gpuStats.kv_cache} label="KV Cache" value={`${gpuStats.kv_cache}%`} color="#B06EFF"/>
        </div>
      </div>

      {/* TPS Chart */}
      <div className="glass rounded-2xl p-5">
        <h3 className="font-heading font-semibold text-sm text-white mb-1">Inference Throughput — Live</h3>
        <p className="font-mono text-[10px] text-[#7A8396] mb-4">AMD GPU (ROCm) vs Host CPU · tokens/second</p>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={tpsHistory}>
              <CartesianGrid strokeDasharray="3 3"/>
              <XAxis dataKey="t" tick={{fontSize:9,fontFamily:"var(--font-mono)",fill:"#7A8396"}}/>
              <YAxis tick={{fontSize:9,fontFamily:"var(--font-mono)",fill:"#7A8396"}} domain={[0,60]}/>
              <Tooltip contentStyle={{background:"rgba(18,22,30,0.95)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:12,fontFamily:"var(--font-mono)",fontSize:11}}/>
              <Line type="monotone" dataKey="gpu" name="AMD GPU (ROCm)" stroke="#ED1C24" strokeWidth={2} dot={false}/>
              <Line type="monotone" dataKey="cpu" name="Host CPU" stroke="#4A5568" strokeWidth={1.5} strokeDasharray="4 4" dot={false}/>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Specs + Speedup */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass rounded-2xl p-5">
          <h3 className="font-heading font-semibold text-sm text-white mb-4">Hardware Architecture</h3>
          <div className="space-y-2">
            {[
              ["Device","AMD Radeon RX 7900 XTX","#ED1C24"],
              ["Architecture","RDNA3 (Navi 31) · 96 CUs","#FF6A00"],
              ["VRAM","24 GB GDDR6 · 384-bit bus","#3AA0FF"],
              ["ROCm Driver","6.2.0-GA · HIP Active","#FFC857"],
              ["Kernel","FlashAttention-2 RDNA3","#00D26A"],
              ["Quantization","GGUF Q4_K_M · 4-bit","#B06EFF"],
              ["Model","Qwen3-8B-Instruct","#B8C0CC"],
            ].map(([k,v,col],i)=>(
              <div key={i} className="flex items-center justify-between text-xs p-2 rounded-lg" style={{background:"rgba(255,255,255,0.03)"}}>
                <span className="font-mono text-[#7A8396]">{k}</span>
                <span className="font-mono font-semibold" style={{color:col}}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl p-5 flex flex-col">
          <h3 className="font-heading font-semibold text-sm text-white mb-4">AMD vs CPU Comparison</h3>
          <div className="grid grid-cols-2 gap-4 flex-1">
            <div className="rounded-2xl p-5 text-center flex flex-col justify-center" style={{background:"rgba(237,28,36,0.08)",border:"1px solid rgba(237,28,36,0.2)"}}>
              <p className="font-mono text-[10px] text-[#ED1C24] mb-2 uppercase tracking-wider">AMD ROCm</p>
              <p className="font-heading font-black text-4xl gradient-amd-text">{gpuStats.tps}</p>
              <p className="font-mono text-[10px] text-[#7A8396] mt-1">tokens/sec</p>
              <p className="font-mono text-[10px] text-[#00D26A] mt-2">{gpuStats.latency} ms latency</p>
            </div>
            <div className="rounded-2xl p-5 text-center flex flex-col justify-center" style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)"}}>
              <p className="font-mono text-[10px] text-[#7A8396] mb-2 uppercase tracking-wider">Host CPU</p>
              <p className="font-heading font-black text-4xl text-[#4A5568]">6.2</p>
              <p className="font-mono text-[10px] text-[#7A8396] mt-1">tokens/sec</p>
              <p className="font-mono text-[10px] text-[#FFC857] mt-2">1,420 ms latency</p>
            </div>
          </div>
          <div className="mt-4 rounded-xl p-4 text-center" style={{background:"rgba(0,210,106,0.08)",border:"1px solid rgba(0,210,106,0.2)"}}>
            <p className="font-mono text-[10px] text-[#7A8396]">AMD Hardware Speedup</p>
            <p className="font-heading font-black text-3xl text-[#00D26A] mt-1">{gpuStats.speedup}× Faster</p>
          </div>
        </div>
      </div>
    </motion.div>
  );

  // ── ANALYTICS ────────────────────────────────────────────────────────────────
  const AnalyticsTab = (
    <motion.div key="analytics" variants={tabVariants} initial="hidden" animate="visible" className="p-6 overflow-y-auto h-full space-y-5">
      <h2 className="font-heading font-bold text-2xl text-white">System Analytics</h2>
      <div className="grid grid-cols-2 gap-4">
        {/* GPU over time */}
        <div className="glass rounded-2xl p-5">
          <h3 className="font-heading font-semibold text-sm text-white mb-4">GPU Inference Speed</h3>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analyticsGpu}>
                <defs>
                  <linearGradient id="aGpu" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ED1C24" stopOpacity={0.3}/><stop offset="95%" stopColor="#ED1C24" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="t" tick={{fontSize:9,fontFamily:"var(--font-mono)",fill:"#7A8396"}}/><YAxis tick={{fontSize:9,fontFamily:"var(--font-mono)",fill:"#7A8396"}}/>
                <Tooltip contentStyle={{background:"rgba(18,22,30,0.95)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:12,fontFamily:"var(--font-mono)",fontSize:11}}/>
                <Area type="monotone" dataKey="tps" name="t/s" stroke="#ED1C24" strokeWidth={2} fill="url(#aGpu)" dot={false}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Task distribution pie */}
        <div className="glass rounded-2xl p-5">
          <h3 className="font-heading font-semibold text-sm text-white mb-4">Task Distribution</h3>
          <div className="flex items-center gap-6">
            <div className="h-44 flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={taskDist} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                    {taskDist.map((d,i)=><Cell key={i} fill={d.color} stroke="transparent"/>)}
                  </Pie>
                  <Tooltip contentStyle={{background:"rgba(18,22,30,0.95)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:12,fontFamily:"var(--font-mono)",fontSize:11}}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {taskDist.map((d,i)=>(
                <div key={i} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{background:d.color}}/>
                  <span className="font-mono text-xs text-[#B8C0CC]">{d.name}</span>
                  <span className="font-mono text-xs font-bold ml-auto" style={{color:d.color}}>{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Memory growth */}
        <div className="glass rounded-2xl p-5">
          <h3 className="font-heading font-semibold text-sm text-white mb-4">Memory Node Growth</h3>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={memGrowth}>
                <defs>
                  <linearGradient id="mGrad2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3AA0FF" stopOpacity={0.3}/><stop offset="95%" stopColor="#3AA0FF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="week" tick={{fontSize:9,fontFamily:"var(--font-mono)",fill:"#7A8396"}}/><YAxis tick={{fontSize:9,fontFamily:"var(--font-mono)",fill:"#7A8396"}}/>
                <Tooltip contentStyle={{background:"rgba(18,22,30,0.95)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:12,fontFamily:"var(--font-mono)",fontSize:11}}/>
                <Area type="monotone" dataKey="nodes" name="Nodes" stroke="#3AA0FF" strokeWidth={2} fill="url(#mGrad2)" dot={{fill:"#3AA0FF",r:4}}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI packs */}
        <div className="glass rounded-2xl p-5">
          <h3 className="font-heading font-semibold text-sm text-white mb-4">AI Extension Packs</h3>
          <div className="space-y-3">
            {packs.map((p,i)=>(
              <div key={p.id} className="flex items-center justify-between p-3 rounded-xl" style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.05)"}}>
                <div>
                  <p className="font-body text-xs font-semibold text-white">{p.name}</p>
                  <p className="font-mono text-[10px] text-[#7A8396]">{p.category}</p>
                </div>
                <motion.button whileTap={{scale:0.95}} onClick={()=>setPacks(prev=>prev.map(x=>x.id===p.id?{...x,installed:!x.installed}:x))}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${p.installed?"":"btn-amd"}`}
                  style={p.installed?{background:"rgba(0,210,106,0.12)",color:"#00D26A",border:"1px solid rgba(0,210,106,0.25)"}:{}}>
                  {p.installed?"Enabled":"Enable"}
                </motion.button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );

  // ── SETTINGS ─────────────────────────────────────────────────────────────────
  const SettingsTab = (
    <motion.div key="settings" variants={tabVariants} initial="hidden" animate="visible" className="p-6 overflow-y-auto h-full space-y-5">
      <h2 className="font-heading font-bold text-2xl text-white">Settings</h2>
      <div className="max-w-2xl space-y-4">
        {[
          { label:"Model", desc:"Inference model loaded via Ollama", value:"Qwen3-8B-Instruct (Q4_K_M)" },
          { label:"ROCm Device", desc:"AMD hardware target", value:"AMD Radeon RX 7900 XTX" },
          { label:"Attention Kernel", desc:"Optimized HIP kernel", value:"FlashAttention-2 (RDNA3)" },
          { label:"Context Window", desc:"Maximum token window", value:"32,768 tokens" },
          { label:"Memory Backend", desc:"Persistent storage engine", value:"SQLite + ChromaDB" },
          { label:"RAG Embeddings", desc:"Vector embedding model", value:"all-MiniLM-L6-v2 (local)" },
        ].map(({label,desc,value},i)=>(
          <motion.div key={i} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:i*0.04}}
            className="glass-sm rounded-2xl p-5 flex items-center justify-between">
            <div>
              <p className="font-heading font-semibold text-sm text-white">{label}</p>
              <p className="font-body text-xs text-[#7A8396] mt-0.5">{desc}</p>
            </div>
            <span className="font-mono text-xs text-[#ED1C24] font-semibold">{value}</span>
          </motion.div>
        ))}
        <div className="glass-sm rounded-2xl p-5">
          <p className="font-heading font-semibold text-sm text-white mb-1">Privacy Mode</p>
          <p className="font-body text-xs text-[#7A8396] mb-3">All inference runs locally. Zero cloud API calls. Zero data leakage.</p>
          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 rounded-full" style={{background:"rgba(0,210,106,0.12)",border:"1px solid rgba(0,210,106,0.25)"}}>
              <span className="font-mono text-[11px] text-[#00D26A] font-semibold">✓ FULL LOCAL MODE</span>
            </div>
            <div className="px-3 py-1.5 rounded-full" style={{background:"rgba(237,28,36,0.12)",border:"1px solid rgba(237,28,36,0.25)"}}>
              <span className="font-mono text-[11px] text-[#ED1C24] font-semibold">✗ CLOUD DISABLED</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  // ── Tab Router ────────────────────────────────────────────────────────────────
  const TAB_CONTENT: Record<NavId, React.ReactNode> = {
    dashboard: DashboardTab,
    workspace: WorkspaceTab,
    memory:    MemoryTab,
    knowledge: KnowledgeTab,
    tasks:     TasksTab,
    agents:    AgentsTab,
    gpu:       GPUTab,
    analytics: AnalyticsTab,
    settings:  SettingsTab,
  };

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="flex h-screen overflow-hidden select-none relative" style={{background:"var(--bg-base)"}}>
      {/* Cursor Glow */}
      <div className="cursor-glow" style={{left:cursorPos.x, top:cursorPos.y}}/>

      {/* Neural BG */}
      <NeuralBg/>

      {/* Sidebar */}
      {Sidebar}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        {TopBar}

        {/* Page content */}
        <div className="flex-1 overflow-hidden relative">
          <AnimatePresence mode="wait">
            {activeNav==="workspace"
              ? <div key="workspace-wrap" className="absolute inset-0 flex">{WorkspaceTab}</div>
              : <div key={activeNav} className="absolute inset-0">{TAB_CONTENT[activeNav]}</div>
            }
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
