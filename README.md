# 📦 Plantilla Web: Catálogo de Venta por Mudanza / Liquidación

Catálogo web interactivo, moderno y ultra liviano para vender muebles, electrodomésticos y artículos del hogar con carrito de consulta directo a **WhatsApp**.

---

## 🌟 Características
- **Dark Mode Refinado:** Diseño visual moderno, sin dependencias complejas (HTML5 + Tailwind CSS + Vanilla JS).
- **Cero Build Steps:** Funciona tanto abriendo `index.html` con doble clic en local, como desplegado en **Vercel** o **GitHub Pages**.
- **Carrito de Consulta Inteligente:** El comprador selecciona varios artículos y presiona *"Enviar consulta por WhatsApp"*; se le abre el chat con el mensaje pre-armado, la lista de artículos, el monto total y las condiciones de retiro.
- **Filtros en Vivo:** Por palabra clave (título, medidas, descripción) y por categorías configurables.
- **Galería de Fotos Múltiples:** Soporte para varias fotos por artículo con selector de miniaturas.
- **Control de Estados:** `Disponible`, `Reservado`, `Vendido`.

---

## 🚀 Guía Rápida para Adaptar este Proyecto (Para un Amigo)

Si querés usar esta misma web para tu propia venta o mudanza:

### 1. Clonar el repositorio
```bash
git clone https://github.com/pagliardini-cell/venta-mudanza.git
```
O descargá el ZIP desde GitHub y descomprimilo en tu computadora.

### 2. Abrir la carpeta en Antigravity
Abrí la carpeta del proyecto en **Google Antigravity**.

### 3. Copiar y pegar el Prompt de Personalización
Pegale a Antigravity el prompt que figura abajo completando tus datos (tu WhatsApp, tu ciudad/barrio, y tus artículos).

---

## 🤖 Prompt para Antigravity (Copiar y Pegar)

```text
Hola Antigravity. Descargué este proyecto de catálogo web de venta por mudanza y quiero que lo adaptes 100% para mí.

Mis datos son:
1. MOTIVO / TÍTULO DE LA WEB: [Ej: "Venta por Mudanza a Córdoba" / "Gran Liquidación por Viaje"]
2. SUBTÍTULO / DESCRIPCIÓN: [Ej: "Nos mudamos y liquidamos todo. Muebles y electrodomésticos en excelente estado."]
3. ZONA DE RETIRO: [Ej: "Barrio Palermo, CABA" / "Barrio Alberdi, Córdoba Capital"]
4. CONDICIÓN DE RETIRO: [Ej: "Retiro a cargo del comprador en domicilio (sin envíos)"]
5. MI NÚMERO DE WHATSAPP: [Ej: "54911XXXXXXXX" - formato internacional sin signos ni espacios]

Por favor realiza lo siguiente:
a) Actualizá en app.js la constante CONFIG con mi número de WhatsApp y zona de retiro.
b) En index.html actualizá el título, subtítulo, badges y condiciones de retiro con mis datos.
c) Si tengo una imagen o foto de portada, ponela en img/ y ajustala en index.html.
d) Vaciá los artículos de ejemplo de articulos.js y articulos.json para que queden listos para cargar mis propios productos.
e) Guiame para ir pasándote fotos, títulos y precios de mis cosas para que los cargues en el catálogo.
```

---

## 📂 Estructura de Archivos

- `index.html`: Estructura visual, Hero con portada, buscador, filtros por categoría y modales.
- `app.js`: Lógica del carrito, cálculo de totales, filtros dinámicos y generación del link de WhatsApp.
- `articulos.js`: Base de datos rápida en JavaScript (garantiza funcionamiento sin errores de CORS en local).
- `articulos.json`: Misma base de datos en formato JSON para integraciones externas.
- `img/`: Carpeta con la foto de portada y las imágenes de cada artículo a la venta.
- `vercel.json`: Archivo de configuración para despliegue instantáneo en Vercel.

---

## 🌐 Publicación en Vercel (1 minuto)

1. Subí tu carpeta personalizada a tu cuenta de GitHub con **GitHub Desktop**.
2. Entrá a [vercel.com](https://vercel.com) e iniciá sesión con GitHub.
3. Tocá **"Add New... ➔ Project"**, seleccioná tu repositorio y dale a **"Deploy"**.
4. ¡Listo! Te entrega un link público gratuito (tipo `tu-mudanza.vercel.app`) para compartir con interesados.
