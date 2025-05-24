# Code Examples Section Styling Fix

## Issue

La sección de ejemplos tenía dos problemas principales:

1. El título del archivo `agent_example.py` no se mostraba correctamente usando `code-title`
2. El código no tenía resaltado de sintaxis adecuado

## Solution Implemented

### 1. Fixed Code Header Structure

Cambié la estructura del código de ejemplo de usar `span.code-title` a usar `div.code-header` y
`div.code-body`:

**Antes:**

```astro
<div class="code-example">
    <span class="code-title">agent_example.py</span>
    <pre><code class="language-python">...</code></pre>
</div>
```

**Después:**

```astro
<div class="code-example">
    <div class="code-header">agent_example.py</div>
    <div class="code-body">
        <pre><code class="language-python">...</code></pre>
    </div>
</div>
```

### 2. Enhanced CSS Styling

Mejoré los estilos CSS para el `code-body` y agregué mejor soporte para Prism.js:

```css
.code-body {
  background-color: #2d3748;
  border-radius: 0 0 8px 8px;
  overflow: hidden;
  margin: 0;
}

.code-body pre {
  margin: 0;
  padding: 1rem;
  background-color: #2d3748;
  color: #e2e8f0;
  font-size: 0.875rem;
  line-height: 1.5;
  overflow-x: auto;
}

.code-body code {
  background-color: transparent;
  color: inherit;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

/* Dark mode styles for code body */
body.dark-mode .code-body {
  background-color: #1a202c;
}

body.dark-mode .code-body pre {
  background-color: #1a202c;
  color: #e2e8f0;
}
```

### 3. Improved Prism.js Configuration

Actualicé la configuración de Prism.js en `BaseLayout.astro`:

**Antes:**

```astro
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism.min.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-dark.min.css" media="(prefers-color-scheme: dark)">
```

**Después:**

```astro
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css">

<!-- Prism.js Dark theme for dark mode -->
<style>
    body.dark-mode pre[class*="language-"] {
        background-color: #1a202c !important;
    }
    body.dark-mode code[class*="language-"] {
        color: #e2e8f0 !important;
    }
</style>
```

## Files Modified

- `/src/pages/index.astro` - Updated code example structure
- `/src/styles/global.css` - Enhanced code styling
- `/src/layouts/BaseLayout.astro` - Improved Prism.js configuration

## Results

- ✅ El título del archivo `agent_example.py` ahora se muestra correctamente con un header
  estilizado
- ✅ El código Python tiene resaltado de sintaxis completo
- ✅ Los estilos son consistentes en modo claro y oscuro
- ✅ El build se completa sin errores
- ✅ La tipografía del código es más legible con fuentes monospace apropiadas

## Key Improvements

1. **Consistent Header Styling**: Usa el mismo patrón `code-header` + `code-body` que otras
   secciones
2. **Better Syntax Highlighting**: Tema Prism.js mejorado con colores más vibrantes
3. **Dark Mode Support**: Estilos específicos para modo oscuro
4. **Professional Typography**: Fuentes monospace apropiadas para código
5. **Responsive Design**: El código se adapta correctamente en diferentes tamaños de pantalla
