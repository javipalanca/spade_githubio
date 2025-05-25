# SPADE Astro Project Makefile
# Makefile para automatizar tareas comunes del proyecto SPADE Astro

# Variables
PROJECT_DIR = /workspaces/spade_githubio
DIST_DIR = $(PROJECT_DIR)/dist
NODE_MODULES = $(PROJECT_DIR)/node_modules

# Colores para output
GREEN = \033[0;32m
YELLOW = \033[1;33m
RED = \033[0;31m
NC = \033[0m

# Default target
.DEFAULT_GOAL = help

# Ayuda: Muestra todos los comandos disponibles
help:
	@echo "$(GREEN)SPADE Astro - Comandos Disponibles$(NC)"
	@echo "=================================="
	@echo ""
	@echo "$(YELLOW)🚀 Desarrollo:$(NC)"
	@echo "  make dev         - Inicia el servidor de desarrollo"
	@echo "  make install     - Instala las dependencias npm"
	@echo "  make clean       - Limpia node_modules y dist"
	@echo "  make open        - Abre el navegador en localhost"
	@echo ""
	@echo "$(YELLOW)🏗️  Build:$(NC)"
	@echo "  make build       - Construye el proyecto para producción"
	@echo "  make preview     - Previsualiza el build de producción"
	@echo "  make quick       - Build rápido + preview"
	@echo ""
	@echo "$(YELLOW)🔍 Verificación:$(NC)"
	@echo "  make check       - Ejecuta verificaciones de tipo"
	@echo "  make status      - Muestra el estado del proyecto"
	@echo "  make info        - Información detallada del proyecto"
	@echo "  make lint        - Ejecuta linting del código"
	@echo "  make format      - Formatea el código"
	@echo ""
	@echo "$(YELLOW)🧹 Mantenimiento:$(NC)"
	@echo "  make reset       - Reinicia completamente el proyecto"
	@echo "  make size        - Muestra el tamaño del build"
	@echo "  make all         - Ejecuta verificación completa"
	@echo ""
	@echo "$(YELLOW)📋 Logs:$(NC)"
	@echo "  make logs        - Muestra los logs del servidor de desarrollo"
	@echo ""
	@echo "$(YELLOW)🌐 Open:$(NC)"
	@echo "  make open        - Abre el navegador en la URL local"
	@echo ""
	@echo "$(YELLOW)🔧 Linting y Formato:$(NC)"
	@echo "  make lint        - Ejecuta linting del código"
	@echo "  make format      - Formatea el código"
	@echo ""
	@echo "$(YELLOW)ℹ️  Información:$(NC)"
	@echo "  make info        - Muestra información detallada del proyecto"
	@echo ""
	@echo "$(YELLOW)⚡ Desarrollo Rápido:$(NC)"
	@echo "  make quick       - Ejecuta un build y preview rápidos"
	@echo ""
	@echo "$(YELLOW)✅ Todo:$(NC)"
	@echo "  make all         - Ejecuta todas las verificaciones"

# Desarrollo: Inicia el servidor de desarrollo
dev:
	@echo "$(GREEN)🚀 Iniciando servidor de desarrollo...$(NC)"
	@cd $(PROJECT_DIR) && npm run dev -- --host

# Instalación: Instala las dependencias
install:
	@echo "$(GREEN)📦 Instalando dependencias...$(NC)"
	@cd $(PROJECT_DIR) && npm install
	@echo "$(GREEN)✅ Dependencias instaladas$(NC)"

# Build: Construye el proyecto para producción
build:
	@echo "$(GREEN)🏗️  Construyendo proyecto...$(NC)"
	@rm -rf $(DIST_DIR)
	@cd $(PROJECT_DIR) && npm run build
	@echo "$(GREEN)✅ Build completado$(NC)"

# Preview: Previsualiza el build de producción
preview:
	@echo "$(GREEN)👀 Iniciando preview del build...$(NC)"
	@cd $(PROJECT_DIR) && npm run preview -- --host

# Check: Ejecuta verificaciones de tipo
check:
	@echo "$(GREEN)🔍 Ejecutando verificaciones...$(NC)"
	@cd $(PROJECT_DIR) && npx astro check

# Estado: Muestra información del proyecto
status:
	@echo "$(GREEN)📊 Estado del Proyecto SPADE Astro$(NC)"
	@echo "=================================="
	@echo "📁 Directorio: $(PROJECT_DIR)"
	@if [ -d "$(NODE_MODULES)" ]; then echo "📦 Node modules: ✅ Instalado"; else echo "📦 Node modules: ❌ No instalado"; fi
	@if [ -d "$(DIST_DIR)" ]; then echo "🏗️  Build dist: ✅ Existe"; else echo "🏗️  Build dist: ⚠️  No existe"; fi

# Limpieza: Limpia archivos temporales
clean:
	@echo "$(YELLOW)🧹 Limpiando archivos temporales...$(NC)"
	@rm -rf $(NODE_MODULES)
	@rm -rf $(DIST_DIR)
	@echo "$(GREEN)✅ Limpieza completada$(NC)"

# Reset: Reinicia completamente el proyecto
reset: clean install
	@echo "$(GREEN)🔄 Proyecto reiniciado completamente$(NC)"

# Size: Muestra el tamaño del build
size:
	@if [ -d "$(DIST_DIR)" ]; then \
		echo "$(GREEN)📏 Tamaño del build: $$(du -sh $(DIST_DIR) | cut -f1)$(NC)"; \
	else \
		echo "$(RED)❌ No existe el directorio dist. Ejecuta 'make build' primero$(NC)"; \
	fi

# Logs: Muestra los logs del servidor de desarrollo
logs:
	@echo "$(GREEN)📋 Mostrando logs del servidor...$(NC)"
	@cd $(PROJECT_DIR) && npm run dev 2>&1 | tail -f

# Open: Abre el navegador en la URL local
open:
	@echo "$(GREEN)🌐 Abriendo navegador...$(NC)"
	@if command -v xdg-open > /dev/null; then xdg-open http://localhost:4321; fi
	@if command -v open > /dev/null; then open http://localhost:4321; fi

# Lint: Ejecuta linting del código
lint:
	@echo "$(GREEN)🔍 Ejecutando linting...$(NC)"
	@cd $(PROJECT_DIR) && npx eslint . --ext .js,.ts,.astro 2>/dev/null || echo "ESLint no configurado, saltando..."

# Format: Formatea el código
format:
	@echo "$(GREEN)🎨 Formateando código...$(NC)"
	@cd $(PROJECT_DIR) && npx prettier --write . 2>/dev/null || echo "Prettier no configurado, saltando..."

# Info: Muestra información detallada del proyecto
info:
	@echo "$(GREEN)ℹ️  Información del Proyecto SPADE Astro$(NC)"
	@echo "========================================"
	@echo "📁 Directorio del proyecto: $(PROJECT_DIR)"
	@echo "🏗️  Directorio de build: $(DIST_DIR)"
	@echo "📦 Directorio node_modules: $(NODE_MODULES)"
	@echo ""
	@echo "📋 Archivos del proyecto:"
	@find $(PROJECT_DIR)/src -name "*.astro" -o -name "*.css" -o -name "*.js" | wc -l | xargs echo "  - Archivos fuente:"
	@echo "  - Componentes: $$(find $(PROJECT_DIR)/src/components -name "*.astro" 2>/dev/null | wc -l)"
	@echo "  - Páginas: $$(find $(PROJECT_DIR)/src/pages -name "*.astro" 2>/dev/null | wc -l)"
	@echo "  - Layouts: $$(find $(PROJECT_DIR)/src/layouts -name "*.astro" 2>/dev/null | wc -l)"
	@echo ""
	@if [ -f "$(PROJECT_DIR)/package.json" ]; then \
		echo "📦 Versión de Astro: $$(cd $(PROJECT_DIR) && npm list astro --depth=0 2>/dev/null | grep astro | cut -d@ -f2 || echo 'No encontrada')"; \
	fi

# Quick: Desarrollo rápido (build + preview)
quick: build preview

# All: Ejecuta todas las verificaciones
all: clean install build check status

# Targets que no son archivos
.PHONY: help dev install build preview check status clean reset size logs open lint format info quick all
