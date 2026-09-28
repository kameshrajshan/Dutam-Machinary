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
  const preview = root.dataset.preview;

  function activate(row) {
    rows.forEach((item) => {
      item.classList.remove("active");
      const end = item.querySelector(".end");
      end.innerHTML = chevron;
    });
    row.classList.add("active");
    const end = row.querySelector(".end");
    end.innerHTML = `<span class="thumb" style="background-image:url('${preview}')"></span><span class="bubble">${chevron}</span>`;
  }

  const current = rows.find((row) => row.classList.contains("active")) || rows[0];
  if (current) activate(current);
  rows.forEach((row) => {
    row.addEventListener("mouseenter", () => activate(row));
    row.addEventListener("focus", () => activate(row));
  });
});

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
