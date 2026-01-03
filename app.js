(() => {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);

  const menuBtn = $("#menuBtn");
  const closeMenuBtn = $("#closeMenuBtn");
  const mobileMenu = $("#mobileMenu");

  const toTop = $("#toTop");
  const searchInput = $("#searchInput");
  const productGrid = $("#productGrid");

  // ---- Mobile menu ----
  function openMenu() {
    mobileMenu.hidden = false;
    menuBtn.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }

  function closeMenu() {
    mobileMenu.hidden = true;
    menuBtn.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  menuBtn?.addEventListener("click", () => {
    if (mobileMenu.hidden) openMenu();
    else closeMenu();
  });

  closeMenuBtn?.addEventListener("click", closeMenu);

  mobileMenu?.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (!a) return;
    closeMenu();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mobileMenu && !mobileMenu.hidden) closeMenu();
  });

  // ---- Scroll to top visibility ----
  const onScroll = () => {
    const y = window.scrollY || document.documentElement.scrollTop || 0;
    if (y > 420) toTop.classList.add("isOn");
    else toTop.classList.remove("isOn");
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  toTop?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // ---- Simple search filter (client-side mock) ----
  searchInput?.addEventListener("input", () => {
    const q = (searchInput.value || "").trim().toLowerCase();
    const cards = productGrid?.querySelectorAll(".card") || [];
    for (const card of cards) {
      const name = (card.getAttribute("data-name") || "").toLowerCase();
      card.style.display = name.includes(q) ? "" : "none";
    }
  });

  // ---- Qty controls (non-persistent mock) ----
  productGrid?.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;

    const card = e.target.closest(".card");
    if (!card) return;

    // qty buttons
    if (btn.classList.contains("qty__btn")) {
      const input = card.querySelector(".qty__val");
      if (!input) return;

      const isPlus = btn.textContent.trim() === "+";
      const isMinus = btn.textContent.trim() === "−" || btn.textContent.trim() === "-";

      let n = parseInt(String(input.value || "1"), 10);
      if (!Number.isFinite(n) || n < 1) n = 1;

      if (isPlus) n += 1;
      if (isMinus) n = Math.max(1, n - 1);

      input.value = String(n);
      return;
    }

    // add to cart mock (no real checkout)
    if (btn.classList.contains("cta") && !btn.disabled && btn.textContent.toLowerCase().includes("add")) {
      const cartCount = $("#cartCount");
      const current = parseInt(cartCount?.textContent || "0", 10);
      const next = (Number.isFinite(current) ? current : 0) + 1;
      if (cartCount) cartCount.textContent = String(next);
    }
  });
})();