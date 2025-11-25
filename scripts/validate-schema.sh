#!/bin/bash

# Script para validar datos estructurados (JSON-LD) con Google Rich Results Test
# Requiere: curl, jq (opcional para formatear JSON)
#
# Uso: ./validate-schema.sh [URL]
# Ejemplo: ./validate-schema.sh https://generador-cv.vercel.app

URL="${1:-http://localhost:3000}"

echo "🔍 Validando datos estructurados en: $URL"
echo "================================================"

# Extraer JSON-LD de la página
echo -e "\n📋 Extrayendo JSON-LD..."

HTML=$(curl -s "$URL")

# Buscar script type="application/ld+json"
JSON_LD=$(echo "$HTML" | grep -o '<script type="application/ld+json">.*</script>' | sed 's/<script type="application\/ld+json">//g' | sed 's/<\/script>//g')

if [ -z "$JSON_LD" ]; then
  echo "❌ No se encontró JSON-LD en la página"
  exit 1
fi

echo "✅ JSON-LD encontrado:"
echo "$JSON_LD" | head -20

# Validar con Google Rich Results Test API (requiere API key)
# Alternativamente, usar schema.org validator
echo -e "\n🔬 Validando estructura..."

# Validación básica de JSON
if echo "$JSON_LD" | python -m json.tool > /dev/null 2>&1; then
  echo "✅ JSON válido"
else
  echo "❌ JSON inválido"
  exit 1
fi

# Verificar campos requeridos según schema.org
echo -e "\n📊 Verificando campos requeridos..."

REQUIRED_FIELDS=("@context" "@type" "name" "description")

for field in "${REQUIRED_FIELDS[@]}"; do
  if echo "$JSON_LD" | grep -q "\"$field\""; then
    echo "✅ Campo '$field' presente"
  else
    echo "❌ Campo '$field' faltante"
  fi
done

echo -e "\n================================================"
echo "✅ Validación completada"
echo ""
echo "Para validar en Google Rich Results Test:"
echo "https://search.google.com/test/rich-results"
echo ""
echo "Para validar en Schema.org Validator:"
echo "https://validator.schema.org/"

# Guardar resultado en logs
mkdir -p logs
echo "$JSON_LD" > logs/schema-validation-$(date +%Y%m%d-%H%M%S).json
echo "📁 Resultado guardado en: logs/schema-validation-*.json"
