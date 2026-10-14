$ErrorActionPreference = 'Stop'

$libraryRoot = (Resolve-Path -LiteralPath $PSScriptRoot).Path
$projectRoot = (Resolve-Path -LiteralPath (Join-Path $libraryRoot '..')).Path
$downloadsRoot = (Resolve-Path -LiteralPath (Join-Path $projectRoot '..')).Path
$templateRoot = Join-Path $projectRoot 'web-templates-main'
$resources = New-Object 'System.Collections.Generic.List[object]'

function Get-DownloadRelativePath([string] $path) {
    $resolved = (Resolve-Path -LiteralPath $path).Path
    return $resolved.Substring($downloadsRoot.Length).TrimStart('\')
}

function Get-ResourceId([string] $prefix, [string] $path) {
    $relative = Get-DownloadRelativePath $path
    $slug = ($relative -replace '[^A-Za-z0-9]+', '-').Trim('-').ToLowerInvariant()
    return "$prefix-$slug"
}

function ConvertTo-LibraryUrl([string] $path) {
    $resolved = (Resolve-Path -LiteralPath $path).Path
    if ($resolved.StartsWith($projectRoot, [System.StringComparison]::OrdinalIgnoreCase)) {
        $relative = $resolved.Substring($projectRoot.Length).TrimStart('\')
        $prefix = '../'
    }
    else {
        $relative = Get-DownloadRelativePath $resolved
        $prefix = '../../'
    }

    $segments = $relative -split '\\' | ForEach-Object { [System.Uri]::EscapeDataString($_) }
    return $prefix + ($segments -join '/')
}

function Get-ProjectFiles([string] $path) {
    if (Test-Path -LiteralPath $path -PathType Leaf) {
        return ,(Get-Item -LiteralPath $path)
    }

    return @(Get-ChildItem -LiteralPath $path -File -Recurse -Force -ErrorAction SilentlyContinue |
        Where-Object { $_.Extension -in '.html', '.htm', '.css', '.js', '.mjs', '.ts', '.tsx', '.json' } |
        Select-Object -First 80)
}

function Get-SourceText([string] $path) {
    $builder = New-Object System.Text.StringBuilder
    foreach ($file in (Get-ProjectFiles $path)) {
        if ($file.Length -gt 2000000) { continue }
        [void]$builder.AppendLine((Get-Content -LiteralPath $file.FullName -Raw -Encoding UTF8))
    }
    return $builder.ToString()
}

function Get-Title([string] $path, [string] $fallback) {
    $htmlFile = $null
    if (Test-Path -LiteralPath $path -PathType Leaf) {
        $htmlFile = Get-Item -LiteralPath $path
    }
    else {
        $htmlFile = Get-ChildItem -LiteralPath $path -File -Filter '*.html' -Recurse -ErrorAction SilentlyContinue |
            Sort-Object @{ Expression = { if ($_.Name -eq 'index.html') { 0 } else { 1 } } }, Name |
            Select-Object -First 1
    }

    if ($null -ne $htmlFile -and $htmlFile.Length -lt 2000000) {
        $content = Get-Content -LiteralPath $htmlFile.FullName -Raw -Encoding UTF8
        if ($content -match '(?is)<title[^>]*>(.*?)</title>') {
            $title = [System.Net.WebUtility]::HtmlDecode(($Matches[1] -replace '\s+', ' ').Trim())
            if ($title) { return $title }
        }
    }

    return $fallback
}

function Get-Technologies([string] $path, [string] $text) {
    $names = New-Object 'System.Collections.Generic.List[string]'
    $files = @(Get-ProjectFiles $path)
    $extensions = @($files | ForEach-Object { $_.Extension.ToLowerInvariant() })

    if ($extensions -contains '.html' -or ((Test-Path -LiteralPath $path -PathType Leaf) -and ($path -match '\.html?$'))) {
        $names.Add('HTML')
    }
    if ($extensions -contains '.css' -or $text -match '(?i)<style\b|stylesheet|@keyframes') {
        $names.Add('CSS')
    }
    if ($extensions -contains '.js' -or $extensions -contains '.mjs' -or $text -match '(?i)<script\b|document\.|addEventListener\(') {
        $names.Add('JavaScript')
    }
    if ($extensions -contains '.ts' -or $extensions -contains '.tsx') {
        $names.Add('TypeScript')
    }
    if ($text -match '(?i)three(?:\.module)?(?:\.min)?\.js|THREE\.|from\s*["'']three["'']|@react-three/fiber') {
        $names.Add('Three.js')
    }
    if ($text -match '(?i)@react-three/fiber|@react-three/drei') {
        $names.Add('React Three Fiber')
    }
    if ($text -match '(?i)getContext\(\s*["'']webgl|WebGLRenderer|fragmentShader|vertexShader|shaderMaterial') {
        $names.Add('WebGL / shaders')
    }
    if ($text -match '(?i)\bgsap\b|ScrollTrigger') { $names.Add('GSAP') }
    if ($text -match '(?i)framer-motion|from\s*["'']motion(?:/[^"'']*)?["'']|["'']motion["'']\s*:') { $names.Add('Framer Motion / Motion') }
    if ($text -match '(?i)@react-three/fiber|from\s*["'']react["'']|require\(["'']react["'']\)|ReactDOM\.createRoot') { $names.Add('React') }
    if ($text -match '(?i)["'']next["'']\s*:|from\s*["'']next/|next/font') { $names.Add('Next.js') }
    if ($text -match '(?i)["'']vite["'']\s*:|vite\.config|from\s*["'']vite["'']') { $names.Add('Vite') }
    if ($text -match '(?i)tailwindcss|@tailwind\b|@theme\b') { $names.Add('Tailwind CSS') }
    if ($text -match '(?i)supabase') { $names.Add('Supabase') }

    return @($names | Select-Object -Unique)
}

function Get-Features([string] $text, [string[]] $technologies) {
    $features = New-Object 'System.Collections.Generic.List[string]'
    if ($technologies -contains 'Three.js' -or $technologies -contains 'React Three Fiber') {
        $features.Add('Scène 3D')
    }
    if ($technologies -contains 'WebGL / shaders') { $features.Add('WebGL / shaders') }
    if ($technologies -contains 'GSAP') { $features.Add('Animation GSAP') }
    if ($text -match '(?i)ScrollTrigger|scrollytelling|scroll-driven') { $features.Add('Animation au scroll') }
    if ($text -match '(?i)backdrop-filter|glassmorphism') { $features.Add('Glassmorphism') }
    if ($text -match '(?i)cursor|pointermove') { $features.Add('Curseur interactif') }
    if ($text -match '(?i)carousel|swiper') { $features.Add('Carrousel') }
    if ($text -match '(?i)<form\b|addEventListener\(\s*["'']submit') { $features.Add('Formulaire') }
    if ($text -match '(?i)localStorage') { $features.Add('Stockage local navigateur') }
    if ($text -match '(?i)prefers-reduced-motion') { $features.Add('Respect de la réduction des animations') }
    if ($text -match '(?i)particles|particle') { $features.Add('Particules') }
    if ($text -match '(?i)shader|distortion|dither') { $features.Add('Effet visuel / distorsion') }
    return @($features | Select-Object -Unique)
}

function Add-Resource(
    [string] $id,
    [string] $name,
    [string] $description,
    [string[]] $categories,
    [string] $type,
    [string] $sourcePath,
    [string] $linkPath,
    [string[]] $technologies,
    [string[]] $features,
    [string] $startInstructions,
    [string] $status,
    [string] $previewPath
) {
    $resourceSourcePath = Get-DownloadRelativePath $sourcePath
    $entryRelativePath = Get-DownloadRelativePath $linkPath
    $resource = [ordered]@{
        id = $id
        name = [System.Net.WebUtility]::HtmlDecode($name)
        description = $description
        categories = @($categories | Select-Object -Unique)
        type = $type
        technologies = @($technologies | Select-Object -Unique)
        features = @($features | Select-Object -Unique)
        sourcePath = $resourceSourcePath
        href = ConvertTo-LibraryUrl $linkPath
        startInstructions = $startInstructions
        status = $status
        previewPath = $null
        exactDuplicate = $duplicateEntryPaths.Contains($entryRelativePath)
    }
    if ($previewPath -and (Test-Path -LiteralPath $previewPath -PathType Leaf)) {
        $resource.previewPath = ConvertTo-LibraryUrl $previewPath
    }
    $resources.Add($resource)
}

function Get-FirstHtml([string] $folder) {
    return Get-ChildItem -LiteralPath $folder -File -Filter '*.html' -Recurse -ErrorAction SilentlyContinue |
        Sort-Object @{ Expression = { if ($_.Name -eq 'index.html') { 0 } else { 1 } } }, FullName |
        Select-Object -First 1
}

function Get-PageCount([string] $folder) {
    return @(Get-ChildItem -LiteralPath $folder -File -Filter '*.html' -Recurse -ErrorAction SilentlyContinue).Count
}

function Get-SiteType([string] $title, [string] $text) {
    if ($title -match '(?i)e-commerce|ecommerce|online store|shop|boutique|mercantile') { return 'E-commerce' }
    if ($title -match '(?i)\bsaas\b|platform|collaboration|analytics|workflow|team|business operations') { return 'Site SaaS' }
    if ($title -match '(?i)portfolio|developer|designer') { return 'Portfolio' }
    if ($title -match '(?i)agency|creative|studio|design|digital innovation studio') { return 'Site agence / studio' }
    return 'Site vitrine multi-pages'
}

# This catalogue intentionally includes only the supplied template document tree.
$projectFiles = Get-ChildItem -LiteralPath $templateRoot -File -Recurse -Force
$duplicateGroups = @($projectFiles | Get-FileHash -Algorithm SHA256 |
    Group-Object Hash | Where-Object Count -gt 1 | ForEach-Object {
        [ordered]@{
            sha256 = $_.Name
            paths = @($_.Group | ForEach-Object { Get-DownloadRelativePath $_.Path } | Sort-Object)
        }
    })
$duplicateEntryPaths = New-Object 'System.Collections.Generic.HashSet[string]' ([System.StringComparer]::OrdinalIgnoreCase)
foreach ($group in $duplicateGroups) {
    foreach ($path in $group.paths) { [void]$duplicateEntryPaths.Add($path) }
}

# Complete 3D single-page experiences; CSS-only illustrations remain visual effects.
$threeRoot = Join-Path $templateRoot 'no-react\3D'
foreach ($file in (Get-ChildItem -LiteralPath $threeRoot -File -Filter '*.html' | Sort-Object Name)) {
    $text = Get-SourceText $file.FullName
    $technologies = Get-Technologies $file.FullName $text
    $true3D = ($technologies -contains 'Three.js') -or ($text -match '(?i)WebGLRenderer|PerspectiveCamera|THREE\.Scene|GLTFLoader')
    $categories = if ($true3D) { @('Sites 3D') } else { @('Effets visuels') }
    $features = Get-Features $text $technologies
    $features += 'Expérience web autonome'
    Add-Resource "web-3d-$($file.BaseName)" (Get-Title $file.FullName $file.BaseName) `
        'Expérience HTML autonome de la collection 3D; technologies et interactions détectées dans le code fourni.' `
        $categories 'Expérience web / page autonome' $file.FullName $file.FullName $technologies $features `
        'Ouvrir le fichier HTML dans un navigateur. Conserver les fichiers associés; des ressources distantes peuvent demander Internet.' `
        'Source présente, non exécutée' ''
}

# Flat landing-page templates (one record per HTML file).
$landingRoot = Join-Path $templateRoot 'no-react\landings'
foreach ($file in (Get-ChildItem -LiteralPath $landingRoot -File -Filter '*.html' | Sort-Object Name)) {
    $text = Get-SourceText $file.FullName
    $technologies = Get-Technologies $file.FullName $text
    $features = Get-Features $text $technologies
    $features += 'Landing page'
    Add-Resource "landing-$($file.BaseName)" (Get-Title $file.FullName $file.BaseName) `
        'Template de landing page 2D autonome; les animations ne constituent pas une scène 3D.' `
        @('Sites 2D', 'Landing pages') 'Landing page' $file.FullName $file.FullName $technologies $features `
        'Ouvrir le fichier HTML dans un navigateur.' 'Source présente, non exécutée' ''
}

# Complete vanilla landing sites, kept as project folders.
foreach ($folder in (Get-ChildItem -LiteralPath $landingRoot -Directory | Sort-Object Name)) {
    $entry = Get-FirstHtml $folder.FullName
    if ($null -eq $entry) { continue }
    $text = Get-SourceText $folder.FullName
    $technologies = Get-Technologies $folder.FullName $text
    $features = Get-Features $text $technologies
    $features += 'Landing page'
    Add-Resource "landing-project-$($folder.Name)" (Get-Title $folder.FullName $folder.Name) `
        "Projet de landing page 2D avec fichiers liés conservés dans le dossier; page principale $($entry.Name)." `
        @('Sites 2D', 'Landing pages') 'Projet HTML/CSS/JavaScript' $folder.FullName $entry.FullName $technologies $features `
        'Ouvrir index.html dans un navigateur depuis le dossier du projet.' 'Source présente, non exécutée' ''
}

# Multipage vanilla sites, one record for each original project.
$websitesRoot = Join-Path $templateRoot 'no-react\websites'
foreach ($folder in (Get-ChildItem -LiteralPath $websitesRoot -Directory | Sort-Object Name)) {
    $entry = Get-FirstHtml $folder.FullName
    if ($null -eq $entry) { continue }
    $text = Get-SourceText $folder.FullName
    $technologies = Get-Technologies $folder.FullName $text
    $title = Get-Title $folder.FullName $folder.Name
    $type = Get-SiteType $title $text
    $categories = @('Sites 2D')
    if ($type -eq 'Site SaaS') { $categories += 'Applications Web' }
    if ($type -eq 'E-commerce') { $categories += 'E-commerce' }
    if ($type -eq 'Portfolio') { $categories += 'Portfolios' }
    $features = Get-Features $text $technologies
    $features += 'Site multi-pages'
    if (Test-Path -LiteralPath (Join-Path $folder.FullName 'README.md')) { $features += 'Documentation incluse' }
    $count = Get-PageCount $folder.FullName
    Add-Resource "website-$($folder.Name)" $title `
        "$type de la collection HTML/CSS/JavaScript; $count pages HTML regroupées dans leur projet source." `
        $categories $type $folder.FullName $entry.FullName $technologies $features `
        "Ouvrir $($entry.Name) dans un navigateur; garder ensemble le dossier et ses pages/assets." `
        'Source présente, non exécutée' ''
}

# Modern experimental pages are classified as 3D only when a real 3D renderer/scene is present.
$modernRoot = Join-Path $templateRoot 'no-react\modern-experimental'
foreach ($file in (Get-ChildItem -LiteralPath $modernRoot -File -Filter '*.html' | Sort-Object Name)) {
    $text = Get-SourceText $file.FullName
    $technologies = Get-Technologies $file.FullName $text
    $true3D = ($technologies -contains 'Three.js') -or ($text -match '(?i)WebGLRenderer|PerspectiveCamera|THREE\.Scene|GLTFLoader')
    $categories = if ($true3D) { @('Sites 3D', 'Expériences visuelles') } else { @('Expériences visuelles') }
    $features = Get-Features $text $technologies
    $features += 'Template expérimental autonome'
    Add-Resource "modern-$($file.BaseName)" (Get-Title $file.FullName $file.BaseName) `
        'Page expérimentale à fort parti pris visuel; classée 3D uniquement si une scène/rendu 3D est présent dans le code.' `
        $categories 'Expérience / effet visuel' $file.FullName $file.FullName $technologies $features `
        'Ouvrir le fichier HTML dans un navigateur; conserver tout fichier compagnon portant le même nom.' `
        'Source présente, non exécutée' ''
}

# CSS Zen Garden themes and associated demonstrations.
$gardenRoot = Join-Path $templateRoot 'no-react\css-zengarden'
$gardenEntry = Join-Path $gardenRoot 'index.html'
if (Test-Path -LiteralPath $gardenEntry) {
    $text = Get-SourceText $gardenRoot
    $technologies = Get-Technologies $gardenRoot $text
    $features = Get-Features $text $technologies
    $features += 'Thèmes CSS multiples'
    Add-Resource 'css-zengarden' 'CSS Zen Garden — galerie de thèmes' `
        'Démonstration HTML avec thèmes visuels alternatifs, dont un thème Three.js mentionné dans les fichiers associés; les fichiers ne sont pas des composants isolés.' `
        @('Effets visuels', 'Outils & documentation') 'Galerie de thèmes / démonstration' $gardenRoot $gardenEntry $technologies $features `
        'Ouvrir index.html dans un navigateur depuis le dossier.' 'Source présente, non exécutée' ''
}

# Standalone experiments at the collection root.
$experimentsRoot = Join-Path $templateRoot 'experiments'
foreach ($file in (Get-ChildItem -LiteralPath $experimentsRoot -File -Filter '*.html' | Sort-Object Name)) {
    $text = Get-SourceText $file.FullName
    $technologies = Get-Technologies $file.FullName $text
    $true3D = ($technologies -contains 'Three.js') -or ($text -match '(?i)WebGLRenderer|PerspectiveCamera|THREE\.Scene|GLTFLoader')
    $categories = if ($true3D) { @('Sites 3D', 'Expériences visuelles') } else { @('Expériences visuelles') }
    $features = Get-Features $text $technologies
    $features += 'Prototype autonome'
    Add-Resource "experiment-$($file.BaseName)" (Get-Title $file.FullName $file.BaseName) `
        'Prototype autonome rangé parmi les expériences; technologies estimées à partir du code, sans lancement.' `
        $categories 'Prototype / démonstration' $file.FullName $file.FullName $technologies $features `
        'Ouvrir le fichier HTML dans un navigateur; vérifier ses dépendances locales avant tout déplacement.' `
        'Prototype, non exécuté' ''
}

# Multi-file experimental projects stay grouped; scene HTML pages are not duplicated as project copies.
foreach ($folder in (Get-ChildItem -LiteralPath $experimentsRoot -Directory | Sort-Object Name)) {
    $entry = Get-FirstHtml $folder.FullName
    if ($null -eq $entry) { continue }
    $text = Get-SourceText $folder.FullName
    $technologies = Get-Technologies $folder.FullName $text
    $true3D = ($technologies -contains 'Three.js') -or ($text -match '(?i)WebGLRenderer|PerspectiveCamera|THREE\.Scene|GLTFLoader')
    if ($folder.Name -eq '2D') { $categories = @('Sites 2D', 'Expériences visuelles') }
    elseif ($true3D) { $categories = @('Sites 3D', 'Expériences visuelles') }
    else { $categories = @('Expériences visuelles') }
    $features = Get-Features $text $technologies
    $features += 'Projet expérimental multi-fichiers'
    if ($text -match '(?i)ScrollTrigger|scrollytelling') { $features += 'Scrollytelling' }
    $count = Get-PageCount $folder.FullName
    Add-Resource "experiment-project-$($folder.Name)" (Get-Title $folder.FullName $folder.Name) `
        "Projet expérimental regroupé; $count pages HTML et fichiers compagnons. Le fichier principal catalogué est $($entry.Name)." `
        $categories 'Projet expérimental multi-fichiers' $folder.FullName $entry.FullName $technologies $features `
        "Ouvrir $($entry.Name) dans le dossier original; le projet peut dépendre de scripts, modèles ou assets voisins." `
        'Source présente, non exécutée' ''
}

# React/Vite templates, one record per runnable project.
$reactRoot = Join-Path $templateRoot 'react'
foreach ($folder in (Get-ChildItem -LiteralPath $reactRoot -Directory | Sort-Object Name)) {
    $packagePath = Join-Path $folder.FullName 'package.json'
    $htmlPath = Join-Path $folder.FullName 'index.html'
    if (-not (Test-Path -LiteralPath $packagePath)) { continue }
    $text = Get-SourceText $folder.FullName
    $technologies = Get-Technologies $folder.FullName $text
    $features = Get-Features $text $technologies
    if ($folder.Name -match 'hero') { $features += 'Hero / accueil' }
    else { $features += 'Landing page' }
    $features += 'Variante React/Vite'
    $title = $folder.Name -replace '-', ' '
    $type = if ($folder.Name -match 'hero') { 'Template de hero React' } else { 'Landing page React' }
    Add-Resource "react-$($folder.Name)" $title `
        "$type avec configuration Vite; les dépendances du projet ne sont pas installées ni exécutées par ce catalogue." `
        @('Sites 2D', 'Applications Web') $type $folder.FullName $htmlPath $technologies $features `
        'Dans le dossier source: npm install puis npm run dev. Node.js requis; application non exécutée.' `
        'Source présente, non exécutée' ''
}

# Local graphic resources are catalogued individually; no media is copied or altered.
$mediaExtensions = @('.glb', '.gltf', '.obj', '.fbx', '.png', '.jpg', '.jpeg', '.webp', '.svg', '.mp4', '.webm', '.woff', '.woff2', '.ttf', '.otf')
foreach ($file in (Get-ChildItem -LiteralPath $templateRoot -File -Recurse -Force |
    Where-Object { $_.Extension.ToLowerInvariant() -in $mediaExtensions } |
    Sort-Object FullName)) {
    $relative = Get-DownloadRelativePath $file.FullName
    $ext = $file.Extension.ToLowerInvariant()
    if ($ext -in '.glb', '.gltf', '.obj', '.fbx') { $type = 'Modèle 3D' }
    elseif ($ext -in '.mp4', '.webm') { $type = 'Vidéo' }
    elseif ($ext -in '.woff', '.woff2', '.ttf', '.otf') { $type = 'Police' }
    elseif ($ext -eq '.svg') { $type = 'Icône / illustration SVG' }
    else { $type = 'Image / texture' }
    $preview = if ($ext -in '.png', '.jpg', '.jpeg', '.webp', '.svg') { $file.FullName } else { '' }
    $name = [System.IO.Path]::GetFileNameWithoutExtension($file.Name)
    Add-Resource (Get-ResourceId 'asset' $file.FullName) $name `
        ('{0} conservé à son emplacement initial ({1} Ko).' -f $type, [math]::Round($file.Length / 1KB)) `
        @('Ressources graphiques') $type $file.FullName $file.FullName @($ext.TrimStart('.').ToUpperInvariant()) `
        @('Asset original') 'Ouvrir ou utiliser le fichier depuis le projet qui le référence.' `
        'Asset original, non modifié' $preview
}

$catalogue = [ordered]@{
    generatedAt = [DateTime]::UtcNow.ToString('o')
    locationBase = 'Downloads'
    resources = @($resources | Sort-Object @{ Expression = { $_.categories[0] } }, name)
    exactDuplicateGroups = $duplicateGroups
    inventory = [ordered]@{
        resourceCount = $resources.Count
        templateHtmlCount = @(Get-ChildItem -LiteralPath $templateRoot -File -Recurse -Filter '*.html').Count
        sourceFileCount = @($projectFiles).Count
        exactDuplicateGroupCount = $duplicateGroups.Count
        sourceRootsIncluded = @('Portfolio-Templates-main\web-templates-main')
        executionPerformed = $false
    }
}

$json = $catalogue | ConvertTo-Json -Depth 12
Set-Content -LiteralPath (Join-Path $libraryRoot 'catalogue.json') -Value $json -Encoding UTF8
Set-Content -LiteralPath (Join-Path $libraryRoot 'catalogue-data.js') -Value ("window.WEB_LIBRARY = $json;") -Encoding UTF8
Write-Output "Catalogue créé: $($resources.Count) ressources; $($catalogue.inventory.templateHtmlCount) pages HTML; $($duplicateGroups.Count) groupes de doublons exacts (aucune suppression)."
