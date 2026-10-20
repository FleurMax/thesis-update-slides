#Requires -Version 5.1
[CmdletBinding()]
param(
    [switch]$NoBrowser
)

$ErrorActionPreference = 'Stop'
$nodeCommand = Get-Command node -ErrorAction SilentlyContinue
$npmCommand = Get-Command npm.cmd -ErrorAction SilentlyContinue

if (-not $nodeCommand -or -not $npmCommand) {
    throw 'Installeer Node.js met npm en open PowerShell opnieuw.'
}

Push-Location -LiteralPath $PSScriptRoot
try {
    if (-not (Test-Path -LiteralPath 'node_modules/vite/bin/vite.js' -PathType Leaf)) {
        Write-Host 'Benodigde pakketten installeren...'
        & $npmCommand.Source ci
        if ($LASTEXITCODE -ne 0) {
            throw 'De installatie met npm ci is mislukt.'
        }
    }

    $launchArguments = @('run', 'dev', '--', '--host', 'localhost', '--port', '5173')
    if (-not $NoBrowser) {
        $launchArguments += @('--open', '/thesis-update-slides/')
    }

    Write-Host 'Slides starten. Stop de server met Ctrl+C.'
    if (-not $NoBrowser) {
        Write-Host 'De slides openen in je standaardbrowser, bij een open browser in een nieuw tabblad.'
    }
    & $npmCommand.Source @launchArguments
    if ($LASTEXITCODE -ne 0) {
        throw "De slideserver is gestopt met foutcode $LASTEXITCODE."
    }
}
finally {
    Pop-Location
}
