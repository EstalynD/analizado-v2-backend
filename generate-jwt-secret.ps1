# Script PowerShell para generar clave JWT secreta
# Uso: .\generate-jwt-secret.ps1

Write-Host "🔐 Generador de Clave JWT Secreta para Analizador" -ForegroundColor Cyan
Write-Host "=" * 50 -ForegroundColor Cyan

# Función para generar string aleatorio
function Generate-RandomString {
    param(
        [int]$Length = 64
    )
    
    $chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"
    $random = New-Object System.Random
    $result = ""
    
    for ($i = 0; $i -lt $Length; $i++) {
        $result += $chars[$random.Next($chars.Length)]
    }
    
    return $result
}

# Genera clave con formato personalizado
$timestamp = Get-Date -Format "yyyy"
$randomPart = Generate-RandomString -Length 32
$customSecret = "analizador_${timestamp}_${randomPart}"

Write-Host "`n📋 Clave JWT con formato personalizado:" -ForegroundColor Green
Write-Host "JWT_SECRET=$customSecret" -ForegroundColor Yellow

# Genera clave completamente aleatoria
$randomSecret = Generate-RandomString -Length 64
Write-Host "`n🎲 Clave JWT completamente aleatoria:" -ForegroundColor Green
Write-Host "JWT_SECRET=$randomSecret" -ForegroundColor Yellow

# Genera clave más corta para desarrollo
$devSecret = Generate-RandomString -Length 32
Write-Host "`n🛠️  Clave JWT para desarrollo (más corta):" -ForegroundColor Green
Write-Host "JWT_SECRET=$devSecret" -ForegroundColor Yellow

Write-Host "`n" + "=" * 50 -ForegroundColor Cyan
Write-Host "💡 Recomendaciones:" -ForegroundColor Magenta
Write-Host "• Usa la clave personalizada para producción" -ForegroundColor White
Write-Host "• Usa la clave aleatoria para máxima seguridad" -ForegroundColor White
Write-Host "• Usa la clave de desarrollo para testing" -ForegroundColor White
Write-Host "• Guarda la clave en un archivo .env" -ForegroundColor White
Write-Host "• Nunca compartas la clave en repositorios públicos" -ForegroundColor Red

# Opcional: Crear archivo .env con la clave
$createEnv = Read-Host "`n¿Quieres crear/actualizar el archivo .env con la clave personalizada? (y/n)"
if ($createEnv -eq "y" -or $createEnv -eq "Y") {
    $envContent = @"
# Configuración de la base de datos
DB_HOST=localhost
DB_PORT=27017
DB_NAME=analizador_db

# Configuración JWT
JWT_SECRET=$customSecret
JWT_EXPIRES_IN=24h

# Configuración del servidor
PORT=3001
NODE_ENV=development
"@
    
    $envContent | Out-File -FilePath ".env" -Encoding UTF8
    Write-Host "✅ Archivo .env creado/actualizado con la nueva clave JWT" -ForegroundColor Green
}
