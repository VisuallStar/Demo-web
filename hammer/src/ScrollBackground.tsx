import React, { useEffect, useRef } from 'react';

export default function ScrollBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;
    
    const seq1Count = 120;
    const seq2Count = 200;
    const totalFrames = seq1Count + seq2Count;
    const images: HTMLImageElement[] = [];
    let targetFrame = 1;
    let currentFrame = 1;
    let lastRendered = 0;
    
    // Create image placeholders (don't load yet)
    const allSources: string[] = [];
    for (let i = 1; i <= seq1Count; i++) {
      allSources.push(`./images/ezgif-frame-${i.toString().padStart(3, '0')}.jpg`);
    }
    for (let i = 1; i <= seq2Count; i++) {
      allSources.push(`./images2/ezgif-frame-${i.toString().padStart(3, '0')}.jpg`);
    }
    
    // Initialize image array with empty Image objects
    for (let i = 0; i < totalFrames; i++) {
      images.push(new Image());
    }
    
    // Progressive loading: load first batch immediately, rest in chunks
    const BATCH_SIZE = 20;
    let loadedCount = 0;
    let initialRenderDone = false;
    
    function loadBatch(startIdx: number) {
      const endIdx = Math.min(startIdx + BATCH_SIZE, totalFrames);
      for (let i = startIdx; i < endIdx; i++) {
        const img = images[i];
        img.decoding = 'async';
        img.onload = () => {
          loadedCount++;
          if (!initialRenderDone && i === 0) {
            canvas.width = img.width;
            canvas.height = img.height;
            renderFrame(1);
            initialRenderDone = true;
          }
          // When this batch finishes, load the next
          if (loadedCount === endIdx) {
            if (endIdx < totalFrames) {
              // Use requestIdleCallback to avoid blocking the main thread
              if ('requestIdleCallback' in window) {
                (window as any).requestIdleCallback(() => loadBatch(endIdx));
              } else {
                setTimeout(() => loadBatch(endIdx), 16);
              }
            }
          }
        };
        img.src = allSources[i];
      }
    }
    
    // Start loading first batch immediately
    loadBatch(0);
    
    function renderFrame(index: number) {
      const img = images[index - 1];
      if (img && img.complete && img.naturalWidth > 0) {
        if (canvas!.width !== img.width || canvas!.height !== img.height) {
          canvas!.width = img.width;
          canvas!.height = img.height;
        }
        ctx!.drawImage(img, 0, 0);
      }
    }
    
    const handleScroll = () => {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      
      let scrollFraction = maxScroll > 0 ? scrollTop / maxScroll : 0;
      scrollFraction = Math.max(0, Math.min(1, scrollFraction));
      
      const frameIndex = Math.floor(scrollFraction * (totalFrames - 1));
      targetFrame = frameIndex + 1;
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    let animationFrameId: number;
    const loop = () => {
      // Faster lerp for snappier scroll response (0.08 → 0.18)
      currentFrame += (targetFrame - currentFrame) * 0.18;
      const rounded = Math.round(currentFrame);
      if (rounded !== lastRendered && rounded >= 1 && rounded <= totalFrames) {
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
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100dvh',
      zIndex: 0, overflow: 'hidden', backgroundColor: '#000',
      willChange: 'transform',
      contain: 'strict',
    }}>
      <canvas 
        ref={canvasRef} 
        className="w-full h-full object-cover lg:object-contain object-center"
        style={{ willChange: 'contents' }}
      />
    </div>
  );
}
