// Navbar: efek glass saat scroll, menu mobile, dan penanda menu aktif
(() => {
  const bar = document.getElementById("nav-bar");
  const btn = document.getElementById("nav-toggle");
  const menu = document.getElementById("m-menu");
  const icOpen = document.getElementById("ic-open");
  const icClose = document.getElementById("ic-close");

  const onScroll = () =>
    bar.classList.toggle("is-scrolled", window.scrollY > 24);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const setMenu = (open) => {
    menu.classList.toggle("open", open);
    btn.setAttribute("aria-expanded", String(open));
    btn.setAttribute("aria-label", open ? "Tutup menu" : "Buka menu");
    icOpen.classList.toggle("hidden", open);
    icClose.classList.toggle("hidden", !open);
  };
  btn.addEventListener("click", () =>
    setMenu(!menu.classList.contains("open")),
  );
  menu
    .querySelectorAll("a")
    .forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setMenu(false);
  });
  window
    .matchMedia("(min-width: 768px)")
    .addEventListener("change", () => setMenu(false));

  // Tandai link menu sesuai section yang sedang dilihat
  const links = document.querySelectorAll(".nav-link");
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        links.forEach((l) =>
          l.classList.toggle(
            "is-active",
            l.getAttribute("href") === "#" + en.target.id,
          ),
        );
      });
    },
    { rootMargin: "-45% 0px -50% 0px" },
  );
  document.querySelectorAll("[data-section]").forEach((s) => io.observe(s));
})();
