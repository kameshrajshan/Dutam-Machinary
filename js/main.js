const header = document.querySelector(".site-header");
const menuButton = document.querySelector(".menu-btn");
const nav = document.querySelector(".nav-links");

window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 8);
}, { passive: true });

menuButton.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuButton.classList.toggle("open", open);
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", open ? "Close menu" : "Open menu");
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
    const preview = row.dataset.preview || root.dataset.preview;
    row.classList.add("active");
    row.querySelector(".end").innerHTML = `<span class="thumb" style="background-image:url('${preview}')"></span><span class="bubble">${chevron}</span>`;
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
  const steps = {
    requirement: {
      kicker: "Requirement",
      title: "The operation, the part, the objective.",
      body: "The production requirement, the specification, and the objective.",
      image: "images/custom.jpg",
      alt: "A prototype assembly and an engineering drawing on the bench",
      points: [
        ["01", "Operation", "The operation, the part, and what you need."],
        ["02", "Specification", "Work built against your specification."],
        ["03", "Objective", "The production requirement and the objective."]
      ]
    },
    design: {
      kicker: "Design",
      title: "The solution, in CAD.",
      body: "The solution, developed in CAD.",
      image: "images/cadcam.jpg",
      alt: "A CAD model of a flange beside the machined parts",
      points: [
        ["01", "Requirement", "The operation, the part, the objective."],
        ["02", "CAD", "The solution, developed in CAD."],
        ["03", "Accuracy", "Components and machines made to strict dimensional accuracy."]
      ]
    },
    manufacturing: {
      kicker: "Manufacturing",
      title: "Machining and fabrication.",
      body: "Machining and fabrication of the agreed design.",
      image: "images/shop.jpg",
      alt: "A CNC machining center on the shop floor",
      points: [
        ["01", "Design", "The agreed design."],
        ["02", "Machining", "Machining and fabrication of the agreed design."],
        ["03", "Consistency", "Each part and machine stays consistent with the specification."]
      ]
    },
    inspection: {
      kicker: "Inspection",
      title: "Checked at every stage.",
      body: "Components and machines are inspected from machining through to the finished part, against your specification.",
      image: "images/parts.jpg",
      alt: "Precision shafts, a gear, a flange, and a bush",
      points: [
        ["01", "Requirement", "The operation, the part, the objective."],
        ["02", "Design", "The solution, in CAD."],
        ["03", "Support", "Install, train, stay with it."]
      ]
    },
    delivery: {
      kicker: "Delivery",
      title: "Install, train, stay with it.",
      body: "Delivery, installation, training, and after-sales support.",
      image: "images/spm.jpg",
      alt: "A finished special-purpose machine on the shop floor",
      points: [
        ["01", "Delivery", "The finished machine or part, before delivery."],
        ["02", "Installation", "Installation and training."],
        ["03", "Support", "After-sales support."]
      ]
    }
  };
  const kicker = project.querySelector("[data-project-kicker]");
  const title = project.querySelector("[data-project-title]");
  const body = project.querySelector("[data-project-body]");
  const points = project.querySelector("[data-project-points]");
  const photo = project.querySelector("[data-project-photo]");
  const tabs = [...project.querySelectorAll("[data-step]")];

  function show(step) {
    const data = steps[step];
    if (!data) return;
    tabs.forEach((tab) => {
      const on = tab.dataset.step === step;
      tab.classList.toggle("active", on);
      tab.setAttribute("aria-selected", String(on));
    });
    kicker.textContent = data.kicker;
    title.textContent = data.title;
    body.textContent = data.body;
    photo.src = data.image;
    photo.alt = data.alt;
    points.innerHTML = data.points.map(([num, name, text]) => `<div><span>${num}</span><strong>${name}</strong><p>${text}</p></div>`).join("");
  }

  tabs.forEach((tab) => {
    tab.addEventListener("mouseenter", () => show(tab.dataset.step));
    tab.addEventListener("focus", () => show(tab.dataset.step));
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
