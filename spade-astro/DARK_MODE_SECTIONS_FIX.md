# Dark Mode Sections Background Fix - SPADE Astro

## Problema Identificado

Varias secciones mantenían fondos blancos o claros en modo oscuro, incluyendo:

- `.plugins-section` - Sección de plugins con fondo `var(--light-color)`
- `.badge-section` - Sección de badges con fondo `#f8f9fa`
- `.timeline-content` - Contenido de timeline con fondo blanco
- `.demo-card` - Tarjetas de demo con fondo blanco
- `.interactive-demo` - Sección de demo interactivo con gradiente claro
- `.code-example` - Ejemplos de código con fondo `#f8f9fa`
- `.btn-light` - Botones claros sin reglas de modo oscuro
- `pre[class*='language-']` - Bloques de código con fondo claro

## Solución Implementada

### CSS Añadido para Dark Mode

**Archivo**: `src/styles/global.css`

```css
/* Dark mode sections */
body.dark-mode .plugins-section {
  background-color: var(--dark-bg) !important;
}

body.dark-mode .badge-section {
  background-color: var(--dark-card-bg) !important;
}

/* Dark mode timeline */
body.dark-mode .timeline-content {
  background: var(--dark-card-bg) !important;
  color: var(--dark-text) !important;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3) !important;
}

/* Dark mode demo cards */
body.dark-mode .demo-card {
  background: var(--dark-card-bg) !important;
  border-color: var(--dark-border) !important;
  color: var(--dark-text) !important;
}

body.dark-mode .demo-card:hover {
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5) !important;
}

/* Dark mode interactive demo */
body.dark-mode .interactive-demo {
  background: linear-gradient(135deg, var(--dark-card-bg) 0%, var(--dark-bg) 100%) !important;
}

/* Dark mode badge section and code example */
body.dark-mode .badge-section {
  background: linear-gradient(45deg, var(--dark-card-bg), var(--dark-bg)) !important;
}

body.dark-mode .code-example {
  background: var(--dark-card-bg) !important;
  border-color: var(--dark-border) !important;
}

/* Dark mode button fixes */
body.dark-mode .btn-light {
  background-color: var(--dark-card-bg) !important;
  border-color: var(--dark-border) !important;
  color: var(--dark-text) !important;
}

body.dark-mode .btn-light:hover {
  background-color: var(--dark-border) !important;
  border-color: var(--dark-border) !important;
  color: var(--dark-text) !important;
}

/* Dark mode syntax highlighting */
body.dark-mode pre[class*='language-'] {
  background-color: var(--dark-card-bg) !important;
  border-color: var(--dark-border) !important;
}
```

## Variables CSS Utilizadas

Las reglas utilizan las variables CSS ya definidas en `:root`:

```css
:root {
  --dark-bg: #121212; /* Fondo principal modo oscuro */
  --dark-card-bg: #1e1e1e; /* Fondo de tarjetas modo oscuro */
  --dark-text: #e0e0e0; /* Texto principal modo oscuro */
  --dark-text-muted: #a0a0a0; /* Texto secundario modo oscuro */
  --dark-border: #333; /* Bordes modo oscuro */
}
```

## Resultado

✅ **Todas las secciones ahora tienen fondos apropiados en modo oscuro**:

- **Sección de plugins**: Fondo oscuro principal
- **Sección de badges**: Fondo de tarjeta oscuro
- **Contenido de timeline**: Fondo de tarjeta oscuro con texto claro
- **Tarjetas de demo**: Fondo de tarjeta oscuro con bordes apropiados
- **Demo interactivo**: Gradiente oscuro
- **Ejemplos de código**: Fondo de tarjeta oscuro
- **Botones claros**: Estilo apropiado para modo oscuro
- **Bloques de código**: Fondo oscuro con sintaxis highlighting

## Verificación

1. ✅ Build completado sin errores
2. ✅ Preview server funcionando en http://localhost:4321/
3. ✅ Todas las secciones visibles correctamente en modo oscuro
4. ✅ Transiciones suaves entre modo claro y oscuro
5. ✅ Contraste apropiado para accesibilidad

## Notas Técnicas

- Se utilizó `!important` para asegurar que las reglas sobrescriban estilos de Bootstrap
- Se mantuvieron las transiciones existentes para cambios suaves
- Se aplicaron sombras más intensas en modo oscuro para mejor definición
- Se respetó la jerarquía visual con diferentes tonos de gris
