/* =========================================================
   Licorera Punto Frío — Lógica principal (index)
   ========================================================= */
(function () {
  "use strict";

  var WHATSAPP_NUMBER = "573002192460";

  /* ---------- Estado persistente ---------- */
  var cart = safeGet("pf_cart", []);
  var favorites = safeGet("pf_favorites", []); // array de ids

  // Migración de seguridad: si el navegador tenía un carrito de una versión
  // anterior del sitio (sin lineId/unitTotal/packKey), se descarta para
  // evitar precios "NaN" en vez de romper el carrito nuevo.
  cart = cart.filter(function (item) {
    return item && item.lineId && typeof item.unitTotal === "number" && item.packKey;
  });

  function safeGet(key, fallback) {
    try {
      var v = JSON.parse(localStorage.getItem(key));
      return v || fallback;
    } catch (e) { return fallback; }
  }
  function saveCart() { localStorage.setItem("pf_cart", JSON.stringify(cart)); }
  function saveFavorites() { localStorage.setItem("pf_favorites", JSON.stringify(favorites)); }

  /* ---------- Elementos ---------- */
  var mobileToggle = document.getElementById("mobileToggle");
  var mainNav = document.getElementById("mainNav");
  var searchInput = document.getElementById("searchInput");
  var searchResults = document.getElementById("searchResults");
  var searchWrap = document.getElementById("searchWrap");
  var mobileSearchBtn = document.getElementById("mobileSearchBtn");
  var cartToggleBtn = document.getElementById("cartToggleBtn");
  var cartCountEl = document.getElementById("cartCount");
  var cartOverlay = document.getElementById("cartOverlay");
  var cartItemsEl = document.getElementById("cartItems");
  var cartTotalEl = document.getElementById("cartTotal");
  var sendOrderBtn = document.getElementById("sendOrderBtn");
  var closeCartBtn = document.getElementById("closeCartBtn");
  var continueShoppingBtn = document.getElementById("continueShoppingBtn");

  var favToggleBtn = document.getElementById("favToggleBtn");
  var favOverlay = document.getElementById("favOverlay");
  var favItemsEl = document.getElementById("favItems");
  var closeFavBtn = document.getElementById("closeFavBtn");
  var favCountEl = document.getElementById("favCount");

  var productGrid = document.getElementById("productGrid");
  var filterPillsEl = document.getElementById("filterPills");

  var ALL_PRODUCTS = getAllProducts();
  var currentFilter = "todos";
  var currentBrandFilter = null;

  /* ---------- Menú móvil ---------- */
  if (mobileToggle) {
    mobileToggle.addEventListener("click", function () {
      mainNav.classList.toggle("open");
    });
  }

  /* Dropdowns (click, accesible en móvil y desktop) */
  document.querySelectorAll(".nav-toggle").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      var li = btn.closest("li");
      var wasOpen = li.classList.contains("open");
      document.querySelectorAll(".main-nav > li.open").forEach(function (openLi) {
        openLi.classList.remove("open");
      });
      if (!wasOpen) li.classList.add("open");
    });
  });
  document.addEventListener("click", function (e) {
    if (!e.target.closest(".main-nav > li")) {
      document.querySelectorAll(".main-nav > li.open").forEach(function (li) { li.classList.remove("open"); });
    }
  });

  /* ---------- Formato ---------- */
  function money(n) { return formatCOP(n); }

  /* ---------- Buscador (toggle móvil) ---------- */
  if (mobileSearchBtn) {
    mobileSearchBtn.addEventListener("click", function () {
      searchWrap.classList.toggle("active");
      if (searchWrap.classList.contains("active")) {
        setTimeout(function () { searchInput.focus(); }, 50);
      } else {
        searchResults.classList.remove("active");
      }
    });
  }

  /* ---------- Buscador ---------- */
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      var q = searchInput.value.trim().toLowerCase();
      if (!q) { searchResults.classList.remove("active"); searchResults.innerHTML = ""; return; }
      var matches = ALL_PRODUCTS.filter(function (p) {
        return p.name.toLowerCase().indexOf(q) !== -1 || CATEGORY_LABELS[p.category].toLowerCase().indexOf(q) !== -1;
      }).slice(0, 8);

      searchResults.innerHTML = "";
      if (matches.length === 0) {
        searchResults.innerHTML = '<div class="search-empty">Sin resultados para "' + escapeHtml(searchInput.value) + '"</div>';
      } else {
        matches.forEach(function (p) {
          var row = document.createElement("a");
          row.href = "#" + p.category;
          row.className = "search-result-row";
          row.innerHTML =
            '<img src="' + p.img + '" alt="">' +
            '<div><div class="name">' + escapeHtml(p.name) + '</div><div class="price">' + money(p.price) + '</div></div>';
          row.addEventListener("click", function (evt) {
            evt.preventDefault();
            searchResults.classList.remove("active");
            searchInput.value = "";
            if (searchWrap) searchWrap.classList.remove("active");
            goToProductInGrid(p);
          });
          searchResults.appendChild(row);
        });
      }
      searchResults.classList.add("active");
    });

    searchInput.addEventListener("keydown", function (e) {
      if (e.key !== "Enter") return;
      var q = searchInput.value.trim().toLowerCase();
      if (!q) return;
      var first = ALL_PRODUCTS.filter(function (p) {
        return p.name.toLowerCase().indexOf(q) !== -1 || CATEGORY_LABELS[p.category].toLowerCase().indexOf(q) !== -1;
      })[0];
      if (first) {
        searchResults.classList.remove("active");
        searchInput.value = "";
        if (searchWrap) searchWrap.classList.remove("active");
        goToProductInGrid(first);
      }
    });

    document.addEventListener("click", function (e) {
      if (!e.target.closest(".search-wrap")) searchResults.classList.remove("active");
    });
  }

  function goToProductInGrid(product) {
    // Activa el filtro "Todo" para garantizar que el producto exista en el grid,
    // sin importar en qué categoría esté el usuario navegando.
    currentFilter = "todos";
    currentBrandFilter = null;
    if (filterPillsEl) {
      filterPillsEl.querySelectorAll(".filter-pill").forEach(function (b) {
        b.classList.toggle("active", b.getAttribute("data-filter") === "todos");
      });
    }
    renderProducts();
    var tienda = document.getElementById("tienda");
    if (tienda) tienda.scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(function () { scrollToProduct(product.id); }, 450);
  }

  function scrollToProduct(id) {
    var el = document.querySelector('[data-product-id="' + id + '"]');
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.style.boxShadow = "0 0 0 3px var(--amber)";
      el.style.transition = "box-shadow .2s ease";
      setTimeout(function () { el.style.boxShadow = ""; }, 2000);
    }
  }

  function escapeHtml(str) {
    var div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  /* ---------- Render de productos ---------- */
  function renderProducts() {
    if (!productGrid) return;
    var list = ALL_PRODUCTS.filter(function (p) {
      if (currentBrandFilter) {
        return p.category === "cerveza" && p.name.toLowerCase().indexOf(currentBrandFilter.toLowerCase()) !== -1;
      }
      if (currentFilter === "todos") return true;
      if (currentFilter === "otros") return p.category === "otros";
      return p.category === currentFilter || p.sub === currentFilter;
    });

    productGrid.innerHTML = "";
    if (list.length === 0) {
      productGrid.innerHTML = '<div class="empty-state">No hay productos en esta categoría todavía.</div>';
      return;
    }

    list.forEach(function (p) {
      var card = document.createElement("div");
      card.className = "product-card";
      card.setAttribute("data-product-id", p.id);
      var isFav = favorites.indexOf(p.id) !== -1;
      var packs = getPackOptions(p);
      var hasPacks = packs.length > 1;

      var packSelectHtml = "";
      if (hasPacks) {
        packSelectHtml =
          '<select class="pack-select" data-pack-select="' + p.id + '">' +
          packs.map(function (opt) {
            var priceInfo = getPackPrice(p, opt.key);
            var suffix = opt.key === "unidad" ? "" : " — " + money(priceInfo.total);
            return '<option value="' + opt.key + '">' + opt.label + suffix + '</option>';
          }).join("") +
          '</select>';
      }

      var mediaClass = "media-" + p.category + (p.category === "otros" && p.sub ? "-" + p.sub : "");

      card.innerHTML =
        '<div class="product-media ' + mediaClass + '">' +
          '<img src="' + p.img + '" alt="' + escapeHtml(p.name) + '" loading="lazy">' +
          '<button type="button" class="fav-btn' + (isFav ? " active" : "") + '" data-fav="' + p.id + '" aria-label="Favorito">' +
            (isFav ? "\u2764" : "\u2661") +
          '</button>' +
        '</div>' +
        '<div class="product-body">' +
          '<span class="product-cat">' + CATEGORY_LABELS[p.category] + '</span>' +
          '<span class="product-name">' + escapeHtml(p.name) + '</span>' +
          (p.ml ? '<span class="product-ml">Contenido: ' + p.ml + ' ml</span>' : '') +
          '<span class="product-price" data-price-display="' + p.id + '">' + money(p.price) + '</span>' +
          packSelectHtml +
          '<div class="product-actions">' +
            '<button type="button" class="btn-buy" data-buy="' + p.id + '">🛒 Comprar ahora</button>' +
          '</div>' +
        '</div>';
      productGrid.appendChild(card);
    });
  }

  /* Actualiza el precio mostrado cuando el usuario cambia de presentación */
  if (productGrid) {
    productGrid.addEventListener("change", function (e) {
      var select = e.target.closest("[data-pack-select]");
      if (!select) return;
      var id = select.getAttribute("data-pack-select");
      var product = ALL_PRODUCTS.find(function (p) { return p.id === id; });
      if (!product) return;
      var priceInfo = getPackPrice(product, select.value);
      var priceEl = productGrid.querySelector('[data-price-display="' + id + '"]');
      if (priceEl) priceEl.textContent = money(priceInfo.total);
    });
  }

  if (filterPillsEl) {
    filterPillsEl.addEventListener("click", function (e) {
      var pill = e.target.closest(".filter-pill");
      if (!pill) return;
      filterPillsEl.querySelectorAll(".filter-pill").forEach(function (b) { b.classList.remove("active"); });
      pill.classList.add("active");
      currentBrandFilter = null;
      currentFilter = pill.getAttribute("data-filter");
      renderProducts();
    });
  }

  /* Enlaces de categoría en la barra / menú despegable / hero disparan filtro también */
  document.querySelectorAll("[data-goto-category]").forEach(function (el) {
    el.addEventListener("click", function (e) {
      var cat = el.getAttribute("data-goto-category");
      currentBrandFilter = null;
      if (filterPillsEl) {
        currentFilter = cat;
        filterPillsEl.querySelectorAll(".filter-pill").forEach(function (b) {
          b.classList.toggle("active", b.getAttribute("data-filter") === cat);
        });
        renderProducts();
      }
    });
  });

  /* Menú desplegable "Cerveza" del header: filtra por marca específica */
  document.querySelectorAll("[data-goto-brand]").forEach(function (el) {
    el.addEventListener("click", function (e) {
      e.preventDefault();
      var brand = el.getAttribute("data-goto-brand");
      currentBrandFilter = brand;
      currentFilter = "cerveza";
      if (filterPillsEl) {
        filterPillsEl.querySelectorAll(".filter-pill").forEach(function (b) {
          b.classList.toggle("active", b.getAttribute("data-filter") === "cerveza");
        });
      }
      renderProducts();
      var tienda = document.getElementById("tienda");
      if (tienda) tienda.scrollIntoView({ behavior: "smooth", block: "start" });
      document.querySelectorAll(".main-nav > li.open").forEach(function (li) { li.classList.remove("open"); });
      if (mainNav) mainNav.classList.remove("open");
    });
  });

  /* ---------- Favoritos ---------- */
  function toggleFavorite(id) {
    var idx = favorites.indexOf(id);
    if (idx === -1) favorites.push(id); else favorites.splice(idx, 1);
    saveFavorites();
    renderProducts();
    renderFavorites();
    updateFavCount();
  }

  function renderFavorites() {
    if (!favItemsEl) return;
    var items = ALL_PRODUCTS.filter(function (p) { return favorites.indexOf(p.id) !== -1; });
    favItemsEl.innerHTML = "";
    if (items.length === 0) {
      favItemsEl.innerHTML = '<div class="fav-panel-empty">Aún no tienes productos favoritos. Toca el corazón en cualquier producto para guardarlo aquí.</div>';
      return;
    }
    items.forEach(function (p) {
      var row = document.createElement("div");
      row.className = "cart-item-row";
      row.innerHTML =
        '<span class="cart-item-name">' + escapeHtml(p.name) + '</span>' +
        '<span class="cart-item-price">' + money(p.price) + '</span>' +
        '<button type="button" class="cart-item-remove" data-unfav="' + p.id + '">&times;</button>';
      favItemsEl.appendChild(row);
    });
  }

  function updateFavCount() {
    if (favCountEl) favCountEl.textContent = favorites.length;
  }

  if (favToggleBtn) {
    favToggleBtn.addEventListener("click", function () { favOverlay.classList.add("active"); renderFavorites(); });
  }
  if (closeFavBtn) closeFavBtn.addEventListener("click", function () { favOverlay.classList.remove("active"); });
  if (favOverlay) favOverlay.addEventListener("click", function (e) { if (e.target === favOverlay) favOverlay.classList.remove("active"); });

  /* ---------- Carrito ---------- */
  function addToCart(id, packKey) {
    var product = ALL_PRODUCTS.find(function (p) { return p.id === id; });
    if (!product) return;
    packKey = packKey || "unidad";
    var priceInfo = getPackPrice(product, packKey);
    var lineId = id + "__" + packKey;
    var existing = cart.find(function (i) { return i.lineId === lineId; });
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({
        lineId: lineId,
        id: id,
        name: product.name,
        packLabel: priceInfo.option.label,
        packKey: packKey,
        unitTotal: priceInfo.total,
        qty: 1
      });
    }
    saveCart();
    renderCart();
    openCart();
  }

  function changeQty(lineId, delta) {
    var item = cart.find(function (i) { return i.lineId === lineId; });
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) cart = cart.filter(function (i) { return i.lineId !== lineId; });
    saveCart();
    renderCart();
  }

  function removeFromCart(lineId) {
    cart = cart.filter(function (i) { return i.lineId !== lineId; });
    saveCart();
    renderCart();
  }

  function renderCart() {
    if (!cartItemsEl) return;
    cartItemsEl.innerHTML = "";
    if (cart.length === 0) {
      cartItemsEl.innerHTML = '<p class="cart-empty">Aún no has agregado productos.</p>';
    }
    var total = 0, totalUnits = 0;
    cart.forEach(function (item) {
      var subtotal = item.unitTotal * item.qty;
      total += subtotal; totalUnits += item.qty;
      var row = document.createElement("div");
      row.className = "cart-item-row";
      row.innerHTML =
        '<span class="cart-item-name">' + escapeHtml(item.name) +
          (item.packKey !== "unidad" ? '<span class="cart-item-pack">' + escapeHtml(item.packLabel) + '</span>' : '') +
        '</span>' +
        '<span class="cart-item-qty">' +
          '<button type="button" data-qty="-1" data-line="' + item.lineId + '">-</button>' +
          '<span>' + item.qty + '</span>' +
          '<button type="button" data-qty="1" data-line="' + item.lineId + '">+</button>' +
        '</span>' +
        '<span class="cart-item-price">' + money(subtotal) + '</span>' +
        '<button type="button" class="cart-item-remove" data-remove="' + item.lineId + '">&times;</button>';
      cartItemsEl.appendChild(row);
    });
    cartTotalEl.textContent = money(total).replace("$", "");
    if (cartCountEl) cartCountEl.textContent = totalUnits;
    sendOrderBtn.disabled = cart.length === 0;
  }

  function openCart() { cartOverlay.classList.add("active"); }
  function closeCart() { cartOverlay.classList.remove("active"); }

  function sendOrderToWhatsApp() {
    if (cart.length === 0) return;

    var nameInput = document.getElementById("customerName");
    var addressInput = document.getElementById("customerAddress");
    var phoneInput = document.getElementById("customerPhone");

    var name = nameInput.value.trim();
    var address = addressInput.value.trim();
    var phone = phoneInput.value.trim();

    if (!name || !address || !phone) {
      showCheckoutError("Por favor completa nombre, dirección y teléfono para enviar tu pedido.");
      if (!name) nameInput.focus(); else if (!address) addressInput.focus(); else phoneInput.focus();
      return;
    }
    hideCheckoutError();

    var total = 0;
    var lines = [];
    cart.forEach(function (item) {
      var subtotal = item.unitTotal * item.qty;
      total += subtotal;
      var packSuffix = item.packKey !== "unidad" ? " (" + item.packLabel + ")" : "";
      lines.push("* " + item.qty + "x " + item.name + packSuffix + " — " + money(subtotal));
    });

    var message = [
      "🛒 NUEVO PEDIDO — Licorera Punto Frío",
      "",
      "👤 Cliente: " + name,
      "📍 Dirección: " + address,
      "📞 Teléfono: " + phone,
      "",
      "📋 Detalle del Pedido:",
      lines.join("\n"),
      "",
      "💰 Subtotal: " + money(total),
      "💵 Total a Pagar: " + money(total)
    ].join("\n");

    saveCustomerInfo(name, address, phone);
    window.open("https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(message), "_blank");
  }

  function showCheckoutError(msg) {
    var box = document.getElementById("checkoutError");
    if (box) { box.textContent = msg; box.classList.add("active"); }
  }
  function hideCheckoutError() {
    var box = document.getElementById("checkoutError");
    if (box) box.classList.remove("active");
  }

  function saveCustomerInfo(name, address, phone) {
    localStorage.setItem("pf_customer", JSON.stringify({ name: name, address: address, phone: phone }));
  }
  function loadCustomerInfo() {
    try {
      var data = JSON.parse(localStorage.getItem("pf_customer"));
      if (data) {
        var n = document.getElementById("customerName");
        var a = document.getElementById("customerAddress");
        var ph = document.getElementById("customerPhone");
        if (n) n.value = data.name || "";
        if (a) a.value = data.address || "";
        if (ph) ph.value = data.phone || "";
      }
    } catch (e) { /* noop */ }
  }
  loadCustomerInfo();

  if (cartToggleBtn) cartToggleBtn.addEventListener("click", openCart);
  if (closeCartBtn) closeCartBtn.addEventListener("click", closeCart);
  if (continueShoppingBtn) continueShoppingBtn.addEventListener("click", closeCart);
  if (cartOverlay) cartOverlay.addEventListener("click", function (e) { if (e.target === cartOverlay) closeCart(); });
  if (sendOrderBtn) sendOrderBtn.addEventListener("click", sendOrderToWhatsApp);

  /* ---------- Delegación de eventos globales ---------- */
  document.addEventListener("click", function (e) {
    var buyBtn = e.target.closest("[data-buy]");
    if (buyBtn) {
      var id = buyBtn.getAttribute("data-buy");
      var select = document.querySelector('[data-pack-select="' + id + '"]');
      var packKey = select ? select.value : "unidad";
      addToCart(id, packKey);
      return;
    }

    var favBtn = e.target.closest("[data-fav]");
    if (favBtn) { toggleFavorite(favBtn.getAttribute("data-fav")); return; }

    var unfavBtn = e.target.closest("[data-unfav]");
    if (unfavBtn) { toggleFavorite(unfavBtn.getAttribute("data-unfav")); return; }

    var qtyBtn = e.target.closest("[data-qty]");
    if (qtyBtn) { changeQty(qtyBtn.getAttribute("data-line"), parseInt(qtyBtn.getAttribute("data-qty"), 10)); return; }

    var removeBtn = e.target.closest("[data-remove]");
    if (removeBtn) { removeFromCart(removeBtn.getAttribute("data-remove")); return; }
  });

  /* ---------- Carrusel de producto destacado ---------- */
  var promoBanner = document.getElementById("promoBanner");
  var FEATURED_IDS = ["ron-01", "cer-08", "whi-04", "cer-05", "agu-01", "teq-02"];
  var promoIndex = 0;
  var promoTimer = null;

  function renderPromo() {
    if (!promoBanner) return;
    var featured = FEATURED_IDS
      .map(function (id) { return ALL_PRODUCTS.find(function (p) { return p.id === id; }); })
      .filter(Boolean);
    if (featured.length === 0) return;
    var p = featured[promoIndex % featured.length];

    promoBanner.innerHTML =
      '<div class="promo-content">' +
        '<span class="eyebrow">Producto destacado</span>' +
        '<h3>' + escapeHtml(p.name) + '</h3>' +
        '<p class="promo-price">Precio: ' + money(p.price) + '</p>' +
        '<div><button type="button" class="btn btn-amber" data-buy="' + p.id + '">Comprar ahora</button></div>' +
      '</div>' +
      '<div class="promo-media"><img src="' + p.img + '" alt="' + escapeHtml(p.name) + '"></div>' +
      '<div class="promo-dots">' +
        featured.map(function (fp, i) {
          return '<button type="button" class="promo-dot' + (i === (promoIndex % featured.length) ? ' active' : '') + '" data-promo-dot="' + i + '" aria-label="Ver ' + escapeHtml(fp.name) + '"></button>';
        }).join('') +
      '</div>';
  }

  function startPromoAuto() {
    if (promoTimer) clearInterval(promoTimer);
    promoTimer = setInterval(function () {
      promoIndex++;
      renderPromo();
    }, 5000);
  }

  if (promoBanner) {
    promoBanner.addEventListener("click", function (e) {
      var dot = e.target.closest("[data-promo-dot]");
      if (dot) {
        promoIndex = parseInt(dot.getAttribute("data-promo-dot"), 10);
        renderPromo();
        startPromoAuto();
      }
    });
    renderPromo();
    startPromoAuto();
  }

  /* ---------- Desplegable "Otros" del catálogo (redirige a un producto exacto) ---------- */
  var otrosDropdownWrap = document.getElementById("otrosDropdownWrap");
  var otrosFilterBtn = document.getElementById("otrosFilterBtn");
  var otrosDropdownMenu = document.getElementById("otrosDropdownMenu");

  function populateOtrosDropdown() {
    if (!otrosDropdownMenu) return;
    var otrosProducts = ALL_PRODUCTS.filter(function (p) { return p.category === "otros"; });
    otrosDropdownMenu.innerHTML = otrosProducts.map(function (p) {
      return '<button type="button" class="filter-dropdown-item" data-otros-product="' + p.id + '">' +
        '<span>' + escapeHtml(p.name) + '</span>' +
        '<span class="fdi-price">' + money(p.price) + '</span>' +
      '</button>';
    }).join("");
  }

  if (otrosFilterBtn) {
    otrosFilterBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      otrosDropdownWrap.classList.toggle("open");
    });
  }
  if (otrosDropdownMenu) {
    otrosDropdownMenu.addEventListener("click", function (e) {
      var item = e.target.closest("[data-otros-product]");
      if (!item) return;
      var product = ALL_PRODUCTS.find(function (p) { return p.id === item.getAttribute("data-otros-product"); });
      otrosDropdownWrap.classList.remove("open");
      if (product) {
        currentBrandFilter = null;
        goToProductInGrid(product);
      }
    });
  }
  document.addEventListener("click", function (e) {
    if (otrosDropdownWrap && !e.target.closest("#otrosDropdownWrap")) {
      otrosDropdownWrap.classList.remove("open");
    }
  });
  populateOtrosDropdown();

  /* ---------- Opiniones de clientes (Referencias) ---------- */
  var testiGrid = document.getElementById("testiGrid");
  var reviewStars = document.getElementById("reviewStars");
  var reviewNameInput = document.getElementById("reviewName");
  var reviewCommentInput = document.getElementById("reviewComment");
  var submitReviewBtn = document.getElementById("submitReviewBtn");
  var selectedRating = 0;

  function paintStars(rating) {
    if (!reviewStars) return;
    reviewStars.querySelectorAll(".star-btn").forEach(function (btn) {
      var val = parseInt(btn.getAttribute("data-star"), 10);
      btn.classList.toggle("filled", val <= rating);
    });
  }

  if (reviewStars) {
    reviewStars.addEventListener("click", function (e) {
      var btn = e.target.closest(".star-btn");
      if (!btn) return;
      selectedRating = parseInt(btn.getAttribute("data-star"), 10);
      paintStars(selectedRating);
    });
  }

  function getInitials(name) {
    var parts = name.trim().split(/\s+/);
    var initials = parts[0] ? parts[0][0] : "";
    if (parts[1]) initials += parts[1][0];
    return initials.toUpperCase();
  }

  function renderReviewCard(review) {
    if (!testiGrid) return;
    var card = document.createElement("div");
    card.className = "testi-card";
    var stars = "★★★★★☆☆☆☆☆".slice(5 - review.rating, 10 - review.rating);
    card.innerHTML =
      '<div class="testi-head">' +
        '<div class="testi-avatar-fallback">' + escapeHtml(getInitials(review.name)) + '</div>' +
        '<div><div class="name">' + escapeHtml(review.name) + '</div><div class="role">Cliente Punto Frío</div></div>' +
      '</div>' +
      '<div class="testi-stars">' + stars + '</div>' +
      '<p>' + escapeHtml(review.comment) + '</p>';
    testiGrid.insertBefore(card, testiGrid.firstChild);
  }

  function getStoredReviews() {
    try { return JSON.parse(localStorage.getItem("pf_reviews")) || []; }
    catch (e) { return []; }
  }
  function saveStoredReviews(list) { localStorage.setItem("pf_reviews", JSON.stringify(list)); }

  function loadStoredReviews() {
    var reviews = getStoredReviews();
    reviews.forEach(function (r) { renderReviewCard(r); });
  }
  loadStoredReviews();

  function showReviewError(msg) {
    var box = document.getElementById("reviewError");
    if (box) { box.textContent = msg; box.classList.add("active"); }
  }
  function hideReviewError() {
    var box = document.getElementById("reviewError");
    if (box) box.classList.remove("active");
  }

  if (submitReviewBtn) {
    submitReviewBtn.addEventListener("click", function () {
      var name = reviewNameInput.value.trim();
      var comment = reviewCommentInput.value.trim();

      if (!name || !comment || selectedRating === 0) {
        showReviewError("Por favor escribe tu nombre, tu opinión y selecciona una calificación.");
        return;
      }
      hideReviewError();

      var review = { name: name, comment: comment, rating: selectedRating, date: Date.now() };
      var stored = getStoredReviews();
      stored.unshift(review);
      saveStoredReviews(stored);
      renderReviewCard(review);

      reviewNameInput.value = "";
      reviewCommentInput.value = "";
      selectedRating = 0;
      paintStars(0);
      submitReviewBtn.textContent = "¡Gracias por tu opinión! ✓";
      setTimeout(function () { submitReviewBtn.textContent = "Enviar opinión"; }, 2200);
    });
  }

  /* ---------- Inicialización ---------- */
  renderProducts();
  renderCart();
  updateFavCount();
})();
