/**
 * Bullet-Time Air Ripple Background Animation
 * Bullet cuts through air leaving ripples behind at fixed positions
 */

(function() {
  'use strict';

  const CONFIG = {
    bulletY: 0.5,

    // Ripple settings
    rippleSpawnInterval: 95, // spawn ripple every N pixels traveled
    rippleMaxRadius: 1200, // max vertical size (extends past top/bottom of frame)
    rippleOpacity: 0.15,

    noiseOpacity: 0.04,
    backgroundColor: '#0a0a0a',
  };

  let canvas, ctx;
  let width, height, dpr;
  let animationId = null;
  let bulletX = -200;
  let lastRippleX = -999;
  let time = 0;
  let ripples = []; // array of {x, y, birthTime}

  let isSlowMode = false;
  let hasRevealedPage = false;
  const FAST_SPEED = 56;
  const SLOW_SPEED = 0.1;
  let currentSpeed = FAST_SPEED;

  // Logo image for bullet
  let logoImage = null;
  const LOGO_SIZE = 50; // size of the logo bullet

  // ============================================
  // RENDER
  // ============================================
  function render(timestamp) {
    time = timestamp;

    // Clear
    ctx.fillStyle = CONFIG.backgroundColor;
    ctx.fillRect(0, 0, width, height);

    // Noise disabled for performance
    // drawNoise();

    const bulletY = height * CONFIG.bulletY;

    // Update bullet position - bullet flies from center off screen
    if (!isSlowMode) {
      const decelStart = width * 0.85;  // start slowing at 85%
      const decelEnd = width + 800;     // fully slow by this point (waves off screen)
      const revealPoint = width * 0.6;  // reveal content early

      // Reveal the rest of the page early
      if (!hasRevealedPage && bulletX >= revealPoint) {
        hasRevealedPage = true;
        document.body.classList.add('animation-complete');
      }

      // Linear interpolation of speed based on position
      if (bulletX >= decelStart) {
        const progress = (bulletX - decelStart) / (decelEnd - decelStart);
        currentSpeed = FAST_SPEED - (FAST_SPEED - SLOW_SPEED) * Math.min(progress, 1);
      }

      bulletX += currentSpeed;

      if (bulletX >= decelEnd) {
        isSlowMode = true;
      }
    }
    // Waves persist and animate - no reset

    // Spawn MULTIPLE ripples per frame based on distance traveled
    if (!isSlowMode) {
      while (bulletX - lastRippleX >= CONFIG.rippleSpawnInterval) {
        lastRippleX += CONFIG.rippleSpawnInterval;
        ripples.push({
          x: lastRippleX,
          y: bulletY,
          birthTime: timestamp
        });
      }
    }

    // Draw all ripples (oldest first so newest are on top)
    ripples.forEach((ripple, index) => {
      drawRipple(ripple, index, width);
    });

    // Draw bullet (only if on screen)
    if (bulletX <= width + 50) {
      drawBullet(bulletX, bulletY);
    }

    // Vignette
    const gradient = ctx.createRadialGradient(
      width / 2, height / 2, 0,
      width / 2, height / 2, Math.max(width, height) * 0.7
    );
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.5)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    animationId = requestAnimationFrame(render);
  }

  function drawRipple(ripple, index, screenWidth) {
    const age = time - ripple.birthTime;

    // Ripple grows over time
    const growthProgress = Math.min(age / 1000, 1); // reaches full size in 1s

    // Flowing wave oscillation - wave travels through all ripples over time
    // Linear triangle wave instead of sine for consistent motion
    const wavePhase = (time * 0.00015 - index * 0.08) % (Math.PI * 2);
    const normalizedPhase = wavePhase / (Math.PI * 2); // 0 to 1
    const oscillation = normalizedPhase < 0.5 ? (normalizedPhase * 4 - 1) : (3 - normalizedPhase * 4); // linear triangle -1 to 1
    const baseScale = 0.65 + oscillation * 0.25; // oscillates between 0.4 and 0.9

    const currentScale = baseScale * growthProgress;
    const waveWidth = CONFIG.rippleMaxRadius * currentScale;

    // Fade on the RIGHT side, more prominent on LEFT
    // Fade starts at 30% mark and fades toward right edge
    const fadeStart = screenWidth * 0.3; // start fading at 30%
    let positionFade = 1;
    if (ripple.x > fadeStart) {
      positionFade = Math.max(0, (screenWidth - ripple.x) / (screenWidth - fadeStart));
      positionFade = positionFade * positionFade; // smooth fade curve
    }

    // Left side boost - more prominent
    const leftBoost = 1 + ((screenWidth - ripple.x) / screenWidth) * 0.6; // up to 1.6x on left edge

    const opacity = CONFIG.rippleOpacity * positionFade * leftBoost;

    if (waveWidth < 1 || opacity < 0.001) return;

    // Slight vertical wave animation for curl effect - linear motion
    const vertPhase = ((time * 0.001 + index * 0.2) % (Math.PI * 2)) / (Math.PI * 2);
    const waveOffset = (vertPhase < 0.5 ? (vertPhase * 4 - 1) : (3 - vertPhase * 4)) * 4;

    ctx.save();
    ctx.translate(ripple.x, ripple.y + waveOffset);
    ctx.scale(-0.2, 1); // compress horizontally for shockwave look (mirrored)

    // Draw curled arc - extends past 90 degrees for curl effect
    const curlAmount = 0.58; // how much the ends curl inward (0.5 = 90deg, 0.58 = ~104deg)

    // Soft outer glow
    ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.3})`;
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.arc(0, 0, waveWidth, -Math.PI * curlAmount, Math.PI * curlAmount);
    ctx.stroke();

    // Main glowing line - more pronounced
    ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(0, 0, waveWidth, -Math.PI * curlAmount, Math.PI * curlAmount);
    ctx.stroke();

    // Inner bright core line
    ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 1.2})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(0, 0, waveWidth * 0.95, -Math.PI * curlAmount, Math.PI * curlAmount);
    ctx.stroke();

    ctx.restore();
  }

  function drawBullet(bx, by) {
    ctx.save();
    ctx.translate(bx, by);

    // Draw logo rotated -90 degrees (pointing right, horizontal)
    if (logoImage && logoImage.complete && logoImage.naturalWidth > 0) {
      ctx.rotate(-Math.PI / 2); // rotate -90 degrees (pointing right)
      ctx.drawImage(logoImage, -LOGO_SIZE / 2, -LOGO_SIZE / 2, LOGO_SIZE, LOGO_SIZE);
      ctx.rotate(Math.PI / 2); // rotate back
    }

    ctx.restore();
  }

  function drawNoise() {
    const imageData = ctx.getImageData(0, 0, width * dpr, height * dpr);
    const data = imageData.data;
    const noiseAmount = 255 * CONFIG.noiseOpacity;

    for (let i = 0; i < data.length; i += 16) {
      const noise = (Math.random() - 0.5) * noiseAmount;
      data[i] = Math.min(255, Math.max(0, data[i] + noise));
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
    }

    ctx.putImageData(imageData, 0, 0);
  }

  // ============================================
  // RESIZE
  // ============================================
  function handleResize() {
    const container = canvas.parentElement;
    const rect = container.getBoundingClientRect();

    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = rect.width;
    height = rect.height;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

    ctx.scale(dpr, dpr);
  }

  // ============================================
  // INIT
  // ============================================
  function init(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error('BulletTimeBackground: Container not found');
      return;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;';
    container.style.position = 'relative';
    container.insertBefore(canvas, container.firstChild);

    ctx = canvas.getContext('2d');
    handleResize();

    // Load logo image (SVG)
    logoImage = new Image();
    logoImage.src = 'logo.svg';

    // Start bullet from middle
    bulletX = width * 0.5;
    isSlowMode = false;
    currentSpeed = FAST_SPEED;
    ripples = [];

    // Pre-populate ripples on the left side of the screen
    const bulletY = height * CONFIG.bulletY;
    for (let x = 0; x < width * 0.5; x += CONFIG.rippleSpawnInterval) {
      ripples.push({
        x: x,
        y: bulletY,
        birthTime: performance.now()
      });
    }

    lastRippleX = bulletX - CONFIG.rippleSpawnInterval;

    window.addEventListener('resize', handleResize);

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(animationId);
      } else {
        animationId = requestAnimationFrame(render);
      }
    });

    animationId = requestAnimationFrame(render);
  }

  window.BulletTimeBackground = { init };
})();
