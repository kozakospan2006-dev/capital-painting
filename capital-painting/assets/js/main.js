window.initSite = () => {
  // year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // active nav link (+ group Services for subpages)
  try {
    const path = (location.pathname.split("/").pop() || "index.html").toLowerCase();

    const serviceGroup = new Set([
      "services.html",
      "commercial-painting.html",
      "residential-painting.html",
      "prep-repairs-coatings.html",
    ]);

    document.querySelectorAll(".nav__link").forEach(a => a.classList.remove("is-active"));

    // 1) mark exact match
    document.querySelectorAll(".nav__link").forEach(a => {
      const href = (a.getAttribute("href") || "").toLowerCase().replace("./", "");
      if (href && href.endsWith(path)) a.classList.add("is-active");
    });

    // 2) if we're on a service subpage, force Services active
    if (serviceGroup.has(path)) {
      const servicesToggle = document.querySelector(".dropdown__toggle");
      if (servicesToggle) servicesToggle.classList.add("is-active");
    }
  } catch {}

  // mobile nav
  const toggle = document.querySelector("[data-nav-toggle]");
  const menu = document.querySelector("[data-nav-menu]");
  if (toggle && menu) {
    const closeMenu = () => {
      menu.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    };

    toggle.addEventListener("click", () => {
      const open = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });

    document.addEventListener("click", (e) => {
      if (!menu.classList.contains("is-open")) return;
      const inside = menu.contains(e.target) || toggle.contains(e.target);
      if (!inside) closeMenu();
    });
  }

 // estimate form (Formspree - automatic submit)
const form = document.getElementById("estimateForm");
const msg = document.getElementById("formMsg");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = new FormData(form);
    const required = ["name","phone","email","type","timeline","location","details"];

    for (const key of required) {
      if (!String(data.get(key) || "").trim()) {
        if (msg) msg.textContent = "Please fill out all required fields.";
        return;
      }
    }

    // nicer subject in inbox
    const subject = `Estimate Request - ${data.get("type")} (${data.get("location")})`;
    data.set("_subject", subject);

    try {
      if (msg) msg.textContent = "Sending…";

      const res = await fetch(form.action, {
        method: "POST",
        body: data,
        headers: { "Accept": "application/json" }
      });

      if (res.ok) {
        if (msg) msg.textContent = "Thank you — we received your request and will respond soon.";
        form.reset();
      } else {
        if (msg) msg.textContent = "Something went wrong. Please call us or try again.";
      }
    } catch (err) {
      if (msg) msg.textContent = "Network error. Please call us or try again.";
    }
  });
}


  // Dropdown (Services): click only on touch (mobile), hover handled by CSS on desktop
const dd = document.querySelector("[data-dropdown]");
const ddBtn = document.querySelector("[data-dropdown-toggle]");

if (dd && ddBtn) {
  const isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;

  const closeDd = () => {
    dd.classList.remove("is-open");
    ddBtn.setAttribute("aria-expanded", "false");
  };

  // Mobile: click to toggle
  if (isTouch) {
    ddBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const open = dd.classList.toggle("is-open");
      ddBtn.setAttribute("aria-expanded", String(open));
    });

    document.addEventListener("click", (e) => {
      if (!dd.classList.contains("is-open")) return;
      if (!dd.contains(e.target)) closeDd();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeDd();
    });
  } else {
    // Desktop: ensure aria-expanded stays sane (menu opens via CSS hover/focus)
    ddBtn.setAttribute("aria-expanded", "false");
  }
}
  // Hero rotating TITLE (index only)
  const heroTitleRotate = document.querySelector("[data-hero-rotate-title]");
  if (heroTitleRotate) {
    const lines = [
      "Commercial & Residential",
      "Interior & Exterior",
      "Offices, Retail, HOAs",
      "Prep-First. Clean Finish.",
      "Reliable Scheduling"
    ];

    let i = 0;
    const intervalMs = 3200;

    setInterval(() => {
      heroTitleRotate.classList.add("is-fading");

      setTimeout(() => {
        i = (i + 1) % lines.length;
        heroTitleRotate.textContent = lines[i];
        heroTitleRotate.classList.remove("is-fading");
      }, 260);

    }, intervalMs);
  }
    // Hero rotating headline (index)
  const heroRotate = document.querySelector("[data-hero-rotate]");
  if (heroRotate) {
    const lines = [
  "Commercial & Residential Painting",
  "Detail-Focused Prep. Consistent Results.",
  "Interior & Exterior Finishes",
  "Clean Lines. Even Coverage.",
  "Protection, Prep, Prime — Done Right.",
  "Durable Coating Systems That Hold Up",
  "Phased / After-Hours Scheduling Available",
  "Clear Proposals. No Surprises.",
  "Respect for Your Space, Start to Finish",
  "Since 1975 — Craftsmanship You Can Trust"
];


    let i = 0;
    const intervalMs = 3200;

    setInterval(() => {
      heroRotate.classList.add("is-fading");

      setTimeout(() => {
        i = (i + 1) % lines.length;
        heroRotate.textContent = lines[i];
        heroRotate.classList.remove("is-fading");
      }, 260);

    }, intervalMs);
  }
// Email chooser modal
const chooserBtn = document.querySelector("[data-email-chooser]");
const modal = document.getElementById("emailChooser");
const closeEls = document.querySelectorAll("[data-email-close]");

if (chooserBtn && modal) {
  const to = "capitalpainting.info@gmail.com";

  const subject = ""; // optional
  const body = "";    // optional

  const mailto = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  // Outlook web compose
  const outlook = `https://outlook.office.com/mail/deeplink/compose?to=${encodeURIComponent(to)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  // Gmail web compose
  const gmail = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  const aDefault = document.getElementById("emailDefault");
  const aOutlook = document.getElementById("emailOutlook");
  const aGmail = document.getElementById("emailGmail");

  if (aDefault) aDefault.href = mailto;
  if (aOutlook) { aOutlook.href = outlook; aOutlook.target = "_blank"; aOutlook.rel = "noopener"; }
  if (aGmail)   { aGmail.href = gmail;     aGmail.target = "_blank";   aGmail.rel = "noopener"; }

  const open = () => {
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const close = () => {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  chooserBtn.addEventListener("click", open);

  closeEls.forEach(el => el.addEventListener("click", close));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) close();
  });
}

};

