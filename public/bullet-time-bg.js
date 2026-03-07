/**
 * Bullet-Time Air Ripple Background Animation
 * Desktop: Bullet flies left to center, fires right on click
 * Mobile: Bullet rises from bottom to center, fires upward on click
 */

(function() {
  'use strict';

  const CONFIG = {
    bulletY: 0.5,

    // Ripple settings
    rippleSpawnInterval: 221,
    rippleMaxRadius: 552,
    rippleOpacity: 0.15,

    backgroundColor: '#0a0a0a',
  };

  let canvas, ctx;
  let width, height, dpr;
  let animationId = null;
  let bulletX = 0;
  let bulletYPos = 0;
  let lastRipplePos = -999;
  let time = 0;
  let ripples = [];
  let isMobile = false;

  // States: 'entering' -> 'waiting' -> 'firing' -> 'done'
  let state = 'entering';
  let hasRevealedPage = false;
  const FAST_SPEED = 56;
  const SLOW_SPEED = 0.1;
  let currentSpeed = FAST_SPEED;

  // Entering animation
  let enterStartTime = 0;
  const ENTER_DURATION = 800;

  // Pulse glow for waiting state
  let pulseTime = 0;

  // Bullet image
  let bulletImage = null;
  const BULLET_SIZE = 50;

  // ============================================
  // RENDER
  // ============================================
  function render(timestamp) {
    time = timestamp;

    ctx.fillStyle = CONFIG.backgroundColor;
    ctx.fillRect(0, 0, width, height);

    const centerX = width * 0.5;
    const centerY = height * CONFIG.bulletY;

    if (state === 'firing') {
      if (isMobile) {
        renderFiringMobile(timestamp);
      } else {
        renderFiringDesktop(timestamp);
      }
    }

    else if (state === 'done') {
      ripples.forEach((ripple, index) => {
        drawRipple(ripple, index);
      });
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

  // ============================================
  // DESKTOP FIRING (left to right)
  // ============================================
  function renderFiringDesktop(timestamp) {
    const bulletY = height * CONFIG.bulletY;
    const decelStart = width * 0.85;
    const decelEnd = width + 800;
    const revealPoint = width * 0.52;

    if (!hasRevealedPage && bulletX >= revealPoint) {
      hasRevealedPage = true;
      document.body.classList.add('animation-complete');
      document.body.style.overflow = '';
    }

    if (bulletX >= decelStart) {
      const progress = (bulletX - decelStart) / (decelEnd - decelStart);
      currentSpeed = FAST_SPEED - (FAST_SPEED - SLOW_SPEED) * Math.min(progress, 1);
    }

    bulletX += currentSpeed;
    bulletYPos = bulletY;

    if (bulletX >= decelEnd) {
      state = 'done';
    }

    // Spawn ripples
    while (bulletX - lastRipplePos >= CONFIG.rippleSpawnInterval) {
      lastRipplePos += CONFIG.rippleSpawnInterval;
      ripples.push({
        x: lastRipplePos,
        y: bulletY,
        birthTime: timestamp
      });
    }

    ripples.forEach((ripple, index) => {
      drawRipple(ripple, index);
    });

    if (bulletX <= width + 50) {
      drawBullet(bulletX, bulletYPos, true);
    }
  }

  // ============================================
  // MOBILE FIRING (bottom to top)
  // ============================================
  function renderFiringMobile(timestamp) {
    const decelStart = height * 0.15;
    const decelEnd = -800;
    const revealPoint = height * 0.4;

    if (!hasRevealedPage && bulletYPos <= revealPoint) {
      hasRevealedPage = true;
      document.body.classList.add('animation-complete');
      document.body.style.overflow = '';
    }

    if (bulletYPos <= decelStart) {
      const progress = (decelStart - bulletYPos) / (decelStart - decelEnd);
      currentSpeed = FAST_SPEED - (FAST_SPEED - SLOW_SPEED) * Math.min(progress, 1);
    }

    bulletYPos -= currentSpeed;

    if (bulletYPos <= decelEnd) {
      state = 'done';
    }

    // Spawn ripples going upward (tighter spacing on mobile)
    const mobileInterval = Math.floor(CONFIG.rippleSpawnInterval * 0.6);
    while (lastRipplePos - bulletYPos >= mobileInterval) {
      lastRipplePos -= mobileInterval;
      ripples.push({
        x: bulletX,
        y: lastRipplePos,
        birthTime: timestamp
      });
    }

    ripples.forEach((ripple, index) => {
      drawRipple(ripple, index);
    });

    if (bulletYPos >= -50) {
      drawBullet(bulletX, bulletYPos, true);
    }
  }

  // ============================================
  // DRAW BULLET
  // ============================================
  function drawBullet(bx, by, showTrail) {
    ctx.save();
    ctx.translate(bx, by);

    if (bulletImage && bulletImage.complete && bulletImage.naturalWidth > 0) {
      // Clip to rounded rect for smooth corners
      ctx.beginPath();
      ctx.roundRect(-BULLET_SIZE / 2, -BULLET_SIZE / 2, BULLET_SIZE, BULLET_SIZE, 8);
      ctx.clip();

      if (isMobile) {
        // Upright (natural orientation) for mobile
        ctx.drawImage(bulletImage, -BULLET_SIZE / 2, -BULLET_SIZE / 2, BULLET_SIZE, BULLET_SIZE);
      } else {
        // Rotated 90deg clockwise (pointing right) for desktop — always
        ctx.rotate(Math.PI / 2);
        ctx.scale(-1, 1);
        ctx.drawImage(bulletImage, -BULLET_SIZE / 2, -BULLET_SIZE / 2, BULLET_SIZE, BULLET_SIZE);
        ctx.scale(-1, 1);
        ctx.rotate(-Math.PI / 2);
      }
    }

    // Trail behind bullet
    if (showTrail) {
      if (isMobile) {
        // Trail below bullet (downward)
        const trailGradient = ctx.createLinearGradient(0, BULLET_SIZE / 2, 0, 1200);
        trailGradient.addColorStop(0, 'rgba(255, 255, 255, 0.15)');
        trailGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.strokeStyle = trailGradient;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, BULLET_SIZE / 2);
        ctx.lineTo(0, 1200);
        ctx.stroke();

        // V shape trail
        const chevronGradient = ctx.createLinearGradient(0, BULLET_SIZE / 2, 0, BULLET_SIZE / 2 + 80);
        chevronGradient.addColorStop(0, 'rgba(255, 255, 255, 0.15)');
        chevronGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.strokeStyle = chevronGradient;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-25, BULLET_SIZE / 2 + 80);
        ctx.lineTo(0, BULLET_SIZE / 2 + 10);
        ctx.lineTo(25, BULLET_SIZE / 2 + 80);
        ctx.stroke();
      } else {
        // Trail to the left (desktop)
        const trailGradient = ctx.createLinearGradient(-1200, 0, -BULLET_SIZE / 2, 0);
        trailGradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
        trailGradient.addColorStop(1, 'rgba(255, 255, 255, 0.15)');
        ctx.strokeStyle = trailGradient;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-1200, 0);
        ctx.lineTo(-BULLET_SIZE / 2, 0);
        ctx.stroke();

        // < shape trail
        const chevronGradient = ctx.createLinearGradient(-BULLET_SIZE / 2 - 80, 0, -BULLET_SIZE / 2, 0);
        chevronGradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
        chevronGradient.addColorStop(1, 'rgba(255, 255, 255, 0.15)');
        ctx.strokeStyle = chevronGradient;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-BULLET_SIZE / 2 - 80, -25);
        ctx.lineTo(-BULLET_SIZE / 2 - 10, 0);
        ctx.lineTo(-BULLET_SIZE / 2 - 80, 25);
        ctx.stroke();
      }
    }

    ctx.restore();
  }

  // ============================================
  // DRAW RIPPLE
  // ============================================
  function drawRipple(ripple, index) {
    const age = time - ripple.birthTime;
    const growthProgress = Math.min(age / 1000, 1);

    const wavePhase = (time * 0.00015 - index * 0.08) % (Math.PI * 2);
    const normalizedPhase = wavePhase / (Math.PI * 2);
    const oscillation = normalizedPhase < 0.5 ? (normalizedPhase * 4 - 1) : (3 - normalizedPhase * 4);
    const baseScale = 0.65 + oscillation * 0.25;

    const currentScale = baseScale * growthProgress;

    if (isMobile) {
      // Mobile: horizontal ovals, size descends from bottom (big) to top (small)
      const positionRatio = ripple.y / height;
      const sizeMultiplier = 0.3 + positionRatio * 1.1; // bigger at bottom, smaller at top
      const waveWidth = CONFIG.rippleMaxRadius * 0.6 * currentScale * sizeMultiplier;

      const opacity = CONFIG.rippleOpacity;
      if (waveWidth < 1 || opacity < 0.001) return;

      const horzPhase = ((time * 0.001 + index * 0.2) % (Math.PI * 2)) / (Math.PI * 2);
      const waveOffset = (horzPhase < 0.5 ? (horzPhase * 4 - 1) : (3 - horzPhase * 4)) * 4;

      ctx.save();
      ctx.translate(ripple.x + waveOffset, ripple.y);
      ctx.scale(1, 0.15); // squash vertically into wide horizontal ovals

      ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.3})`;
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.arc(0, 0, waveWidth, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(0, 0, waveWidth, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 1.2})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(0, 0, waveWidth * 0.95, 0, Math.PI * 2);
      ctx.stroke();

      ctx.restore();
    } else {
      // Desktop: vertical ovals, size descends left to right
      const positionRatio = ripple.x / width;
      const sizeMultiplier = 1.4 - positionRatio * 1.1;
      const waveWidth = CONFIG.rippleMaxRadius * currentScale * sizeMultiplier;

      const opacity = CONFIG.rippleOpacity;
      if (waveWidth < 1 || opacity < 0.001) return;

      const vertPhase = ((time * 0.001 + index * 0.2) % (Math.PI * 2)) / (Math.PI * 2);
      const waveOffset = (vertPhase < 0.5 ? (vertPhase * 4 - 1) : (3 - vertPhase * 4)) * 4;

      ctx.save();
      ctx.translate(ripple.x, ripple.y + waveOffset);
      ctx.scale(0.15, 1); // squash horizontally into tall elongated ovals

      ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.3})`;
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.arc(0, 0, waveWidth, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(0, 0, waveWidth, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 1.2})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(0, 0, waveWidth * 0.95, 0, Math.PI * 2);
      ctx.stroke();

      ctx.restore();
    }
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
      document.body.classList.add('animation-complete');
      return;
    }

    // Detect mobile
    isMobile = window.innerWidth <= 768;

    // Lock scrolling until bullet reveals page
    document.body.style.overflow = 'hidden';

    canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;z-index:2;pointer-events:none;';
    container.style.position = 'relative';
    container.insertBefore(canvas, container.firstChild);

    ctx = canvas.getContext('2d');
    handleResize();

    // Load bullet image
    bulletImage = new Image();
    bulletImage.src = 'glock-logo.png';

    // Start firing immediately
    state = 'firing';
    currentSpeed = FAST_SPEED;
    ripples = [];

    // Haptic feedback on supported devices
    if (navigator.vibrate) {
      navigator.vibrate([15, 30, 10]);
    }

    if (isMobile) {
      // Start from very bottom
      bulletX = width * 0.5;
      bulletYPos = height + BULLET_SIZE;
      // Pre-populate ripples
      const mobileInterval = Math.floor(CONFIG.rippleSpawnInterval * 0.6);
      const bottomY = height + 200;
      const topY = -mobileInterval * 2;
      const totalRipples = Math.ceil((bottomY - topY) / mobileInterval);
      for (let i = 0; i < totalRipples; i++) {
        ripples.push({
          x: bulletX,
          y: bottomY - (i * mobileInterval),
          birthTime: performance.now()
        });
      }
      lastRipplePos = bottomY - ((totalRipples - 1) * mobileInterval);
    } else {
      // Start from far left
      bulletX = -BULLET_SIZE;
      bulletYPos = height * CONFIG.bulletY;
      // Pre-populate ripples
      const totalRipples = Math.floor((width + 400) / CONFIG.rippleSpawnInterval);
      for (let i = 0; i < totalRipples; i++) {
        ripples.push({
          x: i * CONFIG.rippleSpawnInterval,
          y: bulletYPos,
          birthTime: performance.now()
        });
      }
      lastRipplePos = totalRipples * CONFIG.rippleSpawnInterval;
    }

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
