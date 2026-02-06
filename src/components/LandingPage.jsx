import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Mic, FileText, Search, Activity, ArrowRight, Zap, Check,
  Database, Globe, FileCheck, Cpu, Layout, Lock, Smartphone, Command,
  ChevronDown, X, Play, Sparkles, Wand2, ListFilter, Bot, Workflow,
  BookOpen, Library, ClipboardCheck, ShieldCheck, CreditCard, Star,
  Users, Building, CheckCircle2, Menu, XCircle, Heart, Brain, Lightbulb
} from 'lucide-react';

// --- ADVANCED ANIMATION HOOKS ---

const useIntersectionObserver = (options = {}) => {
  const elementRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.1, ...options });

    if (elementRef.current) observer.observe(elementRef.current);
    return () => observer.disconnect();
  }, []);

  return [elementRef, isVisible];
};

const FadeIn = ({ children, delay = 0, direction = 'up', className = "" }) => {
  const [ref, isVisible] = useIntersectionObserver();

  const transforms = {
    up: 'translate-y-12',
    down: '-translate-y-12',
    left: 'translate-x-12',
    right: '-translate-x-12',
    none: 'scale-95'
  };

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 cubic-bezier(0.16, 1, 0.3, 1) transform ${isVisible ? 'opacity-100 translate-x-0 translate-y-0 scale-100' : `opacity-0 ${transforms[direction]}`} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const Counter = ({ end, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const [ref, isVisible] = useIntersectionObserver();

  useEffect(() => {
    if (!isVisible) return;

    let startTime;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
  }, [isVisible, end, duration]);

  return <span ref={ref}>{count}</span>;
};

// --- CONTENT DATA: THE "HUMANE" APPROACH ---

const problemStatements = [
  { text: "Documentation Burnout", icon: Activity, color: "red" },
  { text: "Cognitive Overload", icon: Brain, color: "orange" },
  { text: "Fragmentation", icon: Layout, color: "purple" }
];

const workflows = [
  {
    id: "routine",
    title: "Flow State for Normals",
    icon: Zap,
    color: "amber",
    bsColor: "border-amber-500",
    bgGradient: "from-amber-500/20 to-orange-500/5",
    desc: "70% of your day is routine. Why waste mental energy on it? Clear these cases in seconds with one click.",
    steps: ["Auto-Select Protocol", "Insert 'Perfect Normal'", "Instant Sign-Off"],
    visual: (
      <div className="flex flex-col gap-3 h-full justify-center px-4 relative">
        <div className="absolute inset-0 bg-amber-500/5 blur-xl"></div>
        <div className="p-3 bg-slate-900 border border-slate-700/50 rounded-lg flex justify-between items-center opacity-70 relative z-10">
          <span className="text-xs text-slate-400">Study: Abdomen Complete</span>
          <CheckCircle2 size={14} className="text-green-500" />
        </div>
        <div className="p-4 bg-gradient-to-r from-amber-500/20 to-orange-500/10 border border-amber-500/30 rounded-xl flex items-center gap-3 cursor-pointer shadow-[0_0_25px_rgba(245,158,11,0.2)] animate-pulse relative z-10 hover:scale-105 transition-transform">
          <Zap size={20} className="text-amber-400 fill-amber-400/20" />
          <div>
            <span className="text-sm font-bold text-amber-200 block">Insert Normal Findings</span>
            <span className="text-[10px] text-amber-400/70">Saves ~3 mins</span>
          </div>
        </div>
      </div>
    )
  },
  {
    id: "rescue",
    title: "The 'Messy Dictation' Savior",
    icon: Wand2,
    color: "pink",
    bsColor: "border-pink-500",
    bgGradient: "from-pink-500/20 to-rose-500/5",
    desc: "Tired at 3 AM? Mumble your thoughts. We'll structure them into a pristine report automatically.",
    steps: ["Dictate Freely", "AI Structures Logic", "Review & Sign"],
    visual: (
      <div className="flex flex-col gap-2 h-full justify-center px-4 relative">
        <div className="p-2 bg-slate-800/80 rounded-lg border border-dashed border-slate-600 text-[10px] text-slate-500 italic relative z-10">
          "uh liver looks ok tiny cyst segment 8 gallbladder has sludge no stones"
        </div>
        <div className="flex justify-center relative z-10">
          <div className="w-[1px] h-6 bg-gradient-to-b from-slate-600 to-pink-500"></div>
        </div>
        <div className="p-3 bg-gradient-to-br from-pink-500/10 to-purple-600/10 border border-pink-500/30 rounded-xl shadow-lg relative z-10 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-2 border-b border-pink-500/20 pb-1">
            <Wand2 size={12} className="text-pink-400" />
            <span className="text-[10px] font-bold text-pink-300 uppercase tracking-wider">Restructured</span>
          </div>
          <div className="text-[10px] text-slate-300 space-y-1">
            <div className="flex justify-between"><span className="text-white font-bold">LIVER:</span> <span>Simple cyst, Seg 8.</span></div>
            <div className="flex justify-between"><span className="text-white font-bold">GALLBLADDER:</span> <span>Sludge present. No cholelithiasis.</span></div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: "complex",
    title: "Complexity Without Chaos",
    icon: Brain,
    color: "cyan",
    bsColor: "border-cyan-500",
    bgGradient: "from-cyan-500/20 to-blue-500/5",
    desc: "Don't toggle windows. Access guidelines, measurements, and grading systems right where you work.",
    steps: ["Spot Pathology", "Sidebar Lookup", "Insert Evidence"],
    visual: (
      <div className="flex gap-2 h-full items-center px-4 relative">
        <div className="w-2/3 bg-slate-900 border border-slate-700/50 rounded-lg p-3 relative z-10 opacity-50 blur-[1px]">
          <div className="h-2 w-full bg-slate-700 rounded mb-2"></div>
          <div className="h-2 w-3/4 bg-slate-700 rounded"></div>
        </div>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 w-40 bg-gradient-to-b from-[#0a0f1c] to-[#02040a] border border-cyan-500/40 rounded-xl p-3 shadow-[0_0_30px_rgba(6,182,212,0.15)] z-20 transform scale-105">
          <div className="text-[10px] font-bold text-cyan-400 uppercase mb-2 flex items-center justify-between">
            TI-RADS <Search size={10} />
          </div>
          <div className="space-y-1">
            <div className="p-1.5 bg-cyan-950/50 border border-cyan-500/20 rounded text-[9px] text-cyan-200">
              TR3: Mild Suspicion
            </div>
            <div className="p-1.5 bg-cyan-500/20 border border-cyan-400/50 rounded text-[9px] text-cyan-100 font-bold shadow-sm">
              TR4: Moderate Suspicion
            </div>
            <div className="p-1.5 bg-cyan-950/50 border border-cyan-500/20 rounded text-[9px] text-cyan-200">
              TR5: High Suspicion
            </div>
          </div>
        </div>
      </div>
    )
  }
];

// --- MAIN COMPONENT ---

const LandingPage = () => {
  const navigate = useNavigate();
  const [activeWorkflow, setActiveWorkflow] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => setOpenFaq(openFaq === index ? null : index);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const currentFlow = workflows[activeWorkflow];

  return (
    <div className="min-h-screen bg-[#02040a] text-slate-300 font-sans selection:bg-indigo-500/30 overflow-x-hidden">

      {/* --- VIVID BACKGROUND --- */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* More vibrant, saturated blobs for that "holographic" feel */}
        <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-indigo-600/30 rounded-full mix-blend-screen filter blur-[120px] animate-blob"></div>
        <div className="absolute top-[30%] right-[-10%] w-[60vw] h-[60vw] bg-cyan-500/20 rounded-full mix-blend-screen filter blur-[120px] animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[70vw] h-[70vw] bg-fuchsia-600/20 rounded-full mix-blend-screen filter blur-[120px] animate-blob animation-delay-4000"></div>
        {/* Grid overlay for tech texture */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]"></div>
      </div>

      {/* --- NAVBAR --- */}
      <nav className={`fixed w-full z-100 top-0 transition-all duration-500 border-b ${scrolled ? 'bg-[#02040a]/80 backdrop-blur-xl border-white/5 py-3 shadow-lg shadow-indigo-500/5' : 'bg-transparent border-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo(0, 0)}>
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500 blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-500" />
              <div className="relative p-2 bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-xl border border-white/10 shadow-lg group-hover:border-indigo-500/50 transition-colors">
                <Activity className="text-cyan-400 group-hover:text-cyan-300 transition-colors" size={20} />
              </div>
            </div>
            <span className="text-xl font-bold text-white tracking-tight">aiRAD<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400"> -Reporting, Redefined.</span></span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            {['Workflows', 'Features', 'Pricing'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-white transition-colors duration-300 relative group py-2">
                {item}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-indigo-500 transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <button onClick={() => navigate('/auth')} className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Log In</button>
            <button
              onClick={() => navigate('/auth')}
              className="group relative px-6 py-2.5 rounded-full bg-white text-black font-semibold text-sm transition-all hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] hover:-translate-y-0.5"
            >
              <span className="relative z-10 flex items-center gap-2">Launch Console <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" /></span>
            </button>
          </div>

          <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-[#02040a]/95 backdrop-blur-xl border-b border-white/10 p-6 flex flex-col gap-6 animate-fade-in-up">
            <a href="#workflows" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-white">Workflows</a>
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-white">Features</a>
            <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-white">Pricing</a>
            <button onClick={() => navigate('/auth')} className="w-full py-3 bg-indigo-600 rounded-lg text-white font-bold">Launch Console</button>
          </div>
        )}
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative z-10 pt-48 pb-32 px-6 flex flex-col items-center justify-center text-center min-h-[90vh]">
        {/* Floating Abstract Elements */}
        <div className="absolute top-1/4 left-10 w-24 h-24 bg-purple-500/20 rounded-full blur-xl animate-blob hidden lg:block"></div>
        <div className="absolute bottom-1/4 right-10 w-32 h-32 bg-cyan-500/20 rounded-full blur-xl animate-blob animation-delay-2000 hidden lg:block"></div>

        <FadeIn delay={0}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-cyan-300 text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-colors backdrop-blur-md mb-8 shadow-[0_0_20px_rgba(6,182,212,0.1)]">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
            <span>The AI Assistant for Radiologists</span>
          </div>
        </FadeIn>

        <FadeIn delay={200}>
          <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter mb-8 leading-[1.1] drop-shadow-2xl">
            Reclaim Your <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 animate-shimmer bg-[size:200%_auto]">
              Peace of Mind
            </span>
          </h1>
        </FadeIn>

        <FadeIn delay={400}>
          <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed font-light">
            Radiology is stressful enough. Your software shouldn't add to it. <br />
            Meet the first workspace designed to <span className="text-slate-100 font-medium border-b border-indigo-500/50">reduce cognitive load</span> and <span className="text-slate-100 font-medium border-b border-emerald-500/50">eliminate burnout</span>.
          </p>
        </FadeIn>

        <FadeIn delay={500} className="flex gap-4 md:gap-8 justify-center mb-12">
          {problemStatements.map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-sm font-medium text-slate-500">
              <XCircle size={16} className={`text-${item.color}-500/50`} /> <span className="line-through decoration-slate-600">{item.text}</span>
            </div>
          ))}
        </FadeIn>

        <FadeIn delay={600} className="flex flex-col sm:flex-row items-center gap-6">
          <button
            onClick={() => navigate('/auth')}
            className="group relative px-8 py-4 bg-white text-black rounded-2xl font-bold text-lg overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_50px_-10px_rgba(255,255,255,0.3)]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative flex items-center gap-3">Start Free Trial <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /></span>
          </button>
          <button className="px-8 py-4 rounded-2xl font-bold text-white text-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center gap-3 hover:border-white/20 backdrop-blur-sm">
            <Play size={20} className="fill-white text-white" /> See It In Action
          </button>
        </FadeIn>
      </section>

      {/* --- STATS BAR (With "Alive" effects) --- */}
      <FadeIn delay={800}>
        <div className="relative z-10 border-y border-white/5 bg-gradient-to-r from-slate-900/50 via-slate-800/50 to-slate-900/50 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            <StatItem value={<Counter end={300} />} label="Findings Loaded" suffix="+" color="indigo" />
            <StatItem value={<Counter end={99} />} label="Accuracy Rate" suffix="%" color="emerald" />
            <StatItem value={<Counter end={40} />} label="Time Recaptured" suffix="%" color="cyan" />
            <StatItem value="0s" label="Setup Time" color="fuchsia" />
          </div>
        </div>
      </FadeIn>

      {/* --- VISUAL WORKFLOW ENGINE (Vibrant & Interactive) --- */}
      <section id="workflows" className="py-32 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <FadeIn>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 text-slate-400 text-xs font-bold uppercase tracking-wider mb-4">
                <Brain size={14} /> Cognitive Offloading
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Workflows That <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-orange-400">Think Like You</span></h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">Don't adapt to the software. We've built specialized modes for every mental state you experience during a shift.</p>
            </div>
          </FadeIn>

          <div className="grid lg:grid-cols-12 gap-8 items-stretch min-h-[550px]">
            {/* Left: Menu */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              {workflows.map((flow, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveWorkflow(idx)}
                  className={`text-left p-6 rounded-2xl border transition-all duration-500 flex items-center gap-4 group relative overflow-hidden ${activeWorkflow === idx
                    ? `bg-slate-900/40 ${flow.bsColor} ring-1 ring-white/10 shadow-[0_0_30px_-5px_rgba(0,0,0,0.5)]` // Active state
                    : 'bg-[#0a0f1c]/30 border-white/5 hover:bg-slate-800/30 hover:border-white/10' // Inactive state
                    }`}
                >
                  {/* Active Gradient Background */}
                  {activeWorkflow === idx && <div className={`absolute inset-0 bg-gradient-to-r ${flow.bgGradient} opacity-20`}></div>}

                  <div className={`relative z-10 p-3 rounded-xl bg-slate-950 border border-white/10 shadow-inner group-hover:scale-110 transition-transform duration-300 ${activeWorkflow === idx ? `text-${flow.color}-400` : 'text-slate-500'}`}>
                    <flow.icon size={26} />
                  </div>
                  <div className="relative z-10">
                    <h3 className={`font-bold text-lg mb-1 ${activeWorkflow === idx ? 'text-white' : 'text-slate-400'}`}>{flow.title}</h3>
                    <div className={`h-0.5 w-12 bg-gradient-to-r from-${flow.color}-500 to-transparent transition-all duration-500 ${activeWorkflow === idx ? 'opacity-100 max-w-full' : 'opacity-0 w-0'}`}></div>
                  </div>
                </button>
              ))}
            </div>

            {/* Right: Visual Stage */}
            <div className="lg:col-span-8 bg-[#0a0f1c]/40 backdrop-blur-xl rounded-[2.5rem] border border-white/10 p-10 relative overflow-hidden flex flex-col shadow-2xl items-center justify-center group">
              {/* Background Ambient Glow */}
              <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-${currentFlow.color}-600/10 blur-[150px] rounded-full pointer-events-none transition-colors duration-1000`}></div>

              <div className="relative z-10 w-full h-full flex flex-col md:flex-row gap-12 items-center justify-center">
                {/* Explained Steps */}
                <div className="space-y-8 flex-1">
                  <h3 className="text-2xl font-bold text-white mb-2">{currentFlow.title}</h3>
                  <p className="text-slate-400 text-lg leading-relaxed mb-8 border-l-2 border-white/10 pl-4">{currentFlow.desc}</p>

                  <div className="space-y-4">
                    {currentFlow.steps.map((step, i) => (
                      <div key={i} className="flex gap-4 items-center animate-fade-in-up" style={{ animationDelay: `${i * 150}ms` }}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm bg-slate-900 border border-white/10 text-${currentFlow.color}-400 shadow-[0_0_15px_-5px_rgba(255,255,255,0.1)]`}>
                          {i + 1}
                        </div>
                        <p className="text-slate-200 font-medium text-lg">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rich Visual Mockup */}
                <div className="flex-1 w-full max-w-sm bg-[#02040a] rounded-2xl border border-white/10 p-2 shadow-2xl animate-fade-in-up md:ml-8 transform group-hover:scale-[1.02] transition-transform duration-500">
                  <div className="h-28 absolute -top-10 -right-10 w-28 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl"></div>
                  <div className="h-8 bg-slate-900/80 rounded-t-xl flex items-center px-4 gap-2 mb-2 border-b border-white/5 justify-between">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50"></div>
                    </div>
                    <div className="text-[10px] text-slate-600 font-mono">AI_ENGINE_ACTIVE</div>
                  </div>
                  <div className="h-64 bg-slate-950 rounded-lg overflow-hidden p-0 relative border border-white/5">
                    {currentFlow.visual}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURE DEEP DIVES (Holographic & Detail-Oriented) --- */}
      <section id="features" className="relative z-10 space-y-40 py-12">
        {/* Feature 1: Dual Mode AI */}
        <FeatureSection
          align="left"
          icon={Wand2}
          color="pink"
          title="Your Silent Partner"
          subtitle="Dual-Mode AI Assistant"
          desc="You shouldn't have to correct your software. It should correct you. Our AI silently fixes grammar, lateralities, and structure in the background, so you always look your best."
          bullets={[
            "Auto-Grammar: Never worry about typos again.",
            "Structure Rescue: Turns stream-of-consciousness into reports.",
            "Learning Mode: It adapts to YOUR style over time."
          ]}
          visual={
            <div className="bg-[#0f172a] rounded-2xl border border-pink-500/30 p-1 shadow-[0_0_50px_-10px_rgba(236,72,153,0.2)] relative transform rotate-1 hover:rotate-0 transition-all duration-500 group">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-transparent to-transparent opacity-50 rounded-2xl"></div>
              <div className="bg-slate-950 rounded-xl p-6 relative overflow-hidden">
                <div className="flex gap-3 mb-6">
                  <div className="px-3 py-1 bg-pink-500/20 border border-pink-500/30 rounded-full text-xs font-bold text-pink-300 flex items-center gap-2"><Sparkles size={12} /> AI Active</div>
                  <div className="px-3 py-1 bg-slate-800 rounded-full text-xs text-slate-500">v2.4.0</div>
                </div>

                <div className="space-y-4 font-mono text-sm">
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg opacity-60">
                    <span className="text-red-400 block text-xs mb-1">INPUT (Oral)</span>
                    <span className="text-slate-400 strike-through">"liver is massive... 20 cm..."</span>
                  </div>
                  <div className="flex justify-center"><ArrowRight size={16} className="text-pink-500 rotate-90" /></div>
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg shadow-lg">
                    <span className="text-emerald-400 block text-xs mb-1">OUTPUT (Report)</span>
                    <span className="text-white">"Hepatomegaly is present, measuring 20 cm in craniocaudal dimension."</span>
                  </div>
                </div>
              </div>
            </div>
          }
        />

        {/* Feature 2: Data Extraction */}
        <FeatureSection
          align="right"
          icon={ShieldCheck}
          color="emerald"
          title="The Safety Net"
          subtitle="Intelligent Data Verification"
          desc="Anxiety about missing a finding? Gone. aiRAD scans your report in real-time, extracting measurements and critical findings into a side panel for a final 'sanity check' before signing."
          bullets={[
            "The 'Sidecar': A real-time summary of your report.",
            "Measurement Isolation: Checks all numbers for consistency.",
            "Critical Alert: Highlights 'acute' findings automatically."
          ]}
          visual={
            <div className="h-80 flex items-center justify-center gap-6 relative">
              {/* Blurred Report */}
              <div className="w-56 h-64 bg-slate-800/40 border border-white/10 rounded-xl p-4 blur-[2px] transform -rotate-3 flex flex-col gap-3 opacity-50">
                <div className="h-2 w-1/3 bg-slate-600 rounded"></div>
                <div className="h-2 w-full bg-slate-600 rounded"></div>
                <div className="h-2 w-5/6 bg-slate-600 rounded"></div>
                <div className="h-2 w-4/5 bg-slate-600 rounded"></div>
              </div>

              {/* Connection Link */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 bg-emerald-500 rounded-full p-2 shadow-[0_0_20px_rgba(16,185,129,0.5)]">
                <ArrowRight className="text-white" size={20} />
              </div>

              {/* The "Safety Net" Card */}
              <div className="w-64 bg-[#052e16]/80 border border-emerald-500/50 rounded-xl p-5 shadow-[0_0_40px_-10px_rgba(16,185,129,0.3)] transform rotate-2 backdrop-blur-xl relative z-20 hover:scale-105 transition-transform">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-teal-400"></div>
                <div className="text-xs font-bold text-emerald-400 uppercase mb-4 flex items-center gap-2"><ClipboardCheck size={14} /> Verified Data</div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs text-slate-300 border-b border-emerald-500/20 pb-2">
                    <span>Liver Lesion</span> <span className="bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-mono">2.4 cm</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-slate-300 border-b border-emerald-500/20 pb-2">
                    <span>Gallstones</span> <span className="bg-red-500/20 text-red-300 px-1.5 py-0.5 rounded font-mono font-bold">YES</span>
                  </div>
                </div>
                <div className="mt-4 pt-2 text-center">
                  <span className="text-[10px] text-emerald-500/70 font-bold tracking-widest uppercase">No Discrepancies</span>
                </div>
              </div>
            </div>
          }
        />

        {/* Feature 3: Knowledge Base */}
        <FeatureSection
          align="left"
          icon={Library}
          color="cyan"
          title="Instant Recall"
          subtitle="Integrated Knowledge Base"
          desc="Stop Googling guidelines on your phone. Access Fleischner criteria, TI-RADS grading, and vascular normal limits instantly—without ever leaving your report."
          bullets={[
            "Context Aware: It knows you're dictating 'Thyroid' and suggests TI-RADS.",
            "One-Click Insert: Paste the grading table directly into your impression.",
            "Pre-Built Findings: Large number of built-in findings are readily available with one-click."
          ]}
          visual={
            <div className="h-72 bg-[#0a0f1c] rounded-2xl border border-cyan-500/40 p-1 relative overflow-hidden shadow-[0_0_30px_rgba(6,182,212,0.15)] group">
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
              <div className="bg-slate-950 rounded-xl h-full p-6 relative z-10 flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <div className="px-3 py-1 bg-cyan-900/40 border border-cyan-500/30 rounded-lg text-xs font-mono text-cyan-300 flex items-center gap-2"><Globe size={12} /> REF_DB_LOCAL</div>
                  <Search size={16} className="text-slate-500" />
                </div>

                <div className="space-y-3 flex-1 overflow-hidden mask-image-b">
                  <div className="p-3 bg-cyan-500/10 rounded-lg border border-cyan-500/20 backdrop-blur-sm group-hover:bg-cyan-500/20 transition-colors cursor-pointer">
                    <div className="text-sm font-bold text-cyan-200 flex justify-between">ACR TI-RADS (2017)</div>
                    <div className="text-xs text-cyan-400 mt-1">Thyroid Nodule Grading System</div>
                  </div>
                  <div className="p-3 bg-white/5 rounded-lg border border-white/5 opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
                    <div className="text-sm font-bold text-slate-300">Fleischner Criteria</div>
                    <div className="text-xs text-slate-500 mt-1">Pulmonary Nodule Guidelines</div>
                  </div>
                  <div className="p-3 bg-white/5 rounded-lg border border-white/5 opacity-60">
                    <div className="text-sm font-bold text-slate-300">Liver LI-RADS</div>
                  </div>
                </div>
              </div>
            </div>
          }
        />
      </section>

      {/* --- COMPARISON (Refined) --- */}
      <section id="comparison" className="py-24 relative z-10">
        <div className="absolute inset-0 bg-white/[0.02] -skew-y-1 transform origin-top-left z-0"></div>
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-white mb-4">Don't Settle for "Old School"</h2>
              <p className="text-slate-400 text-lg">See why aiRAD is replacing legacy dictation systems nationwide.</p>
            </div>
          </FadeIn>

          <FadeIn delay={200}>
            <div className="bg-[#0a0f1c] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
              <div className="grid grid-cols-3 bg-white/[0.03] p-6 border-b border-white/5 text-xs font-bold uppercase tracking-wider">
                <div className="text-slate-500 pl-4">The Struggle</div>
                <div className="text-center text-slate-500">Legacy VR</div>
                <div className="text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 font-extrabold">aiRAD Experience</div>
              </div>

              <CompareRow feature="Access" oldWay="Tethered to Hospital PC" newWay="Work from Anywhere (Web)" />
              <CompareRow feature="Mistakes" oldWay="You fix the AI's typos" newWay="AI fixes YOUR thoughts" />
              <CompareRow feature="Cost" oldWay="$10,000+ Contracts" newWay="Free for Residents(10 Reports/month)" />
              <CompareRow feature="Integration" oldWay="IT Dept. Nightmare" newWay="Instant Setup (No IT)" />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* --- FAQs (Accordion Style) --- */}
      <section className="py-24 relative z-10">
        <div className="max-w-3xl mx-auto px-6">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Common Questions</h2>
            </div>
          </FadeIn>

          <FadeIn className="space-y-4">
            <FaqItem
              question="Is patient data actually secure?"
              answer="Yes. We use a 'Local-First' architecture. Your voice is processed in your browser, not the cloud. The text report is encrypted before it ever touches a database."
              isOpen={openFaq === 0} onClick={() => toggleFaq(0)}
            />
            <FaqItem
              question="Do I need a special microphone?"
              answer="No. While a SpeechMike is supported, our noise-cancellation AI makes even a standard laptop microphone sound studio-quality."
              isOpen={openFaq === 1} onClick={() => toggleFaq(1)}
            />
            <FaqItem
              question="Can I bring my existing macros?"
              answer="Yes. We have a 'Macros Modal'through which you can add your own macros."
              isOpen={openFaq === 2} onClick={() => toggleFaq(2)}
            />
          </FadeIn>
        </div>
      </section>

      {/* --- CTA (Final Push) --- */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-indigo-900/20"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/30 blur-[150px] rounded-full pointer-events-none"></div>

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <FadeIn>
            <h2 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter">Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">Flow?</span></h2>
            <p className="text-xl text-indigo-200 mb-10 max-w-2xl mx-auto">Join thousands of radiologists who have rediscovered the joy of diagnostics.</p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button onClick={() => navigate('/auth')} className="px-10 py-5 bg-white text-indigo-950 rounded-2xl font-bold text-xl shadow-[0_0_50px_rgba(255,255,255,0.4)] hover:scale-105 transition-transform">Get Started Now</button>
            </div>
            {/* <p className="mt-8 text-sm text-indigo-400/60 font-medium tracking-wide uppercase">No credit card required • Cancel anytime</p> */}
          </FadeIn>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="border-t border-white/5 bg-[#000000] pt-16 pb-12 relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-slate-500 text-sm font-medium">
            &copy; 2026 aiRAD Systems. <Heart size={12} className="inline text-red-500 mx-1" /> for Medicine.
          </div>
          <div className="flex gap-8 text-sm text-slate-500 font-medium">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

// --- SUB-COMPONENTS (With enhanced styling) ---

const StatItem = ({ value, label, suffix = "", color = "indigo" }) => {
  const colors = {
    indigo: 'from-indigo-400 to-indigo-600',
    emerald: 'from-emerald-400 to-emerald-600',
    cyan: 'from-cyan-400 to-cyan-600',
    fuchsia: 'from-fuchsia-400 to-fuchsia-600'
  };

  return (
    <div className="hover:-translate-y-1 transition-transform duration-300 group">
      <div className={`text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b ${colors[color]} mb-3 tracking-tight drop-shadow-sm`}>
        {value}{suffix}
      </div>
      <div className="text-xs md:text-sm text-slate-500 uppercase tracking-widest font-bold group-hover:text-white transition-colors">{label}</div>
    </div>
  );
};

const FeatureSection = ({ align, icon: Icon, color, title, subtitle, desc, bullets, visual }) => {
  const isRight = align === 'right';
  const colors = {
    indigo: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    cyan: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    pink: 'text-pink-400 bg-pink-500/10 border-pink-500/20',
  };

  return (
    <section className="relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className={`flex flex-col lg:flex-row gap-20 items-center ${isRight ? 'lg:flex-row-reverse' : ''}`}>
          <FadeIn direction={isRight ? 'left' : 'right'} className="flex-1">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 border ${colors[color]} backdrop-blur-sm shadow-[0_0_30px_-10px_rgba(255,255,255,0.1)]`}>
              <Icon size={32} />
            </div>
            <h3 className={`text-sm font-bold uppercase tracking-wider mb-2 text-${color}-400`}>{subtitle}</h3>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">{title}</h2>
            <p className="text-lg text-slate-400 mb-8 leading-relaxed font-light">{desc}</p>
            <ul className="space-y-4">
              {bullets.map((bullet, i) => (
                <li key={i} className="flex items-start gap-4 group">
                  <div className={`mt-1.5 w-1.5 h-1.5 rounded-full bg-${color}-400 shrink-0 group-hover:scale-150 transition-transform`} />
                  <span className="text-slate-300 group-hover:text-white transition-colors">{bullet}</span>
                </li>
              ))}
            </ul>
          </FadeIn>
          <FadeIn delay={200} direction={isRight ? 'right' : 'left'} className="flex-1 w-full">
            <div className="relative group perspective-1000">
              {/* Glow behind visual */}
              <div className={`absolute -inset-4 bg-gradient-to-r from-${color}-500 to-blue-600 rounded-[2rem] blur-xl opacity-20 group-hover:opacity-40 transition duration-1000`}></div>
              <div className="relative">{visual}</div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};

const CompareRow = ({ feature, oldWay, newWay }) => (
  <div className="grid grid-cols-3 p-6 border-b border-white/5 hover:bg-white/[0.02] transition-colors items-center group">
    <div className="font-bold text-slate-200 pl-4">{feature}</div>
    <div className="text-center text-slate-500 text-sm flex justify-center items-center gap-2 group-hover:text-slate-400 transition-colors">
      <X size={14} className="text-red-500/50 group-hover:text-red-500 transition-colors" /> {oldWay}
    </div>
    <div className="text-center text-indigo-300 font-medium text-sm flex justify-center items-center gap-2 shadow-indigo-500/20">
      <Check size={14} className="text-emerald-500 group-hover:text-emerald-400 transition-colors" /> {newWay}
    </div>
  </div>
);

const FaqItem = ({ question, answer, isOpen, onClick }) => (
  <div className={`border rounded-2xl overflow-hidden transition-all duration-300 ${isOpen ? 'bg-[#0f172a] border-indigo-500/30 shadow-lg' : 'bg-[#02040a] border-white/5 hover:border-white/10'}`}>
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between p-6 text-left"
    >
      <span className={`font-bold text-lg transition-colors ${isOpen ? 'text-white' : 'text-slate-300'}`}>{question}</span>
      <ChevronDown size={20} className={`text-slate-500 transition-transform duration-300 ${isOpen ? 'rotate-180 text-indigo-400' : ''}`} />
    </button>
    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
      <p className="p-6 pt-0 text-slate-400 text-base leading-relaxed border-t border-white/5 font-light">
        {answer}
      </p>
    </div>
  </div>
);

export default LandingPage;