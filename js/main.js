const chrome = document.querySelector(".site-chrome");
const menuButton = document.querySelector(".menu-btn");
const nav = document.querySelector(".nav-links");
const motionAllowed = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

window.addEventListener("scroll", () => {
  chrome?.classList.toggle("scrolled", window.scrollY > 8);
}, { passive: true });

menuButton?.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuButton.classList.toggle("open", open);
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", open ? "Close menu" : "Open menu");
});

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    if (!nav.classList.contains("open")) return;
    nav.classList.remove("open");
    menuButton.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open menu");
  });
});

const chevron = `<svg class="chev" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3.5 10.5 8 6 12.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path></svg>`;

document.querySelectorAll("[data-work]").forEach((root) => {
  const rows = [...root.querySelectorAll(".work-row")];

  function clear(row) {
    row.classList.remove("active");
    row.querySelector(".end").innerHTML = chevron;
  }

  function activate(row) {
    rows.forEach((item) => { if (item !== row) clear(item); });
    row.classList.add("active");
    row.querySelector(".end").innerHTML = `<span class="bubble">${chevron}</span>`;
  }

  rows.forEach((row) => {
    clear(row);
    row.addEventListener("mouseenter", () => activate(row));
    row.addEventListener("mouseleave", () => clear(row));
    row.addEventListener("focus", () => activate(row));
    row.addEventListener("blur", () => clear(row));
  });
});

const project = document.querySelector("[data-project]");
if (project) {
  const items = [...project.querySelectorAll(".project-step")];

  function pulsePanel(panel) {
    if (!motionAllowed) return;
    const inner = panel.querySelector(".project-step-panel");
    if (!inner) return;
    inner.classList.remove("motion-panel-enter");
    void inner.offsetWidth;
    inner.classList.add("motion-panel-enter");
  }

  function setOpen(item, open, { animate = true } = {}) {
    const toggle = item.querySelector(".project-step-toggle");
    const panel = item.querySelector(".project-step-collapse");
    item.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    panel.toggleAttribute("inert", !open);
    panel.setAttribute("aria-hidden", String(!open));
    if (open && animate) pulsePanel(panel);
  }

  function openStep(target) {
    if (target.classList.contains("is-open")) return;
    target.querySelector(".project-step-toggle").focus({ preventScroll: true });
    items.forEach((item) => setOpen(item, item === target));
  }

  items.forEach((item) => {
    setOpen(item, item.classList.contains("is-open"), { animate: false });
    item.querySelector(".project-step-toggle").addEventListener("click", (event) => {
      event.preventDefault();
      openStep(item);
    });
  });
}

const contactForm = document.querySelector("#quote-form");
if (contactForm) {
  const note = new URLSearchParams(window.location.search).get("note");
  if (note) contactForm.elements.description.value = note;

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(contactForm).entries());
    const saved = JSON.parse(sessionStorage.getItem("dutam-enquiries") || "[]");
    saved.push({ ...data, at: new Date().toISOString() });
    sessionStorage.setItem("dutam-enquiries", JSON.stringify(saved));
    contactForm.outerHTML = `<div class="form-card thanks"><h2>Thank you.</h2><p>We have the details of this enquiry. A delivery address is not connected yet, so it is kept in this browser only.</p></div>`;
  });
}

if (motionAllowed) {
  document.documentElement.classList.add("motion-ready");

  [
    ".hero-center .hero-copy > *",
    ".hero-statement .statement > *",
    ".hero-navy h1",
    ".hero-navy .note",
    ".bento-hero-copy > *",
  ].forEach((selector) => {
    document.querySelectorAll(selector).forEach((el, index) => {
      el.classList.add("motion-hero-item");
      el.style.setProperty("--motion-delay", `${0.1 + index * 0.07}s`);
    });
  });

  [
    ".section-head",
    ".project-intro",
    ".industries-home-intro",
    ".facility-copy",
    ".detail .wrap > .eyebrow",
    ".detail .wrap > h2",
    ".detail-lead",
    ".contact-band",
    ".section.close .wrap > *",
    ".prose > *",
    ".process-photo",
    ".facility-photo",
    ".bento-section + .section .section-head",
  ].forEach((selector) => {
    document.querySelectorAll(selector).forEach((el) => el.classList.add("motion-reveal"));
  });

  const staggerRoots = [
    ".cap-grid",
    ".steps",
    ".quotes",
    ".industry-index",
    ".equip-grid",
    ".bento-section",
    ".project-steps",
  ];
  staggerRoots.forEach((selector) => {
    document.querySelectorAll(selector).forEach((root) => {
      root.classList.add("motion-stagger");
      [...root.children].forEach((child, index) => {
        child.classList.add("motion-stagger-child");
        child.style.setProperty("--motion-delay", `${Math.min(index * 0.05, 0.4)}s`);
      });
    });
  });

  document.querySelectorAll("[data-work]").forEach((root) => {
    root.classList.add("motion-stagger");
    [...root.querySelectorAll(".work-row")].forEach((row, index) => {
      row.classList.add("motion-stagger-child");
      row.style.setProperty("--motion-delay", `${Math.min(index * 0.04, 0.45)}s`);
    });
  });

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-inview");
        revealObserver.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0.08 },
  );

  document.querySelectorAll(".motion-reveal, .motion-stagger").forEach((el) => revealObserver.observe(el));
}
