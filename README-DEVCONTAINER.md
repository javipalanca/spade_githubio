# SPADE Astro - Instrucciones de Desarrollo

Este proyecto contiene:
1. El sitio original de SPADE en la raíz (`/`)
2. La versión migrada a Astro en el directorio `spade-astro/`

## Desarrollo con DevContainer

Este proyecto está configurado para usar DevContainers, lo que permite un entorno de desarrollo consistente y aislado.

### Requisitos previos
- Docker instalado
- Visual Studio Code con la extensión Remote Containers

### Pasos para iniciar el DevContainer
1. Abre este proyecto en VS Code
2. VS Code debería detectar el DevContainer y sugerirte abrirlo. Si no:
   - Presiona `F1` o `Ctrl+Shift+P` (`Cmd+Shift+P` en Mac)
   - Escribe y selecciona "Remote-Containers: Reopen in Container"
3. Espera a que el contenedor se construya y se inicie (puede tardar unos minutos la primera vez)

### Estructura del proyecto en el DevContainer
- `/workspaces/spade_githubio/` - La raíz del proyecto con el sitio original
- `/workspaces/spade_githubio/spade-astro/` - La versión Astro del sitio

### Comandos útiles en el DevContainer
Para trabajar con el proyecto Astro:
```bash
# Navegar al directorio de Astro
cd /workspaces/spade_githubio/spade-astro

# Iniciar el servidor de desarrollo
npm run dev

# Construir para producción
npm run build

# Previsualizar la construcción
npm run preview
```

## Solución de problemas

### Si el DevContainer no se inicia correctamente
1. Verifica que Docker esté funcionando
2. Intenta reconstruir el contenedor:
   - `F1` > "Remote-Containers: Rebuild Container"

### Si tienes problemas con las dependencias
Dentro del contenedor:
```bash
cd /workspaces/spade_githubio/spade-astro
rm -rf node_modules
npm install
```

### Si el sitio no se visualiza correctamente
Verifica que los archivos estáticos (CSS, JS, imágenes) se estén sirviendo correctamente desde el directorio `public/`
