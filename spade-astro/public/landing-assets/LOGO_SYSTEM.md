# SPADE Logo Design System

Este documento describe el sistema de logos para SPADE (Smart Python Agent Development Environment), una plataforma de sistemas multi-agente escrita en Python y basada en mensajería XMPP.

## Fundamentos del diseño del logo

Los logos de SPADE representan los conceptos fundamentales de la plataforma:

1. **Sistemas Multi-Agente**: Representados por nodos interconectados y redes
2. **Comunicación**: Visualizada a través de líneas de conexión entre agentes
3. **Base en Python**: Incorporada a través del esquema de colores azul y amarillo de Python
4. **Inteligencia**: Mostrada a través de redes y patrones organizados y estructurados

## Variantes del logo

### 1. Logo Principal (`spade-agent-network-fixed.svg`)
- **Concepto**: Un diseño circular con un nodo central (plataforma) rodeado de nodos agente
- **Elementos**:
  - Forma circular exterior representando el ecosistema completo
  - Nodo central utilizando un gradiente azul
  - Nodos satélite en color verde
  - Líneas punteadas representando la comunicación XMPP
  - Texto "SPADE" visible en el centro
  - Camino sutil en forma de serpiente (referencia a Python)

### 2. Logo Modo Oscuro (`spade-darkmode-fixed.svg`)
- **Concepto**: Versión de alto contraste para fondos oscuros
- **Elementos**:
  - Diseño idéntico al logo principal para mantener coherencia
  - Efectos de brillo en nodos y conexiones
  - Optimizado para alta legibilidad en fondos oscuros
  - Mantiene el texto "SPADE" visible

## Favicon (`favicon-spade-new.svg`)
- Una versión simplificada del diseño de Red Python
- Optimizado para tamaños pequeños manteniendo la reconocibilidad
- Utiliza tanto los colores azul como amarillo de Python

## Pautas de uso

1. **Logo Principal**: Usar `spade-agent-network-fixed.svg` como el logo principal
2. **Modo Oscuro**: Cambiar a `spade-darkmode-fixed.svg` para fondos oscuros
3. **Favicon**: Usar `favicon-spade-new.svg` para pestañas del navegador y marcadores

## Paleta de colores

- **Azul de Python**: #306998
- **Amarillo de Python**: #FFD43B
- **Azul de SPADE**: #3498db
- **Verde de SPADE**: #2ecc71
- **Fondo oscuro**: #121212

Estos colores deben usarse consistentemente en toda la documentación y sitio web de SPADE para mantener la identidad de marca.

## Logo Unification

To maintain brand consistency across the website, we've standardized on the following logos:

1. **Light Mode**: The `spade-agent-network.svg` logo is used consistently across the navbar, hero section, and footer
2. **Dark Mode**: The `spade-darkmode.svg` logo is used when the user selects dark mode

This consistency helps with brand recognition and provides a cleaner, more professional appearance.

### Implementation Details

The logo switching is handled automatically by JavaScript in `scripts.js`. When the user toggles dark mode:

1. The theme preference is saved to localStorage
2. All logo instances throughout the page are updated simultaneously
3. The dark mode toggle icon changes from moon to sun (or vice versa)

This provides a seamless experience as users navigate between light and dark modes.
