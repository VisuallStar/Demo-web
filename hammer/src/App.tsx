import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Headphones,
  ArrowRight,
  Play,
  Pause,
  Sliders,
  Sparkles,
  Zap,
  Volume2,
  VolumeX,
  Plus,
  Compass,
  Layers,
  Activity,
  Award
} from "lucide-react";
import ScrollBackground from "./ScrollBackground";

// Sound profiles for the interactive visualizer
interface SoundProfile {
  name: string;
  label: string;
  frequency: number;
  amplitude: number;
  speed: number;
  color: string;
  description: string;
}

const SOUND_PROFILES: SoundProfile[] = [
  {
    name: "bass",
    label: "HAMMER BASS",
    frequency: 0.015,
    amplitude: 45,
    speed: 0.08,
    color: "#f97316", // Warm Amber/Orange
    description: "Deep, powerful sub-bass frequencies optimized for dynamic impact."
  },
  {
    name: "reference",
    label: "STUDIO FLAT",
    frequency: 0.03,
    amplitude: 20,
    speed: 0.04,
    color: "#3b82f6", // Cool Blue
    description: "Uncompromised, ultra-linear frequency response for precise monitoring."
  },
  {
    name: "spatial",
    label: "SPATIAL 360",
    frequency: 0.01,
    amplitude: 30,
    speed: 0.06,
    color: "#10b981", // Emerald Green
    description: "Immersive multi-dimensional soundstage with advanced phase alignment."
  }
];

export default function App() {
  const [activeProfile, setActiveProfile] = useState<SoundProfile>(SOUND_PROFILES[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>("PRODUCTS");
  const [currentPage, setCurrentPage] = useState<string>("home");
  
  // Audio Visualizer Canvas Setup
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const phaseRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener("resize", handleResize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      if (isPlaying) {
        phaseRef.current += activeProfile.speed;
      }

      // Draw mathematical waves representing acoustic signals
      const numWaves = 3;
      for (let i = 0; i < numWaves; i++) {
        ctx.beginPath();
        ctx.lineWidth = i === 0 ? 2 : 1;
        
        // Blend colors subtly
        ctx.strokeStyle = i === 0 
          ? activeProfile.color 
          : `${activeProfile.color}${i === 1 ? "66" : "22"}`;

        const currentAmplitude = isPlaying 
          ? activeProfile.amplitude * (1 - i * 0.25)
          : 2; // flat line if paused with subtle micro-vibration

        const currentFrequency = activeProfile.frequency * (1 + i * 0.2);

        for (let x = 0; x < width; x++) {
          // Soften the wave at the boundaries to prevent clipping visual artifacts
          const boundaryFade = Math.sin((x / width) * Math.PI);
          const y = (height / 2) + 
            Math.sin(x * currentFrequency + phaseRef.current + (i * Math.PI / 4)) * 
            currentAmplitude * boundaryFade;

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }

      // Draw decorative target/crosshair lines in the visualizer for a technical high-end look
      ctx.strokeStyle = "rgba(63, 63, 70, 0.3)";
      ctx.lineWidth = 0.5;
      ctx.setLineDash([4, 4]);
      
      // Center vertical and horizontal grid marks
      ctx.beginPath();
      ctx.moveTo(width / 2, 0);
      ctx.lineTo(width / 2, height);
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();
      ctx.setLineDash([]); // Reset line dash

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [activeProfile, isPlaying]);

  return (
    <div id="app-root" className="min-h-screen bg-transparent text-white selection:bg-zinc-800 selection:text-white overflow-x-hidden relative">
      {currentPage === "home" && <ScrollBackground />}
      
      {(currentPage === "login" || currentPage === "buy") && (
        <div className="fixed inset-0 z-0">
          <img src="./background.png" className="w-full h-full object-cover" alt="Background" />
        </div>
      )}

      <div className="relative z-10 w-full h-full">
      {/* HEADER SECTION */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => setCurrentPage("home")} id="logo-container">
            <div className="w-9 h-9 bg-white text-black rounded flex items-center justify-center font-bold tracking-tighter transition-all duration-300 group-hover:bg-zinc-200">
              H
            </div>
            <span className="text-xl font-bold tracking-[0.25em] text-white uppercase font-sans">
              Hammer
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1" id="main-nav">
            {["PRODUCTS", "TECHNOLOGY", "SPECS", "REVIEWS"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 text-xs font-semibold tracking-widest uppercase transition-all duration-300 relative ${
                  activeTab === tab ? "text-white" : "text-zinc-500 hover:text-zinc-300"
                }`}
                id={`nav-${tab.toLowerCase()}`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div
                    layoutId="activeNavLine"
                    className="absolute bottom-0 left-5 right-5 h-[2px] bg-white"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </nav>

          {/* Shop Call to Action */}
          <div className="flex flex-col items-center gap-1.5 w-32">
            <button 
              onClick={() => setCurrentPage('buy')}
              className="px-6 py-2 bg-white text-black text-[10px] font-bold tracking-widest uppercase rounded-none hover:bg-zinc-200 transition-all duration-300 active:scale-95 w-full"
              id="cta-buy-now"
            >
              BUY NOW
            </button>
            <div className="flex gap-1.5 w-full">
              <button onClick={() => setCurrentPage('login')} className="flex-1 py-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[8px] font-bold uppercase tracking-wider transition-colors rounded-none">Sign Up</button>
              <button onClick={() => setCurrentPage('login')} className="flex-1 py-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[8px] font-bold uppercase tracking-wider transition-colors rounded-none">Login</button>
            </div>
          </div>
        </div>
      </header>

      {currentPage === "home" && (
        <>
      {/* HERO SECTION - REPLICA OF THE FIRST SLIDE GRID */}
      <main className="max-w-7xl mx-auto px-6 pt-12 pb-24 font-sans min-h-[120vh] flex flex-col justify-center" id="hero-section">
        
        {/* Outermost grid box with technical borders */}
        <div className="relative w-full" id="hero-grid-container">

          {/* Layout Container */}
          <div className="flex flex-col space-y-16">
            
            {/* COLUMN 1: LEFT SIDE (Heading and primary CTA) */}
            <div className="w-full py-8 lg:py-12 flex flex-col justify-center relative">
              
              <div className="space-y-6">
                <div className="inline-flex items-center space-x-2 bg-zinc-950 border border-zinc-800 px-3 py-1 rounded-full">
                  <Activity className="w-3.5 h-3.5 text-zinc-400 animate-pulse" />
                  <span className="text-[10px] tracking-widest text-zinc-400 font-bold uppercase">
                    GEN-3 ACOUSTIC ENGINE
                  </span>
                </div>
                
                <h1 className="text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-bold tracking-tight leading-[1.05] text-white">
                  Acoustics <br />
                  That Think, <br />
                  <span className="text-zinc-500">Adapt &</span> <br />
                  Deliver
                </h1>
                
                <p className="text-sm text-zinc-500 max-w-sm font-light leading-relaxed">
                  Engineered with real-time room calibration, custom beryllium drivers, and pure active noise isolation. Hammer isn’t just heard—it’s experienced.
                </p>
              </div>

              {/* CTAs */}
              <div className="mt-12 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="px-8 py-3.5 bg-white text-black hover:bg-zinc-200 transition-all duration-300 font-bold text-xs tracking-widest uppercase flex items-center justify-center space-x-2 rounded-none"
                  id="hero-primary-cta"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-3.5 h-3.5 fill-black" />
                      <span>PAUSE SPECTRUM</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-black" />
                      <span>PLAY SPECTRUM</span>
                    </>
                  )}
                </button>
                
                <button 
                  onClick={() => {
                    const specSection = document.getElementById("testimonials-section");
                    specSection?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="px-8 py-3.5 bg-transparent border border-zinc-800 hover:border-zinc-500 text-white transition-all duration-300 font-bold text-xs tracking-widest uppercase flex items-center justify-center space-x-2 rounded-none"
                  id="hero-secondary-cta"
                >
                  <span>EXPLORE SPECS</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

            <div className="flex flex-col space-y-16 lg:space-y-24 border-t border-zinc-800/30 pt-16">

            {/* COLUMN 2: CENTER GRAPHIC (Minimalist Live Waveform Interface) */}
            <div className="w-full lg:w-2/3 p-0 bg-transparent flex flex-col justify-between min-h-[400px] relative overflow-hidden group">
              
              <div className="flex items-center justify-between z-10">
                <span className="text-[10px] tracking-widest text-zinc-600 font-bold">
                  LIVE ACOUSTIC RESONANCE
                </span>
                <div className="flex items-center space-x-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${isPlaying ? "bg-emerald-500 animate-ping" : "bg-zinc-700"}`}></span>
                  <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase">
                    {isPlaying ? "CALIBRATING" : "STANDBY"}
                  </span>
                </div>
              </div>

              {/* Live Canvas Waveform Container */}
              <div className="flex-1 flex flex-col items-center justify-center relative py-6">
                <div className="w-full h-44 relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                  <canvas 
                    ref={canvasRef} 
                    className="w-full h-full block cursor-pointer"
                    onClick={() => setIsPlaying(!isPlaying)}
                    title="Click to pause/play waveform"
                  />
                  
                  {/* Subtle Floating Controls Overlay */}
                  <div className="absolute bottom-2 right-2 flex items-center space-x-2 opacity-50 hover:opacity-100 transition-opacity duration-300">
                    <span className="text-[9px] font-mono text-zinc-500">
                      FREQ: {(activeProfile.frequency * 1000).toFixed(0)}Hz
                    </span>
                  </div>
                </div>

                {/* Profile Controls (Interactive) */}
                <div className="w-full grid grid-cols-3 gap-2 mt-6 z-10">
                  {SOUND_PROFILES.map((profile) => (
                    <button
                      key={profile.name}
                      onClick={() => {
                        setActiveProfile(profile);
                        setIsPlaying(true);
                      }}
                      className={`py-2 px-1 text-center border transition-all duration-300 flex flex-col items-center justify-center space-y-1 rounded-lg backdrop-blur-md ${
                        activeProfile.name === profile.name
                          ? "border-white/40 bg-white/10 shadow-lg"
                          : "border-white/10 hover:border-white/30 bg-white/5"
                      }`}
                      style={{
                        borderTop: activeProfile.name === profile.name ? `2px solid ${profile.color}` : undefined
                      }}
                    >
                      <span className="text-[9px] font-extrabold tracking-wider">{profile.label}</span>
                      <span className="text-[7px] text-zinc-500 uppercase tracking-widest">Profile</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Responsive Text about the Selected Profile */}
              <div className="mt-4 border-t border-zinc-950 pt-4 z-10">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeProfile.name}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="text-xs text-zinc-400 font-light" style={{ color: activeProfile.color }}>
                      {activeProfile.description}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

            </div>

            {/* COLUMN 3: RIGHT SIDE (Key Features List and Summary - MOVED BELOW SPECTRUM, RIGHT ALIGNED) */}
            <div className="w-full lg:w-1/2 self-end flex flex-col space-y-10 relative">
              
              {/* Feature Points list */}
              <div className="space-y-10">
                
                {/* Feature 1 */}
                <div className="cursor-default">
                  <div className="flex items-center justify-end text-right space-x-2 text-zinc-600">
                    <h3 className="text-[11px] tracking-widest uppercase font-extrabold">Smart ANC</h3>
                    <Layers className="w-3.5 h-3.5" />
                  </div>
                  <p className="text-xs text-zinc-600 font-light mt-2 leading-relaxed text-right">
                    Silence the world instantly. 48dB hybrid Active Noise Cancellation adapts in real time to your surroundings.
                  </p>
                </div>

                {/* Feature 2 */}
                <div className="cursor-default">
                  <div className="flex items-center justify-end text-right space-x-2 text-zinc-600">
                    <h3 className="text-[11px] tracking-widest uppercase font-extrabold">60h Battery</h3>
                    <Zap className="w-3.5 h-3.5" />
                  </div>
                  <p className="text-xs text-zinc-600 font-light mt-2 leading-relaxed text-right">
                    Acoustics that live 24/7. Ultra-efficient hardware delivers standard setting battery life with quick charging.
                  </p>
                </div>

              </div>

              {/* Bottom Paragraph with fine grid separator */}
              <div className="pt-6">
                <div className="border-t border-dashed border-zinc-900 pt-6 text-right">
                  <p className="text-xs text-zinc-600 font-light leading-relaxed">
                    From deep studio-monitor spatial audio setups to your daily active commute, our beryllium diaphragms deliver absolute acoustic fidelity with speed, authority, and zero distortion.
                  </p>
                </div>
              </div>

            </div>

            </div>
          </div>

        </div>

      </main>

      {/* PRICING SECTION */}
      <section className="py-24 lg:py-48 min-h-[150vh] relative z-10 flex flex-col justify-center" id="pricing-section">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-white">Choose Your Tier</h2>
            <p className="text-zinc-500 mt-2 font-light">Transparent pricing. No hidden fees.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            
            {/* Price Block 1 */}
            <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-8 rounded-3xl flex flex-col items-center shadow-2xl">
              <h3 className="text-zinc-300 font-bold tracking-widest uppercase text-xs mb-2">Essential</h3>
              <div className="text-4xl font-bold text-white mb-6">$149</div>
              <ul className="text-zinc-500 text-sm space-y-4 mb-8 text-center w-full font-light">
                <li>Smart ANC</li>
                <li>20h Battery Life</li>
                <li>Standard EQ</li>
              </ul>
              <button className="w-full mt-auto py-3.5 bg-zinc-800/50 hover:bg-zinc-700/50 text-white rounded-lg text-[10px] font-bold tracking-widest uppercase transition-all duration-300">
                Select Plan
              </button>
            </div>

            {/* Price Block 2 */}
            <div className="bg-white/10 backdrop-blur-2xl border border-white/20 p-8 rounded-3xl flex flex-col items-center relative transform md:-translate-y-6 shadow-2xl shadow-white/5">
              <div className="absolute top-0 transform -translate-y-1/2 bg-white text-black px-4 py-1.5 rounded-full text-[9px] font-bold tracking-widest uppercase shadow-xl">
                Most Popular
              </div>
              <h3 className="text-zinc-300 font-bold tracking-widest uppercase text-xs mb-2 mt-4">Pro</h3>
              <div className="text-4xl font-bold text-white mb-6">$249</div>
              <ul className="text-zinc-300 text-sm space-y-4 mb-8 text-center w-full font-light">
                <li>Adaptive ANC</li>
                <li>40h Battery Life</li>
                <li>Advanced Pro EQ</li>
              </ul>
              <button className="w-full mt-auto py-3.5 bg-white text-black hover:bg-zinc-200 rounded-lg text-[10px] font-bold tracking-widest uppercase transition-all duration-300">
                Select Plan
              </button>
            </div>

            {/* Price Block 3 */}
            <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-8 rounded-3xl flex flex-col items-center shadow-2xl">
              <h3 className="text-zinc-300 font-bold tracking-widest uppercase text-xs mb-2">Audiophile</h3>
              <div className="text-4xl font-bold text-white mb-6">$399</div>
              <ul className="text-zinc-500 text-sm space-y-4 mb-8 text-center w-full font-light">
                <li>Lossless Audio</li>
                <li>60h Battery Life</li>
                <li>Beryllium Drivers</li>
              </ul>
              <button className="w-full mt-auto py-3.5 bg-zinc-800/50 hover:bg-zinc-700/50 text-white rounded-lg text-[10px] font-bold tracking-widest uppercase transition-all duration-300">
                Select Plan
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION - REPLICA OF THE SECOND SLIDE */}
      <section className="bg-transparent border-t border-white/10 py-24 min-h-[120vh] flex flex-col justify-center" id="testimonials-section">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Replica Grid of Slide 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-12 lg:gap-16">
            
            {/* Left side: Section Title and Intro */}
            <div className="lg:col-span-4 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="inline-flex items-center space-x-2 bg-zinc-950 border border-zinc-800 px-3 py-1 rounded-full">
                  <Award className="w-3.5 h-3.5 text-zinc-400" />
                  <span className="text-[10px] tracking-widest text-zinc-400 font-bold uppercase">
                    CRITICAL ACCLAIM
                  </span>
                </div>
                
                <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-white uppercase leading-none">
                  VOICES OF <br />
                  THE ACOUSTIC
                </h2>
                
                <div className="h-[1px] w-24 bg-zinc-800 my-6"></div>
                
                <p className="text-sm text-zinc-500 font-light leading-relaxed max-w-sm">
                  Firsthand impressions from Grammy-winning producers, sound engineers, and creative visionaries who demand acoustic perfection without compromise. Discover how Hammer is rewriting the standard for high-fidelity audio.
                </p>
              </div>

              {/* Decorative signature mark */}
              <div className="pt-12 hidden lg:block">
                <span className="text-[10px] font-mono tracking-widest text-zinc-700 uppercase block">
                  HAMMER SOUND LABORATORY
                </span>
                <span className="text-[9px] font-mono text-zinc-800 tracking-wider mt-1 block">
                  EST. 2026 // MUNICH, GERMANY
                </span>
              </div>
            </div>

            {/* Right side: 3 Testimonial Cards stacked vertically */}
            <div className="lg:col-span-6 space-y-4">
              
              {/* Testimonial Card 1 */}
              <motion.div 
                whileHover={{ x: 6 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="bg-white/5 backdrop-blur-2xl hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-2xl p-8 flex items-center justify-between gap-6 transition-all duration-300 cursor-default shadow-xl"
              >
                <div className="flex-1 space-y-4">
                  <p className="text-sm text-zinc-200 font-light leading-relaxed">
                    "Hammer completely transformed the way I monitor acoustic frequencies when mixing on the go. The reference transparency is pure and unmatched."
                  </p>
                  <div>
                    <h4 className="text-xs font-bold tracking-widest text-white uppercase">James Rizaki</h4>
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-light">Grammy-Nominated Audio Engineer</span>
                  </div>
                </div>
                <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-zinc-400">JR</span>
                </div>
              </motion.div>

              {/* Testimonial Card 2 */}
              <motion.div 
                whileHover={{ x: 6 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="bg-white/5 backdrop-blur-2xl hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-2xl p-8 flex items-center justify-between gap-6 transition-all duration-300 cursor-default shadow-xl"
              >
                <div className="flex-1 space-y-4">
                  <p className="text-sm text-zinc-200 font-light leading-relaxed">
                    "The adaptive Active Noise Cancellation is a sheer miracle. It completely screens off background roar instantly, creating a silent studio environment anywhere."
                  </p>
                  <div>
                    <h4 className="text-xs font-bold tracking-widest text-white uppercase">Samantha Leonardo</h4>
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-light">Principal XR Sound Architect</span>
                  </div>
                </div>
                <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-zinc-400">SL</span>
                </div>
              </motion.div>

              {/* Testimonial Card 3 */}
              <motion.div 
                whileHover={{ x: 6 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="bg-white/5 backdrop-blur-2xl hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-2xl p-8 flex items-center justify-between gap-6 transition-all duration-300 cursor-default shadow-xl"
              >
                <div className="flex-1 space-y-4">
                  <p className="text-sm text-zinc-200 font-light leading-relaxed">
                    "I have curated a massive collection of high-end planar magnetic headphones, but Hammer is the very first to package true pristine sound inside a wireless setup."
                  </p>
                  <div>
                    <h4 className="text-xs font-bold tracking-widest text-white uppercase">Mark Trevor</h4>
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-light">Lead Editor, ReferenceAudio</span>
                  </div>
                </div>
                <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-zinc-400">MT</span>
                </div>
              </motion.div>

            </div>

          </div>

        </div>
      </section>
      </>
      )}

      {currentPage === "login" && (
        <div className="min-h-[85vh] flex items-center justify-center p-6">
          <div className="bg-white/5 backdrop-blur-2xl border border-white/20 p-10 rounded-2xl w-full max-w-md shadow-2xl flex flex-col space-y-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-zinc-500 via-white to-zinc-500"></div>
            <h2 className="text-2xl font-bold tracking-widest uppercase text-center text-white">Login</h2>
            <div className="space-y-4">
              <input type="email" placeholder="Email" className="w-full bg-black/20 border border-white/10 rounded px-4 py-3 text-sm outline-none focus:border-white/40 transition-colors text-white placeholder-zinc-500" />
              <input type="password" placeholder="Password" className="w-full bg-black/20 border border-white/10 rounded px-4 py-3 text-sm outline-none focus:border-white/40 transition-colors text-white placeholder-zinc-500" />
            </div>
            <button className="w-full bg-white text-black font-bold tracking-widest uppercase text-sm py-3 hover:bg-zinc-200 transition-colors rounded">Sign In</button>
            <p className="text-xs text-center text-zinc-400">Don't have an account? <span className="text-white cursor-pointer hover:underline">Sign up</span></p>
          </div>
        </div>
      )}

      {currentPage === "buy" && (
        <div className="min-h-[85vh] flex flex-col items-center justify-center p-6 text-center space-y-8">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight uppercase">Checkout</h1>
          <p className="text-zinc-400 font-light max-w-md">Complete your purchase. Secure, simple, and beautifully minimalist.</p>
          <div className="w-full max-w-lg bg-white/5 backdrop-blur-2xl border border-white/10 p-8 flex flex-col space-y-4 shadow-2xl rounded-2xl text-left relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-zinc-500 via-white to-zinc-500"></div>
            <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-4">
                <span className="text-zinc-300 tracking-widest uppercase text-sm">Hammer Pro</span>
                <span className="font-bold text-xl text-white">$399</span>
            </div>
            <div className="space-y-3">
              <input type="text" placeholder="Full Name" className="w-full bg-black/20 border border-white/10 rounded px-4 py-3 text-sm outline-none focus:border-white/40 transition-colors text-white placeholder-zinc-500" />
              <input type="email" placeholder="Email Address" className="w-full bg-black/20 border border-white/10 rounded px-4 py-3 text-sm outline-none focus:border-white/40 transition-colors text-white placeholder-zinc-500" />
              <input type="text" placeholder="Card Number" className="w-full bg-black/20 border border-white/10 rounded px-4 py-3 text-sm outline-none focus:border-white/40 transition-colors text-white placeholder-zinc-500" />
            </div>
            <button className="w-full bg-white text-black font-bold tracking-widest uppercase text-sm py-4 hover:bg-zinc-200 transition-colors rounded mt-6">Confirm Purchase</button>
          </div>
        </div>
      )}

      {/* FOOTER SECTION */}
      <footer className="border-t border-white/10 bg-white/5 backdrop-blur-2xl py-12 text-zinc-400">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-xs space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <span className="font-bold tracking-widest text-zinc-500 uppercase">HAMMER SOUND INC.</span>
            <span>&copy; {new Date().getFullYear()} ALL RIGHTS RESERVED.</span>
          </div>
          <div className="flex space-x-6">
            <a href="#hero-section" className="hover:text-zinc-400 transition-colors duration-200">PRIVACY POLICY</a>
            <a href="#hero-section" className="hover:text-zinc-400 transition-colors duration-200">TERMS OF SERVICE</a>
            <a href="#hero-section" className="hover:text-zinc-400 transition-colors duration-200">WARRANTY</a>
          </div>
        </div>
      </footer>
      </div>
    </div>
  );
}
