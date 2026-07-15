import React, { useEffect, useRef } from 'react';

export default function ScrollBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const frameCount = 120;
    const images: HTMLImageElement[] = [];
    let targetFrame = 1;
    let currentFrame = 1;
    let lastRendered = 0;
    
    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      img.src = `/images/ezgif-frame-${i.toString().padStart(3, '0')}.jpg`;
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
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      
      let scrollFraction = maxScroll > 0 ? scrollTop / maxScroll : 0;
      scrollFraction = Math.max(0, Math.min(1, scrollFraction));
      
      const frameIndex = Math.floor(scrollFraction * (frameCount - 1));
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
  }, []);
  
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100dvh', zIndex: -1, overflow: 'hidden', backgroundColor: '#000' }}>
      <canvas 
        ref={canvasRef} 
        className="w-full h-full object-cover lg:object-contain"
      />
    </div>
  );
}
