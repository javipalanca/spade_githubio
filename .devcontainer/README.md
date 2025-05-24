# SPADE Astro Development Container

Este devcontainer está configurado para desarrollar el sitio web de SPADE con Astro de manera consistente y sin problemas de configuración.

## Características incluidas

- **Node.js 22** (LTS)
- **TypeScript** y **Prettier** configurados
- **Extensiones de VS Code** optimizadas para desarrollo Astro
- **Puertos configurados** (4321 para dev server, 3000 para preview)
- **Herramientas adicionales**: git, github-cli, build-essential

## Estructura del proyecto

```
/workspaces/
├── spade_githubio/              # Archivos originales del sitio
│   ├── landing-page.html        # Sitio original en HTML
│   ├── styles.css               # Estilos originales
│   ├── scripts.js               # JavaScript original
│   └── landing-assets/          # Assets originales
└── spade-astro/                 # Proyecto Astro (DIRECTORIO PRINCIPAL)
    ├── src/
    │   ├── pages/index.astro    # Página principal migrada
    │   ├── layouts/             # Layouts de Astro
    │   └── components/          # Componentes de Astro
    ├── public/                  # Assets públicos
    └── package.json             # Configuración del proyecto
```

## Uso

### 1. Prerequisitos
- Docker instalado en tu sistema
- VS Code con la extensión "Dev Containers" instalada

### 2. Abrir el proyecto en devcontainer
1. Abre VS Code en el directorio `/Users/jpalanca/devel/spade_githubio`
2. Presiona `Ctrl+Shift+P` (o `Cmd+Shift+P` en Mac)
3. Busca y ejecuta "Dev Containers: Reopen in Container"
4. Espera a que se construya el contenedor (solo la primera vez)

### 3. Comandos disponibles
Una vez dentro del devcontainer, estarás automáticamente en el directorio `/workspaces/spade-astro`:

```bash
# Verificar que estás en el directorio correcto
pwd
# Debería mostrar: /workspaces/spade-astro

# Instalar dependencias (ya se ejecuta automáticamente)
npm install

# Iniciar el servidor de desarrollo
npm run dev
# o usar el alias
astro-dev

# Construir para producción
npm run build
# o usar el alias
astro-build

# Vista previa de la build
npm run preview
# o usar el alias
astro-preview

# Formatear código
npm run format

# Verificar formato de código
npm run format:check
```

### 4. Puertos
- **Puerto 4321**: Servidor de desarrollo de Astro
- **Puerto 3000**: Servidor de preview

Estos puertos se reenvían automáticamente a tu máquina local.

### 5. Acceso al sitio
Una vez que ejecutes `npm run dev`, podrás acceder al sitio en:
- http://localhost:4321

## Extensiones incluidas

- **Astro**: Soporte completo para archivos .astro
- **Prettier**: Formateo automático de código
- **TypeScript**: Soporte completo para TypeScript
- **Auto Rename Tag**: Renombra automáticamente tags HTML
- **Path Intellisense**: Autocompletado de rutas de archivos
- **JSON/YAML**: Soporte mejorado para archivos de configuración

## Migración completada

✅ **La migración de HTML a Astro está completa**:
- ✅ HTML original convertido a componentes Astro
- ✅ Estilos CSS migrados
- ✅ JavaScript migrado
- ✅ Assets copiados
- ✅ Configuración de GitHub Pages lista
- ✅ Build funcional

## Deployment

El proyecto está configurado para desplegarse automáticamente en GitHub Pages cuando se hace push a las ramas `main` o `master`. El workflow de GitHub Actions está en `.github/workflows/deploy.yml`.

## Troubleshooting

### El contenedor no se construye
- Asegúrate de tener Docker ejecutándose
- Verifica que no haya otros contenedores usando los mismos puertos

### No puedo acceder al servidor de desarrollo
- Verifica que el puerto 4321 esté disponible
- Asegúrate de estar en el directorio `/workspaces/spade-astro`
- Intenta abrir manualmente: http://localhost:4321

### Problemas con permisos
- El usuario dentro del contenedor es `node` (no root)
- Los archivos se sincronizan automáticamente con tu sistema local

### El comando npm no funciona
- Asegúrate de estar en el directorio correcto: `/workspaces/spade-astro`
- Si no estás ahí, ejecuta: `cd /workspaces/spade-astro`
