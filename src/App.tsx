/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useSpring } from 'motion/react';
import { 
  Palette, 
  MessageCircle, 
  Phone, 
  Send, 
  ArrowRight, 
  X,
  ChevronRight,
  Upload,
  ExternalLink,
  Github,
  Twitter
} from 'lucide-react';
import { InteractiveHero } from './components/InteractiveHero';
import { FolderCarousel } from './components/FolderCarousel';

// --- Types ---
interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  image: string;
  color: string;
  challenge: string;
  solution: string;
  metrics: string[];
}

interface Experience {
  id: number;
  date: string;
  title: string;
  company: string;
  description: string;
  details: string[];
}

// --- Constants ---
const PROJECTS: Project[] = [
  {
    id: 1,
    title: "空灵之梦",
    category: "网页体验",
    description: "使用自定义 GLSL 着色器和原生 Canvas 打造的抽象景观沉浸式 3D 旅程。",
    image: "https://picsum.photos/seed/dream/1200/800",
    color: "#C6A6FE",
    challenge: "如何在不使用 Three.js 的情况下实现高性能的 3D 粒子系统和地形渲染。",
    solution: "通过原生 WebGL 编写顶点和片元着色器，优化缓冲区管理，实现 60FPS 的流畅体验。",
    metrics: ["加载速度提升 40%", "包体积减少 200KB", "用户停留时间增加 30%"]
  },
  {
    id: 2,
    title: "诺瓦仪表盘",
    category: "UI/UX 设计",
    description: "一个专注于清晰度、性能和玻璃拟态美学的数据密集型分析平台。",
    image: "https://picsum.photos/seed/nova/1200/800",
    color: "#ec4899",
    challenge: "在展示海量数据的同时保持界面的极简主义和高可读性。",
    solution: "采用模块化网格系统，结合玻璃拟态层级，通过动态模糊引导用户视觉焦点。",
    metrics: ["操作效率提升 25%", "错误率降低 15%", "NPS 评分 9.2"]
  },
  {
    id: 3,
    title: "脉冲交互",
    category: "创意编程",
    description: "实时音频响应可视化，将声音转化为动态几何图案。",
    image: "https://picsum.photos/seed/pulse/1200/800",
    color: "#C6A6FE",
    challenge: "音频数据的实时处理与复杂几何图形渲染的同步性。",
    solution: "利用 Web Audio API 进行频域分析，通过 RequestAnimationFrame 驱动 Canvas 渲染循环。",
    metrics: ["延迟低于 16ms", "支持 10+ 种视觉预设", "移动端完美适配"]
  },
  {
    id: 4,
    title: "Aura 品牌标识",
    category: "品牌设计",
    description: "为一家数字优先的创意机构构筑的完整视觉识别系统，强调流动性与运动。",
    image: "https://picsum.photos/seed/aura/1200/800",
    color: "#10b981",
    challenge: "如何通过静态视觉语言传达“流动”与“数字原生”的核心概念。",
    solution: "设计了一套基于算法生成的动态 Logo，并将其延展至全套视觉系统。",
    metrics: ["品牌识别度提升 50%", "社交媒体互动率 +40%", "获得 3 项设计奖项"]
  }
];

const EXPERIENCES: Experience[] = [
  {
    id: 1,
    date: "2024.06 - 2026.06",
    title: "设计师",
    company: "得力集团有限公司",
    description: "负责“黄油小熊”等IP项目的文创产品设计，并主导“无限派”“国博联名”“交个萌友”“水果系列”“万事得鲤”等项目的视觉方向。",
    details: []
  },
  {
    id: 2,
    date: "2024.03 - 2024.05",
    title: "设计师实习生",
    company: "北京音娱时光科技有限公司",
    description: "实习期间参与制作公司APP关于日常活动运营设计项目及POKE项目迭送、子养成计划迭送项目。",
    details: []
  },
  {
    id: 3,
    date: "2023.10 - 2024.03",
    title: "设计师实习生",
    company: "前锦网络信息技术(上海)有限公司",
    description: "实习期间参与公司招聘物料设计，线上KV设计、H5长图文设计、推文、招聘网页设计；线下易拉宝、折页、手举牌等招聘运营设计。",
    details: []
  }
];

// --- Components ---

const InteractiveHouse = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const houseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!houseRef.current) return;
      const rect = houseRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Calculate normalized direction vector
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const maxMove = 4; // Max pixels the pupil can move
      
      const moveX = (dx / (distance || 1)) * Math.min(distance / 50, maxMove);
      const moveY = (dy / (distance || 1)) * Math.min(distance / 50, maxMove);
      
      setMousePos({ x: moveX, y: moveY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <motion.div 
      ref={houseRef}
      initial={{ opacity: 0, scale: 0.5, rotate: 20 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      className="relative z-[100] cursor-pointer w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.15)]"
    >
      <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* House Body */}
        <path d="M15 45L50 15L85 45V85H15V45Z" fill="#FF69B4" />
        <path d="M15 45L50 15L85 45V85H15V45Z" fill="url(#houseGradient)" />
        
        {/* White "i" mark */}
        <rect x="25" y="65" width="6" height="12" rx="3" fill="white" fillOpacity="0.8" />
        <circle cx="28" cy="58" r="3" fill="white" fillOpacity="0.8" />

        {/* Eyes */}
        <circle cx="40" cy="55" r="8" fill="white" />
        <circle cx="60" cy="55" r="8" fill="white" />
        
        {/* Pupils */}
        <motion.circle 
          cx={40 + mousePos.x} 
          cy={55 + mousePos.y} 
          r="4" 
          fill="black" 
        />
        <motion.circle 
          cx={60 + mousePos.x} 
          cy={55 + mousePos.y} 
          r="4" 
          fill="black" 
        />

        {/* Mouth */}
        <circle cx="50" cy="72" r="3" fill="black" />

        {/* Star */}
        <motion.path 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 3,
            ease: "easeInOut"
          }}
          d="M75 15L78 22L85 25L78 28L75 35L72 28L65 25L72 22L75 15Z" 
          fill="#FFD700" 
          className="drop-shadow-[0_0_8px_rgba(255,215,0,0.8)]"
        />

        <defs>
          <linearGradient id="houseGradient" x1="50" y1="15" x2="50" y2="85" gradientUnits="userSpaceOnUse">
            <stop stopColor="white" stopOpacity="0.2" />
            <stop offset="1" stopColor="black" stopOpacity="0.1" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  );
};

const NeonCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch('ontouchstart' in window);
    const moveCursor = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
    };
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  if (isTouch) return null;

  return (
    <div 
      ref={cursorRef}
      className="fixed top-0 left-0 w-6 h-6 rounded-full pointer-events-none z-[9999] border border-white/20 bg-white/5 backdrop-blur-[3px] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_4px_12px_rgba(0,0,0,0.15)] transition-transform duration-100 ease-out -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
    >
      <div className="w-1.5 h-1.5 rounded-full bg-[#C6A6FE] shadow-[0_0_6px_rgba(198,166,254,0.8)]" />
    </div>
  );
};

const MagneticButton = ({ children, className = "", onClick }: any) => {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!btnRef.current) return;
    const { left, top, width, height } = btnRef.current.getBoundingClientRect();
    const x = (e.clientX - (left + width / 2)) * 0.35;
    const y = (e.clientY - (top + height / 2)) * 0.35;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => setPosition({ x: 0, y: 0 });

  return (
    <motion.button
      ref={btnRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={`relative ${className}`}
    >
      {children}
    </motion.button>
  );
};

const HeroCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -1000, y: -1000 });
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', resize);
    resize();

    const text = "PORTFOLIO";
    const fontSize = 80;
    const rows = 12;
    const cols = 6;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.font = `900 ${fontSize}px Inter`;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.052)';
      ctx.lineWidth = 1.0;

      const textWidth = ctx.measureText(text).width + 100;
      const time = Date.now() * 0.05;

      for (let i = -2; i < rows + 2; i++) {
        // Vary speed slightly per row and add a unique starting offset for "misalignment"
        const rowSpeedMult = (i % 2 === 0 ? 1 : -1) * (0.7 + Math.abs(Math.sin(i)) * 0.6);
        const rowInitialOffset = (i * 150) % textWidth;
        const offset = (rowInitialOffset + time * rowSpeedMult) % textWidth;
        
        for (let j = -2; j < cols + 2; j++) {
          const x = j * textWidth + offset;
          const y = i * (height / rows * 1.2);
          
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(-10 * Math.PI / 180);
          
          // Harmonious interaction effect: Subtle color and thickness with quadratic falloff
          const dx = x - mouse.current.x;
          const dy = y - mouse.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 800; // Expanded area for more responsive interaction
          
          if (dist < maxDist) {
            // Use quadratic falloff for a more "premium", organic feel
            const power = Math.pow(1 - (dist / maxDist), 2);
            
            // Transition from faint white to a soft brand purple (extremely subtle)
            const alpha = 0.052 + power * 0.025;
            ctx.strokeStyle = `rgba(198, 166, 254, ${alpha})`;
            ctx.lineWidth = 1.0 + power * 1.0;
          } else {
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.052)';
            ctx.lineWidth = 1.0;
          }
          
          ctx.strokeText(text, 0, 0);
          ctx.restore();
        }
      }
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <motion.canvas 
      ref={canvasRef} 
      style={{ opacity }}
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
};

const ProjectCard = ({ project, onClick }: { project: Project, onClick: (p: Project) => void }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;
    
    setRotate({
      x: (y - 0.5) * 10,
      y: (x - 0.5) * -10
    });
    setMousePos({ x: x * 100, y: y * 100 });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ 
        scale: 1.02,
        boxShadow: `0 30px 60px -15px ${project.color}55, 0 0 20px ${project.color}22`
      }}
      animate={{ rotateX: rotate.x, rotateY: rotate.y }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      onClick={() => onClick(project)}
      className="group relative glass rounded-3xl overflow-hidden cursor-pointer aspect-[16/10]"
      style={{ 
        perspective: 1000,
      }}
    >
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10"
        style={{
          background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, ${project.color}44 0%, transparent 70%)`,
          maskImage: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, black 0%, transparent 90%)`,
          WebkitMaskImage: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, black 0%, transparent 90%)`
        }}
      />
      
      <img 
        src={project.image} 
        alt={project.title}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        loading="lazy"
        referrerPolicy="no-referrer"
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/20 to-transparent flex flex-col justify-end p-8">
        <span className="text-[10px] font-mono text-brand uppercase tracking-widest mb-2">{project.category}</span>
        <h3 className="text-2xl font-black mb-2">{project.title}</h3>
        <p className="text-sm text-white/50 line-clamp-2 max-w-md">{project.description}</p>
        <div className="mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
          查看项目 <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </motion.div>
  );
};

const ProjectModal = ({ project, onClose }: { project: Project | null, onClose: () => void }) => {
  if (!project) return null;

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: "spring", damping: 30, stiffness: 200 }}
      className="fixed inset-0 z-[100] bg-bg overflow-y-auto"
    >
      <div className="max-w-5xl mx-auto px-6 py-20">
        <button 
          onClick={onClose}
          className="fixed top-8 right-8 w-12 h-12 glass rounded-full flex items-center justify-center hover:bg-white hover:text-bg transition-colors z-50"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="mb-20">
          <span className="text-xs font-mono text-brand uppercase tracking-[0.3em] mb-4 block">{project.category}</span>
          <h2 className="text-6xl font-black mb-8">{project.title}</h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="md:col-span-2">
              <p className="text-xl text-white/70 leading-relaxed">{project.description}</p>
            </div>
            <div className="space-y-6">
              <div>
                <h4 className="text-[10px] font-mono text-white/30 uppercase tracking-widest mb-2">品牌色</h4>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full" style={{ backgroundColor: project.color }} />
                  <span className="text-xs font-mono">{project.color}</span>
                </div>
              </div>
              <div className="flex gap-4">
                <button className="flex-1 glass py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-bg transition-all">
                  访问网站
                </button>
                <button className="w-12 h-12 glass rounded-xl flex items-center justify-center hover:bg-white hover:text-bg transition-all">
                  <Github className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-32">
          <section>
            <img 
              src={project.image} 
              alt="Hero" 
              className="w-full h-auto rounded-3xl shadow-2xl"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          </section>

          <section className="grid md:grid-cols-2 gap-20">
            <div>
              <h3 className="text-3xl font-black mb-6">项目挑战</h3>
              <p className="text-white/60 leading-relaxed">{project.challenge}</p>
            </div>
            <div>
              <h3 className="text-3xl font-black mb-6">解决方案</h3>
              <p className="text-white/60 leading-relaxed">{project.solution}</p>
            </div>
          </section>

          <section className="glass p-12 rounded-3xl">
            <h3 className="text-3xl font-black mb-12 text-center">数据指标</h3>
            <div className="grid md:grid-cols-3 gap-8">
              {project.metrics.map((m, i) => (
                <div key={i} className="text-center p-8 rounded-2xl bg-white/5 border border-white/5">
                  <p className="text-sm font-mono text-brand">{m}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <img 
              src={`https://picsum.photos/seed/${project.id}-detail/1200/2000`} 
              alt="Detail" 
              className="w-full h-auto rounded-3xl shadow-2xl"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          </section>
        </div>

        <footer className="py-32 text-center">
          <button onClick={onClose} className="text-sm font-bold uppercase tracking-[0.5em] text-white/30 hover:text-white transition-colors">
            BACK TO PROJECTS
          </button>
        </footer>
      </div>
    </motion.div>
  );
};




export default function App() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState('ALL');
  const [avatar, setAvatar] = useState("https://qizha482-cloud.github.io/changtu/c30852094aef668c6a7940f545ec8acc.jpg");
  const filteredProjects = useMemo(() => {
    if (activeTab === 'ALL') return PROJECTS;
    const mapping: Record<string, string> = {
      'UI/UX': 'UI/UX 设计',
      'BRAND': '品牌设计',
      'CREATIVE': '创意编程'
    };
    return PROJECTS.filter(p => p.category === mapping[activeTab] || p.category === activeTab);
  }, [activeTab]);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatar(url);
    }
  };

  const [activeContact, setActiveContact] = useState<{ type: string, value: string } | null>(null);
  const [isGeneralContactModalOpen, setIsGeneralContactModalOpen] = useState(false);

  const CONTACTS = [
    { icon: MessageCircle, type: 'WECHAT', value: '15971403435', label: '微信' },
    { icon: Phone, type: 'PHONE', value: '15971403435', label: '电话' },
    { icon: Send, type: 'EMAIL', value: '2798449653@qq.com', label: '邮箱' }
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add a toast here, but simple alert or temporary text change is easier
  };

  return (
    <div className="relative min-h-screen bg-bg selection:bg-brand/30 selection:text-white overflow-x-hidden">
      <AnimatePresence>
        {activeContact && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveContact(null)}
            className="fixed inset-0 z-[200] bg-bg/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="glass p-6 sm:p-12 rounded-3xl max-w-sm w-full relative overflow-hidden group"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand to-transparent" />
              
              <button 
                onClick={() => setActiveContact(null)}
                className="absolute top-4 right-4 text-white/30 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center">
                <span className="text-[10px] font-mono text-brand uppercase tracking-[0.4em] mb-4 block">
                  {activeContact.type}
                </span>
                <h3 className="text-xl sm:text-2xl font-black mb-8 break-all px-2">{activeContact.value}</h3>
                
                <button
                  onClick={() => {
                    copyToClipboard(activeContact.value);
                    const btn = document.getElementById('copy-btn');
                    if (btn) {
                      btn.innerText = 'COPIED!';
                      setTimeout(() => { btn.innerText = 'COPY TO CLIPBOARD'; }, 2000);
                    }
                  }}
                  id="copy-btn"
                  className="w-full py-4 glass rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-bg transition-all active:scale-95"
                >
                  COPY TO CLIPBOARD
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {isGeneralContactModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsGeneralContactModalOpen(false)}
            className="fixed inset-0 z-[200] bg-bg/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="glass p-6 sm:p-12 rounded-3xl max-w-lg w-full relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand to-transparent" />
              
              <button 
                onClick={() => setIsGeneralContactModalOpen(false)}
                className="absolute top-4 right-4 text-white/30 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-6 sm:mb-12 text-center">
                <span className="text-[10px] font-mono text-brand uppercase tracking-[0.4em] mb-2 sm:mb-4 block">GET IN TOUCH</span>
                <h2 className="text-3xl sm:text-4xl font-black">联系方式</h2>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {CONTACTS.map((contact, i) => (
                  <div 
                    key={i}
                    className="glass flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 rounded-2xl group hover:bg-white/5 transition-all gap-4"
                  >
                    <div className="flex items-center gap-4 sm:gap-6 min-w-0">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-brand/10 flex items-center justify-center group-hover:bg-brand group-hover:text-bg transition-all shrink-0">
                        <contact.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[9px] sm:text-[10px] font-mono text-white/30 uppercase tracking-widest block mb-0.5 sm:mb-1">{contact.label}</span>
                        <span className="text-base sm:text-lg font-black truncate block text-white/90">{contact.value}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        copyToClipboard(contact.value);
                        const btn = document.getElementById(`copy-btn-${i}`);
                        if (btn) {
                          btn.innerText = 'COPIED!';
                          setTimeout(() => { btn.innerText = 'COPY'; }, 2000);
                        }
                      }}
                      id={`copy-btn-${i}`}
                      className="text-[10px] font-mono text-brand uppercase tracking-widest hover:text-white transition-colors self-end sm:self-auto px-4 py-2 sm:p-0 rounded-lg sm:rounded-none bg-white/5 sm:bg-transparent border border-white/5 sm:border-none active:scale-95"
                    >
                      COPY
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <NeonCursor />
      <InteractiveHero />
      <HeroCanvas />
      <div className="breathing-glow" />

      {/* Header */}
      <header className="absolute top-0 left-0 w-full z-50 px-6 md:px-12 py-6 md:py-8 flex justify-between items-center pointer-events-none">
        <button 
          onClick={() => setActiveContact(CONTACTS[2])}
          className="text-[9px] md:text-[10px] font-mono tracking-[0.2em] text-white/70 mix-blend-difference pointer-events-auto hover:text-brand transition-colors text-left"
        >
          CHINA • 2798449653@qq.com
        </button>
        <div className="pointer-events-auto flex items-center gap-4 md:gap-6">
          <InteractiveHouse />
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[70vh] md:min-h-screen flex flex-col items-center justify-center pt-24 md:pt-40 pb-6 md:pb-20 px-6">
        <div className="relative z-10 text-center translate-x-[8%] md:translate-x-0">

          <h1 className="text-[8.5vw] md:text-[9vw] font-black leading-[1.1] tracking-tighter mb-8 md:mb-24 relative inline-block text-center -translate-x-12 md:translate-x-0">
            <div className="relative flex items-center justify-center gap-4 md:gap-6">
              {/* NEW Bubble */}
              <motion.div 
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: -15 }}
                whileHover={{ 
                  scale: 1.2, 
                  rotate: -10,
                  boxShadow: "0 0 30px rgba(255, 215, 0, 0.6)"
                }}
                className="absolute -top-10 right-[calc(100%-2rem)] md:right-auto md:-left-12 md:-top-14 bg-white px-3 py-1 md:px-5 md:py-1.5 rounded-xl md:rounded-2xl shadow-[0_10px_30px_rgba(255,255,255,0.1)] z-20 flex items-center justify-center border border-black/5"
              >
                <span className="text-[#FFD700] font-black text-xs md:text-xl italic tracking-tighter select-none drop-shadow-[0_0_8px_rgba(255,215,0,0.3)]">NEW</span>
                <div className="absolute -bottom-1 left-3 md:-bottom-1.5 md:left-4 w-2 h-2 md:w-3 md:h-3 bg-white rotate-45 border-r border-b border-black/5" />
              </motion.div>

              <span>这是①</span>
              
              <div className="flex gap-1.5 md:gap-4 items-center pt-2 md:pt-4">
                {[1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0.2 }}
                    animate={{ opacity: [0.2, 1, 0.2] }}
                    transition={{ repeat: Infinity, duration: 2, delay: i * 0.3 }}
                    className="w-0 h-0 border-t-[1.2vw] border-t-transparent border-l-[2vw] border-l-white border-b-[1.2vw] border-b-transparent"
                  />
                ))}
              </div>

              {/* HEY! Bubble */}
              <motion.div 
                initial={{ scale: 0, rotate: 20 }}
                animate={{ scale: 1, rotate: 10 }}
                whileHover={{ 
                  scale: 1.2, 
                  rotate: 15,
                  boxShadow: "0 0 30px rgba(255, 64, 129, 0.6)"
                }}
                className="absolute -top-10 left-[calc(100%+0.75rem)] md:left-auto md:-right-12 md:-top-14 bg-white px-3 py-1 md:px-5 md:py-1.5 rounded-xl md:rounded-2xl shadow-[0_10px_30px_rgba(255,255,255,0.1)] z-20 flex items-center justify-center border border-black/5"
              >
                <span className="text-[#FF4081] font-black text-xs md:text-xl italic tracking-tighter select-none drop-shadow-[0_0_8px_rgba(255,64,129,0.3)]">HEY!</span>
                <div className="absolute -bottom-1 right-3 md:-bottom-1.5 md:right-4 w-2 h-2 md:w-3 md:h-3 bg-white rotate-45 border-r border-b border-black/5" />
              </motion.div>
            </div>

            <div className="relative flex items-center justify-center mt-1 md:mt-0">
              <span>渣琪作品集</span>
              
              {/* JOIN Card */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                whileHover={{ 
                  scale: 1.2, 
                  rotate: 0,
                  y: -10,
                  boxShadow: "0 30px 60px rgba(198, 166, 254, 0.4), 0 0 20px rgba(198, 166, 254, 0.2)"
                }}
                onClick={() => setIsGeneralContactModalOpen(true)}
                className="absolute left-[calc(100%+0.75rem)] md:left-auto md:-right-32 bottom-0 bg-white p-1.5 md:p-4 rounded-xl shadow-[0_20px_50px_rgba(255,255,255,0.2)] flex flex-col items-center gap-1 md:gap-2 rotate-12 z-20 w-14 md:w-24 cursor-pointer transition-shadow"
              >
                <div className="w-6 h-6 md:w-12 md:h-12 bg-[#C6A6FE] rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(198,166,254,0.5)]">
                  <ArrowRight className="w-4 h-4 md:w-8 md:h-8 text-white -rotate-45" />
                </div>
                <span className="text-[#C6A6FE] font-black text-[8px] md:text-sm tracking-tighter">JOIN</span>
              </motion.div>
            </div>
          </h1>

          <div className="flex flex-wrap justify-center gap-x-6 md:gap-x-12 gap-y-2 text-[9px] md:text-[10px] font-mono text-white/40 uppercase tracking-[0.3em] md:tracking-[0.4em] -translate-x-[9%] md:translate-x-0">
            <span>INCREMENTAL</span>
            <span className="text-brand">/</span>
            <span>DESIGN</span>
            <span className="text-brand">/</span>
            <span>ITERATION</span>
            <span className="text-brand">/</span>
            <span>ILLUSTRATIONS</span>
          </div>
        </div>

      </section>



      {/* About Section */}
      <section className="pt-6 md:pt-24 pb-12 md:pb-16 px-6 max-w-7xl mx-auto grid md:grid-cols-[1fr_1.3fr] gap-8 md:gap-14 lg:gap-16">
        <aside className="md:sticky md:top-40 h-fit">
          <div className="relative w-32 h-32 md:w-48 md:h-48 mb-6 md:mb-12 group">
            <div className="absolute inset-0 bg-brand rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity" />
            <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-white/10 z-10">
              <img 
                src={avatar} 
                alt="Profile" 
                className="w-full h-full object-cover transition-all duration-700"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          <h2 className="text-3xl md:text-5xl font-black mb-4 md:mb-8 leading-tight">
            About Me
          </h2>
          
          <div className="text-white/70 text-sm leading-relaxed mb-6 md:mb-8 max-w-sm space-y-4">
            <p>
              Hi，我是张嘉琪，这个作品集里放的是我过去一段时间认真做的一些项目。有满意的，也有不那么满意的，但它们都代表了我目前对设计的理解 and 执行能力。
            </p>
            <p>
              我擅长品牌视觉设计、文创产品设计，也能处理从想法到落地的完整过程。如果你发现某个项目让你觉得有意思，或者正好有类似的需求想找人聊聊，欢迎随时找我。
            </p>
          </div>

          <div className="flex flex-wrap gap-2 md:gap-3 mb-6 md:mb-12">
            {['BRANDING', 'CULTURE', 'VISUAL', 'CREATIVE'].map(tag => (
              <span key={tag} className="glass px-3 py-1 md:px-4 md:py-1.5 rounded-full text-[9px] md:text-[10px] font-mono tracking-widest flex items-center gap-1.5 md:gap-2">
                <Palette className="w-3 h-3 text-brand" /> {tag}
              </span>
            ))}
          </div>

          <div className="flex gap-4">
            {CONTACTS.map((contact, i) => (
              <MagneticButton 
                key={i} 
                onClick={() => setActiveContact(contact)}
                className="w-10 h-10 md:w-12 md:h-12 glass rounded-full flex items-center justify-center hover:bg-white hover:text-bg transition-all"
              >
                <contact.icon className="w-4 h-4 md:w-5 md:h-5" />
              </MagneticButton>
            ))}
          </div>
        </aside>

        <div className="space-y-12 md:space-y-16">
          <div className="mb-6 md:mb-8">
            <span className="text-[10px] font-mono text-brand uppercase tracking-[0.4em] mb-2 md:mb-3 block">WORK EXPERIENCE</span>
            <h2 className="text-3xl md:text-6xl font-black">工作经验</h2>
          </div>

          <div className="relative border-l border-brand/20 ml-2 space-y-8">
            {EXPERIENCES.map((exp) => (
              <motion.div 
                key={exp.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative pl-8 md:pl-10 group"
              >
                {/* Timeline node dot centered vertically with the first header text inside */}
                <div className="absolute left-0 top-[1.65rem] w-3 h-3 md:w-4 md:h-4 rounded-full bg-bg border-2 border-brand -translate-x-1/2 z-10 group-hover:scale-125 transition-transform" />
                <motion.div 
                  whileHover={{ 
                    scale: 1.015, 
                    x: 8,
                    boxShadow: "0 20px 45px -15px rgba(198, 166, 254, 0.35), 0 0 20px rgba(198, 166, 254, 0.2)"
                  }}
                  className="glass p-5 md:p-6 lg:p-7 rounded-2xl md:rounded-3xl transition-all duration-500 hover:border-[#C6A6FE]/40"
                >
                  <span className="text-lg md:text-xl font-black text-white/90 mb-1.5 block">
                    ({exp.company})
                  </span>
                  <div className="text-xs md:text-sm font-medium text-brand/90 font-mono mb-4 flex items-center gap-2">
                    <span>{exp.title}</span>
                    <span className="text-white/30 font-normal font-sans text-xs">({exp.date})</span>
                  </div>
                  <p className="text-xs md:text-sm text-white/70 leading-relaxed">{exp.description}</p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Folder Carousel Section */}
      <section className="pt-12 md:pt-16 pb-20 md:pb-24 px-6 max-w-7xl mx-auto overflow-hidden">
        <div className="mb-10 text-center max-w-3xl mx-auto">
          <span className="text-[11px] font-mono text-brand uppercase tracking-[0.45em] mb-4 block font-extrabold">PROJECT ARCHIVE</span>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight mb-5 bg-gradient-to-b from-white via-white/95 to-white/70 bg-clip-text text-transparent leading-none">创意项目文件夹</h2>
          <p className="text-xs text-white/40 leading-relaxed font-mono uppercase tracking-[0.18em] flex items-center justify-center gap-1.5 mt-2">
            <span>点击打开活动文件夹 • 左右拖拽或使用方向键滑动</span>
          </p>
        </div>
        <div className="w-full">
          <FolderCarousel />
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-16 pb-24 md:pt-20 md:pb-32 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-brand/5 blur-[120px] rounded-full -translate-y-1/2" />
        <div className="relative z-10">
          <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter">感谢您的观看</h2>
          <p className="text-[10px] font-mono uppercase tracking-[0.5em] text-white/20 mb-10">THANK YOU FOR WATCHING</p>
          <MagneticButton 
            onClick={() => setIsGeneralContactModalOpen(true)}
            className="px-16 py-6 glass rounded-full text-xs font-bold tracking-[0.3em] hover:bg-white hover:text-bg transition-all uppercase"
          >
            联系方式
          </MagneticButton>
        </div>
      </footer>

      {/* Modals */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal 
            project={selectedProject} 
            onClose={() => setSelectedProject(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}