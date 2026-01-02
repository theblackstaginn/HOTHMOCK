// app.js
(() => {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);

  // Menu
  const menuOverlay = $("#menuOverlay");
  const openMenuBtn = $("#openMenu");
  const closeMenuBtn = $("#closeMenu");

  openMenuBtn.addEventListener("click", () => {
    menuOverlay.classList.add("open");
    menuOverlay.setAttribute("aria-hidden", "false");
  });

  closeMenuBtn.addEventListener("click", () => {
    menuOverlay.classList.remove("open");
    menuOverlay.setAttribute("aria-hidden", "true");
  });

  menuOverlay.addEventListener("click", (e) => {
    if (e.target === menuOverlay) {
      menuOverlay.classList.remove("open");
      menuOverlay.setAttribute("aria-hidden", "true");
    }
  });

  // Scroll to top
  $("#toTop").addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Cart drawer
  const cartDrawer = $("#cartDrawer");
  const openCartBtn = $("#openCart");
  const closeCartBtn = $("#closeCart");

  openCartBtn.addEventListener("click", () => {
    cartDrawer.classList.add("open");
    cartDrawer.setAttribute("aria-hidden", "false");
  });

  closeCartBtn.addEventListener("click", () => {
    cartDrawer.classList.remove("open");
    cartDrawer.setAttribute("aria-hidden", "true");
  });

  // Checkout modal (mock)
  const checkoutModal = $("#checkoutModal");
  const checkoutBtn = $("#checkoutBtn");
  const closeCheckoutBtn = $("#closeCheckout");

  checkoutBtn.addEventListener("click", () => {
    checkoutModal.classList.add("open");
    checkoutModal.setAttribute("aria-hidden", "false");
  });

  closeCheckoutBtn.addEventListener("click", () => {
    checkoutModal.classList.remove("open");
    checkoutModal.setAttribute("aria-hidden", "true");
  });

  checkoutModal.addEventListener("click", (e) => {
    if (e.target === checkoutModal) {
      checkoutModal.classList.remove("open");
      checkoutModal.setAttribute("aria-hidden", "true");
    }
  });

  // Tiny “Add to Cart” demo
  const cartCount = $("#cartCount");
  const addToCartBtn = $("#addToCart");

  if (addToCartBtn) {
    addToCartBtn.addEventListener("click", () => {
      const n = Number(cartCount.textContent || "0");
      cartCount.textContent = String(n + 1);
    });
  }

  // Hero slide placeholders (optional swap images)
  // If you add assets/hero-2.jpg etc., you can expand this.
})();
