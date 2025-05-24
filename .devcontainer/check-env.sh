#!/bin/bash

# Script para verificar el entorno dentro del DevContainer

echo "=== Verificando entorno de desarrollo ==="

echo -e "\n> Versión de Node.js:"
node --version

echo -e "\n> Versión de npm:"
npm --version

echo -e "\n> Herramientas globales instaladas:"
npm list -g --depth=0

echo -e "\n> Estructura del directorio de trabajo:"
ls -la /workspaces/spade_githubio

echo -e "\n> Verificando proyecto Astro:"
if [ -d "/workspaces/spade_githubio/spade-astro" ]; then
  echo "✅ Directorio de proyecto Astro encontrado"
  cd /workspaces/spade_githubio/spade-astro
  
  echo -e "\n> Verificando dependencias de Astro:"
  if [ -d "node_modules" ]; then
    echo "✅ node_modules encontrado"
    if [ -d "node_modules/astro" ]; then
      echo "✅ Astro instalado"
      echo -e "\n> Versión de Astro:"
      npx astro --version
    else
      echo "❌ Astro no instalado. Ejecuta: npm install"
    fi
  else
    echo "❌ node_modules no encontrado. Ejecuta: npm install"
  fi
  
  echo -e "\n> Verificando configuración de Astro:"
  if [ -f "astro.config.mjs" ]; then
    echo "✅ Archivo de configuración de Astro encontrado"
    echo -e "\n> Contenido de astro.config.mjs:"
    cat astro.config.mjs
  else
    echo "❌ Archivo de configuración de Astro no encontrado"
  fi
else
  echo "❌ Directorio de proyecto Astro no encontrado"
fi

echo -e "\n=== Verificación completada ==="
