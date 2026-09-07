/* =========================================================
   Licorera Punto Frío — Catálogo de productos (Supabase)
   ========================================================= */

const CATEGORY_LABELS = {
  cerveza: "Cervezas",
  ron: "Ron",
  whisky: "Whisky",
  aguardiente: "Aguardiente",
  tequila: "Tequila",
  vino: "Vinos",
  otros: "Otros"
};

/* =========================================================
   Presentaciones de venta (unidad, six-pack, caja)
   ========================================================= */
function getPackOptions(p) {
  var unidad = { key: "unidad", label: "Unidad", units: 1, discount: 0 };

  if (p.category === "cerveza") {
    return [
      unidad,
      { key: "six", label: "Six pack (6 unds.)", units: 6, discount: 0.05 },
      { key: "caja", label: "Caja x24", units: 24, discount: 0.10 }
    ];
  }
  if (p.category === "otros" && p.sub === "michelada") {
    return [
      unidad,
      { key: "six", label: "Six pack (6 unds.)", units: 6, discount: 0.05 }
    ];
  }
  if (p.category === "otros" && (p.sub === "mecato" || p.sub === "cigarro")) {
    return [
      unidad,
      { key: "caja", label: "Caja x10", units: 10, discount: 0.08 }
    ];
  }
  if (["ron", "whisky", "aguardiente", "tequila", "vino"].indexOf(p.category) !== -1) {
    return [
      unidad,
      { key: "caja", label: "Caja x12", units: 12, discount: 0.08 }
    ];
  }
  return [unidad];
}

/* Calcula el precio total de una presentación específica */
function getPackPrice(product, packKey) {
  var options = getPackOptions(product);
  var opt = options.find(function (o) { return o.key === packKey; }) || options[0];
  var raw = product.price * opt.units;
  var total = Math.round(raw * (1 - opt.discount));
  return { option: opt, total: total };
}

/* =========================================================
   Consulta de Productos desde Supabase
   ========================================================= */
async function getAllProducts() {
  const { data: productos, error } = await supabase
    .from("productos")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    console.error("Error al obtener productos desde Supabase:", error.message);
    return [];
  }

  return productos;
}

/* Edición directa en Supabase desde funciones externas */
async function saveProductEdit(id, changes) {
  const { error } = await supabase
    .from("productos")
    .update(changes)
    .eq("id", id);

  if (error) {
    console.error("Error al actualizar producto:", error.message);
  }
}

function formatCOP(n) {
  return "$" + Number(n).toLocaleString("es-CO");
}