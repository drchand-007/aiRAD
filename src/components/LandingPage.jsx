import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Mic, FileText, Search, Activity, ArrowRight, Zap, Check, 
  Database, Globe, FileCheck, Cpu, Layout, Lock, Smartphone, Command, 
  ChevronDown, X, Play, Sparkles, Wand2, ListFilter, Bot, Workflow,
  BookOpen, Library, ClipboardCheck, ShieldCheck, CreditCard, Star,
  Users, Building, CheckCircle2
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);
  const [activeWorkflow, setActiveWorkflow] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  const toggleFaq = (index) => setOpenFaq(openFaq === index ? null : index);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- WORKFLOW DATA ---
  const workflows = [
    {
      id: "routine",
      title: "The Routine Normal",
      icon: Zap,
      color: "amber",
      desc: "For the 70% of cases that are completely normal.",
      steps: ["Select 'Abdomen US' Template", "Click 'Insert Normal Macros'", "Sign & Export"],
      visual: (
        <div className="flex flex-col gap-3 h-full justify-center">
           <div className="p-3 bg-slate-900 border border-slate-700 rounded-lg flex justify-between items-center opacity-50">
              <span className="text-xs text-slate-400">Template: Abdomen US</span>
              <ChevronDown size={14} className="text-slate-500"/>
           </div>
           <div className="p-3 bg-amber-900/20 border border-amber-500/50 rounded-lg flex items-center gap-3 cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.2)] animate-pulse">
              <Zap size={16} className="text-amber-400"/>
              <span className="text-sm font-bold text-amber-200">Insert Normal Findings</span>
           </div>
           <div className="p-4 bg-slate-900 border border-slate-700 rounded-lg text-[10px] text-slate-400 font-mono leading-relaxed">
              LIVER: Normal size and echotexture... <br/>
              GALLBLADDER: No stones or sludge... <br/>
              PANCREAS: Unremarkable...
           </div>
        </div>
      )
    },
    {
      id: "rescue",
      title: "Messy Draft Rescue",
      icon: Wand2,
      color: "pink",
      desc: "Turn unstructured dictation into a polished report.",
      steps: ["Paste rough voice notes", "Click 'AI Fix Report'", "Generate Smart Template"],
      visual: (
        <div className="flex flex-col gap-2 h-full">
           <div className="p-2 bg-slate-800 rounded border border-white/5 text-[10px] text-slate-500 italic">
              "uh liver is ok but gallbladder has a 5mm stone and wall is thick 4mm"
           </div>
           <div className="flex justify-center">
              <ArrowRight size={16} className="text-pink-500 rotate-90 my-1"/>
           </div>
           <div className="p-3 bg-pink-900/20 border border-pink-500/30 rounded-lg shadow-lg">
              <div className="flex items-center gap-2 mb-2 border-b border-pink-500/20 pb-1">
                 <Wand2 size={12} className="text-pink-400"/>
                 <span className="text-xs font-bold text-pink-300">AI Correction</span>
              </div>
              <div className="text-[10px] text-slate-300">
                 <span className="text-white font-bold">GALLBLADDER:</span> Cholelithiasis noted. <br/>
                 - Stone Size: 5mm <br/>
                 - Wall Thickness: 4mm (Thickened)
              </div>
           </div>
        </div>
      )
    },
    {
      id: "complex",
      title: "Complex Analysis",
      icon: Search,
      color: "cyan",
      desc: "Deep research without context switching.",
      steps: ["Identify Pathology", "AI Sidebar: 'TI-RADS'", "Insert Grading Table"],
      visual: (
        <div className="flex gap-2 h-full">
           <div className="w-2/3 bg-slate-900 border border-slate-700 rounded-lg p-2">
              <div className="h-2 w-full bg-slate-700 rounded mb-2"></div>
              <div className="h-2 w-3/4 bg-slate-700 rounded"></div>
           </div>
           <div className="w-1/3 bg-cyan-950/30 border-l border-cyan-500/30 p-2 flex flex-col gap-2">
              <div className="text-[8px] font-bold text-cyan-400 uppercase">Knowledge Base</div>
              <div className="p-1 bg-cyan-500/10 border border-cyan-500/20 rounded text-[8px] text-cyan-200">
                 TI-RADS 4 <br/> Moderately Suspicious
              </div>
              <div className="p-1 bg-cyan-500/10 border border-cyan-500/20 rounded text-[8px] text-cyan-200">
                 Risk: 5-20%
              </div>
           </div>
        </div>
      )
    },
    {
      id: "qa",
      title: "Rapid QA Check",
      icon: ListFilter,
      color: "emerald",
      desc: "Verify numbers and findings instantly.",
      steps: ["AI Scans Report", "Extracts 'Key Findings'", "Cross-check images"],
      visual: (
        <div className="relative h-full flex items-center justify-center">
           <div className="absolute inset-0 bg-slate-900 border border-slate-700 rounded-lg p-3 blur-[2px] opacity-50">
              <div className="h-1 w-full bg-slate-600 mb-1"></div>
              <div className="h-1 w-full bg-slate-600 mb-1"></div>
              <div className="h-1 w-full bg-slate-600"></div>
           </div>
           <div className="relative z-10 w-4/5 bg-emerald-950/90 backdrop-blur-md border border-emerald-500/50 rounded-xl p-3 shadow-2xl">
              <div className="flex items-center gap-2 mb-2">
                 <ClipboardCheck size={14} className="text-emerald-400"/>
                 <span className="text-xs font-bold text-white">Extraction</span>
              </div>
              <div className="space-y-1">
                 <div className="flex justify-between text-[10px] text-emerald-100 border-b border-white/10 pb-1">
                    <span>Ovary</span> <span>4.2 x 3.1 cm</span>
                 </div>
                 <div className="flex justify-between text-[10px] text-emerald-100">
                    <span>Mass</span> <span className="font-bold text-white">Solid</span>
                 </div>
              </div>
           </div>
        </div>
      )
    },
    {
      id: "mobile",
      title: "Mobile Sign-Off",
      icon: Smartphone,
      color: "indigo",
      desc: "Approve reports while moving between wards.",
      steps: ["Open Mobile Web", "Review Summary", "Digital Signature"],
      visual: (
        <div className="h-full flex justify-center items-center">
           <div className="w-24 h-40 bg-slate-950 border-2 border-slate-700 rounded-[1rem] p-2 flex flex-col justify-between relative shadow-xl">
              <div className="absolute top-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-slate-800 rounded-full"></div>
              <div className="mt-4 space-y-1">
                 <div className="h-1 w-full bg-indigo-500/20 rounded"></div>
                 <div className="h-1 w-3/4 bg-indigo-500/20 rounded"></div>
                 <div className="h-1 w-full bg-indigo-500/20 rounded"></div>
              </div>
              <div className="w-full py-1 bg-indigo-600 rounded text-[6px] text-center text-white font-bold">
                 Sign Report
              </div>
           </div>
        </div>
      )
    }
  ];

  const currentFlow = workflows[activeWorkflow];

  return (
    <div className="min-h-screen bg-[#02040a] text-slate-300 font-sans selection:bg-indigo-500/30 overflow-x-hidden scroll-smooth">
      
      {/* --- ATMOSPHERIC BACKGROUND --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
          {/* Ultrasound Texture */}
          <div 
            className="absolute inset-0 z-0 opacity-[0.05] mix-blend-screen bg-repeat pointer-events-none"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1559757175-5700dde675bc?q=80&w=2000&auto=format&fit=crop')`, 
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'grayscale(100%) contrast(150%) brightness(0.6)'
            }}
          />
          {/* Gradients */}
          <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[60vw] h-[60vw] bg-indigo-600/10 blur-[120px] rounded-full mix-blend-screen animate-pulse" style={{animationDuration: '8s'}} />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-teal-600/10 blur-[100px] rounded-full mix-blend-screen" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-purple-600/5 blur-[100px] rounded-full mix-blend-screen" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      {/* --- NAVBAR --- */}
      <nav className={`fixed w-full z-50 top-0 transition-all duration-300 border-b ${scrolled ? 'bg-[#02040a]/80 backdrop-blur-xl border-white/5 py-3' : 'bg-transparent border-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo(0,0)}>
            <div className="relative">
                <div className="absolute inset-0 bg-indigo-500 blur-md opacity-20 group-hover:opacity-40 transition-opacity" />
                <div className="relative p-2 bg-gradient-to-br from-indigo-600 to-cyan-500 rounded-xl border border-white/10 shadow-lg">
                    <Activity className="text-white" size={20} />
                </div>
            </div>
            <span className="text-xl font-bold text-white tracking-tight">aiRAD<span className="text-cyan-500">.io</span></span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#workflows" className="hover:text-white transition-colors duration-200">Workflows</a>
            <a href="#features" className="hover:text-white transition-colors duration-200">Capabilities</a>
            <a href="#pricing" className="hover:text-white transition-colors duration-200">Pricing</a>
          </div>

          <button 
            onClick={() => navigate('/auth')}
            className="group px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-sm font-semibold text-white transition-all flex items-center gap-2 hover:border-cyan-500/30 hover:shadow-[0_0_15px_-5px_rgba(6,182,212,0.3)]"
          >
            Launch Console <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform"/>
          </button>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative z-10 pt-48 pb-24 px-6 text-center">
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-950/30 border border-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-8 animate-fade-in backdrop-blur-sm shadow-xl shadow-indigo-900/10 cursor-default">
            <Sparkles size={12} className="text-cyan-400" />
            <span>Clinical Intelligence Engine v3.0</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-8 leading-[1.15] drop-shadow-2xl">
            The Operating System for <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-teal-400">
              High-Velocity Reporting
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            Stop typing. Start diagnosing. aiRAD combines <span className="text-slate-200 font-medium">Dual-Mode AI</span>, <span className="text-slate-200 font-medium">Smart Templates</span>, and <span className="text-slate-200 font-medium">Data Verification</span> into one private workspace.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => navigate('/auth')}
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white rounded-xl font-bold text-lg shadow-[0_0_40px_-10px_rgba(6,182,212,0.4)] transition-all hover:scale-[1.02] active:scale-[0.98] border border-white/10 flex items-center gap-2"
            >
              Start Reporting Free <Zap size={18} fill="currentColor" />
            </button>
            <button className="px-8 py-4 bg-[#0B1121] hover:bg-[#131b2e] text-slate-200 hover:text-white rounded-xl font-semibold text-lg border border-white/10 hover:border-white/20 transition-all shadow-lg flex items-center gap-2">
              <Play size={18} className="text-cyan-400" /> Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* --- STATS BAR --- */}
      <div className="relative z-10 border-y border-white/5 bg-[#0B1121]/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-white/5">
            <StatItem value="300+" label="Findings Loaded" />
            <StatItem value="99.9%" label="Accuracy Rate" />
            <StatItem value="2hrs" label="Saved Per Day" />
            <StatItem value="0s" label="Setup Time" />
        </div>
      </div>

      {/* --- VISUAL WORKFLOW ENGINE --- */}
      <section id="workflows" className="py-32 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
           <div className="text-center mb-16">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 text-slate-400 text-xs font-bold uppercase tracking-wider mb-4">
               <Workflow size={14} /> Efficiency Engine
             </div>
             <h2 className="text-4xl font-bold text-white">Workflows That Work For You</h2>
             <p className="text-slate-400 mt-4 text-lg">Select a scenario to see how aiRAD adapts.</p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-stretch min-h-[500px]">
            {/* Left: Interactive Menu */}
            <div className="lg:col-span-4 flex flex-col gap-3">
              {workflows.map((flow, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveWorkflow(idx)}
                  className={`text-left p-5 rounded-2xl border transition-all duration-300 flex items-center gap-4 group ${
                    activeWorkflow === idx 
                      ? `bg-slate-800 border-${flow.color}-500/50 ring-1 ring-${flow.color}-500/30`
                      : 'bg-[#0a0f1c] border-white/5 hover:bg-slate-800 hover:border-white/10'
                  }`}
                >
                  <div className={`p-3 rounded-xl bg-slate-900 border border-white/10 group-hover:scale-110 transition-transform ${activeWorkflow === idx ? `text-${flow.color}-400` : 'text-slate-500'}`}>
                    <flow.icon size={24} />
                  </div>
                  <div>
                    <h3 className={`font-bold text-lg ${activeWorkflow === idx ? 'text-white' : 'text-slate-400'}`}>{flow.title}</h3>
                    {activeWorkflow === idx && <p className="text-xs text-slate-400 mt-1 animate-in fade-in">{flow.desc}</p>}
                  </div>
                </button>
              ))}
            </div>

            {/* Right: Visual Stage */}
            <div className="lg:col-span-8 bg-[#0a0f1c] rounded-[2rem] border border-white/5 p-8 relative overflow-hidden flex flex-col shadow-2xl">
                {/* Background Glow */}
                <div className={`absolute top-0 right-0 w-[500px] h-[500px] bg-${currentFlow.color}-600/10 blur-[100px] rounded-full pointer-events-none transition-colors duration-700`}></div>
                
                {/* Header */}
                <div className="relative z-10 mb-8 flex justify-between items-end border-b border-white/5 pb-6">
                   <div>
                      <h3 className={`text-3xl font-bold text-${currentFlow.color}-400 mb-2`}>{currentFlow.title}</h3>
                      <p className="text-slate-300 text-lg">{currentFlow.desc}</p>
                   </div>
                   <div className={`hidden md:flex items-center gap-2 px-3 py-1 bg-${currentFlow.color}-900/20 border border-${currentFlow.color}-500/30 rounded-full text-${currentFlow.color}-300 text-xs font-bold uppercase`}>
                      <Activity size={14} /> Simulation Active
                   </div>
                </div>

                {/* Content Split */}
                <div className="relative z-10 grid md:grid-cols-2 gap-8 flex-1">
                   {/* Steps */}
                   <div className="flex flex-col justify-center space-y-6">
                      {currentFlow.steps.map((step, i) => (
                        <div key={i} className="flex gap-4 items-center">
                           <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm bg-slate-900 border border-white/10 text-slate-400 shadow-inner`}>
                              {i + 1}
                           </div>
                           <p className="text-slate-300 font-medium">{step}</p>
                        </div>
                      ))}
                   </div>

                   {/* Visualizer Window */}
                   <div className="relative bg-[#02040a] rounded-2xl border border-white/10 p-2 shadow-2xl flex flex-col">
                      {/* Browser Chrome */}
                      <div className="h-6 bg-slate-900 rounded-t-xl flex items-center px-3 gap-1.5 mb-2">
                         <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
                         <div className="w-2 h-2 rounded-full bg-amber-500/50"></div>
                         <div className="w-2 h-2 rounded-full bg-emerald-500/50"></div>
                      </div>
                      {/* Dynamic Content */}
                      <div className="flex-1 bg-slate-950 rounded-lg overflow-hidden p-4 relative">
                         {currentFlow.visual}
                      </div>
                   </div>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURE DEEP DIVE --- */}
      <div id="features" className="relative z-10">
        <FeatureSection 
          align="left"
          icon={Wand2}
          color="pink"
          title="Dual-Mode AI Assistant"
          subtitle="Smart Corrections & Templating"
          desc="Turn chaos into structure. Paste rough, unstructured voice notes and watch the AI clean them up instantly. Then, convert that perfect report into a reusable Smart Template for future cases."
          bullets={[
            "Tab 1: Fix Report - Auto-corrects grammar, laterality, and style.",
            "Tab 2: Generate Template - Creates dynamic macros from your report.",
            "One-Click Apply: Instantly replaces your rough draft with the polished version."
          ]}
          visual={
            <div className="bg-[#0f172a] rounded-xl border border-pink-500/30 p-5 shadow-2xl relative overflow-hidden transform rotate-1">
                <div className="flex gap-1 mb-0">
                    <div className="px-4 py-2 bg-pink-500/20 border-t border-x border-pink-500/40 rounded-t-lg text-xs font-bold text-pink-300 flex items-center gap-2"><Sparkles size={10}/> Fix Report</div>
                    <div className="px-4 py-2 bg-white/5 border-t border-x border-white/5 rounded-t-lg text-xs font-bold text-slate-500">Generate Template</div>
                </div>
                <div className="p-4 bg-slate-900 border border-pink-500/20 rounded-b-lg rounded-tr-lg flex flex-col gap-3">
                    <div className="h-2 w-3/4 bg-slate-700 rounded animate-pulse"></div>
                    <div className="h-2 w-1/2 bg-slate-700 rounded animate-pulse"></div>
                    <div className="h-px bg-white/5 my-1"></div>
                    <div className="self-end px-3 py-1 bg-pink-600 rounded text-[10px] font-bold text-white flex items-center gap-1">
                       <Wand2 size={10} /> Auto-Correcting...
                    </div>
                </div>
            </div>
          }
        />

        <FeatureSection 
          align="right"
          icon={ListFilter}
          color="emerald"
          title="Intelligent Data Extraction"
          subtitle="Automated Verification"
          desc="Cross-verifying a long, complex report is tedious and error-prone. Our Summary Extractor instantly parses your full report and presents a clean 'at-a-glance' card containing only the Positive Findings and Measurements."
          bullets={[
            "Instant Summary: Extracts key data points in < 1 second.",
            "Measurement Check: Isolates all numbers for rapid image cross-referencing.",
            "Focus Mode: Highlights only the pathological findings."
          ]}
          visual={
             <div className="h-64 flex items-center justify-center gap-4 relative">
                <div className="w-40 h-48 bg-slate-800/50 border border-white/10 rounded-lg p-3 blur-[1px] transform -rotate-6 flex flex-col gap-2">
                   <div className="h-1 w-full bg-slate-600 rounded"></div>
                   <div className="h-1 w-2/3 bg-slate-600 rounded"></div>
                   <div className="h-1 w-full bg-slate-600 rounded"></div>
                </div>
                <ArrowRight className="text-emerald-400 animate-pulse" />
                <div className="w-48 bg-emerald-950/40 border border-emerald-500/40 rounded-lg p-4 shadow-lg shadow-emerald-500/10 transform rotate-3">
                   <div className="text-[10px] font-bold text-emerald-400 uppercase mb-3 flex items-center gap-2"><ClipboardCheck size={12}/> Extracted Data</div>
                   <div className="space-y-2">
                      <div className="flex justify-between text-[10px] text-slate-300 border-b border-white/5 pb-1">
                         <span>Liver Lesion</span> <span className="text-white font-bold">2.4 cm</span>
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-300 border-b border-white/5 pb-1">
                         <span>Gallstones</span> <span className="text-white font-bold">Present</span>
                      </div>
                   </div>
                </div>
             </div>
          }
        />

        <FeatureSection 
          align="left"
          icon={Database}
          color="cyan"
          title="Clinical Knowledge Base"
          subtitle="Integrated Decision Support"
          desc="Never break your flow. Pull up grading systems, measurements, and differential diagnoses directly within the application sidebar."
          bullets={[
            "Instant Lookup: Search 'TI-RADS' or 'Fleischner' instantly.",
            "AI Suggestions: The app suggests lookups based on your dictated findings.",
            "One-Click Insert: Pull standard reference text directly into your report."
          ]}
          visual={
             <div className="h-64 bg-[#0a0f1c] rounded-2xl border border-cyan-500/30 p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2 bg-cyan-500/20 rounded-bl-xl text-xs font-mono text-cyan-300">REFERENCE_DB</div>
                <div className="space-y-3 mt-4">
                   <div className="p-3 bg-cyan-500/10 rounded-lg border border-cyan-500/10">
                      <div className="text-sm font-bold text-cyan-200 flex justify-between">ACR TI-RADS <Search size={12}/></div>
                      <div className="text-xs text-cyan-400 mt-1">TR3: Mildly Suspicious...</div>
                   </div>
                   <div className="p-3 bg-white/5 rounded-lg border border-white/5 opacity-50">
                      <div className="text-sm font-bold text-slate-300">RECIST 1.1 Criteria</div>
                   </div>
                </div>
             </div>
          }
        />

        <FeatureSection 
          align="right"
          icon={Layout}
          color="amber"
          title="Smart Macros & Library"
          subtitle="Pre-Loaded Findings"
          desc="Static templates are obsolete. Use our library of 100+ Diamond Standard findings or build dynamic macros with variables and logic."
          bullets={[
            "Pre-loaded Library: 100+ vetted findings for CT/MRI/US.",
            "Variables: Use placeholders like {measure} or {list}.",
            "Quick-Insert: Type '/' to open the command palette."
          ]}
          visual={
            <div className="h-64 bg-[#0a0f1c] rounded-2xl border border-amber-500/30 flex flex-col items-center justify-center font-mono text-sm relative">
                <div className="w-3/4 bg-black/50 rounded-lg p-4 border border-white/10">
                   <span className="text-amber-500">/norm-abd</span>
                   <span className="animate-pulse text-white">|</span>
                </div>
                <div className="my-2 text-slate-600 text-xs">EXPANDS TO</div>
                <div className="w-3/4 bg-amber-900/10 rounded-lg p-4 border border-amber-500/20 text-xs text-slate-300 shadow-inner">
                   LIVER: Normal size and echotexture.<br/>
                   GALLBLADDER: No stones...
                </div>
            </div>
          }
        />

         <FeatureSection 
          align="left"
          icon={Mic}
          color="indigo"
          title="Local Voice Engine"
          subtitle="Privacy-First Dictation"
          desc="For when you need to dictate. Unlike traditional tools, aiRAD uses the Whisper model running entirely in your browser via WebAssembly."
          bullets={[
            "Zero Latency: No network lag, instant transcription.",
            "100% Privacy: Audio never leaves your device.",
            "Command Mode: Say 'Insert Normal Chest' to trigger macros."
          ]}
          visual={
            <div className="h-64 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 flex items-center justify-center relative overflow-hidden">
               <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
               <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-indigo-500 rounded-full animate-pulse flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.5)]">
                    <Mic className="text-white w-8 h-8" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 w-32 bg-indigo-400/50 rounded-full animate-pulse" />
                    <div className="h-2 w-48 bg-indigo-400/30 rounded-full animate-pulse delay-75" />
                  </div>
               </div>
            </div>
          }
        />
      </div>

      {/* --- PRICING SECTION --- */}
      <section id="pricing" className="py-24 bg-[#0a0f1c] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
           <div className="text-center mb-16">
             <h2 className="text-4xl font-bold text-white mb-4">Transparent Pricing</h2>
             <p className="text-slate-400 text-lg">Start for free. Upgrade when you need more power.</p>
           </div>

           <div className="grid md:grid-cols-2 gap-8 items-start">
              {/* Free Tier */}
              <div className="bg-[#02040a] border border-white/10 rounded-3xl p-8 hover:border-slate-600 transition-all">
                 <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center mb-6 text-slate-300">
                    <Zap size={24}/>
                 </div>
                 <h3 className="text-xl font-bold text-white">Resident</h3>
                 <div className="my-4 flex items-baseline">
                    <span className="text-4xl font-bold text-white">$0</span>
                    <span className="text-slate-500 ml-2">/month</span>
                 </div>
                 <p className="text-slate-400 text-sm mb-8">Perfect for residents and individual practice.</p>
                 <ul className="space-y-4 mb-8 text-sm text-slate-300">
                    <li className="flex gap-3"><CheckCircle2 size={16} className="text-slate-500"/> Unlimited Local Dictation</li>
                    <li className="flex gap-3"><CheckCircle2 size={16} className="text-slate-500"/> 10 Reports / Month</li>
                    <li className="flex gap-3"><CheckCircle2 size={16} className="text-slate-500"/> Basic Macros</li>
                    <li className="flex gap-3"><CheckCircle2 size={16} className="text-slate-500"/> Standard Support</li>
                 </ul>
                 <button className="w-full py-3 border border-white/20 rounded-xl text-white font-bold hover:bg-white/5 transition-all">Start Free</button>
              </div>

              {/* Pro Tier (Featured) */}
              <div className="bg-[#0f172a] border border-indigo-500/50 rounded-3xl p-8 relative shadow-2xl scale-105 z-10">
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Most Popular</div>
                 <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center mb-6 text-white shadow-lg shadow-indigo-500/30">
                    <Star size={24}/>
                 </div>
                 <h3 className="text-xl font-bold text-white">Consultant</h3>
                 <div className="my-4 flex items-baseline">
                    <span className="text-4xl font-bold text-white">$29</span>
                    <span className="text-slate-500 ml-2">/month</span>
                 </div>
                 <p className="text-indigo-200 text-sm mb-8">Full AI power for high-volume radiologists.</p>
                 <ul className="space-y-4 mb-8 text-sm text-white font-medium">
                    <li className="flex gap-3"><CheckCircle2 size={16} className="text-indigo-400"/> Unlimited Reports</li>
                    <li className="flex gap-3"><CheckCircle2 size={16} className="text-indigo-400"/> AI Co-Pilot (Fix & Summarize)</li>
                    <li className="flex gap-3"><CheckCircle2 size={16} className="text-indigo-400"/> Private Cloud Archive</li>
                    <li className="flex gap-3"><CheckCircle2 size={16} className="text-indigo-400"/> Custom Templates & Macros</li>
                 </ul>
                 <button onClick={() => navigate('/auth')} className="w-full py-3 bg-indigo-600 rounded-xl text-white font-bold hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-900/20">Upgrade to Pro</button>
              </div>

              {/* Enterprise Tier */}
              {/* <div className="bg-[#02040a] border border-white/10 rounded-3xl p-8 hover:border-slate-600 transition-all">
                 <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center mb-6 text-slate-300">
                    <Building size={24}/>
                 </div>
                 <h3 className="text-xl font-bold text-white">Department</h3>
                 <div className="my-4 flex items-baseline">
                    <span className="text-2xl font-bold text-white">Custom</span>
                 </div>
                 <p className="text-slate-400 text-sm mb-8">For hospitals and diagnostic centers.</p>
                 <ul className="space-y-4 mb-8 text-sm text-slate-300">
                    <li className="flex gap-3"><CheckCircle2 size={16} className="text-slate-500"/> Multi-User Admin Dashboard</li>
                    <li className="flex gap-3"><CheckCircle2 size={16} className="text-slate-500"/> Shared Department Templates</li>
                    <li className="flex gap-3"><CheckCircle2 size={16} className="text-slate-500"/> Analytics & Audit Logs</li>
                    <li className="flex gap-3"><CheckCircle2 size={16} className="text-slate-500"/> Priority 24/7 Support</li>
                 </ul>
                 <button className="w-full py-3 border border-white/20 rounded-xl text-white font-bold hover:bg-white/5 transition-all">Contact Sales</button>
              </div> */}
           </div>
        </div>
      </section>

      {/* --- COMPARISON TABLE --- */}
      <section id="comparison" className="py-24 relative z-10">
        <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-white mb-4">Why Modern Radiologists Choose aiRAD</h2>
                <p className="text-slate-400 text-lg">Don't fight your software. Lead the diagnosis.</p>
            </div>

            <div className="bg-[#0a0f1c] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
                <div className="grid grid-cols-3 bg-white/[0.02] p-6 border-b border-white/5 text-xs font-bold uppercase tracking-wider">
                    <div className="text-slate-500 pl-4">Feature</div>
                    <div className="text-center text-slate-500">Traditional Dictation</div>
                    <div className="text-center text-indigo-400">aiRAD Platform</div>
                </div>
                
                <CompareRow feature="Installation" oldWay="Heavy desktop software" newWay="Zero footprint (Web-based)" />
                <CompareRow feature="Access" oldWay="Tethered to workstation" newWay="Secure Home/Mobile Access" />
                <CompareRow feature="Privacy" oldWay="Cloud Processing" newWay="Private Text Reports Only" />
                <CompareRow feature="Cost" oldWay="Expensive Contracts" newWay="Free Basic / Transparent Pro" />
                <CompareRow feature="Formatting" oldWay="Manual structuring" newWay="Auto-structured Findings" />
            </div>
        </div>
      </section>

      {/* --- CAPABILITIES GRID --- */}
      <section className="py-24 bg-[#0a0f1c] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-white mb-4">Complete Capability Suite</h2>
                <p className="text-slate-400 text-lg">Every tool you need to operate at peak efficiency.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <DetailCard icon={FileText} title="One-Click PDF" desc="Generate branded PDF reports with digital signatures instantly." />
                <DetailCard icon={Database} title="Private Archive" desc="Only your final text reports are stored securely. No images are uploaded. Private access." />
                <DetailCard icon={Layout} title="Auto-Structure" desc="AI separates your dictation into Findings and Impressions automatically." />
                <DetailCard icon={Bot} title="Co-Pilot" desc="Interactive AI assistant for formatting and summaries." />
                <DetailCard icon={Smartphone} title="Mobile Ready" desc="Review cases, check schedules, or sign reports from your tablet." />
                <DetailCard icon={Globe} title="Web Native" desc="No IT tickets. No updates. Runs in Chrome/Edge." />
                <DetailCard icon={ShieldCheck} title="Enterprise Security" desc="End-to-end encryption and role-based access control." />
                <DetailCard icon={Cpu} title="Auto-Summary" desc="AI generates patient-friendly summaries automatically." />
            </div>
        </div>
      </section>

      {/* --- FAQ SECTION --- */}
      <section className="py-24 relative z-10">
        <div className="max-w-3xl mx-auto px-6">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Frequently Asked Questions</h2>
            </div>
            
            <div className="space-y-4">
                <FaqItem 
                    question="Is patient data secure and HIPAA compliant?" 
                    answer="Yes. We use industry-standard encryption (AES-256) for data at rest and TLS 1.3 for data in transit. We sign BAAs for enterprise clients."
                    isOpen={openFaq === 0} onClick={() => toggleFaq(0)}
                />
                <FaqItem 
                    question="Does the voice dictation require training?" 
                    answer="No. Our medical model is pre-trained on millions of radiology reports. It understands accents and complex terminology out of the box."
                    isOpen={openFaq === 1} onClick={() => toggleFaq(1)}
                />
                <FaqItem 
                    question="Can I use my existing microphone?" 
                    answer="Absolutely. aiRAD works with standard USB microphones, dictaphones (like Philips SpeechMike), and even your laptop's built-in mic."
                    isOpen={openFaq === 2} onClick={() => toggleFaq(2)}
                />
                <FaqItem 
                    question="Is it really free?" 
                    answer="Our Basic tier is free forever for individual radiologists. It includes 10 reports/month and standard dictation features."
                    isOpen={openFaq === 3} onClick={() => toggleFaq(3)}
                />
            </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="border-t border-white/5 bg-[#000000] pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-slate-500 text-sm font-medium">
                &copy; 2026 aiRAD Systems. Built for Radiologists.
            </div>
            <div className="flex gap-8 text-sm text-slate-500 font-medium">
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-white transition-colors">Contact Support</a>
            </div>
        </div>
      </footer>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const StatItem = ({ value, label }) => (
    <div className="hover:-translate-y-1 transition-transform duration-300">
        <div className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 mb-2 tracking-tight">{value}</div>
        <div className="text-xs md:text-sm text-slate-500 uppercase tracking-widest font-semibold">{label}</div>
    </div>
);

const DetailCard = ({ icon: Icon, title, desc }) => (
    <div className="bg-[#0a0f1c] p-7 rounded-2xl border border-white/5 hover:border-cyan-500/30 transition-all group hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-900/10">
        <div className="w-12 h-12 bg-[#02040a] rounded-xl flex items-center justify-center mb-5 text-slate-300 group-hover:text-white group-hover:bg-cyan-600 transition-all shadow-inner border border-white/5">
            <Icon size={22} />
        </div>
        <h4 className="text-xl font-bold text-white mb-3">{title}</h4>
        <p className="text-sm text-slate-400 leading-relaxed font-light">{desc}</p>
    </div>
);

const CompareRow = ({ feature, oldWay, newWay }) => (
    <div className="grid grid-cols-3 p-6 border-b border-white/5 hover:bg-white/[0.02] transition-colors items-center group">
        <div className="font-bold text-slate-200 pl-4">{feature}</div>
        <div className="text-center text-slate-500 text-sm flex justify-center items-center gap-2">
            <X size={14} className="text-red-500/50 group-hover:text-red-500 transition-colors" /> {oldWay}
        </div>
        <div className="text-center text-indigo-300 font-medium text-sm flex justify-center items-center gap-2 shadow-indigo-500/20">
            <Check size={14} className="text-emerald-500 group-hover:text-emerald-400 transition-colors" /> {newWay}
        </div>
    </div>
);

const FaqItem = ({ question, answer, isOpen, onClick }) => (
    <div className="border border-white/5 rounded-2xl bg-[#02040a] overflow-hidden transition-all hover:border-white/10">
        <button 
            onClick={onClick}
            className="w-full flex items-center justify-between p-6 text-left hover:bg-white/[0.02] transition-colors"
        >
            <span className="font-bold text-slate-200 text-lg">{question}</span>
            <ChevronDown size={20} className={`text-slate-500 transition-transform duration-300 ${isOpen ? 'rotate-180 text-white' : ''}`} />
        </button>
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
            <p className="p-6 pt-0 text-slate-400 text-base leading-relaxed border-t border-white/5 font-light">
                {answer}
            </p>
        </div>
    </div>
);

const FeatureSection = ({ align, icon: Icon, color, title, subtitle, desc, bullets, visual }) => {
    const isRight = align === 'right';
    
    // Color maps for dynamic classes
    const colors = {
        indigo: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
        emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
        amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
        purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
        cyan: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
        pink: 'text-pink-400 bg-pink-500/10 border-pink-500/20',
    };

    return (
        <section className="py-24 relative">
            <div className="max-w-7xl mx-auto px-6">
                <div className={`flex flex-col lg:flex-row gap-16 items-center ${isRight ? 'lg:flex-row-reverse' : ''}`}>
                    {/* Text Side */}
                    <div className="flex-1">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border ${colors[color]}`}>
                            <Icon size={28} />
                        </div>
                        <h3 className={`text-sm font-bold uppercase tracking-wider mb-2 text-${color}-400`}>{subtitle}</h3>
                        <h2 className="text-4xl font-bold text-white mb-6">{title}</h2>
                        <p className="text-lg text-slate-400 mb-8 leading-relaxed">
                            {desc}
                        </p>
                        <ul className="space-y-4">
                            {bullets.map((bullet, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <div className={`mt-1.5 w-1.5 h-1.5 rounded-full bg-${color}-400 shrink-0`} />
                                    <span className="text-slate-300">{bullet}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    {/* Visual Side */}
                    <div className="flex-1 w-full">
                        <div className="relative group">
                            <div className={`absolute -inset-1 bg-gradient-to-r from-${color}-500 to-blue-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000`}></div>
                            <div className="relative">
                                {visual}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LandingPage;