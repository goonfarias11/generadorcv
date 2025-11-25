@echo off
echo.
echo 🚀 Preparando deploy a Vercel...
echo.

REM Verificar que estemos en el directorio correcto
if not exist package.json (
    echo ❌ Error: package.json no encontrado
    echo Ejecuta este script desde la raíz del proyecto
    exit /b 1
)

REM Limpiar builds anteriores
echo 🧹 Limpiando builds anteriores...
if exist .next rmdir /s /q .next
if exist out rmdir /s /q out

REM Instalar dependencias
echo 📦 Instalando dependencias...
call npm install

REM Verificar que compile
echo 🔨 Compilando proyecto...
call npm run build

if errorlevel 1 (
    echo.
    echo ❌ Error en la compilación
    echo Revisa los errores arriba antes de deployar
    exit /b 1
)

echo.
echo ✅ Build exitoso!
echo.
echo Opciones de deploy:
echo 1. Deploy de preview (testing^)
echo 2. Deploy a producción
echo 3. Cancelar
echo.
set /p option="Selecciona una opción (1-3): "

if "%option%"=="1" (
    echo 🚀 Deployando preview...
    call vercel
) else if "%option%"=="2" (
    echo 🚀 Deployando a producción...
    call vercel --prod
) else if "%option%"=="3" (
    echo ❌ Deploy cancelado
    exit /b 0
) else (
    echo ❌ Opción inválida
    exit /b 1
)

echo.
echo ✅ Deploy completado!
echo Verifica tu deployment en https://vercel.com/dashboard
pause
