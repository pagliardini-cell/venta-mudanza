# 🇧🇷 Venta por Mudanza Definitiva a Brasil (Mar del Plata)

Catálogo interactivo moderno para liquidar artículos del departamento por mudanza al exterior.

## 📍 Características Principales
- **Diseño Ultra Estético:** Dark mode refinado con acentos de color cálido y esmeralda.
- **Logística Clara:** Avisos bien visibles de **Retiro por Barrio Constitución / Caisamar (Mar del Plata)** a cargo exclusivo del comprador.
- **Carrito de Consulta y Botón WhatsApp:** El interesado selecciona los muebles o artículos que le gustan y presiona un botón para mandarte un WhatsApp con la lista completa, el total y la aclaración del retiro.
- **Buscador en Vivo y Filtros:** Por texto y por categorías (Muebles, Electro, Hogar/Bazar, Varios).
- **Control de Estados:** Disponible, Reservado, Vendido.

---

## ⚙️ Configuración Rápida

### 1. Poner tu número de WhatsApp
Abrí `app.js` y en las primeras líneas cambiá el teléfono por el tuyo:
```javascript
const CONFIG = {
  whatsappTelefono: "549223XXXXXXX", // Código de país 54 + 9 + 223 + tu número sin 15
  ...
};
```

### 2. Cómo agregar artículos a través de la IA
Solo pasame por el chat:
1. Las fotos del artículo.
2. Título, precio, medidas aproximadas y estado.
Yo lo agrego automáticamente a `articulos.json` y queda publicado.

---

## 🚀 Conectar a GitHub y Desplegar en Vercel

1. Abrí **GitHub Desktop**.
2. Andá a **File > Add Local Repository** y elegí la carpeta:
   `C:\Users\Walter\Desktop\venta-mudanza`
3. Si te pide inicializar el repositorio Git, dale **"Create a repository"**.
4. Hacé clic en **"Publish repository"** en GitHub.
5. Andá a [vercel.com](https://vercel.com), dale a **"Add New Project"**, seleccioná el repositorio `venta-mudanza` y dale a **Deploy**.
6. ¡Listo! Te va a dar una URL tipo `venta-mudanza.vercel.app` para compartir por todos lados.
