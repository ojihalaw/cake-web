// Produk dinamis dari data.json: satu section per produk, gambar kiri/kanan selang-seling
const PLATFORMS = {
  shopee: { label: "Beli di Shopee", cls: "bg-[#EE4D2D] hover:bg-[#c93d20]" },
  gofood: { label: "Pesan di GoFood", cls: "bg-[#00880C] hover:bg-[#006b09]" },
};

const $ = (s) => document.querySelector(s);
const rupiah = (n) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
const esc = (s = "") =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );

function buyButtons(p) {
  const ks = Object.keys(PLATFORMS).filter((k) => p[k]);
  if (!ks.length)
    return '<p class="text-ink/60">Produk ini belum tersedia untuk dipesan online.</p>';
  return ks
    .map(
      (k) =>
        `<a href="${esc(p[k])}" target="_blank" rel="noopener noreferrer" class="btn text-white ${PLATFORMS[k].cls}">${PLATFORMS[k].label}</a>`,
    )
    .join("");
}

function productSection(p, i) {
  const flip = i % 2 === 1; // item genap: gambar kiri, ganjil: gambar kanan
  const bg = flip ? "bg-mist" : "bg-blush";
  const img = p.image
    ? `<img src="${esc(p.image)}" alt="${esc(p.name)}" loading="lazy" class="absolute inset-0 w-full h-full object-cover" onerror="this.onerror=null;this.remove()">`
    : "";
  return `
    <article class="${bg} rounded-[2rem] md:rounded-[2.5rem] p-6 sm:p-10 md:p-14 grid md:grid-cols-2 gap-8 md:gap-14 items-center">
      <div class="${flip ? "md:order-2" : ""}">
        <div class="relative rounded-[1.75rem] overflow-hidden aspect-[4/3] bg-white/70 flex items-center justify-center text-8xl shadow-[0_16px_40px_rgba(23,23,26,.10)]">
          <span aria-hidden="true">${esc(p.emoji || "🍞")}</span>
          ${img}
          ${p.badge ? `<span class="absolute top-4 left-4 bg-butter text-ink text-sm font-bold px-4 py-1.5 rounded-full">${esc(p.badge)}</span>` : ""}
        </div>
      </div>
      <div class="${flip ? "md:order-1" : ""}">
        <h3 class="font-display font-semibold text-3xl sm:text-4xl md:text-5xl leading-tight">${esc(p.name)}</h3>
        <p class="mt-3 text-2xl font-semibold text-berry">${rupiah(p.price)}</p>
        <p class="mt-5 text-lg leading-8 text-ink/80 max-w-xl">${esc(p.description)}</p>
        ${p.ingredients ? `<p class="mt-4 text-[17px] text-ink/70 max-w-xl"><span class="font-semibold text-ink">Bahan:</span> ${esc(p.ingredients)}</p>` : ""}
        <div class="mt-7 flex flex-col sm:flex-row flex-wrap gap-3">${buyButtons(p)}</div>
      </div>
    </article>`;
}

// ---------- Testimoni ----------
const star = (on) =>
  `<svg class="w-5 h-5 ${on ? "text-berry" : "text-ink/15"}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m12 2.5 2.9 6 6.6.9-4.8 4.6 1.2 6.5-5.9-3.1-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9L12 2.5Z"/></svg>`;

function testimonialCard(t) {
  const r = Math.max(0, Math.min(5, Number(t.rating) || 5));
  return `
    <figure class="snap-start shrink-0 w-[85%] sm:w-[calc(50%_-_0.625rem)] lg:w-[calc(33.333%_-_0.84rem)] bg-blush rounded-3xl p-7 flex flex-col">
      <div class="flex gap-0.5" role="img" aria-label="Rating ${r} dari 5">${[1, 2, 3, 4, 5].map((n) => star(n <= r)).join("")}</div>
      <blockquote class="mt-4 text-lg leading-8 text-ink/85 grow">&ldquo;${esc(t.text)}&rdquo;</blockquote>
      <figcaption class="mt-6 flex items-center gap-3">
        <span class="w-12 h-12 rounded-full bg-berry text-white font-display font-semibold text-xl flex items-center justify-center shrink-0" aria-hidden="true">${esc((t.name || "?").charAt(0))}</span>
        <span><span class="block font-semibold">${esc(t.name)}</span><span class="block text-[15px] text-ink/65">${esc(t.role)}</span></span>
      </figcaption>
    </figure>`;
}

function initCarousel() {
  const track = $("#testi-track"),
    prev = $("#testi-prev"),
    next = $("#testi-next"),
    dots = $("#testi-dots");
  const cards = [...track.children];
  const step = () =>
    cards[0].getBoundingClientRect().width +
    (parseFloat(getComputedStyle(track).columnGap) || 20);

  dots.innerHTML = cards
    .map(
      (_, i) =>
        `<button type="button" data-i="${i}" class="h-2.5 rounded-full transition-all bg-ink/20" aria-label="Testimoni ${i + 1}"></button>`,
    )
    .join("");

  const update = () => {
    const max = track.scrollWidth - track.clientWidth;
    let i = Math.round(track.scrollLeft / step());
    if (track.scrollLeft >= max - 4) i = cards.length - 1;
    i = Math.max(0, Math.min(cards.length - 1, i));
    dots.querySelectorAll("button").forEach((b, n) => {
      b.className =
        "h-2.5 rounded-full transition-all " +
        (n === i ? "w-7 bg-berry" : "w-2.5 bg-ink/20");
      b.setAttribute("aria-current", n === i ? "true" : "false");
    });
    prev.disabled = track.scrollLeft <= 4;
    next.disabled = track.scrollLeft >= max - 4;
  };
  let raf = 0;
  track.addEventListener(
    "scroll",
    () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    },
    { passive: true },
  );
  window.addEventListener("resize", update);
  update();

  prev.addEventListener("click", () => track.scrollBy({ left: -step() }));
  next.addEventListener("click", () => track.scrollBy({ left: step() }));
  dots.addEventListener("click", (e) => {
    const b = e.target.closest("[data-i]");
    if (b) track.scrollTo({ left: Number(b.dataset.i) * step() });
  });
  track.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      track.scrollBy({ left: step() });
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      track.scrollBy({ left: -step() });
    }
  });

  // Geser dengan mouse (di layar sentuh sudah native)
  let down = false,
    startX = 0,
    startL = 0;
  track.addEventListener("pointerdown", (e) => {
    if (e.pointerType !== "mouse") return;
    down = true;
    startX = e.clientX;
    startL = track.scrollLeft;
    track.style.scrollSnapType = "none";
    track.style.scrollBehavior = "auto";
    track.classList.replace("cursor-grab", "cursor-grabbing");
  });
  window.addEventListener("pointermove", (e) => {
    if (down) track.scrollLeft = startL - (e.clientX - startX);
  });
  const end = () => {
    if (!down) return;
    down = false;
    track.classList.replace("cursor-grabbing", "cursor-grab");
    const i = Math.round(track.scrollLeft / step());
    track.style.scrollSnapType = "";
    track.style.scrollBehavior = "";
    track.scrollTo({ left: i * step(), behavior: "smooth" });
  };
  window.addEventListener("pointerup", end);
  window.addEventListener("pointercancel", end);
}

// ---------- Init ----------
async function init() {
  const root = $("#products");
  try {
    const res = await fetch("data.json");
    if (!res.ok) throw new Error("HTTP " + res.status);
    const { products = [], testimonials = [] } = await res.json();

    root.innerHTML = products.length
      ? products.map(productSection).join("")
      : '<p class="text-ink/60">Belum ada produk.</p>';

    if (testimonials.length) {
      $("#testi-track").innerHTML = testimonials.map(testimonialCard).join("");
      initCarousel();
    } else {
      $("#testimoni").hidden = true;
    }
  } catch (err) {
    root.innerHTML =
      '<p class="text-berry font-medium">Data menu gagal dimuat. Jalankan lewat server lokal (bukan file://), lalu cek data.json.</p>';
    $("#testimoni").hidden = true;
    console.error(err);
  }
}

init();
