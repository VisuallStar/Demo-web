import React, { useEffect, useRef } from 'react';

interface ScrollSectionProps {
  folder: string;
  frameCount: number;
  children?: React.ReactNode;
}

export default function ScrollSection({ folder, frameCount, children }: ScrollSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const images: HTMLImageElement[] = [];
    let targetFrame = 1;
    let currentFrame = 1;
    let lastRendered = 0;

    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      img.src = `/${folder}/ezgif-frame-${i.toString().padStart(3, '0')}.jpg`;
      images.push(img);
    }

    images[0].onload = () => {
      canvas.width = images[0].width;
      canvas.height = images[0].height;
      renderFrame(1);
    };

    function renderFrame(index: number) {
      if (images[index - 1] && images[index - 1].complete) {
        ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
        ctx!.drawImage(images[index - 1], 0, 0);
      }
    }

    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const offsetTop = -rect.top; 
      const maxScroll = rect.height - window.innerHeight;
      
      let scrollFraction = offsetTop / maxScroll;
      scrollFraction = Math.max(0, Math.min(1, scrollFraction));
      
      const frameIndex = Math.min(
        frameCount - 1,
        Math.floor(scrollFraction * frameCount)
      );
      
      targetFrame = frameIndex + 1;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    let animationFrameId: number;
    const loop = () => {
      currentFrame += (targetFrame - currentFrame) * 0.08;
      const rounded = Math.round(currentFrame);
      if (rounded !== lastRendered && rounded >= 1 && rounded <= frameCount) {
        renderFrame(rounded);
        lastRendered = rounded;
      }
      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, [folder, frameCount]);

  return (
    <div ref={sectionRef} className="relative" style={{ height: '500vh' }}>
      <div className="sticky top-0 w-full h-screen overflow-hidden flex justify-center items-center -z-10">
        <canvas 
          ref={canvasRef} 
          className="w-full h-full object-contain absolute inset-0"
        />
        {/* Render children inside the sticky container on top of canvas */}
        <div className="absolute inset-0 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
