const anims = [
  {
    id: 'canvas1',
    folder: 'images',
    frameCount: 120,
    images: [],
    currentFrame: 1,
    targetFrame: 1,
    lastRendered: 0
  },
  {
    id: 'canvas3',
    folder: 'images2',
    frameCount: 200,
    images: [],
    currentFrame: 1,
    targetFrame: 1,
    lastRendered: 0
  }
];

// Preload images for both animations
anims.forEach(anim => {
  anim.canvas = document.getElementById(anim.id);
  anim.context = anim.canvas.getContext('2d');
  
  for (let i = 1; i <= anim.frameCount; i++) {
    const img = new Image();
    img.src = `${anim.folder}/ezgif-frame-${i.toString().padStart(3, '0')}.jpg`;
    anim.images.push(img);
  }
  
  anim.images[0].onload = () => {
    // Set internal resolution based on first frame
    anim.canvas.width = anim.images[0].width;
    anim.canvas.height = anim.images[0].height;
    renderFrame(anim, 1);
  }
});

function renderFrame(anim, index) {
  if (anim.images[index - 1] && anim.images[index - 1].complete) {
    anim.context.clearRect(0, 0, anim.canvas.width, anim.canvas.height);
    anim.context.drawImage(anim.images[index - 1], 0, 0);
  }
}

// Map scroll progress to animation frames for each section
window.addEventListener('scroll', () => {
  anims.forEach(anim => {
    const section = anim.canvas.closest('.scroll-section');
    const rect = section.getBoundingClientRect();
    
    // offsetTop determines how far we've scrolled inside this specific section
    // rect.top is 0 when the section's sticky container hits the top of the viewport
    const offsetTop = -rect.top; 
    const maxScroll = rect.height - window.innerHeight;
    
    let scrollFraction = offsetTop / maxScroll;
    
    // Clamp the fraction between 0 (start) and 1 (end)
    scrollFraction = Math.max(0, Math.min(1, scrollFraction));
    
    const frameIndex = Math.min(
      anim.frameCount - 1,
      Math.floor(scrollFraction * anim.frameCount)
    );
    
    anim.targetFrame = frameIndex + 1;
  });
});

// Main animation loop for smoothing
function loop() {
  anims.forEach(anim => {
    anim.currentFrame += (anim.targetFrame - anim.currentFrame) * 0.08;
    const rounded = Math.round(anim.currentFrame);
    
    if (rounded !== anim.lastRendered && rounded >= 1 && rounded <= anim.frameCount) {
      renderFrame(anim, rounded);
      anim.lastRendered = rounded;
    }
  });
  
  requestAnimationFrame(loop);
}

// Start loop
requestAnimationFrame(loop);
