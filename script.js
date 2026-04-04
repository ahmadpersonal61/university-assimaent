// ============================================
//  AHMIISTORE — script.js
// ============================================

/* ---- PRODUCT DATA (100 Products) ---- */
const shoeImages = [
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80",
  "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&q=80",
  "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&q=80",
  "https://images.unsplash.com/photo-1608231387042-66d1773d3028?w=400&q=80",
  "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=400&q=80",
  "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&q=80",
  "https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=400&q=80",
  "https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?w=400&q=80",
  "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=400&q=80",
  "https://images.unsplash.com/photo-1539185441755-769473a23570?w=400&q=80",
  "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400&q=80",
  "https://images.unsplash.com/photo-1579338908476-3a3a1d71c36e?w=400&q=80",
  "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&q=80",
  "https://images.unsplash.com/photo-1527090526205-beaac8dc3c62?w=400&q=80",
  "https://images.unsplash.com/photo-1520316587275-5e4f06f355e3?w=400&q=80",
  "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&q=80",
  "https://images.unsplash.com/photo-1556906781-9a412961d28e?w=400&q=80",
  "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400&q=80",
  "https://images.unsplash.com/photo-1615397349754-cfa2066a298e?w=400&q=80",
  "https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=400&q=80",
];

const brands   = ["Nike","Adidas","Jordan","Puma","Converse","Vans","New Balance","Reebok","Skechers","Under Armour"];
const cats     = ["sneakers","formal","sports","casual","boots"];
const adjectives = ["Air Max","Pro Elite","Classic","Ultra Boost","Runner","Street","Heritage","Retro","Premium","Signature"];
const badgeTypes = ["new","sale","hot",null,null,null];
const descriptions = [
  "Crafted for performance and style, these shoes deliver all-day comfort with a bold aesthetic.",
  "A timeless silhouette reinvented for modern wardrobes with premium materials.",
  "Built for the streets, designed for the spotlight. Turn heads wherever you go.",
  "Lightweight construction meets responsive cushioning for ultimate everyday wear.",
  "Iconic design fused with cutting-edge technology for the fashion-forward athlete.",
  "Versatile enough for gym sessions, stylish enough for weekend outings.",
  "Heritage-inspired design with a contemporary twist — a true wardrobe staple.",
  "Premium leather upper with cushioned insole for superior comfort and class.",
];

function genProducts() {
  const products = [];
  for (let i = 1; i <= 100; i++) {
    const brand   = brands[Math.floor(Math.random() * brands.length)];
    const adj     = adjectives[Math.floor(Math.random() * adjectives.length)];
    const cat     = cats[Math.floor(Math.random() * cats.length)];
    const img     = shoeImages[(i - 1) % shoeImages.length];
    const oldPrice = Math.floor(Math.random() * 15000) + 4000;
    const disc    = [10, 15, 20, 25, 30][Math.floor(Math.random() * 5)];
    const price   = Math.round(oldPrice * (1 - disc / 100));
    const rating  = (3.5 + Math.random() * 1.5).toFixed(1);
    const reviews = Math.floor(Math.random() * 900) + 50;
    const badge   = badgeTypes[Math.floor(Math.random() * badgeTypes.length)];
    const desc    = descriptions[Math.floor(Math.random() * descriptions.length)];

    products.push({ id: i, brand, name: `${brand} ${adj} ${i}`, category: cat, img, price, oldPrice, disc, rating: parseFloat(rating), reviews, badge, desc });
  }
  return products;
}

const allProducts = genProducts();
let filteredProducts = [...allProducts];
let visibleCount = 12;
let cart = [];
let selectedSizes = {};
let currentProduct = null;

/* ---- DOM REFS ---- */
const grid        = document.getElementById("productsGrid");
const loadMoreBtn = document.getElementById("loadMore");
const cartSidebar = document.getElementById("cartSidebar");
const cartItems   = document.getElementById("cartItems");
const cartCount   = document.getElementById("cartCount");
const cartTotal   = document.getElementById("cartTotal");
const cartFooter  = document.getElementById("cartFooter");
const overlayBg   = document.getElementById("overlayBg");
const productCount = document.getElementById("productCount");

/* ---- LOADER ---- */
window.addEventListener("load", () => {
  setTimeout(() => {
    const loader = document.getElementById("loader");
    loader.classList.add("hidden");
    setTimeout(() => loader.remove(), 600);
  }, 2000);
});

/* ---- CUSTOM CURSOR ---- */
const cursor   = document.getElementById("cursor");
const follower = document.getElementById("cursorFollower");
let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;

document.addEventListener("mousemove", e => {
  mouseX = e.clientX; mouseY = e.clientY;
  cursor.style.left = mouseX + "px";
  cursor.style.top  = mouseY + "px";
});

function animateFollower() {
  followerX += (mouseX - followerX) * 0.12;
  followerY += (mouseY - followerY) * 0.12;
  follower.style.left = followerX + "px";
  follower.style.top  = followerY + "px";
  requestAnimationFrame(animateFollower);
}
animateFollower();

document.querySelectorAll("a, button, .product-card, .cat-card, select, input").forEach(el => {
  el.addEventListener("mouseenter", () => { cursor.classList.add("hover"); follower.classList.add("hover"); });
  el.addEventListener("mouseleave", () => { cursor.classList.remove("hover"); follower.classList.remove("hover"); });
});

/* ---- NAVBAR SCROLL ---- */
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 60);
  document.getElementById("backTop").classList.toggle("show", window.scrollY > 400);
});

/* ---- MOBILE NAV ---- */
document.getElementById("hamburger").addEventListener("click", () => {
  document.getElementById("navLinks").classList.toggle("open");
});
document.getElementById("navLinks").addEventListener("click", e => {
  if (e.target.tagName === "A") document.getElementById("navLinks").classList.remove("open");
});

/* ---- SEARCH ---- */
document.getElementById("searchToggle").addEventListener("click", () => {
  document.getElementById("searchOverlay").classList.add("open");
  setTimeout(() => document.getElementById("searchInput").focus(), 300);
});
document.getElementById("closeSearch").addEventListener("click", () => {
  document.getElementById("searchOverlay").classList.remove("open");
});
document.getElementById("searchInput").addEventListener("input", e => {
  const q = e.target.value.toLowerCase();
  const resultsEl = document.getElementById("searchResults");
  resultsEl.innerHTML = "";
  if (!q) return;
  const matches = allProducts.filter(p => p.name.toLowerCase().includes(q) || p.category.includes(q)).slice(0, 6);
  matches.forEach(p => {
    const div = document.createElement("div");
    div.className = "search-result-item";
    div.innerHTML = `<img src="${p.img}" alt="${p.name}"/><span>${p.name} — <strong>Rs. ${p.price.toLocaleString()}</strong></span>`;
    div.addEventListener("click", () => {
      document.getElementById("searchOverlay").classList.remove("open");
      openModal(p);
    });
    resultsEl.appendChild(div);
  });
});

/* ---- CART ---- */
document.getElementById("cartBtn").addEventListener("click", () => {
  cartSidebar.classList.add("open");
  overlayBg.classList.add("show");
});
document.getElementById("closeCart").addEventListener("click", closeCart);
overlayBg.addEventListener("click", closeCart);
function closeCart() {
  cartSidebar.classList.remove("open");
  overlayBg.classList.remove("show");
}

function addToCart(product, size) {
  const existing = cart.find(c => c.id === product.id && c.size === size);
  if (existing) { existing.qty++; }
  else { cart.push({ ...product, size, qty: 1 }); }
  updateCartUI();
  showToast(`✅ ${product.name} added to bag!`);
}

function removeFromCart(id, size) {
  cart = cart.filter(c => !(c.id === id && c.size === size));
  updateCartUI();
}

function updateCartUI() {
  const total = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const totalItems = cart.reduce((s, c) => s + c.qty, 0);
  cartCount.textContent = totalItems;
  cartTotal.textContent = `Rs. ${total.toLocaleString()}`;
  cartFooter.style.display = cart.length ? "block" : "none";

  if (!cart.length) {
    cartItems.innerHTML = '<p class="empty-cart">Your bag is empty 👟</p>';
    return;
  }
  cartItems.innerHTML = cart.map(c => `
    <div class="cart-item">
      <img src="${c.img}" alt="${c.name}"/>
      <div class="cart-item-info">
        <h4>${c.name}</h4>
        <div class="item-size">Size: ${c.size} | Qty: ${c.qty}</div>
        <p>Rs. ${(c.price * c.qty).toLocaleString()}</p>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart(${c.id},'${c.size}')"><i class="fas fa-trash-alt"></i></button>
    </div>
  `).join("");
}

/* ---- FILTER & SORT ---- */
document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const f = btn.dataset.filter;
    filteredProducts = f === "all" ? [...allProducts] : allProducts.filter(p => p.category === f);
    applySortAndRender();
  });
});

document.getElementById("sortSelect").addEventListener("change", applySortAndRender);

document.querySelectorAll(".cat-card").forEach(card => {
  card.addEventListener("click", () => {
    const f = card.dataset.filter;
    document.querySelectorAll(".filter-btn").forEach(b => {
      b.classList.toggle("active", b.dataset.filter === f);
    });
    filteredProducts = allProducts.filter(p => p.category === f);
    applySortAndRender();
    document.getElementById("products").scrollIntoView({ behavior: "smooth" });
  });
});

function applySortAndRender() {
  const sort = document.getElementById("sortSelect").value;
  let sorted = [...filteredProducts];
  if (sort === "low")    sorted.sort((a,b) => a.price - b.price);
  if (sort === "high")   sorted.sort((a,b) => b.price - a.price);
  if (sort === "rating") sorted.sort((a,b) => b.rating - a.rating);
  filteredProducts = sorted;
  visibleCount = 12;
  renderProducts();
}

/* ---- RENDER PRODUCTS ---- */
function renderProducts() {
  grid.innerHTML = "";
  const visible = filteredProducts.slice(0, visibleCount);
  productCount.textContent = `Showing ${Math.min(visibleCount, filteredProducts.length)} of ${filteredProducts.length} products`;

  visible.forEach((p, i) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.style.animationDelay = `${(i % 12) * 0.05}s`;
    card.innerHTML = `
      ${p.badge ? `<div class="card-badge ${p.badge}">${p.badge.toUpperCase()}</div>` : ""}
      <button class="card-wishlist" onclick="toggleWishlist(this,event)" title="Wishlist">
        <i class="fas fa-heart"></i>
      </button>
      <div class="card-img-wrap">
        <img src="${p.img}" alt="${p.name}" loading="lazy"/>
        <button class="card-quick" onclick="openModal(allProducts.find(x=>x.id===${p.id}),event)">
          Quick View <i class="fas fa-eye"></i>
        </button>
      </div>
      <div class="card-body">
        <div class="card-category">${p.category}</div>
        <div class="card-name">${p.name}</div>
        <div class="card-rating">
          <div class="stars">${getStars(p.rating)}</div>
          <span>${p.rating} (${p.reviews})</span>
        </div>
        <div class="card-footer">
          <div class="card-price">
            <span class="price-current">Rs. ${p.price.toLocaleString()}</span>
            <span class="price-old">Rs. ${p.oldPrice.toLocaleString()}</span>
          </div>
          <button class="card-add" onclick="quickAdd(${p.id},event)" title="Add to bag">
            <i class="fas fa-plus"></i>
          </button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });

  loadMoreBtn.style.display = visibleCount >= filteredProducts.length ? "none" : "flex";
  
  // Re-attach cursor hover
  grid.querySelectorAll(".product-card, button").forEach(el => {
    el.addEventListener("mouseenter", () => { cursor.classList.add("hover"); follower.classList.add("hover"); });
    el.addEventListener("mouseleave", () => { cursor.classList.remove("hover"); follower.classList.remove("hover"); });
  });

  // Reveal animation
  observeReveal();
}

function getStars(rating) {
  let s = "";
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) s += "★";
    else if (rating >= i - 0.5) s += "☆";
    else s += "☆";
  }
  return s;
}

/* ---- QUICK ADD ---- */
function quickAdd(id, e) {
  e && e.stopPropagation();
  const p = allProducts.find(x => x.id === id);
  addToCart(p, "UK 8");
  cartSidebar.classList.add("open");
  overlayBg.classList.add("show");
}

/* ---- WISHLIST ---- */
function toggleWishlist(btn, e) {
  e && e.stopPropagation();
  btn.classList.toggle("active");
  const isAdded = btn.classList.contains("active");
  showToast(isAdded ? "❤️ Added to Wishlist!" : "💔 Removed from Wishlist");
}

/* ---- LOAD MORE ---- */
loadMoreBtn.addEventListener("click", () => {
  visibleCount += 12;
  renderProducts();
});

/* ---- MODAL ---- */
const modalOverlay = document.getElementById("modalOverlay");

function openModal(product, e) {
  if (e) e.stopPropagation();
  currentProduct = product;
  document.getElementById("modalImg").src = product.img;
  document.getElementById("modalBadge").textContent = product.badge ? product.badge.toUpperCase() : product.category.toUpperCase();
  document.getElementById("modalName").textContent = product.name;
  document.getElementById("modalPrice").textContent = `Rs. ${product.price.toLocaleString()}`;
  document.getElementById("modalRating").innerHTML = `<span style="color:#f5a623">${getStars(product.rating)}</span>&nbsp;${product.rating} (${product.reviews} reviews)`;
  document.getElementById("modalDesc").textContent = product.desc;

  const sizes = ["UK 6","UK 7","UK 8","UK 9","UK 10","UK 11"];
  document.getElementById("modalSizes").innerHTML = sizes.map((s,i) =>
    `<button class="size-btn ${i===0?'active':''}" onclick="selectSize(this,'${s}')">${s}</button>`
  ).join("");
  selectedSizes[product.id] = "UK 6";

  modalOverlay.classList.add("open");
  document.body.style.overflow = "hidden";
}

function selectSize(btn, size) {
  document.querySelectorAll(".size-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  if (currentProduct) selectedSizes[currentProduct.id] = size;
}

document.getElementById("modalClose").addEventListener("click", closeModal);
modalOverlay.addEventListener("click", e => { if (e.target === modalOverlay) closeModal(); });

function closeModal() {
  modalOverlay.classList.remove("open");
  document.body.style.overflow = "";
}

document.getElementById("modalAddCart").addEventListener("click", () => {
  if (!currentProduct) return;
  const size = selectedSizes[currentProduct.id] || "UK 8";
  addToCart(currentProduct, size);
  closeModal();
  cartSidebar.classList.add("open");
  overlayBg.classList.add("show");
});

document.getElementById("modalWishlist").addEventListener("click", () => {
  showToast("❤️ Added to Wishlist!");
});

/* ---- TOAST ---- */
let toastTimer;
function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 3000);
}

/* ---- BACK TO TOP ---- */
document.getElementById("backTop").addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

/* ---- NEWSLETTER ---- */
window.subscribeNewsletter = function(e) {
  e.preventDefault();
  showToast("🎉 Subscribed! 10% off coupon sent to your email.");
  e.target.reset();
};

/* ---- CONTACT ---- */
window.submitContact = function(e) {
  e.preventDefault();
  showToast("✅ Message sent! We'll reply within 24 hours.");
  e.target.reset();
};

/* ---- INTERSECTION OBSERVER ---- */
function observeReveal() {
  const els = document.querySelectorAll(".product-card, .cat-card, .feature, .contact-item");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add("visible");
        observer.unobserve(en.target);
      }
    });
  }, { threshold: 0.1 });
  els.forEach(el => {
    el.classList.add("reveal");
    observer.observe(el);
  });
}

// General reveal for sections
const sectionReveal = new IntersectionObserver((entries) => {
  entries.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add("visible"); }
  });
}, { threshold: 0.1 });

document.querySelectorAll(".section-header, .about-content, .about-visual, .newsletter, .contact-grid").forEach(el => {
  el.classList.add("reveal");
  sectionReveal.observe(el);
});

/* ---- KEYBOARD NAV ---- */
document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    closeModal();
    closeCart();
    document.getElementById("searchOverlay").classList.remove("open");
    document.getElementById("navLinks").classList.remove("open");
  }
});

/* ---- INIT ---- */
renderProducts();
