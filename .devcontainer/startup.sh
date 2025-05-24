#!/bin/bash

# Script de inicio para el DevContainer de SPADE Astro

# Colores para la salida
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}====================================================${NC}"
echo -e "${BLUE}  BIENVENIDO AL ENTORNO DE DESARROLLO DE SPADE ASTRO  ${NC}"
echo -e "${BLUE}====================================================${NC}"

# Verificar si el directorio de Astro existe
if [ -d "/workspaces/spade_githubio/spade-astro" ]; then
  echo -e "\n${GREEN}✅ Proyecto Astro encontrado${NC}"
else
  echo -e "\n${RED}❌ Error: Directorio del proyecto Astro no encontrado${NC}"
  echo -e "   Verifica que la ruta '/workspaces/spade_githubio/spade-astro' existe"
  exit 1
fi

# Verificar las dependencias de Astro
cd /workspaces/spade_githubio/spade-astro
if [ ! -d "node_modules" ]; then
  echo -e "\n${YELLOW}⚠️  Instalando dependencias del proyecto...${NC}"
  npm install
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Dependencias instaladas correctamente${NC}"
  else
    echo -e "${RED}❌ Error al instalar dependencias${NC}"
    exit 1
  fi
else
  echo -e "\n${GREEN}✅ Dependencias ya instaladas${NC}"
fi

# Mostrar información útil
echo -e "\n${BLUE}INFORMACIÓN DEL PROYECTO:${NC}"
echo -e "  • Directorio principal: ${YELLOW}/workspaces/spade_githubio${NC}"
echo -e "  • Proyecto Astro: ${YELLOW}/workspaces/spade_githubio/spade-astro${NC}"
echo -e "  • Puerto del servidor: ${YELLOW}4321${NC}"

echo -e "\n${BLUE}COMANDOS ÚTILES:${NC}"
echo -e "  • ${YELLOW}cd /workspaces/spade_githubio/spade-astro${NC} - Ir al proyecto Astro"
echo -e "  • ${YELLOW}npm run dev${NC} - Iniciar servidor de desarrollo"
echo -e "  • ${YELLOW}npm run build${NC} - Construir para producción"
echo -e "  • ${YELLOW}npm run preview${NC} - Previsualizar construcción"

echo -e "\n${GREEN}¡Listo para empezar a desarrollar!${NC}"
echo -e "${BLUE}====================================================${NC}"
