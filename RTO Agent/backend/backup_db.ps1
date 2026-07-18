<#
Nightly backup for the RTO_Agent database.

Tier 1 (always on): creates a compressed .bak in $LocalBackupDir, then deletes
local backups older than $RetentionDays so disk usage stays bounded.

Tier 2 (off-machine copy, currently disabled): if $NetworkSharePath is set to
a reachable path, the fresh backup is also copied there and pruned the same
way. Leave it blank until a share/external drive is available -- nothing else
needs to change to turn it on later.

Intended to run unattended via Windows Task Scheduler (see backup_db_setup.txt
for the one-time setup command). Can also be run manually:
    powershell -ExecutionPolicy Bypass -File backup_db.ps1
#>

$ErrorActionPreference = "Stop"

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$EnvFile = Join-Path $ScriptDir ".env"

$LocalBackupDir = "D:\RTO_Agent_Backups"
$NetworkSharePath = ""   # e.g. "\\SERVER\Backups\RTO_Agent" -- fill in once available
$RetentionDays = 14
$LogFile = Join-Path $LocalBackupDir "backup_log.txt"

function Write-Log($message) {
    $line = "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')  $message"
    Write-Output $line
    Add-Content -Path $LogFile -Value $line
}

function Read-EnvValue($key) {
    $line = Get-Content $EnvFile | Where-Object { $_ -match "^$key=" } | Select-Object -First 1
    if (-not $line) {
        throw "Missing $key in $EnvFile"
    }
    return ($line -split "=", 2)[1].Trim()
}

New-Item -ItemType Directory -Force -Path $LocalBackupDir | Out-Null

try {
    $DbServer = Read-EnvValue "DB_SERVER"
    $DbName = Read-EnvValue "DB_DATABASE"
    $DbUser = Read-EnvValue "DB_USERNAME"
    $DbPassword = Read-EnvValue "DB_PASSWORD"

    $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $backupFile = Join-Path $LocalBackupDir "RTO_Agent_$timestamp.bak"

    Write-Log "Starting backup of [$DbName] to $backupFile"

    # No WITH COMPRESSION -- not supported on this SQL Server Express instance.
    # -b makes sqlcmd exit non-zero on a T-SQL error (default behavior prints
    # the error but still exits 0, which would make failures go undetected).
    $query = "BACKUP DATABASE [$DbName] TO DISK = N'$backupFile' WITH INIT, STATS = 25"

    & sqlcmd -S $DbServer -U $DbUser -P $DbPassword -b -Q $query
    if ($LASTEXITCODE -ne 0) {
        throw "sqlcmd exited with code $LASTEXITCODE"
    }

    if (-not (Test-Path $backupFile)) {
        throw "sqlcmd reported success but $backupFile was not created"
    }

    Write-Log "Backup completed: $backupFile"

    $cutoff = (Get-Date).AddDays(-$RetentionDays)

    Get-ChildItem -Path $LocalBackupDir -Filter "RTO_Agent_*.bak" |
        Where-Object { $_.LastWriteTime -lt $cutoff } |
        ForEach-Object {
            Write-Log "Deleting old local backup: $($_.Name)"
            Remove-Item $_.FullName -Force
        }

    if ($NetworkSharePath -and (Test-Path $NetworkSharePath)) {
        Write-Log "Copying backup to network share: $NetworkSharePath"
        Copy-Item $backupFile -Destination $NetworkSharePath -Force

        Get-ChildItem -Path $NetworkSharePath -Filter "RTO_Agent_*.bak" |
            Where-Object { $_.LastWriteTime -lt $cutoff } |
            ForEach-Object {
                Write-Log "Deleting old network backup: $($_.Name)"
                Remove-Item $_.FullName -Force
            }
    } elseif ($NetworkSharePath) {
        Write-Log "WARNING: NetworkSharePath is set to '$NetworkSharePath' but is not reachable -- skipped off-machine copy."
    } else {
        Write-Log "NetworkSharePath not configured -- local backup only (Tier 2 disabled)."
    }

    Write-Log "Backup run finished successfully."

} catch {
    Write-Log "ERROR: $($_.Exception.Message)"
    throw
}
