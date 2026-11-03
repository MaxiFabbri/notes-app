param(
    [string]$DbHost = 'localhost',
    [int]$Port = 5432,
    [string]$AdminUser = 'postgres',
    [string]$PsqlPath = ''
)
$ErrorActionPreference = 'Stop'

# Prefer PATH; use the current Windows installation as a fallback.
if (-not $PsqlPath) {
    $psqlCommand = Get-Command psql -ErrorAction SilentlyContinue
    if ($psqlCommand) {
        $PsqlPath = $psqlCommand.Source
    } elseif (Test-Path -LiteralPath 'C:\Program Files\PostgreSQL\18\bin\psql.exe') {
        $PsqlPath = 'C:\Program Files\PostgreSQL\18\bin\psql.exe'
    } else {
        throw 'psql was not found. Install PostgreSQL or provide -PsqlPath.'
    }
}

# Passwords are requested interactively by psql, never stored in this script.
& $PsqlPath -X -W -h $DbHost -p $Port -U $AdminUser -d postgres -f (Join-Path $PSScriptRoot 'setup-db.sql')
if ($LASTEXITCODE -ne 0) {
    throw 'Database setup failed. Check the PostgreSQL output above.'
}
