$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot
$items = @('images', 'art', 'fonts', 'vendor', 'index.html', 'style.css', 'README.md', 'sources.md', 'photo-sources.json', 'qa.json')
$paths = $items | ForEach-Object { Join-Path $root $_ }
$zipPath = Join-Path $root 'hainan-first3days-chibi.zip'
Compress-Archive -LiteralPath $paths -DestinationPath $zipPath -CompressionLevel Optimal -Force
Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Compression.ZipFile]::OpenRead($zipPath)
try {
    $imgCount = @($zip.Entries | Where-Object { $_.FullName -match '\.(webp|png|jpg)$' }).Count
    $sizeMB = [math]::Round((Get-Item -LiteralPath $zipPath).Length/1MB, 2)
    [PSCustomObject]@{
        ZipPath = $zipPath
        SizeMB = $sizeMB
        TotalEntries = $zip.Entries.Count
        FinalImages = $imgCount
    } | Format-List
} finally {
    $zip.Dispose()
}
