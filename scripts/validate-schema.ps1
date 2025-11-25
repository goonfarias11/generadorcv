# Script para validar datos estructurados (JSON-LD) con Google Rich Results Test
# Requiere: PowerShell 5.1+
#
# Uso: .\validate-schema.ps1 [-Url "https://generador-cv.vercel.app"]

param(
    [string]$Url = "http://localhost:3000"
)

Write-Host "🔍 Validando datos estructurados en: $Url" -ForegroundColor Cyan
Write-Host "================================================"

# Extraer JSON-LD de la página
Write-Host "`n📋 Extrayendo JSON-LD..." -ForegroundColor Yellow

try {
    $response = Invoke-WebRequest -Uri $Url -UseBasicParsing
    $html = $response.Content
    
    # Buscar script type="application/ld+json"
    $pattern = '<script type="application/ld\+json">(.*?)</script>'
    $matches = [regex]::Matches($html, $pattern, [System.Text.RegularExpressions.RegexOptions]::Singleline)
    
    if ($matches.Count -eq 0) {
        Write-Host "❌ No se encontró JSON-LD en la página" -ForegroundColor Red
        exit 1
    }
    
    $jsonLd = $matches[0].Groups[1].Value.Trim()
    
    Write-Host "✅ JSON-LD encontrado:" -ForegroundColor Green
    Write-Host ($jsonLd.Substring(0, [Math]::Min(500, $jsonLd.Length)))
    
    # Validar JSON
    Write-Host "`n🔬 Validando estructura..." -ForegroundColor Yellow
    
    try {
        $jsonObject = $jsonLd | ConvertFrom-Json
        Write-Host "✅ JSON válido" -ForegroundColor Green
        
        # Verificar campos requeridos
        Write-Host "`n📊 Verificando campos requeridos..." -ForegroundColor Yellow
        
        $requiredFields = @("@context", "@type", "name", "description")
        
        foreach ($field in $requiredFields) {
            if ($jsonObject.PSObject.Properties.Name -contains $field) {
                Write-Host "✅ Campo '$field' presente" -ForegroundColor Green
            } else {
                Write-Host "❌ Campo '$field' faltante" -ForegroundColor Red
            }
        }
        
        # Mostrar información del schema
        Write-Host "`n📋 Información del schema:" -ForegroundColor Yellow
        Write-Host "   Tipo: $($jsonObject.'@type')" -ForegroundColor White
        Write-Host "   Nombre: $($jsonObject.name)" -ForegroundColor White
        
    } catch {
        Write-Host "❌ JSON inválido: $_" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "`n================================================"
    Write-Host "✅ Validación completada" -ForegroundColor Green
    Write-Host ""
    Write-Host "Para validar en Google Rich Results Test:" -ForegroundColor Cyan
    Write-Host "https://search.google.com/test/rich-results"
    Write-Host ""
    Write-Host "Para validar en Schema.org Validator:" -ForegroundColor Cyan
    Write-Host "https://validator.schema.org/"
    
    # Guardar resultado en logs
    $logsDir = "logs"
    if (-not (Test-Path $logsDir)) {
        New-Item -ItemType Directory -Path $logsDir | Out-Null
    }
    
    $timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
    $outputFile = "$logsDir\schema-validation-$timestamp.json"
    $jsonLd | Out-File -FilePath $outputFile -Encoding UTF8
    
    Write-Host "`n📁 Resultado guardado en: $outputFile" -ForegroundColor Green
    
} catch {
    Write-Host "❌ Error al obtener la página: $_" -ForegroundColor Red
    exit 1
}
