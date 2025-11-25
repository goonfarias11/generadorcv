#!/bin/bash

echo "🚀 Preparando deploy a Vercel..."
echo ""

# Verificar que estemos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json no encontrado"
    echo "Ejecuta este script desde la raíz del proyecto"
    exit 1
fi

# Limpiar builds anteriores
echo "🧹 Limpiando builds anteriores..."
rm -rf .next
rm -rf out

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm install

# Verificar que compile
echo "🔨 Compilando proyecto..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Error en la compilación"
    echo "Revisa los errores arriba antes de deployar"
    exit 1
fi

echo ""
echo "✅ Build exitoso!"
echo ""
echo "Opciones de deploy:"
echo "1. Deploy de preview (testing)"
echo "2. Deploy a producción"
echo "3. Cancelar"
echo ""
read -p "Selecciona una opción (1-3): " option

case $option in
    1)
        echo "🚀 Deployando preview..."
        vercel
        ;;
    2)
        echo "🚀 Deployando a producción..."
        vercel --prod
        ;;
    3)
        echo "❌ Deploy cancelado"
        exit 0
        ;;
    *)
        echo "❌ Opción inválida"
        exit 1
        ;;
esac

echo ""
echo "✅ Deploy completado!"
echo "Verifica tu deployment en https://vercel.com/dashboard"
