/* =========================================================
   Licorera Punto Frío — Catálogo base de productos
   Precios de referencia para Colombia (COP)
   ========================================================= */

const BASE_PRODUCTS = [
  // CERVEZAS
  { id: "cer-01", name: "Águila Light", category: "cerveza", ml: 330, price: 3800, img: "assets/imgs/c2.jpg" },
  { id: "cer-02", name: "Águila Negra", category: "cerveza", ml: 330, price: 4000, img: "assets/imgs/c3.jpg" },
  { id: "cer-03", name: "Poker", category: "cerveza", ml: 330, price: 4000, img: "assets/imgs/c4.jpg" },
  { id: "cer-04", name: "Club Colombia", category: "cerveza", ml: 330, price: 4500, img: "assets/imgs/c8.webp" },
  { id: "cer-05", name: "Corona", category: "cerveza", ml: 355, price: 5500, img: "assets/imgs/c10.jpg" },
  { id: "cer-06", name: "Budweiser", category: "cerveza", ml: 330, price: 6000, img: "assets/imgs/c5.jpg" },
  { id: "cer-07", name: "Heineken", category: "cerveza", ml: 330, price: 6500, img: "assets/imgs/c11.jpg" },
  { id: "cer-08", name: "Cerveza Urbana Blonde Ale", category: "cerveza", ml: 330, price: 6800, img: "assets/imgs/c1.jpg" },
  { id: "cer-09", name: "Andina Light", category: "cerveza", ml: 330, price: 3800, img: "assets/imgs/c7.jpg" },
  { id: "cer-10", name: "Blue Ribbon", category: "cerveza", ml: 330, price: 4500, img: "assets/imgs/c9.jpg" },
  { id: "cer-11", name: "Gallo Cerveza", category: "cerveza", ml: 330, price: 4500, img: "assets/imgs/c6.jpg" },
  { id: "cer-12", name: "Águila Original", category: "cerveza", ml: 330, price: 3800, img: "assets/imgs/c2.jpg" },
  { id: "cer-13", name: "Stella Artois", category: "cerveza", ml: 330, price: 6200, img: "assets/imgs/c11.jpg" },

  // RON
  { id: "ron-01", name: "Ron Viejo de Caldas 8 Años", category: "ron", ml: 750, price: 75000, img: "assets/imgs/r3.jpg" },
  { id: "ron-02", name: "Ron Medellín 8 Años", category: "ron", ml: 750, price: 80000, img: "assets/imgs/r1.jpg" },
  { id: "ron-03", name: "Ron Bacardí Blanco", category: "ron", ml: 750, price: 68000, img: "assets/imgs/r2.jpg" },
  { id: "ron-04", name: "Ron Havana Club 7 Años", category: "ron", ml: 750, price: 115000, img: "assets/imgs/r4.jpg" },
  { id: "ron-05", name: "Ron Santa Fe Dorado", category: "ron", ml: 750, price: 62000, img: "assets/imgs/r5.jpg" },
  { id: "ron-06", name: "Ron Zacapa 23 Años", category: "ron", ml: 750, price: 245000, img: "assets/icons/bottles/ron-zacapa.svg" },
  { id: "ron-07", name: "Ron Cacique Añejo", category: "ron", ml: 750, price: 58000, img: "assets/icons/bottles/ron-cacique.svg" },

  // WHISKY
  { id: "whi-01", name: "Old Parr 18 Años", category: "whisky", ml: 750, price: 330000, img: "assets/icons/bottles/whisky-old-parr.svg" },
  { id: "whi-02", name: "Buchanan's 18 Años", category: "whisky", ml: 750, price: 290000, img: "assets/icons/bottles/whisky-buchanans-18.svg" },
  { id: "whi-03", name: "Johnnie Walker Etiqueta Negra", category: "whisky", ml: 750, price: 135000, img: "assets/icons/bottles/whisky-jw-negra.svg" },
  { id: "whi-04", name: "Chivas Regal 12 Años", category: "whisky", ml: 750, price: 160000, img: "assets/icons/bottles/whisky-chivas-12.svg" },
  { id: "whi-05", name: "Jack Daniel's Tennessee", category: "whisky", ml: 750, price: 140000, img: "assets/icons/bottles/whisky-jack-daniels.svg" },
  { id: "whi-06", name: "Johnnie Walker Etiqueta Roja", category: "whisky", ml: 750, price: 98000, img: "assets/icons/bottles/whisky-jw-roja.svg" },
  { id: "whi-07", name: "Buchanan's 12 Años", category: "whisky", ml: 750, price: 155000, img: "assets/icons/bottles/whisky-buchanans-12.svg" },

  // AGUARDIENTE
  { id: "agu-01", name: "Aguardiente Antioqueño Sin Azúcar", category: "aguardiente", ml: 750, price: 46000, img: "assets/imgs/ag.webp" },
  { id: "agu-02", name: "Aguardiente Néctar Doble Anís", category: "aguardiente", ml: 750, price: 45000, img: "assets/imgs/ag1.jpg" },
  { id: "agu-03", name: "Aguardiente Cristal", category: "aguardiente", ml: 750, price: 43000, img: "assets/icons/bottles/aguardiente-cristal.svg" },
  { id: "agu-04", name: "Aguardiente Blanco del Valle", category: "aguardiente", ml: 750, price: 40000, img: "assets/icons/bottles/aguardiente-blanco-valle.svg" },
  { id: "agu-05", name: "Aguardiente Amarillo de Manzanares", category: "aguardiente", ml: 750, price: 41000, img: "assets/icons/bottles/aguardiente-amarillo.svg" },

  // TEQUILA
  { id: "teq-01", name: "José Cuervo Especial", category: "tequila", ml: 750, price: 95000, img: "assets/icons/bottles/tequila-jose-cuervo.svg" },
  { id: "teq-02", name: "Don Julio Blanco", category: "tequila", ml: 750, price: 220000, img: "assets/icons/bottles/tequila-don-julio.svg" },
  { id: "teq-03", name: "1800 Reposado", category: "tequila", ml: 750, price: 150000, img: "assets/icons/bottles/tequila-1800.svg" },
  { id: "teq-04", name: "Herradura Blanco", category: "tequila", ml: 750, price: 165000, img: "assets/icons/bottles/tequila-herradura.svg" },

  // VINOS
  { id: "vin-01", name: "Santa Rita 120 Cabernet Sauvignon", category: "vino", ml: 750, price: 38000, img: "assets/icons/bottles/vino-santa-rita.svg" },
  { id: "vin-02", name: "Casillero del Diablo", category: "vino", ml: 750, price: 45000, img: "assets/icons/bottles/vino-casillero.svg" },
  { id: "vin-03", name: "Gato Negro", category: "vino", ml: 750, price: 32000, img: "assets/icons/bottles/vino-gato-negro.svg" },
  { id: "vin-04", name: "Santo Tomás Rosado", category: "vino", ml: 750, price: 35000, img: "assets/icons/bottles/vino-rosado.svg" },
  { id: "vin-05", name: "Concha y Toro Reservado", category: "vino", ml: 750, price: 48000, img: "assets/icons/bottles/vino-concha-toro.svg" },

  // OTROS — MICHELADAS
  { id: "mic-01", name: "Michelada de Cereza con Corona", category: "otros", sub: "michelada", ml: 400, price: 8000, img: "assets/imgs/m1.jpg" },
  { id: "mic-02", name: "Micheladas de Frutas", category: "otros", sub: "michelada", ml: 400, price: 7000, img: "assets/imgs/m3.jpg" },
  { id: "mic-03", name: "Michelada de Mango con Poker", category: "otros", sub: "michelada", ml: 400, price: 7000, img: "assets/imgs/m2.jpg" },
  { id: "mic-04", name: "Michelada de Maracuyá con Budweiser", category: "otros", sub: "michelada", ml: 400, price: 8000, img: "assets/imgs/m4.jpg" },
  { id: "mic-05", name: "Michelada de Piña", category: "otros", sub: "michelada", ml: 400, price: 7000, img: "assets/imgs/m5.jpg" },
  { id: "mic-06", name: "Soda Michelada Águila Light", category: "otros", sub: "michelada", ml: 400, price: 6000, img: "assets/imgs/m7.jpg" },

  // OTROS — MECATOS
  { id: "mec-01", name: "Papas Margarita", category: "otros", sub: "mecato", ml: null, price: 3500, img: "assets/icons/mecato.svg" },
  { id: "mec-02", name: "Maní Moto", category: "otros", sub: "mecato", ml: null, price: 2500, img: "assets/icons/mecato.svg" },
  { id: "mec-03", name: "Doritos", category: "otros", sub: "mecato", ml: null, price: 4000, img: "assets/icons/mecato.svg" },
  { id: "mec-04", name: "Platanitos Verdes", category: "otros", sub: "mecato", ml: null, price: 3000, img: "assets/icons/mecato.svg" },

  // OTROS — CIGARROS
  { id: "cig-01", name: "Marlboro Rojo", category: "otros", sub: "cigarro", ml: null, price: 9000, img: "assets/icons/cigarro.svg" },
  { id: "cig-02", name: "Lucky Strike", category: "otros", sub: "cigarro", ml: null, price: 8500, img: "assets/icons/cigarro.svg" },
  { id: "cig-03", name: "Marlboro Azul", category: "otros", sub: "cigarro", ml: null, price: 9000, img: "assets/icons/cigarro.svg" }
];

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
   Cada categoría tiene sus propias presentaciones típicas de
   una licorera colombiana. El precio de cada presentación
   aplica un pequeño descuento por volumen.
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

/* Combina el catálogo base con los productos que el admin
   haya agregado, editado o eliminado desde el panel (localStorage). */
function getAllProducts() {
  let custom = [];
  let removed = [];
  let overrides = {};
  try { custom = JSON.parse(localStorage.getItem("pf_custom_products")) || []; } catch (e) { custom = []; }
  try { removed = JSON.parse(localStorage.getItem("pf_removed_products")) || []; } catch (e) { removed = []; }
  try { overrides = JSON.parse(localStorage.getItem("pf_product_overrides")) || {}; } catch (e) { overrides = {}; }

  const base = BASE_PRODUCTS
    .filter(p => !removed.includes(p.id))
    .map(p => overrides[p.id] ? Object.assign({}, p, overrides[p.id]) : p);

  return base.concat(custom);
}

/* Guarda una edición sobre un producto: si es del catálogo base, se guarda
   como "override" (el original en products.js nunca se toca); si es un
   producto agregado por el admin, se actualiza directamente. */
function saveProductEdit(id, changes) {
  if (id.indexOf("custom-") === 0) {
    let custom = [];
    try { custom = JSON.parse(localStorage.getItem("pf_custom_products")) || []; } catch (e) { custom = []; }
    custom = custom.map(p => p.id === id ? Object.assign({}, p, changes) : p);
    localStorage.setItem("pf_custom_products", JSON.stringify(custom));
  } else {
    let overrides = {};
    try { overrides = JSON.parse(localStorage.getItem("pf_product_overrides")) || {}; } catch (e) { overrides = {}; }
    overrides[id] = Object.assign({}, overrides[id], changes);
    localStorage.setItem("pf_product_overrides", JSON.stringify(overrides));
  }
}

function formatCOP(n) {
  return "$" + Number(n).toLocaleString("es-CO");
}
