// CONFIGURACIÓN PRINCIPAL
const CONFIG = {
  // Número de WhatsApp configurado para recibir las consultas
  whatsappTelefono: "5491151792060",
  moneda: "$",
  barrioRetiro: "Barrio Constitución / Caisamar (Mar del Plata)"
};

// ESTADO GLOBAL DE LA APP
let catalogo = [];
let articulosSeleccionados = new Set();
let categoriaActiva = "todas";
let busquedaTexto = "";
let soloDisponibles = false;

// ELEMENTOS DEL DOM
const gridArticulos = document.getElementById("gridArticulos");
const sinResultados = document.getElementById("sinResultados");
const inputBusqueda = document.getElementById("inputBusqueda");
const btnLimpiarBusqueda = document.getElementById("btnLimpiarBusqueda");
const checkSoloDisponibles = document.getElementById("checkSoloDisponibles");
const contadorItems = document.getElementById("contadorItems");
const contenedorCategorias = document.getElementById("contenedorCategorias");
const barraFlotante = document.getElementById("barraFlotante");
const cantFlotante = document.getElementById("cantFlotante");
const totalFlotante = document.getElementById("totalFlotante");
const btnAbrirModalConsulta = document.getElementById("btnAbrirModalConsulta");
const btnVerConsultaTop = document.getElementById("btnVerConsultaTop");
const badgeTopCount = document.getElementById("badgeTopCount");

// Modales
const modalConsulta = document.getElementById("modalConsulta");
const btnCerrarModalConsulta = document.getElementById("btnCerrarModalConsulta");
const listaConsultaItems = document.getElementById("listaConsultaItems");
const montoTotalModal = document.getElementById("montoTotalModal");
const inputNombreComprador = document.getElementById("inputNombreComprador");
const btnDispararWhatsApp = document.getElementById("btnDispararWhatsApp");

const modalDetalle = document.getElementById("modalDetalle");
const btnCerrarModalDetalle = document.getElementById("btnCerrarModalDetalle");
const imgDetalle = document.getElementById("imgDetalle");
const badgeEstadoDetalle = document.getElementById("badgeEstadoDetalle");
const precioDetalle = document.getElementById("precioDetalle");
const tituloDetalle = document.getElementById("tituloDetalle");
const medidasDetalle = document.getElementById("medidasDetalle");
const descripcionDetalle = document.getElementById("descripcionDetalle");
const btnAccionDetalle = document.getElementById("btnAccionDetalle");

// FORMATEO DE MONEDA ARGENTINA
function formatearPrecio(precio) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0
  }).format(precio);
}

// INICIALIZACIÓN
async function inicializar() {
  if (typeof CATALOGO_ITEMS !== "undefined" && Array.isArray(CATALOGO_ITEMS)) {
    catalogo = CATALOGO_ITEMS;
  } else {
    try {
      const res = await fetch("articulos.json");
      catalogo = await res.json();
    } catch (err) {
      console.error("Error al cargar articulos:", err);
      catalogo = [];
    }
  }

  // Cargar selección previa de localStorage
  try {
    const guardados = JSON.parse(localStorage.getItem("items_consulta_mudanza") || "[]");
    articulosSeleccionados = new Set(guardados);
  } catch (e) {
    articulosSeleccionados = new Set();
  }

  configurarEventos();
  renderizar();
  actualizarBarraFlotante();
}

// CONFIGURACIÓN DE LISTENERS
function configurarEventos() {
  // Búsqueda
  inputBusqueda.addEventListener("input", (e) => {
    busquedaTexto = e.target.value.toLowerCase().trim();
    btnLimpiarBusqueda.classList.toggle("hidden", busquedaTexto.length === 0);
    renderizar();
  });

  btnLimpiarBusqueda.addEventListener("click", () => {
    inputBusqueda.value = "";
    busquedaTexto = "";
    btnLimpiarBusqueda.classList.add("hidden");
    renderizar();
  });

  document.getElementById("btnResetFiltros").addEventListener("click", () => {
    inputBusqueda.value = "";
    busquedaTexto = "";
    checkSoloDisponibles.checked = false;
    soloDisponibles = false;
    categoriaActiva = "todas";
    document.querySelectorAll(".cat-chip").forEach(b => {
      b.classList.toggle("active", b.dataset.cat === "todas");
      b.classList.toggle("bg-emerald-500", b.dataset.cat === "todas");
      b.classList.toggle("text-neutral-950", b.dataset.cat === "todas");
    });
    renderizar();
  });

  // Filtro Solo Disponibles
  checkSoloDisponibles.addEventListener("change", (e) => {
    soloDisponibles = e.target.checked;
    renderizar();
  });

  // Chips de Categorías
  contenedorCategorias.addEventListener("click", (e) => {
    const btn = e.target.closest(".cat-chip");
    if (!btn) return;
    categoriaActiva = btn.dataset.cat;
    
    document.querySelectorAll(".cat-chip").forEach(b => {
      b.classList.remove("active", "bg-emerald-500", "text-neutral-950", "shadow-lg", "shadow-emerald-500/20");
      b.classList.add("bg-neutral-900", "text-neutral-300", "hover:bg-neutral-800", "border-neutral-800");
    });

    btn.classList.add("active", "bg-emerald-500", "text-neutral-950", "shadow-lg", "shadow-emerald-500/20");
    btn.classList.remove("bg-neutral-900", "text-neutral-300");

    renderizar();
  });

  // Modales
  btnAbrirModalConsulta.addEventListener("click", abrirModalConsulta);
  btnVerConsultaTop.addEventListener("click", abrirModalConsulta);
  btnCerrarModalConsulta.addEventListener("click", cerrarModalConsulta);
  modalConsulta.addEventListener("click", (e) => {
    if (e.target === modalConsulta) cerrarModalConsulta();
  });

  btnCerrarModalDetalle.addEventListener("click", cerrarModalDetalle);
  modalDetalle.addEventListener("click", (e) => {
    if (e.target === modalDetalle) cerrarModalDetalle();
  });

  // Disparo a WhatsApp
  btnDispararWhatsApp.addEventListener("click", enviarWhatsApp);
}

// TOGGLE DE SELECCIÓN DE ARTÍCULO
function toggleSeleccion(id) {
  const item = catalogo.find(i => i.id === id);
  if (!item || item.estado === "vendido") return;

  if (articulosSeleccionados.has(id)) {
    articulosSeleccionados.delete(id);
  } else {
    articulosSeleccionados.add(id);
  }

  // Guardar en localStorage
  localStorage.setItem("items_consulta_mudanza", JSON.stringify([...articulosSeleccionados]));

  renderizar();
  actualizarBarraFlotante();
}

// FILTRADO DE ITEMS
function obtenerItemsFiltrados() {
  return catalogo.filter(item => {
    // Categoría
    if (categoriaActiva !== "todas" && item.categoria !== categoriaActiva) {
      return false;
    }
    // Estado
    if (soloDisponibles && item.estado !== "disponible") {
      return false;
    }
    // Texto
    if (busquedaTexto) {
      const matchTitulo = item.titulo.toLowerCase().includes(busquedaTexto);
      const matchDesc = item.descripcion.toLowerCase().includes(busquedaTexto);
      const matchMedidas = item.medidas ? item.medidas.toLowerCase().includes(busquedaTexto) : false;
      if (!matchTitulo && !matchDesc && !matchMedidas) return false;
    }
    return true;
  });
}

// RENDERIZADO DEL CATÁLOGO
function renderizar() {
  const items = obtenerItemsFiltrados();
  const disponibles = items.filter(i => i.estado === "disponible").length;

  contadorItems.textContent = `${items.length} artículos (${disponibles} disponibles)`;

  if (items.length === 0) {
    gridArticulos.innerHTML = "";
    sinResultados.classList.remove("hidden");
    return;
  }

  sinResultados.classList.add("hidden");

  gridArticulos.innerHTML = items.map(item => {
    const estaSeleccionado = articulosSeleccionados.has(item.id);
    const esVendido = item.estado === "vendido";
    const esReservado = item.estado === "reservado";
    const fotoPrincipal = item.fotos && item.fotos.length > 0 ? item.fotos[0] : "";

    // Badge de estado
    let badgeHtml = "";
    if (esVendido) {
      badgeHtml = `<span class="bg-neutral-800 text-neutral-400 border border-neutral-700 text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">Vendido</span>`;
    } else if (esReservado) {
      badgeHtml = `<span class="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">Reservado</span>`;
    } else {
      badgeHtml = `<span class="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">Disponible</span>`;
    }

    // Botón de acción
    let btnHtml = "";
    if (esVendido) {
      btnHtml = `
        <button disabled class="w-full py-2.5 rounded-xl bg-neutral-800 text-neutral-500 text-xs font-bold cursor-not-allowed">
          No disponible
        </button>
      `;
    } else if (estaSeleccionado) {
      btnHtml = `
        <button onclick="toggleSeleccion('${item.id}')" class="w-full py-2.5 rounded-xl bg-emerald-500 text-neutral-950 text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 transition">
          <i data-lucide="check" class="w-4 h-4"></i> En tu consulta
        </button>
      `;
    } else {
      btnHtml = `
        <button onclick="toggleSeleccion('${item.id}')" class="w-full py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700/80 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition">
          <i data-lucide="plus" class="w-4 h-4 text-emerald-400"></i> Me interesa
        </button>
      `;
    }

    return `
      <div class="glass-card rounded-2xl overflow-hidden flex flex-col group transition-all duration-300 hover:border-neutral-600 ${esVendido ? 'opacity-60 grayscale-[40%]' : ''}">
        
        <!-- Contenedor Imagen -->
        <div class="relative aspect-[4/3] bg-neutral-900 cursor-pointer overflow-hidden" onclick="abrirModalDetalle('${item.id}')">
          <img 
            src="${fotoPrincipal}" 
            alt="${item.titulo}" 
            loading="lazy"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          >
          <div class="absolute top-3 left-3">
            ${badgeHtml}
          </div>
          ${item.fotos && item.fotos.length > 1 ? `
            <span class="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md text-white text-[10px] font-semibold px-2 py-1 rounded-lg flex items-center gap-1">
              <i data-lucide="images" class="w-3 h-3"></i> ${item.fotos.length} fotos
            </span>
          ` : ''}
        </div>

        <!-- Info Card -->
        <div class="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
          <div class="space-y-1.5">
            <h3 class="font-bold text-white text-base leading-snug group-hover:text-emerald-400 transition cursor-pointer" onclick="abrirModalDetalle('${item.id}')">
              ${item.titulo}
            </h3>
            ${item.medidas ? `
              <div class="text-xs text-neutral-400 flex items-center gap-1.5 font-medium">
                <i data-lucide="ruler" class="w-3.5 h-3.5 text-neutral-500"></i>
                <span>${item.medidas}</span>
              </div>
            ` : ''}
            <p class="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
              ${item.descripcion}
            </p>
          </div>

          <div class="pt-3 border-t border-neutral-800/80 space-y-3">
            <div class="flex items-baseline justify-between">
              <span class="text-[11px] text-neutral-500 font-semibold uppercase tracking-wider">Precio</span>
              <span class="text-lg font-black text-white">${formatearPrecio(item.precio)}</span>
            </div>
            ${btnHtml}
          </div>

        </div>

      </div>
    `;
  }).join("");

  // Re-inicializar iconos de Lucide
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

// ACTUALIZACIÓN DE BARRA FLOTANTE
function actualizarBarraFlotante() {
  const count = articulosSeleccionados.size;
  badgeTopCount.textContent = count;
  badgeTopCount.classList.toggle("hidden", count === 0);

  if (count === 0) {
    barraFlotante.classList.add("translate-y-32", "opacity-0", "pointer-events-none");
    barraFlotante.classList.remove("translate-y-0", "opacity-100", "pointer-events-auto");
    return;
  }

  // Calcular monto total
  let total = 0;
  articulosSeleccionados.forEach(id => {
    const it = catalogo.find(i => i.id === id);
    if (it) total += it.precio;
  });

  cantFlotante.textContent = count;
  totalFlotante.textContent = formatearPrecio(total);

  barraFlotante.classList.remove("translate-y-32", "opacity-0", "pointer-events-none");
  barraFlotante.classList.add("translate-y-0", "opacity-100", "pointer-events-auto");
}

// MODAL DE RESUMEN / CONSULTA
function abrirModalConsulta() {
  const items = catalogo.filter(i => articulosSeleccionados.has(i.id));

  if (items.length === 0) {
    alert("Todavía no seleccionaste ningún artículo. Hacé clic en '+ Me interesa' en lo que te guste.");
    return;
  }

  let total = 0;
  listaConsultaItems.innerHTML = items.map(item => {
    total += item.precio;
    const foto = item.fotos && item.fotos.length > 0 ? item.fotos[0] : "";
    return `
      <div class="flex items-center justify-between p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 gap-3">
        <img src="${foto}" alt="${item.titulo}" class="w-12 h-12 rounded-lg object-cover bg-neutral-800">
        <div class="flex-1 min-w-0">
          <div class="text-xs font-bold text-white truncate">${item.titulo}</div>
          <div class="text-xs text-emerald-400 font-extrabold">${formatearPrecio(item.precio)}</div>
        </div>
        <button onclick="toggleSeleccion('${item.id}'); abrirModalConsulta();" class="text-neutral-500 hover:text-red-400 p-1.5 rounded-lg transition" title="Quitar">
          <i data-lucide="trash-2" class="w-4 h-4"></i>
        </button>
      </div>
    `;
  }).join("");

  montoTotalModal.textContent = formatearPrecio(total);
  modalConsulta.classList.remove("hidden");
  modalConsulta.classList.add("flex");

  if (window.lucide) window.lucide.createIcons();
}

function cerrarModalConsulta() {
  modalConsulta.classList.add("hidden");
  modalConsulta.classList.remove("flex");
}

// MODAL DE DETALLE
function abrirModalDetalle(id) {
  const item = catalogo.find(i => i.id === id);
  if (!item) return;

  const foto = item.fotos && item.fotos.length > 0 ? item.fotos[0] : "";
  imgDetalle.src = foto;
  tituloDetalle.textContent = item.titulo;
  precioDetalle.textContent = formatearPrecio(item.precio);
  descripcionDetalle.textContent = item.descripcion;
  medidasDetalle.innerHTML = item.medidas ? `<i data-lucide="ruler" class="w-4 h-4 text-emerald-400"></i> Medidas: ${item.medidas}` : '';

  // Miniaturas si tiene múltiples fotos
  const miniaturasDetalle = document.getElementById("miniaturasDetalle");
  if (miniaturasDetalle) {
    if (item.fotos && item.fotos.length > 1) {
      miniaturasDetalle.innerHTML = item.fotos.map((f, idx) => `
        <img 
          src="${f}" 
          alt="Foto ${idx + 1}" 
          onclick="document.getElementById('imgDetalle').src = '${f}'" 
          class="w-14 h-14 rounded-xl object-cover cursor-pointer border-2 border-neutral-700 hover:border-emerald-500 transition shrink-0 bg-neutral-900"
        >
      `).join("");
      miniaturasDetalle.classList.remove("hidden");
    } else {
      miniaturasDetalle.innerHTML = "";
      miniaturasDetalle.classList.add("hidden");
    }
  }

  // Badge estado
  badgeEstadoDetalle.className = "text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider";
  if (item.estado === "vendido") {
    badgeEstadoDetalle.classList.add("bg-neutral-800", "text-neutral-400", "border", "border-neutral-700");
    badgeEstadoDetalle.textContent = "Vendido";
    btnAccionDetalle.className = "flex-1 py-3 rounded-xl bg-neutral-800 text-neutral-500 font-bold text-sm cursor-not-allowed";
    btnAccionDetalle.textContent = "Artículo ya vendido";
    btnAccionDetalle.onclick = null;
  } else if (item.estado === "reservado") {
    badgeEstadoDetalle.classList.add("bg-amber-500/20", "text-amber-300", "border", "border-amber-500/40");
    badgeEstadoDetalle.textContent = "Reservado";
    configurarBotonModalDetalle(item);
  } else {
    badgeEstadoDetalle.classList.add("bg-emerald-500/20", "text-emerald-300", "border", "border-emerald-500/40");
    badgeEstadoDetalle.textContent = "Disponible";
    configurarBotonModalDetalle(item);
  }

  modalDetalle.classList.remove("hidden");
  modalDetalle.classList.add("flex");

  if (window.lucide) window.lucide.createIcons();
}

function configurarBotonModalDetalle(item) {
  const esta = articulosSeleccionados.has(item.id);
  if (esta) {
    btnAccionDetalle.className = "flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-black text-sm flex items-center justify-center gap-2 transition";
    btnAccionDetalle.innerHTML = `<i data-lucide="check" class="w-4 h-4"></i> Quitar de tu consulta`;
  } else {
    btnAccionDetalle.className = "flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-black text-sm flex items-center justify-center gap-2 transition";
    btnAccionDetalle.innerHTML = `<i data-lucide="plus" class="w-4 h-4"></i> Sumar a mi consulta`;
  }

  btnAccionDetalle.onclick = () => {
    toggleSeleccion(item.id);
    cerrModalDetalle();
  };
}

function cerrarModalDetalle() {
  modalDetalle.classList.add("hidden");
  modalDetalle.classList.remove("flex");
}

// MODAL PARA AMPLIAR LA ILUSTRACIÓN DE PORTADA
function abrirModalFotoCaricatura() {
  imgDetalle.src = "img/caricatura-familia.jpg";
  tituloDetalle.textContent = "Venta por Mudanza: MDQ ➔ Brasil";
  precioDetalle.textContent = "Mar del Plata ➔ Brasil";
  descripcionDetalle.textContent = "Liquidamos muebles, electrodomésticos y artículos del hogar por mudanza definitiva al exterior.";
  medidasDetalle.innerHTML = `<i data-lucide="map-pin" class="w-4 h-4 text-emerald-400"></i> Retiro en Barrio Constitución / Caisamar (Mar del Plata)`;

  badgeEstadoDetalle.className = "text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40";
  badgeEstadoDetalle.textContent = "Mudanza";

  btnAccionDetalle.className = "flex-1 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-sm flex items-center justify-center gap-2 transition";
  btnAccionDetalle.innerHTML = `<i data-lucide="x" class="w-4 h-4"></i> Cerrar`;
  btnAccionDetalle.onclick = cerrarModalDetalle;

  modalDetalle.classList.remove("hidden");
  modalDetalle.classList.add("flex");

  if (window.lucide) window.lucide.createIcons();
}

// GENERADOR Y ENVÍO A WHATSAPP
function enviarWhatsApp() {
  const items = catalogo.filter(i => articulosSeleccionados.has(i.id));
  if (items.length === 0) return;

  const nombre = inputNombreComprador.value.trim();
  let total = 0;

  let textoItems = items.map(i => {
    total += i.precio;
    return `• ${i.titulo} (${formatearPrecio(i.precio)})`;
  }).join("\n");

  let mensaje = "";
  if (nombre) {
    mensaje += `¡Hola! Mi nombre es ${nombre}.\n\n`;
  } else {
    mensaje += `¡Hola! Vi la publicación de venta por mudanza a Brasil.\n\n`;
  }

  mensaje += `Me interesan los siguientes artículos:\n${textoItems}\n\n`;
  mensaje += `*Total estimado: ${formatearPrecio(total)}*\n\n`;
  mensaje += `Entiendo que el retiro es exclusivamente por *Barrio Constitución / Caisamar* a mi cargo (sin flete).\n¿Siguen disponibles para coordinar el retiro?`;

  const urlWhatsapp = `https://wa.me/${CONFIG.whatsappTelefono}?text=${encodeURIComponent(mensaje)}`;
  window.open(urlWhatsapp, "_blank");

  cerrarModalConsulta();
}

// INICIAR
document.addEventListener("DOMContentLoaded", inicializar);
