/* ✅ app.js (UPDATED: selector binds to ANY [data-sku] + click works) */
(() => {
  "use strict";

  const CATALOG = {
    "energybee": {
      name: "EnergyBee",
      img: "product-energybee.jpg",
      desc: `Our Superfood Hero, EnergyBee is packed with dried organic blueberries and whipped wildflower honey to help you feel great and stay well.

Blueberries contain some of the most powerful antioxidants known to the fruit world. These antioxidants are known to help boost your immune system, promote cognitive function, fight off free radicals, and help prevent chronic disease.

Naturally rich in vitamin K, blueberries also support bone health and healthy calcium regulation.`
    },

    "honeycomb-candy": {
      name: "Honeycomb Candy",
      img: "product-honeycomb-candy.jpg",
      desc: `Light, crunchy, and decadent all at the same time, our white chocolate honeycomb candy warrants a smile at first bite.

This confection features our signature honeycomb—made from a simple mixture of honey, baking soda, and water—dipped in high-quality white chocolate for the perfect balance of crunch and indulgence.`
    },

    "honeypops": {
      name: "Honey Pops",
      img: "product-honeypops.jpg",
      desc: `With over 28 flavors to choose from, it’s hard to settle on just one favorite.

Our honey pops are made with sustainably sourced honey and flavored using all-natural extracts and essential oils—simple, sweet, and a treat you can feel good about.`
    },

    "saw-honey": {
      name: "Saw Palmetto Honey",
      img: "saw-honey.jpg",
      desc: `One of the most sought-after raw honeys, Saw Palmetto Honey is prized for its naturally occurring antimicrobial properties and is often compared to Manuka honey.

It features a sweet, lightly smoky flavor with citrus and caramel undertones, making it an excellent sweetener for beverages, teas, and desserts.`
    },

    "bee-plush": {
      name: "Bee Plush",
      img: "bee-plush.jpg",
      desc: `Soft, cuddly, and irresistibly charming, this Ty bee plush is a sweet companion for kids and collectors alike.

A cheerful reminder of the hardworking pollinators that make all of this possible.`
    }
  };

  const CART_KEY = "hoth_mock_cart_v1";
  const cart = loadCart();

  initUI();
  wireProducts();
  renderCartBadge();

  function initUI() {
    const fab = document.createElement("button");
    fab.className = "cart-fab";
    fab.type = "button";
    fab.innerHTML = `
      <span aria-hidden="true">🛒</span>
      <span>Cart</span>
      <span class="cart-badge" id="cartBadge">0</span>
    `;
    fab.addEventListener("click", openCartModal);
    document.body.appendChild(fab);

    const backdrop = document.createElement("div");
    backdrop.className = "modal-backdrop";
    backdrop.id = "modalBackdrop";
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) closeModal();
    });

    backdrop.innerHTML = `
      <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
        <div class="modal-header">
          <h3 class="modal-title" id="modalTitle"></h3>
          <button class="modal-close" type="button" id="modalClose" aria-label="Close">✕</button>
        </div>
        <div class="modal-body" id="modalBody"></div>
      </div>
    `;
    document.body.appendChild(backdrop);

    backdrop.querySelector("#modalClose").addEventListener("click", closeModal);
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeModal();
    });
  }

  function wireProducts() {
    /* ✅ binds even if you rename classes — as long as data-sku exists */
    const nodes = document.querySelectorAll("[data-sku]");
    nodes.forEach((card) => {
      card.style.cursor = "pointer";
      card.addEventListener("click", () => {
        const sku = card.getAttribute("data-sku");
        openProductModal(sku);
      });

      card.tabIndex = 0;
      card.setAttribute("role", "button");
      const label = card.querySelector("h3")?.textContent || "product";
      card.setAttribute("aria-label", `View ${label}`);

      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          const sku = card.getAttribute("data-sku");
          openProductModal(sku);
        }
      });
    });
  }

  function openProductModal(sku) {
    const p = CATALOG[sku];
    if (!p) return;

    setModalTitle(p.name);

    const body = document.getElementById("modalBody");
    body.innerHTML = `
      <div class="modal-product">
        <img src="${escapeAttr(p.img)}" alt="${escapeAttr(p.name)}">
        <div>
          <p class="modal-desc">${escapeHTML(p.desc).replace(/\n\n/g, "</p><p class='modal-desc'>")}</p>

          <div class="modal-actions">
            <div class="qty" aria-label="Quantity selector">
              <button type="button" data-qty-minus aria-label="Decrease quantity">−</button>
              <input type="number" inputmode="numeric" min="1" max="99" value="1" aria-label="Quantity" />
              <button type="button" data-qty-plus aria-label="Increase quantity">+</button>
            </div>

            <button type="button" class="btn primary" data-add>
              Add to Cart
            </button>

            <button type="button" class="btn" data-viewcart>
              View Cart
            </button>
          </div>
        </div>
      </div>
    `;

    const qtyInput = body.querySelector("input[type='number']");
    const minus = body.querySelector("[data-qty-minus]");
    const plus = body.querySelector("[data-qty-plus]");

    minus.addEventListener("click", () => {
      qtyInput.value = String(Math.max(1, (toInt(qtyInput.value) || 1) - 1));
    });
    plus.addEventListener("click", () => {
      qtyInput.value = String(Math.min(99, (toInt(qtyInput.value) || 1) + 1));
    });

    qtyInput.addEventListener("change", () => {
      const v = clamp(toInt(qtyInput.value) || 1, 1, 99);
      qtyInput.value = String(v);
    });

    body.querySelector("[data-add]").addEventListener("click", () => {
      const qty = clamp(toInt(qtyInput.value) || 1, 1, 99);
      cart[sku] = clamp((cart[sku] || 0) + qty, 1, 999);
      saveCart();

      const btn = body.querySelector("[data-add]");
      const old = btn.textContent;
      btn.textContent = "Added ✓";
      setTimeout(() => (btn.textContent = old), 650);
    });

    body.querySelector("[data-viewcart]").addEventListener("click", openCartModal);

    openModal();
  }

  function openCartModal() {
    setModalTitle("Cart");

    const body = document.getElementById("modalBody");

    const items = Object.entries(cart)
      .filter(([sku, qty]) => CATALOG[sku] && qty > 0)
      .map(([sku, qty]) => ({ sku, qty, ...CATALOG[sku] }));

    if (items.length === 0) {
      body.innerHTML = `
        <div class="cart-panel">
          <p class="modal-desc">Your cart is empty.</p>
          <div class="modal-actions">
            <button type="button" class="btn" data-close>Continue Shopping</button>
          </div>
        </div>
      `;
      body.querySelector("[data-close]").addEventListener("click", closeModal);
      openModal();
      return;
    }

    body.innerHTML = `
      <div class="cart-panel">
        <div class="cart-list">
          ${items.map(renderCartRow).join("")}
        </div>

        <div class="cart-sub">
          <span>Total items</span>
          <span>${cartCount()}</span>
        </div>

        <div class="modal-actions" style="margin-top:14px;">
          <button type="button" class="btn" data-clear>Clear Cart</button>
          <button type="button" class="btn primary" data-close>Done</button>
        </div>
      </div>
    `;

    body.querySelectorAll("[data-sku]").forEach((row) => {
      const sku = row.getAttribute("data-sku");
      const minus = row.querySelector("[data-minus]");
      const plus = row.querySelector("[data-plus]");
      const remove = row.querySelector("[data-remove]");
      const qtyEl = row.querySelector("[data-qty]");

      minus.addEventListener("click", () => {
        const next = Math.max(1, (cart[sku] || 1) - 1);
        cart[sku] = next;
        qtyEl.textContent = String(next);
        saveCart();
      });

      plus.addEventListener("click", () => {
        const next = Math.min(999, (cart[sku] || 1) + 1);
        cart[sku] = next;
        qtyEl.textContent = String(next);
        saveCart();
      });

      remove.addEventListener("click", () => {
        delete cart[sku];
        saveCart();
        openCartModal();
      });
    });

    body.querySelector("[data-clear]").addEventListener("click", () => {
      for (const k of Object.keys(cart)) delete cart[k];
      saveCart();
      openCartModal();
    });

    body.querySelector("[data-close]").addEventListener("click", closeModal);

    openModal();
  }

  function renderCartRow(item) {
    return `
      <div class="cart-item" data-sku="${escapeAttr(item.sku)}">
        <img src="${escapeAttr(item.img)}" alt="${escapeAttr(item.name)}">
        <div>
          <h4>${escapeHTML(item.name)}</h4>
          <div class="qty" style="margin-top:6px;">
            <button type="button" data-minus aria-label="Decrease quantity">−</button>
            <span data-qty style="min-width:28px;text-align:center;display:inline-block;">${item.qty}</span>
            <button type="button" data-plus aria-label="Increase quantity">+</button>
          </div>
        </div>
        <button type="button" class="btn" data-remove aria-label="Remove item">Remove</button>
      </div>
    `;
  }

  function openModal() {
    document.getElementById("modalBackdrop").classList.add("open");
  }

  function closeModal() {
    document.getElementById("modalBackdrop").classList.remove("open");
  }

  function setModalTitle(title) {
    document.getElementById("modalTitle").textContent = title;
  }

  function cartCount() {
    return Object.values(cart).reduce((sum, n) => sum + (toInt(n) || 0), 0);
  }

  function renderCartBadge() {
    const badge = document.getElementById("cartBadge");
    if (badge) badge.textContent = String(cartCount());
  }

  function loadCart() {
    try {
      const raw = localStorage.getItem(CART_KEY);
      if (!raw) return {};
      const obj = JSON.parse(raw);
      return (obj && typeof obj === "object") ? obj : {};
    } catch {
      return {};
    }
  }

  function saveCart() {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    renderCartBadge();
  }

  function toInt(x) {
    const n = parseInt(String(x), 10);
    return Number.isFinite(n) ? n : 0;
  }

  function clamp(v, lo, hi) {
    return Math.max(lo, Math.min(hi, v));
  }

  function escapeHTML(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function escapeAttr(str) {
    return escapeHTML(str).replace(/`/g, "&#096;");
  }
})();