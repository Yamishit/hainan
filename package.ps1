$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot
$items = @('images', 'art', 'fonts', 'index.html', 'style.css', 'README.md', 'sources.md', 'generation-prompts.md', 'qa.json')
$paths = $items | ForEach-Object { Join-Path $root $_ }
$zipPath = Join-Path $root 'hainan-dongdong-tianxin-chibi.zip'
Compress-Archive -LiteralPath $paths -DestinationPath $zipPath -CompressionLevel Optimal -Force
Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Compression.ZipFile]::OpenRead($zipPath)
try {
    $pngCount = @($zip.Entries | Where-Object { $_.FullName -match '\.png$' }).Count
    if ($pngCount -ne 25) { throw "Expected 25 final PNGs, found $pngCount" }
    if (@($zip.Entries | Where-Object { $_.FullName -match 'clipboard|\.jpg$' }).Count) { throw 'Unexpected reference photo in archive' }
    [PSCustomObject]@{Path=$zipPath; SizeMB=[math]::Round((Get-Item -LiteralPath $zipPath).Length/1MB,2); Entries=$zip.Entries.Count; FinalPNGs=$pngCount} | Format-List
} finally { $zip.Dispose() }
