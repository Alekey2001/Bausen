/* BAUSEN - Términos (UI only)
   - Menú móvil (drawer)
   - Smooth scroll + active section highlight
   - Copiar enlace
   - “Descargar PDF” (imprimir)
   - Botón “Volver a Servicios” se habilita si aceptas checkbox
*/

(function () {
  const qs = (s, p = document) => p.querySelector(s);
  const qsa = (s, p = document) => Array.from(p.querySelectorAll(s));

  // Drawer (mobile)
  const navBtn = qs("#navbtn");
  const drawer = qs("#drawer");
  const drawerClose = qs("#drawerClose");
  const drawerBackdrop = qs("#drawerBackdrop");

  function openDrawer() {
    if (!drawer || !navBtn) return;
    drawer.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
    navBtn.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }
  function closeDrawer() {
    if (!drawer || !navBtn) return;
    drawer.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    navBtn.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  navBtn && navBtn.addEventListener("click", () => {
    const isOpen = drawer && drawer.classList.contains("is-open");
    isOpen ? closeDrawer() : openDrawer();
  });
  drawerClose && drawerClose.addEventListener("click", closeDrawer);
  drawerBackdrop && drawerBackdrop.addEventListener("click", closeDrawer);
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDrawer();
  });

  // Close drawer on link click (mobile)
  qsa(".drawer__link").forEach((a) => a.addEventListener("click", closeDrawer));

  // Smooth scroll for in-page anchors
  qsa('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (!href || href === "#") return;
      const target = qs(href);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", href);
    });
  });

  // Active section highlight (rail nav)
  const railLinks = qsa(".rail__link");
  const sections = railLinks
    .map((l) => qs(l.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window && railLinks.length && sections.length) {
    const byId = new Map();
    railLinks.forEach((l) => {
      const id = (l.getAttribute("href") || "").replace("#", "");
      if (id) byId.set(id, l);
    });

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((x) => x.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;

        const id = visible.target.id;
        railLinks.forEach((l) => l.classList.remove("is-active"));
        const active = byId.get(id);
        active && active.classList.add("is-active");
      },
      { root: null, threshold: [0.15, 0.35, 0.55], rootMargin: "-20% 0px -65% 0px" }
    );

    sections.forEach((s) => io.observe(s));
  }

  // Copy link
  const copyBtn = qs("#copyLinkBtn");
  copyBtn &&
    copyBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(location.href);
        copyBtn.textContent = "¡Copiado!";
        setTimeout(() => (copyBtn.textContent = "Copiar enlace"), 1200);
      } catch {
        const tmp = document.createElement("input");
        tmp.value = location.href;
        document.body.appendChild(tmp);
        tmp.select();
        document.execCommand("copy");
        document.body.removeChild(tmp);
        copyBtn.textContent = "¡Copiado!";
        setTimeout(() => (copyBtn.textContent = "Copiar enlace"), 1200);
      }
    });

  // Download as PDF via print
  const downloadBtn = qs("#downloadBtn");
  downloadBtn && downloadBtn.addEventListener("click", () => window.print());

  // Accept -> enable back button
  const acceptCheck = qs("#acceptCheck");
  const backBtn = qs("#backBtn");
  function syncAccept() {
    if (!acceptCheck || !backBtn) return;
    const ok = !!acceptCheck.checked;
    backBtn.classList.toggle("btn--disabled", !ok);
    backBtn.setAttribute("aria-disabled", ok ? "false" : "true");
  }
  acceptCheck && acceptCheck.addEventListener("change", syncAccept);
  syncAccept();
})();
