import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Lock, 
  AlertTriangle, 
  Check, 
  X, 
  ShieldAlert, 
  Activity, 
  Terminal, 
  Cpu, 
  Layers 
} from 'lucide-react';

interface FolderItem {
  id: number;
  title: string;
  cnTitle: string;
  category: string;
  code: string;
  date: string;
  color: string;
  secondaryColor: string;
  stamp: string;
  warningText: string;
  description: string;
  challenge: string;
  solution: string;
  metrics: string[];
  author: string;
  count: string;
  image: string;
}

const FOLDER_PROJECTS: FolderItem[] = [
  {
    id: 1,
    title: "Butter Bear Sweetness",
    cnTitle: "黄油小熊萌力大爆发",
    category: "产品设计 / 精细雕琢",
    code: "ALP-1920-8523",
    date: "2026.07",
    color: "#FFE394", // Yellowish
    secondaryColor: "#D1B15E",
    stamp: "APPROVED",
    warningText: "该文件夹包含黄金阿尔法高级网页资产。未经授权禁止分发。",
    description: "高级模块化交互网格 system 及自适应动态卡片演示项目。",
    challenge: "在长图细节呈现中保证页面滚动平滑且不丢失像素锐度。",
    solution: "利用高分辨率 PBR 图层配合渐进式流式加载，确保视觉效果高度保真。",
    metrics: ["加载性能 +45%", "响应耗时 <50ms", "设计还原度 100%"],
    author: "alpha_builder",
    count: "#01 / 007",
    image: "https://qizha482-cloud.github.io/changtu/butter-bear.png"
  },
  {
    id: 2,
    title: "Sweetie Party",
    cnTitle: "甜心派对",
    category: "产品设计 / 柔美交互",
    code: "BET-1920-9001",
    date: "2026.07",
    color: "#FFCDE1", // Pale pink
    secondaryColor: "#E09AB4",
    stamp: "CONFIDENTIAL",
    warningText: "本栏目包含柔性交互设计流与粉色系遥测视觉布局。",
    description: "具有微小惯性摩擦力效果的卡片与高对比度界面布局。",
    challenge: "如何在超高比例长图中呈现高密度的渐变色彩。",
    solution: "使用高性能 PNG 位图及自适应 Canvas 混合模式渲染渐变流光。",
    metrics: ["视觉评分 9.8", "色彩丰富度 +40%", "加载效率优异"],
    author: "beta_flow",
    count: "#02 / 007",
    image: "https://qizha482-cloud.github.io/changtu/sweetie-party.png"
  },
  {
    id: 3,
    title: "Good Luck Koi",
    cnTitle: "万事得鲤",
    category: "IP设计 / 高亮视觉",
    code: "GAM-1920-9343",
    date: "2026.07",
    color: "#FFD950", // Yellow
    secondaryColor: "#CFA42D",
    stamp: "RESTRICTED",
    warningText: "高亮环境资产，请在暗光环境之外合理调阅。",
    description: "高色域饱和度及立体视差滚动极简概念设计方案。",
    challenge: "垂直跨度极大的图像如何进行自适应缩放而不破坏排版。",
    solution: "使用 object-contain 与比例约束，使得所有移动端都能完美看清细节。",
    metrics: ["交互留存率 +35%", "视觉吸引力 100%", "支持无级缩放"],
    author: "gamma_core",
    count: "#03 / 007",
    image: "https://qizha482-cloud.github.io/changtu/good-luck-koi.png"
  },
  {
    id: 4,
    title: "Infinite Pi 1.0",
    cnTitle: "无限Π 1.0",
    category: "品牌设计 / 冷色简约",
    code: "DEL-1920-8480",
    date: "2026.07",
    color: "#B6C3CB", // Grayish blue
    secondaryColor: "#7F8E96",
    stamp: "SECURE",
    warningText: "含有冷灰色工业风极简主义线框图。内部评估档案。",
    description: "高密度极简线框图、空间结构与精密栅格布局。",
    challenge: "多级线框在大长图中的矢量还原与边缘抗锯齿处理。",
    solution: "启用硬件加速滤镜，搭配亚像素边缘渲染技术解决抗锯齿。",
    metrics: ["渲染延迟 0.8ms", "线条边缘清晰度 +60%", "通过严苛测试"],
    author: "delta_eng",
    count: "#04 / 007",
    image: "https://qizha482-cloud.github.io/changtu/infinite-pi-1.png"
  },
  {
    id: 5,
    title: "Infinite Pi 2.0",
    cnTitle: "无限Π 2.0",
    category: "品牌设计 / 纯净灰色",
    code: "EPS-1920-7787",
    date: "2026.07",
    color: "#D9D9D9", // Light gray
    secondaryColor: "#A6A6A6",
    stamp: "UNCLASSIFIED",
    warningText: "灰色极简记录板，不带任何额外多余的修饰。",
    description: "高保真极简视觉资产与数字美学排版典范。",
    challenge: "超长图层渲染时的内存占用控制与回收。",
    solution: "利用 DOM 级流式视图容器和滚动时不可见区域懒渲染策略。",
    metrics: ["内存减少 50%", "滚动帧率 120 FPS", "适配低配机型"],
    author: "epsilon_doc",
    count: "#05 / 007",
    image: "https://qizha482-cloud.github.io/changtu/infinite-pi-2.png"
  },
  {
    id: 6,
    title: "National Museum IP",
    cnTitle: "国博IP联名",
    category: "视觉策划 / 淡紫流光",
    code: "ZET-1920-9380",
    date: "2026.07",
    color: "#E8DCF5", // Pale purple
    secondaryColor: "#B5A0C8",
    stamp: "TOP SECRET",
    warningText: "带有紫色梦幻反射与荧光微粒的高级创意文件夹。",
    description: "柔和色调排版与艺术长画卷形式 of 交互设计规范。",
    challenge: "高清晰度大长图的逐级动态解压与加载过渡动画。",
    solution: "采用带模糊占位符的渐进式预载算法，提供丝滑体验。",
    metrics: ["白屏时间 0ms", "转换成功率 99.4%", "美学评级 S+"],
    author: "zeta_dream",
    count: "#06 / 007",
    image: "https://qizha482-cloud.github.io/changtu/national-museum-ip.png"
  },
  {
    id: 7,
    title: "Make Cute Friends",
    cnTitle: "交个萌友",
    category: "产品策划 / 蔚蓝交响",
    code: "ETA-1920-11807",
    date: "2026.07",
    color: "#C5EFFF", // Light blue
    secondaryColor: "#8FBED1",
    stamp: "RESTRICTED",
    warningText: "深邃亮蓝色彩，展示高维跨度的极长图卷（高11807px）。",
    description: "跨越上万像素的超级视觉流，探索无限滚动的极限可能性。",
    challenge: "高度达 11807px 的超级图像无损加载与交互性能保证。",
    solution: "支持智能视口裁剪及轻量级的 canvas 分块重组渲染技术。",
    metrics: ["首屏加载 0.4s", "CPU 消耗 -30%", "画质无损展现"],
    author: "eta_ocean",
    count: "#07 / 007",
    image: "https://qizha482-cloud.github.io/changtu/make-cute-friends.png"
  }
];

export const FolderCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [smoothIndex, setSmoothIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isOpened, setIsOpened] = useState(false);
  const [selectedFolderForModal, setSelectedFolderForModal] = useState<FolderItem | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Smooth circular interpolation of activeIndex using requestAnimationFrame
  useEffect(() => {
    let animationFrameId: number;
    
    const updateLerp = () => {
      setSmoothIndex((prev) => {
        const N = FOLDER_PROJECTS.length;
        let diff = activeIndex - prev;
        
        // Find shortest direction on a circular domain
        diff = ((diff + N / 2) % N + N) % N - N / 2;
        
        if (Math.abs(diff) < 0.002) {
          return activeIndex;
        }
        
        // Interpolation speed: 0.08 offers smooth and responsive movement
        const nextVal = prev + diff * 0.085;
        return (nextVal % N + N) % N;
      });
      
      animationFrameId = requestAnimationFrame(updateLerp);
    };
    
    animationFrameId = requestAnimationFrame(updateLerp);
    return () => cancelAnimationFrame(animationFrameId);
  }, [activeIndex]);

  const handleNext = () => {
    setIsOpened(false);
    setActiveIndex((prev) => (prev + 1) % FOLDER_PROJECTS.length);
  };

  const handlePrev = () => {
    setIsOpened(false);
    setActiveIndex((prev) => (prev - 1 + FOLDER_PROJECTS.length) % FOLDER_PROJECTS.length);
  };

  // Keyboard navigation for carousel & closing modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedFolderForModal) {
        if (e.key === 'Escape') setSelectedFolderForModal(null);
        return;
      }
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedFolderForModal]);

  // Auto-scrolling interval when no folder is open
  useEffect(() => {
    if (isOpened || selectedFolderForModal) return; // Pause when open

    const timer = setInterval(() => {
      handleNext();
    }, 6000);

    return () => clearInterval(timer);
  }, [activeIndex, isOpened, selectedFolderForModal]);

  return (
    <div className="relative w-full max-w-6xl mx-auto py-4 px-4 flex flex-col items-center">
      {/* Main 3D Stage with Flat Side-by-Side Horizontal Layout */}
      <div className="relative w-full h-[420px] md:h-[600px] flex items-center justify-center select-none overflow-visible md:overflow-hidden" style={{ perspective: '2000px' }}>
        {/* Soft Left and Right Ambient Fade Masks */}
        <div className="hidden md:block absolute inset-y-0 left-0 w-44 bg-gradient-to-r from-[#050505] via-[#050505]/40 to-transparent z-40 pointer-events-none" />
        <div className="hidden md:block absolute inset-y-0 right-0 w-44 bg-gradient-to-l from-[#050505] via-[#050505]/40 to-transparent z-40 pointer-events-none" />

        <div className={`relative ${isMobile ? 'w-[240px] h-[325px]' : 'w-[340px] h-[450px]'} preserve-3d flex items-center justify-center`}>
          <AnimatePresence initial={false} mode="popLayout">
            {FOLDER_PROJECTS.map((item, index) => {
              // Calculate offset relative to smoothIndex for continuous rendering
              let offset = index - smoothIndex;
              if (offset < -FOLDER_PROJECTS.length / 2) offset += FOLDER_PROJECTS.length;
              if (offset > FOLDER_PROJECTS.length / 2) offset -= FOLDER_PROJECTS.length;

              const isActive = index === activeIndex;
              const isCurrentOpen = isActive && isOpened;
              const isHovered = hoveredIndex === index && isActive;

              // Hide extremely far away cards to optimize rendering
              if (Math.abs(offset) > 2.5) return null;

              return (
                <motion.div
                  key={item.id}
                  style={{
                    transformStyle: 'preserve-3d',
                    zIndex: isActive ? 50 : 20 - Math.min(15, Math.floor(Math.abs(offset) * 5)),
                  }}
                  initial={{ opacity: 0, scale: 0.8, x: offset * (isMobile ? 240 : 365) }}
                  animate={{
                    opacity: Math.max(0.12, 1 - Math.abs(offset) * 0.55),
                    scale: isActive 
                      ? (isCurrentOpen ? 1.02 : (isHovered ? 1.04 : 1)) 
                      : 0.85,
                    // Linear side-by-side positioning spacing per folder, shifted down slightly so opened card is not clipped
                    x: offset * (isMobile ? 240 : 365),
                    y: isActive ? (isCurrentOpen ? (isMobile ? 45 : 65) : (isMobile ? 35 : 50)) : (isMobile ? 45 : 65),
                    rotateY: offset * -6, // Subtle dynamic curvature based on precise scroll progress
                  }}
                  exit={{ opacity: 0, scale: 0.7, x: offset > 0 ? (isMobile ? 250 : 400) : (isMobile ? -250 : -400) }}
                  transition={{ 
                    x: { type: "tween", ease: "linear", duration: 0 },
                    opacity: { type: "tween", ease: "linear", duration: 0 },
                    rotateY: { type: "tween", ease: "linear", duration: 0 },
                    scale: { type: "spring", stiffness: 180, damping: 20 },
                    y: { type: "spring", stiffness: 180, damping: 20 }
                  }}
                  onMouseEnter={() => isActive && setHoveredIndex(index)}
                  onMouseLeave={() => isActive && setHoveredIndex(null)}
                  onClick={() => {
                    if (isActive) {
                      setIsOpened(!isOpened);
                    } else {
                      setIsOpened(false);
                      setActiveIndex(index);
                    }
                  }}
                  className="absolute w-[230px] h-[310px] md:w-[330px] md:h-[440px] preserve-3d cursor-pointer"
                >
                  {/* Colored folder core refraction glow */}
                  <div 
                    className="absolute inset-4 rounded-full blur-[70px] pointer-events-none transition-all duration-700"
                    style={{ 
                      backgroundColor: item.color,
                      opacity: isActive ? (isCurrentOpen ? 0.35 : (isHovered ? 0.3 : 0.18)) : 0.04
                    }} 
                  />

                  {/* FOLDER BODY BACK PANEL - Solid/Translucent Colored Folders */}
                  <div 
                    className="absolute inset-0 rounded-2xl shadow-[0_25px_50px_rgba(0,0,0,0.65)] border overflow-hidden backdrop-blur-md"
                    style={{
                      backgroundColor: `${item.color}25`, // ~14% opacity color tint
                      borderColor: `${item.color}45`,     // Color border
                    }}
                  >
                    {/* Inner glassy textures with matching color gradient */}
                    <div 
                      className="absolute inset-0 pointer-events-none" 
                      style={{
                        background: `linear-gradient(to top right, ${item.color}15, transparent)`
                      }}
                    />
                    
                    {/* Folder spine indentation line */}
                    <div 
                      className="absolute top-0 bottom-0 left-3.5 w-px" 
                      style={{
                        backgroundColor: `${item.color}35`,
                        boxShadow: `1px 0 0 ${item.color}15`
                      }}
                    />
                  </div>

                  {/* THE PHYSICAL CLASSIFIED DOCUMENT PAPER INSIDE */}
                  <motion.div 
                    animate={{ 
                      y: isCurrentOpen ? (isMobile ? -90 : -135) : 0,
                      rotate: isCurrentOpen ? 4.5 : 0,
                      scale: isCurrentOpen ? 1.01 : 1,
                      x: isCurrentOpen ? (isMobile ? 10 : 15) : 0,
                    }}
                    transition={{ type: "spring", stiffness: 180, damping: 19 }}
                    className="absolute inset-2 left-3 md:inset-2.5 md:left-4 bg-[#FCFAF7] rounded-xl shadow-[0_12px_30px_rgba(0,0,0,0.25)] p-3 md:p-4.5 flex flex-col justify-between border border-[#E4E0D7] overflow-hidden"
                    onClick={(e) => {
                      if (isCurrentOpen) {
                        e.stopPropagation(); // Avoid closing folder cover
                        setSelectedFolderForModal(item);
                      }
                    }}
                  >
                    {/* Retro Grid background watermark */}
                    <div className="absolute inset-0 opacity-[0.04] pointer-events-none" 
                      style={{ 
                        backgroundImage: 'radial-gradient(#000 1.2px, transparent 1.2px)', 
                        backgroundSize: '11px 11px' 
                      }} 
                    />

                    {/* Paper Top section */}
                    <div className="relative z-10 font-mono text-black">
                      <div className="flex justify-between items-center border-b border-black/10 pb-1 md:pb-1.5 mb-1 md:mb-2 text-[6.5px] md:text-[8px] font-bold tracking-widest text-black/55">
                        <span>
                          CLASSIFIED // DEPT-9
                        </span>
                        <span>REF: {item.code}</span>
                      </div>
                      
                      <span className="px-1 md:px-1.5 py-0.5 rounded bg-black/5 text-[6px] md:text-[7.5px] text-black/60 font-bold uppercase tracking-wider inline-block mb-1 md:mb-1.5">
                        {item.category.split(' / ')[0]}
                      </span>
                      <h4 className="text-[13px] md:text-[18px] font-black tracking-tight text-neutral-900 leading-tight">
                        {item.cnTitle}
                      </h4>
                      <p className="text-[8px] md:text-[9.5px] leading-relaxed text-neutral-500 mt-1 md:mt-2 font-mono font-bold uppercase tracking-wider line-clamp-1 md:line-clamp-2">
                        {item.title}
                      </p>
                    </div>

                    {/* Central Document Image / Illustration */}
                    <div className="relative flex-1 my-1.5 md:my-2.5 rounded-lg overflow-hidden border border-neutral-300/60 bg-[#EFECE6] group/doc">
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover/doc:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
                      
                      {/* Laser scanner effect only when active folder is open */}
                      {isCurrentOpen && (
                        <div 
                          className="absolute top-0 left-0 right-0 h-0.5 shadow-lg animate-[bounce_2.5s_infinite]" 
                          style={{
                            backgroundColor: item.color,
                            boxShadow: `0 0 8px ${item.color}`
                          }}
                        />
                      )}

                      {/* Stamp badge overlay */}
                      <div className="absolute top-1 right-1 md:top-2 md:right-2 border border-red-500/80 md:border-2 text-red-500/90 px-1 md:px-1.5 py-0.5 rounded text-[5.5px] md:text-[7.5px] font-black font-mono tracking-widest uppercase rotate-12 scale-90 bg-[#FAF8F5]/10 backdrop-blur-[2px]">
                        {item.stamp}
                      </div>

                      {/* Confidential lock icon / click prompt */}
                      <div className="absolute bottom-1 md:bottom-2 left-1.5 md:left-2 right-1.5 md:right-2 flex items-center justify-between text-white text-[6px] md:text-[8px] font-mono tracking-wider">
                        <div className="flex items-center gap-0.5 md:gap-1 text-white/90">
                          <Lock className="w-2 h-2 md:w-2.5 md:h-2.5 text-white/80" />
                          <span>SECURE</span>
                        </div>
                        {isCurrentOpen && (
                          <span className="text-[5.5px] md:text-[7.5px] font-bold animate-pulse bg-black/40 px-1 md:px-1.5 py-0.5 rounded" style={{ color: item.color }}>
                            点击读取 / READ
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Paper Bottom section */}
                    <div className="relative z-10 flex justify-between items-end border-t border-black/10 pt-1 md:pt-2 text-black/60 font-mono text-[6.5px] md:text-[8px]">
                      <div className="flex flex-col">
                        <span className="text-black/35 text-[5.5px] md:text-[6.5px]">DEVELOPER</span>
                        <span className="font-bold">{item.author}</span>
                      </div>
                      
                      <div className="flex flex-col items-end">
                        <span className="text-black/35 text-[5.5px] md:text-[6.5px]">STAMP</span>
                        <span className="font-bold text-neutral-800">{item.count}</span>
                      </div>
                    </div>
                  </motion.div>

                  {/* FRONT FOLDER COVER - Dynamic Colored Material */}
                  <motion.div 
                    animate={{ 
                      rotateY: isCurrentOpen ? -135 : 0,
                    }}
                    transition={{ type: "spring", stiffness: 140, damping: 19 }}
                    className="absolute inset-0 origin-left preserve-3d"
                  >
                    {/* Front cover - Front Side (Colored Folder Cover) */}
                    <div 
                      className="absolute inset-0 rounded-2xl shadow-[5px_0_15px_rgba(0,0,0,0.22)] border flex flex-col justify-between p-4 md:p-6 backface-hidden backdrop-blur-lg"
                      style={{
                        background: `linear-gradient(135deg, ${item.color}35 0%, ${item.color}12 50%, ${item.color}05 100%)`,
                        borderColor: `${item.color}50`,
                      }}
                    >
                      {/* Specular glare overlay matching folder color */}
                      <div 
                        className="absolute inset-0 pointer-events-none rounded-2xl" 
                        style={{
                          background: `linear-gradient(to top right, transparent, ${item.color}10, ${item.color}20)`
                        }}
                      />

                      {/* Spine Hinge indicator line */}
                      <div 
                        className="absolute top-0 bottom-0 left-3.5 w-px" 
                        style={{
                          backgroundColor: `${item.color}40`,
                          boxShadow: `1px 0 0 ${item.color}20`
                        }}
                      />

                      {/* Glowing border outline */}
                      <div 
                        className="absolute inset-[1px] rounded-[15px] pointer-events-none" 
                        style={{
                          border: `1px solid ${item.color}15`
                        }}
                      />

                      {/* Colored Tab on Right without DO NOT OPEN text */}
                      <div 
                        className="absolute right-0 top-1/3 -translate-y-1/2 translate-x-[11px] md:translate-x-[16px] w-[12px] md:w-[18px] h-20 md:h-32 border-y border-r rounded-r-xl flex items-center justify-center shadow-[4px_0_10px_rgba(0,0,0,0.28)] backdrop-blur-md"
                        style={{
                          backgroundColor: `${item.color}22`,
                          borderColor: `${item.color}55`,
                        }}
                      >
                        <div 
                          className="absolute inset-0 rounded-r-xl pointer-events-none" 
                          style={{
                            background: `linear-gradient(to right, transparent, ${item.color}15)`
                          }}
                        />
                      </div>

                      {/* Top Left Info Component on Cover */}
                      <div className="relative z-10 self-start flex flex-col items-start text-left mt-1 md:mt-2 pl-2 md:pl-4 select-none">
                        <span className="text-[7.5px] md:text-[9.5px] font-extrabold font-mono tracking-[0.35em] block mb-1.5 md:mb-2 uppercase" style={{ color: item.color }}>
                          CONFIDENTIAL FILE
                        </span>
                        <span className="text-[6.5px] md:text-[8px] font-mono text-white/35 tracking-wider">
                          REF // {item.code}
                        </span>
                      </div>

                      {/* Bottom Section - Metadata for beautiful aesthetic spacing balance */}
                      <div className="relative z-10 self-start text-left pl-2 md:pl-4 mb-1 md:mb-2 select-none">
                        <div className="flex gap-3 md:gap-5 text-[5.5px] md:text-[7px] font-mono text-white/40 uppercase tracking-widest">
                          <div>
                            <span className="text-[4.5px] md:text-[6px] text-white/20 block mb-0.5">AUTHORIZATION</span>
                            <span>LEVEL 1 // AUTH</span>
                          </div>
                          <div>
                            <span className="text-[4.5px] md:text-[6px] text-white/20 block mb-0.5">CREATED DATE</span>
                            <span>{item.date}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Front cover - Back Side (Colored back side) */}
                    <div 
                      className="absolute inset-0 rounded-2xl border flex flex-col justify-between p-4 md:p-6 backface-hidden rotate-y-180 backdrop-blur-md"
                      style={{
                        backgroundColor: `${item.color}1E`,
                        borderColor: `${item.color}45`,
                      }}
                    >
                      {/* Cover back dark shadow blend */}
                      <div className="absolute inset-0 bg-black/35 pointer-events-none rounded-2xl" />
                      
                      {/* Spine highlight */}
                      <div 
                        className="absolute top-0 bottom-0 right-3.5 w-px" 
                        style={{
                          backgroundColor: `${item.color}35`,
                          boxShadow: `-1px 0 0 ${item.color}15`
                        }}
                      />

                      {/* Content inside back flap (retro details) */}
                      <div className="flex flex-col justify-between h-full relative z-10 text-white/70 font-mono text-[6px] md:text-[7px] leading-relaxed">
                        <div className="space-y-1 md:space-y-2">
                          <div className="flex items-center gap-1 text-yellow-400">
                            <AlertTriangle className="w-2.5 h-2.5 md:w-3 md:h-3 animate-pulse" />
                            <span className="font-bold text-[6px] md:text-[7px]">WARNING // ACCESS LEVEL 1</span>
                          </div>
                          <p className="text-white/45 text-[5.5px] md:text-[6.5px]">
                            {item.warningText}
                          </p>
                        </div>

                        <div className="border-t border-white/10 pt-2 flex justify-between items-center text-[5.5px] md:text-[6px] text-white/35">
                          <span>ENCRYPTED SHIELD IS ACTIVE</span>
                          <span>FILE {item.id} / {FOLDER_PROJECTS.length}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center gap-4 mt-6 relative z-50">
        <button 
          onClick={handlePrev}
          className="w-12 h-12 rounded-full glass border border-white/10 flex items-center justify-center hover:bg-white hover:text-bg hover:scale-105 active:scale-95 transition-all text-white/80"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Stack Dots Indicator */}
        <div className="flex gap-2.5 px-4 py-2 glass rounded-full border border-white/10">
          {FOLDER_PROJECTS.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setIsOpened(false);
                setActiveIndex(i);
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                activeIndex === i ? 'scale-125' : 'bg-white/20 hover:bg-white/40'
              }`}
              style={activeIndex === i ? {
                backgroundColor: FOLDER_PROJECTS[i].color,
                boxShadow: `0 0 10px ${FOLDER_PROJECTS[i].color}`
              } : undefined}
            />
          ))}
        </div>

        <button 
          onClick={handleNext}
          className="w-12 h-12 rounded-full glass border border-white/10 flex items-center justify-center hover:bg-white hover:text-bg hover:scale-105 active:scale-95 transition-all text-white/80"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* IMMERSIVE DOSSIER READER MODAL */}
      <AnimatePresence>
        {selectedFolderForModal && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
            {/* Dark glassmorphic backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: "easeInOut" }}
              onClick={() => setSelectedFolderForModal(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Body Container - Slimmer and optimized for vertical long images */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 25 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 15 }}
              transition={{ type: "spring", stiffness: 240, damping: 24 }}
              className="relative w-full max-w-[920px] max-h-[95vh] md:max-h-[98vh] bg-[#0c0c0e]/95 border border-white/10 rounded-2xl overflow-y-auto shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95)] no-scrollbar"
            >
              {/* Soft Sticky Top and Bottom Gradient Fades for natural scrolling transitions */}
              <div className="sticky top-0 left-0 right-0 h-12 bg-gradient-to-b from-[#0c0c0e] via-[#0c0c0e]/40 to-transparent z-40 pointer-events-none" />
              <div className="sticky bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#0c0c0e] via-[#0c0c0e]/40 to-transparent z-40 pointer-events-none -mt-12" />

              {/* Hide Scrollbar style injection */}
              <style dangerouslySetInnerHTML={{__html: `
                .no-scrollbar::-webkit-scrollbar {
                  display: none !important;
                }
                .no-scrollbar {
                  -ms-overflow-style: none !important;
                  scrollbar-width: none !important;
                }
              `}} />
              {/* Colored ambient background glow */}
              <div 
                className="absolute -top-32 -left-32 md:-top-48 md:-left-48 w-80 h-80 md:w-[450px] md:h-[450px] rounded-full blur-[120px] opacity-25 md:opacity-30 pointer-events-none transition-all"
                style={{ backgroundColor: selectedFolderForModal.color }}
              />

              {/* Sticky Close Button on Top Right */}
              <div className="sticky top-4 right-4 flex justify-end z-50 pointer-events-none pr-4">
                <button 
                  onClick={() => setSelectedFolderForModal(null)}
                  className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/15 flex items-center justify-center text-white/70 hover:text-white hover:bg-black/80 transition-all pointer-events-auto shadow-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Long Image Content Panel */}
              <div className="relative w-full p-4 md:p-6 flex flex-col items-center">
                <div className="relative w-full rounded-xl overflow-hidden border border-white/10 bg-[#121214] shadow-2xl">
                  {/* We display the main image as a long image in full width */}
                  <img 
                    src={selectedFolderForModal.image} 
                    alt={selectedFolderForModal.cnTitle} 
                    className="w-full h-auto object-contain"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Subtle Grid and Scan lines */}
                  <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
                  
                  {/* HUD Corner Tech Lines */}
                  <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-white/20" />
                  <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-white/20" />
                  <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-white/20" />
                  <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-white/20" />
                </div>

                {/* Secure status code badge */}
                <div className="mt-4 flex items-center justify-between w-full px-2 text-[10px] font-mono text-white/40">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span>SECURE TRANSMISSION COMPLETED</span>
                  </div>
                  <span>REF: {selectedFolderForModal.code} // {selectedFolderForModal.count}</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
