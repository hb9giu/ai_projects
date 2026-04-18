$ErrorActionPreference = "Stop"

$appName = "pm-app"
$imageName = "pm-app"
$rootDir = Resolve-Path "$PSScriptRoot\.."

docker build -t $imageName $rootDir

docker rm -f $appName *>$null

docker run -d `
  --name $appName `
  --env-file "$rootDir\.env" `
  -p 8000:8000 `
  --read-only `
  --tmpfs /tmp `
  -v pm-data:/app/backend/data `
  $imageName

Write-Host "Waiting for server to be ready..."
$ready = $false
for ($i = 0; $i -lt 60; $i++) {
  try {
    $response = Invoke-WebRequest -Uri "http://localhost:8000/health" -UseBasicParsing -ErrorAction Stop
    if ($response.StatusCode -eq 200) { $ready = $true; break }
  } catch {}
  Start-Sleep -Seconds 1
}
if ($ready) {
  Write-Host "Server is ready at http://localhost:8000"
} else {
  Write-Host "Server did not become healthy in time. Check: docker logs $appName"
  exit 1
}
