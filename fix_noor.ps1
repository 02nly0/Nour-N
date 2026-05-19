$enc1256 = [System.Text.Encoding]::GetEncoding(1256)

# Build correct CP1256 reverse map from built-in table
$rev1256 = @{}
for ($b = 0; $b -le 0x7F; $b++) { $rev1256[$b] = $b }
for ($b = 0x80; $b -le 0xFF; $b++) {
    $single = , [byte]$b
    $str = $enc1256.GetString($single)
    $cp = [int][char]$str
    if (-not $rev1256.ContainsKey($cp)) { $rev1256[$cp] = $b }
}

function Fix-MethodA($bodyBytes) {
    $bodyText = $enc1256.GetString($bodyBytes)
    $byteList = New-Object System.Collections.Generic.List[byte]
    foreach ($c in $bodyText.ToCharArray()) {
        $cp = [int]$c
        if ($rev1256.ContainsKey($cp)) { $byteList.Add($rev1256[$cp]) }
        else { $byteList.Add([byte]($cp -band 0xFF)) }
    }
    return [System.Text.Encoding]::UTF8.GetString($byteList.ToArray())
}

$dir = "C:\Users\m7md2\brave\Desktop\noor"
$files = @(
    "about.html"
)
#$files = Get-ChildItem -Path "$dir\*.html" | Select-Object -ExpandProperty Name

foreach ($fname in $files) {
    $fullPath = Join-Path -Path $dir -ChildPath $fname
    Write-Output "Processing $fname..."
    
    $raw = [System.IO.File]::ReadAllBytes($fullPath)
    
    # Find wrapper/footer in raw bytes (ASCII)
    $startTag = [byte[]][char[]]'<main class="wrapper">'
    $endTag = [byte[]][char[]]'<footer class="main-footer">'
    
    $si = -1
    for ($i = 0; $i -lt $raw.Length - $startTag.Length; $i++) {
        $m = $true
        for ($j = 0; $j -lt $startTag.Length; $j++) {
            if ($raw[$i+$j] -ne $startTag[$j]) { $m = $false; break }
        }
        if ($m) { $si = $i; break }
    }
    
    $ei = -1
    for ($i = $si+1; $i -lt $raw.Length - $endTag.Length; $i++) {
        $m = $true
        for ($j = 0; $j -lt $endTag.Length; $j++) {
            if ($raw[$i+$j] -ne $endTag[$j]) { $m = $false; break }
        }
        if ($m) { $ei = $i + $endTag.Length; break }
    }
    
    if ($si -lt 0 -or $ei -lt 0) {
        Write-Output "  SKIP: wrapper/footer not found"
        continue
    }
    
    Write-Output "  Body bytes: $si .. $ei"

    # Split into 3 byte arrays
    $beforeLen = $si
    $bodyLen = $ei - $si
    $afterLen = $raw.Length - $ei
    
    $before = [byte[]]::new($beforeLen)
    [Array]::Copy($raw, 0, $before, 0, $beforeLen)
    
    $body = [byte[]]::new($bodyLen)
    [Array]::Copy($raw, $si, $body, 0, $bodyLen)
    
    $after = [byte[]]::new($afterLen)
    [Array]::Copy($raw, $ei, $after, 0, $afterLen)
    
    # Apply fix
    $fixedBody = Fix-MethodA $body
    $fixedBodyBytes = [System.Text.Encoding]::UTF8.GetBytes($fixedBody)
    
    Write-Output "  Body $bodyLen B -> $($fixedBodyBytes.Length) B"
    
    # Write output file using FileStream
    $fs = [System.IO.File]::Open($fullPath, [System.IO.FileMode]::Create)
    try {
        $fs.Write($before, 0, $before.Length)
        $fs.Write($fixedBodyBytes, 0, $fixedBodyBytes.Length)
        $fs.Write($after, 0, $after.Length)
        Write-Output "  FIXED"
    } finally {
        $fs.Close()
    }
}
