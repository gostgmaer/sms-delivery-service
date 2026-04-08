# SMS Template Import Script (PowerShell)
# Usage: .\import-templates.ps1 -ApiKey "your-api-key" -TenantId "your-tenant" -Url "http://localhost:3000"

param(
    [Parameter(Mandatory=$true)]
    [string]$ApiKey,
    
    [Parameter(Mandatory=$false)]
    [string]$TenantId = "default",
    
    [Parameter(Mandatory=$false)]
    [string]$Url = "http://localhost:3000"
)

Write-Host "═══════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  📱 SMS Template Importer (PowerShell)" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════`n" -ForegroundColor Cyan

Write-Host "API URL: $Url" -ForegroundColor Gray
Write-Host "Tenant: $TenantId`n" -ForegroundColor Gray

$templates = Get-Content -Path "sample-templates.json" -Raw | ConvertFrom-Json
$imported = 0
$skipped = 0

$headers = @{
    "Authorization" = "Bearer $ApiKey"
    "X-Tenant-Id" = $TenantId
    "Content-Type" = "application/json"
}

foreach ($template in $templates) {
    try {
        $body = $template | ConvertTo-Json -Depth 10
        $response = Invoke-RestMethod -Uri "$Url/api/v1/templates" -Method Post -Headers $headers -Body $body
        Write-Host "✅ Imported: $($template.name)" -ForegroundColor Green
        $imported++
    }
    catch {
        if ($_.Exception.Response.StatusCode -eq 409) {
            Write-Host "⏭️  Skipped: $($template.name) (already exists)" -ForegroundColor Yellow
            $skipped++
        }
        else {
            Write-Host "❌ Failed: $($template.name) - $($_.Exception.Message)" -ForegroundColor Red
        }
    }
}

Write-Host "`n📊 Summary: $imported imported, $skipped skipped" -ForegroundColor Cyan
Write-Host "✨ Done!`n" -ForegroundColor Green
