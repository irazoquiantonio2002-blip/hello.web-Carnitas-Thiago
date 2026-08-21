(() => {
  const body = document.body;
  body.classList.add("is-loading");

  window.addEventListener("load", () => {
    const loader = document.getElementById("loading-screen");
    setTimeout(() => {
      loader?.classList.add("is-hidden");
      body.classList.remove("is-loading");
    }, 450);
  });

  const header = document.getElementById("site-header");
  const nav = document.getElementById("main-nav");
  const toggle = document.getElementById("nav-toggle");
  const navLinks = document.querySelectorAll(".nav-link");

  const onScroll = () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 24);
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  toggle?.addEventListener("click", () => {
    const isOpen = nav?.classList.toggle("is-open");
    toggle.classList.toggle("is-open", Boolean(isOpen));
    toggle.setAttribute("aria-expanded", String(Boolean(isOpen)));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      nav?.classList.remove("is-open");
      toggle?.classList.remove("is-open");
      toggle?.setAttribute("aria-expanded", "false");
    });
  });

  const sections = [...document.querySelectorAll("main section[id]")];
  const updateActiveLink = () => {
    const current = sections.find((section) => {
      const rect = section.getBoundingClientRect();
      return rect.top <= 160 && rect.bottom >= 160;
    });

    navLinks.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${current?.id}`);
    });
  };

  window.addEventListener("scroll", updateActiveLink, { passive: true });
  updateActiveLink();

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });

  document.querySelectorAll("[data-reveal]").forEach((element) => revealObserver.observe(element));

  const typewriter = document.getElementById("typewriter");
  const words = ["tacos de maciza", "gorditas", "chamorro con cueritos", "carnitas por kilo", "paquetes para eventos"];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  const type = () => {
    if (!typewriter) return;

    const current = words[wordIndex];
    typewriter.textContent = current.slice(0, charIndex);

    if (!isDeleting && charIndex < current.length) {
      charIndex += 1;
      setTimeout(type, 75);
      return;
    }

    if (!isDeleting && charIndex === current.length) {
      isDeleting = true;
      setTimeout(type, 1300);
      return;
    }

    if (isDeleting && charIndex > 0) {
      charIndex -= 1;
      setTimeout(type, 40);
      return;
    }

    isDeleting = false;
    wordIndex = (wordIndex + 1) % words.length;
    setTimeout(type, 260);
  };

  type();

  const canvas = document.getElementById("particles-canvas");
  const ctx = canvas?.getContext("2d");

  if (canvas && ctx) {
    let width = 0;
    let height = 0;
    let particles = [];

    const resize = () => {
      const ratio = window.devicePixelRatio || 1;
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      particles = Array.from({ length: Math.min(90, Math.floor(width / 14)) }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2.4 + 0.8,
        speed: Math.random() * 0.35 + 0.18,
        drift: Math.random() * 0.5 - 0.25,
        alpha: Math.random() * 0.45 + 0.2
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((particle) => {
        particle.y -= particle.speed;
        particle.x += particle.drift;

        if (particle.y < -8) {
          particle.y = height + 8;
          particle.x = Math.random() * width;
        }

        if (particle.x < -8) particle.x = width + 8;
        if (particle.x > width + 8) particle.x = -8;

        const gradient = ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          particle.radius * 4
        );
        gradient.addColorStop(0, `rgba(248, 215, 28, ${particle.alpha})`);
        gradient.addColorStop(1, "rgba(248, 215, 28, 0)");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius * 4, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
  }

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
