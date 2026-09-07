/* =========================================================
   Licorera Punto Frío — Panel de administración (Supabase)
   ========================================================= */
(async function () {
  "use strict";

  // Protección de acceso: si no inició sesión, se envía a login
  if (sessionStorage.getItem("pf_admin_logged_in") !== "true") {
    window.location.href = "login.html";
    return;
  }

  var form = document.getElementById("addProductForm");
  var tableBody = document.getElementById("productTableBody");
  var categorySelect = document.getElementById("prodCategory");
  var subWrap = document.getElementById("subCategoryWrap");
  var logoutBtn = document.getElementById("logoutBtn");
  var resetBtn = document.getElementById("resetCatalogBtn");
  var countEl = document.getElementById("productCount");
  var formTitle = document.getElementById("formTitle");
  var formSubmitBtn = document.getElementById("formSubmitBtn");
  var cancelEditBtn = document.getElementById("cancelEditBtn");
  var editingIdInput = document.getElementById("editingId");
  var panelForm = form.closest(".panel");
  var uploadDropzone = document.getElementById("uploadDropzone");
  var imgPreview = document.getElementById("imgPreview");
  var uploadPlaceholder = document.getElementById("uploadPlaceholder");
  var prodImgFile = document.getElementById("prodImgFile");
  var removeImgBtn = document.getElementById("removeImgBtn");
  var pendingImageDataUrl = null;

  // Mapa local para acceder rápido a los productos traídos de Supabase
  var currentProductsMap = {};

  /* ---------- Renderizar Tabla desde Supabase ---------- */
  async function renderTable() {
    tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Cargando productos...</td></tr>';

    const { data: products, error } = await supabase
      .from("productos")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error("Error al obtener productos:", error);
      tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:red;">Error al cargar datos de Supabase</td></tr>';
      return;
    }

    tableBody.innerHTML = "";
    countEl.textContent = products.length;
    currentProductsMap = {};

    products.forEach(function (p) {
      currentProductsMap[p.id] = p;

      var badgeClass = "b-" + (["cerveza", "ron", "whisky", "aguardiente", "tequila", "vino"].indexOf(p.category) !== -1 ? p.category : "otros");
      var tr = document.createElement("tr");
      tr.innerHTML =
        '<td><img src="' + (p.img || "assets/icons/whisky.svg") + '" alt="" class="thumb"></td>' +
        '<td>' + escapeHtml(p.name) + '</td>' +
        '<td><span class="cat-badge ' + badgeClass + '">' + (CATEGORY_LABELS[p.category] || p.category) + (p.sub ? " · " + p.sub : "") + '</span></td>' +
        '<td>' + (p.ml ? p.ml + " ml" : "—") + '</td>' +
        '<td>' + formatCOP(p.price) + '</td>' +
        '<td><div class="row-actions">' +
          '<button type="button" class="btn-edit" data-edit="' + p.id + '">Editar</button>' +
          '<button type="button" class="btn-delete" data-delete="' + p.id + '">Eliminar</button>' +
        '</div></td>';
      tableBody.appendChild(tr);
    });
  }

  function escapeHtml(str) {
    var div = document.createElement("div");
    div.textContent = str || "";
    return div.innerHTML;
  }

  categorySelect.addEventListener("change", function () {
    subWrap.style.display = categorySelect.value === "otros" ? "block" : "none";
  });

  /* ---------- Subida de imagen ---------- */
  function showImagePreview(src) {
    imgPreview.src = src;
    imgPreview.style.display = "block";
    uploadPlaceholder.style.display = "none";
    removeImgBtn.style.display = "inline-block";
  }

  function clearImagePreview() {
    imgPreview.src = "";
    imgPreview.style.display = "none";
    uploadPlaceholder.style.display = "flex";
    removeImgBtn.style.display = "none";
    pendingImageDataUrl = null;
    prodImgFile.value = "";
  }

  function handleImageFile(file) {
    if (!file || file.type.indexOf("image/") !== 0) {
      alert("Por favor selecciona un archivo de imagen (JPG, PNG, WEBP...).");
      return;
    }
    var reader = new FileReader();
    reader.onload = function (e) {
      var img = new Image();
      img.onload = function () {
        var maxDim = 640;
        var w = img.width, h = img.height;
        if (w > maxDim || h > maxDim) {
          if (w >= h) { h = Math.round(h * maxDim / w); w = maxDim; }
          else { w = Math.round(w * maxDim / h); h = maxDim; }
        }
        var canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        var ctx = canvas.getContext("2d");
        var isPng = file.type === "image/png";
        if (!isPng) { ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, w, h); }
        ctx.drawImage(img, 0, 0, w, h);
        var dataUrl = isPng ? canvas.toDataURL("image/png") : canvas.toDataURL("image/jpeg", 0.85);
        pendingImageDataUrl = dataUrl;
        showImagePreview(dataUrl);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  if (uploadDropzone) {
    uploadDropzone.addEventListener("click", function () { prodImgFile.click(); });
    prodImgFile.addEventListener("change", function () {
      if (prodImgFile.files && prodImgFile.files[0]) handleImageFile(prodImgFile.files[0]);
    });
    uploadDropzone.addEventListener("dragover", function (e) {
      e.preventDefault();
      uploadDropzone.classList.add("dragover");
    });
    uploadDropzone.addEventListener("dragleave", function () {
      uploadDropzone.classList.remove("dragover");
    });
    uploadDropzone.addEventListener("drop", function (e) {
      e.preventDefault();
      uploadDropzone.classList.remove("dragover");
      if (e.dataTransfer.files && e.dataTransfer.files[0]) handleImageFile(e.dataTransfer.files[0]);
    });
  }

  if (removeImgBtn) {
    removeImgBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      clearImagePreview();
    });
  }

  /* ---------- Guardar (Insert / Update) en Supabase ---------- */
  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    var name = document.getElementById("prodName").value.trim();
    var category = categorySelect.value;
    var sub = document.getElementById("prodSub").value;
    var ml = document.getElementById("prodMl").value;
    var price = document.getElementById("prodPrice").value;
    var editingId = editingIdInput.value;

    if (!name || !category || !price) return;

    formSubmitBtn.disabled = true;
    formSubmitBtn.textContent = "Guardando...";

    if (editingId) {
      // --- Modo edición (UPDATE) ---
      var changes = {
        name: name,
        category: category,
        price: parseInt(price, 10),
        ml: ml ? parseInt(ml, 10) : null,
        sub: (category === "otros" && sub) ? sub : null
      };
      if (pendingImageDataUrl) changes.img = pendingImageDataUrl;

      const { error } = await supabase
        .from("productos")
        .update(changes)
        .eq("id", editingId);

      formSubmitBtn.disabled = false;

      if (error) {
        alert("Error al actualizar producto: " + error.message);
      } else {
        exitEditMode();
        await renderTable();
      }
      return;
    }

    // --- Modo agregar nuevo (INSERT) ---
    var newProduct = {
      name: name,
      category: category,
      price: parseInt(price, 10),
      ml: ml ? parseInt(ml, 10) : null,
      img: pendingImageDataUrl || "assets/icons/whisky.svg",
      sub: (category === "otros" && sub) ? sub : null
    };

    const { error } = await supabase
      .from("productos")
      .insert([newProduct]);

    formSubmitBtn.disabled = false;

    if (error) {
      alert("Error al agregar producto: " + error.message);
    } else {
      form.reset();
      subWrap.style.display = "none";
      clearImagePreview();
      exitEditMode();
      await renderTable();
    }
  });

  /* ---------- Modo Edición ---------- */
  function enterEditMode(product) {
    editingIdInput.value = product.id;
    document.getElementById("prodName").value = product.name;
    categorySelect.value = product.category;
    document.getElementById("prodMl").value = product.ml || "";
    document.getElementById("prodPrice").value = product.price;
    subWrap.style.display = product.category === "otros" ? "block" : "none";
    if (product.sub) document.getElementById("prodSub").value = product.sub;

    pendingImageDataUrl = null;
    if (product.img) { showImagePreview(product.img); } else { clearImagePreview(); }

    formTitle.textContent = "✏️ Editando: " + product.name;
    formSubmitBtn.textContent = "💾 Guardar cambios";
    cancelEditBtn.style.display = "block";
    panelForm.classList.add("editing-mode");
    panelForm.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function exitEditMode() {
    editingIdInput.value = "";
    form.reset();
    subWrap.style.display = "none";
    formTitle.textContent = "🧊 Agregar producto";
    formSubmitBtn.textContent = "+ Agregar producto";
    cancelEditBtn.style.display = "none";
    panelForm.classList.remove("editing-mode");
    clearImagePreview();
  }

  if (cancelEditBtn) {
    cancelEditBtn.addEventListener("click", exitEditMode);
  }

  /* ---------- Eliminar y Editar (Acciones de la tabla) ---------- */
  tableBody.addEventListener("click", async function (e) {
    var editBtn = e.target.closest("[data-edit]");
    if (editBtn) {
      var id = editBtn.getAttribute("data-edit");
      var product = currentProductsMap[id];
      if (product) enterEditMode(product);
      return;
    }

    var delBtn = e.target.closest("[data-delete]");
    if (!delBtn) return;
    var delId = delBtn.getAttribute("data-delete");

    if (confirm("¿Estás seguro de eliminar este producto de la base de datos?")) {
      const { error } = await supabase
        .from("productos")
        .delete()
        .eq("id", delId);

      if (error) {
        alert("Error al eliminar: " + error.message);
      } else {
        if (editingIdInput.value === delId) exitEditMode();
        await renderTable();
      }
    }
  });

  /* ---------- Opciones secundarias ---------- */
  if (resetBtn) {
    resetBtn.addEventListener("click", function () {
      alert("Para vaciar el catálogo completo, por favor borra las filas directamente desde el editor de Supabase.");
    });
  }

  logoutBtn.addEventListener("click", function () {
    sessionStorage.removeItem("pf_admin_logged_in");
    window.location.href = "login.html";
  });

  // Carga inicial de datos
  await renderTable();
})();