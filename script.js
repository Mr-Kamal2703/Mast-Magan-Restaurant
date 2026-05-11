(() => {
  const prefersLight = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
  const savedTheme = localStorage.getItem("mastmagan-theme");
  const theme = savedTheme || (prefersLight ? "light" : "dark");

  const applyTheme = (mode) => {
    document.documentElement.dataset.theme = mode;
    const toggle = document.getElementById("themeToggle");
    if (toggle) {
      const icon = toggle.querySelector("i");
      if (icon) {
        icon.className = mode === "light" ? "fa-solid fa-moon" : "fa-solid fa-sun";
      }
    }
    localStorage.setItem("mastmagan-theme", mode);
  };

  applyTheme(theme);

  document.getElementById("themeToggle")?.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
    applyTheme(next);
  });

  const revealItems = document.querySelectorAll(".reveal");
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealItems.forEach((item) => revealObserver.observe(item));

  const parallaxItems = [
    { el: document.querySelector(".hero-card__image"), rate: 0.06 },
    { el: document.querySelector(".gallery-stack"), rate: 0.04 },
    { el: document.querySelector(".split-visual"), rate: 0.05 },
  ].filter((item) => item.el);

  let parallaxTicking = false;
  const updateParallax = () => {
    const scrollY = window.scrollY;
    parallaxItems.forEach(({ el, rate }) => {
      const offset = Math.max(Math.min(scrollY * rate, 24), -24);
      el.style.transform = `translate3d(0, ${offset}px, 0)`;
    });
    parallaxTicking = false;
  };

  const requestParallaxUpdate = () => {
    if (parallaxTicking) return;
    parallaxTicking = true;
    requestAnimationFrame(updateParallax);
  };

  window.addEventListener("scroll", requestParallaxUpdate, { passive: true });
  requestParallaxUpdate();

  const backToTop = document.getElementById("backToTop");
  const handleScroll = () => {
    if (!backToTop) return;
    backToTop.classList.toggle("show", window.scrollY > 500);
  };
  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();
  backToTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  const counters = document.querySelectorAll(".counter");
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.target || "0");
      const isFloat = String(target).includes(".");
      const duration = 1500;
      const started = performance.now();
      const animate = (now) => {
        const progress = Math.min((now - started) / duration, 1);
        const value = target * (0.15 + 0.85 * progress);
        el.textContent = isFloat ? value.toFixed(1) : Math.round(value).toString();
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
      countObserver.unobserve(el);
    });
  }, { threshold: 0.6 });
  counters.forEach((counter) => countObserver.observe(counter));

  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter;
      document.querySelectorAll(".filter-btn").forEach((b) => b.classList.toggle("active", b === btn));
      document.querySelectorAll("#menuGrid .menu-item").forEach((card) => {
        const match = filter === "all" || card.dataset.category === filter;
        card.style.display = match ? "" : "none";
      });
    });
  });

  const showToast = (message, kind = "success") => {
    const shell = document.getElementById("toastShell");
    if (!shell) return;
    const toast = document.createElement("div");
    toast.className = "toast-message";
    toast.innerHTML = `<strong>${kind === "success" ? "Success" : "Notice"}</strong><div>${message}</div>`;
    shell.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(-8px)";
      setTimeout(() => toast.remove(), 250);
    }, 2500);
  };

  const validateRequired = (form) => {
    const fields = [...form.querySelectorAll("[required]")];
    return fields.every((field) => {
      const ok = String(field.value || "").trim().length > 0;
      field.classList.toggle("is-invalid", !ok);
      return ok;
    });
  };

  const bookingForm = document.getElementById("bookingForm");
  bookingForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!validateRequired(bookingForm)) {
      showToast("Please complete the required reservation fields.", "notice");
      return;
    }
    bookingForm.reset();
    document.querySelectorAll("#bookingForm .is-invalid").forEach((el) => el.classList.remove("is-invalid"));
    showToast("Your reservation request has been received. We'll confirm shortly.");
  });

  const contactForm = document.getElementById("contactForm");
  contactForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!validateRequired(contactForm)) {
      showToast("Please fill in your contact details and message.", "notice");
      return;
    }
    contactForm.reset();
    document.querySelectorAll("#contactForm .is-invalid").forEach((el) => el.classList.remove("is-invalid"));
    showToast("Thanks for reaching out. Our team will reply soon.");
  });
})();
