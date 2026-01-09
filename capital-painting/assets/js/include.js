async function includePartials() {
  const targets = document.querySelectorAll("[data-include]");
  for (const el of targets) {
    const file = el.getAttribute("data-include");
    const res = await fetch(file, { cache: "no-cache" });
    if (!res.ok) {
      console.error("Include failed:", file, res.status);
      continue;
    }
    el.innerHTML = await res.text();
  }
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = src;
    s.defer = true;
    s.onload = resolve;
    s.onerror = reject;
    document.body.appendChild(s);
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  await includePartials();

  // load main AFTER header/footer exist
  await loadScript("./assets/js/main.js");

  // run init after main loads
  if (typeof window.initSite === "function") window.initSite();
});
