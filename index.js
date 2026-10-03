(() => {
  const canvas = document.getElementById("bg-effects");
  const ctx = canvas.getContext("2d");

  let width = 0;
  let height = 0;
  let dpr = 1;

  const MAX_WIND_ANGLE = Math.PI / 4;
  let windAngle = 0;
  let targetWindAngle = 0;

  const mouse = {
    x: -1000,
    y: -1000,
    active: false,
  };

  const particles = [];
  const PARTICLE_DENSITY = 0.000575;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    createParticles();
  }

  function createParticles() {
    particles.length = 0;

    const count = Math.max(700, Math.floor(width * height * PARTICLE_DENSITY));

    for (let i = 0; i < count; i++) {
      particles.push({
        // Each particle has a fixed "home" track. The track itself is
        // horizontal; wind changes the particle's trajectory without
        // collapsing all particles onto one Y coordinate.
        homeY: Math.random() * height,

        // Position along the track.
        x: Math.random() * width,

        // Vertical displacement caused by the wind.
        windOffset: 0,

        // Mouse-induced displacement from its track.
        mouseOffset: 0,

        speed: 35 + Math.random() * 80,
        size: 0.35 + Math.random() * 1.1,
        opacity: 0.3 + Math.random() * 0.6,

        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.4 + Math.random() * 1.4,
        wobbleAmount: 0.3 + Math.random() * 1.7,
      });
    }
  }

  window.addEventListener("resize", resize);

  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;

    const normalized = (e.clientY / Math.max(1, height)) * 2 - 1;
    targetWindAngle = normalized * MAX_WIND_ANGLE;
  });

  window.addEventListener("mouseleave", () => {
    mouse.active = false;
    targetWindAngle = 0;
  });

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  let lastTime = performance.now();

  function frame(now) {
    // pulse associated with mouse
    const pulseDuration = 2200;
    // Number oscilating between 1 and 0.6.
    const mousePulse =
      1 -
      Math.abs(((performance.now() % pulseDuration) / pulseDuration) * 2 - 1) *
        0.3;

    const dt = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;

    // ~4 seconds to substantially change 30 degrees.
    const response = 1 - Math.exp(-dt / 4);
    windAngle = lerp(windAngle, targetWindAngle, response);

    ctx.clearRect(0, 0, width, height);

    const dx = Math.cos(windAngle);
    const dy = Math.sin(windAngle);

    for (const p of particles) {
      // Always advance horizontally. This keeps each particle associated
      // with its own original track instead of moving the track itself.
      p.x += p.speed * dx * dt;

      // Wind gradually bends the particle away from its horizontal track.
      // The vertical velocity is damped, so particles do not permanently
      // drift toward the top/bottom of the screen.
      const windTarget = Math.sin(windAngle) * p.speed * 0.45;
      p.windOffset += (windTarget - p.windOffset) * (1 - Math.exp(-dt * 1.8));
      p.windOffset += dy * p.speed * 0.35 * dt;

      // Mouse attraction.
      const baseY = p.homeY + p.windOffset;
      const mx = mouse.x - p.x;
      const my = mouse.y - baseY;
      const distance = Math.hypot(mx, my);

      const INNER_RADIUS = 30 / mousePulse;
      const OUTER_RADIUS = 200 / mousePulse;

      let influence = 0;

      if (mouse.active && distance < OUTER_RADIUS) {
        const t =
          1 -
          Math.max(0, distance - INNER_RADIUS) / (OUTER_RADIUS - INNER_RADIUS);
        influence = t * t * (3 - 2 * t);
      }

      // Pull toward the cursor, but only enough to visibly bend the stream.
      const desiredMouseOffset = distance > 0.001 ? my * influence * 0.55 : 0;

      p.mouseOffset = lerp(
        p.mouseOffset,
        desiredMouseOffset,
        1 - Math.exp(-dt * 7),
      );

      p.wobble += p.wobbleSpeed * dt;

      const naturalWobble = Math.sin(p.wobble) * p.wobbleAmount;

      const drawX = p.x;
      const drawY = baseY + p.mouseOffset + naturalWobble;

      // Wrap horizontally while preserving the particle's original Y track.
      if (p.x > width + 30) {
        p.x = -30;
      } else if (p.x < -30) {
        p.x = width + 30;
      }

      // Keep wind displacement bounded at the screen edges.
      if (drawY < -40 || drawY > height + 40) {
        p.windOffset *= 0.85;
      }

      const length = p.size * (2.0 + p.speed / 45);

      ctx.save();
      ctx.translate(drawX, drawY);
      ctx.rotate(windAngle);

      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = "#d8bd7c";
      ctx.fillRect(-length * 0.5, -p.size * 0.5, length, p.size);

      ctx.restore();
    }

    // Soft ambient glow centered around the mouse.
    // It is drawn after the particles so the cursor area has a subtle
    // illuminated, hazy atmosphere rather than a hard spotlight.
    if (mouse.active) {
      const glow = ctx.createRadialGradient(
        mouse.x,
        mouse.y,
        0,
        mouse.x,
        mouse.y,
        60,
      );

      const radius = mousePulse;

      glow.addColorStop(0, "rgba(255, 220, 150, 0.30)");
      glow.addColorStop((radius / 3) * 0.4, "rgba(255, 220, 150, 0.30)");
      glow.addColorStop(radius / 3, "rgba(255, 210, 130, 0.20)");
      glow.addColorStop((radius / 2) * 0.8, "rgba(255, 220, 150, 0.20)");
      glow.addColorStop((radius / 2) * 1.2, "rgba(255, 210, 130, 0.10)");
      glow.addColorStop(radius * 0.8, "rgba(255, 210, 130, 0.10)");
      glow.addColorStop(radius, "rgba(255, 200, 120, 0)");

      ctx.fillStyle = glow;
      ctx.fillRect(mouse.x - 180, mouse.y - 180, 360, 360);
    }

    requestAnimationFrame(frame);
  }

  resize();
  requestAnimationFrame(frame);
})();
