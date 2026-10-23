
Add-Type -AssemblyName System.Drawing
$bmp = [System.Drawing.Bitmap]::FromFile('D:\한우리\temp_crop_src.png')

# Let's inspect height/width
Write-Host "Width: $($bmp.Width), Height: $($bmp.Height)"

# Crop Header Banner (x: 40, y: 60, w: 644, h: 68)
$rect = New-Object System.Drawing.Rectangle(40, 60, 644, 70)
$cropped = $bmp.Clone($rect, $bmp.PixelFormat)
$cropped.Save('D:\한우리\header_full.png', [System.Drawing.Imaging.ImageFormat]::Png)
$cropped.Dispose()

# Also crop just the left star logo (x: 40, y: 65, w: 260, h: 55)
$rectLogo = New-Object System.Drawing.Rectangle(40, 65, 260, 55)
$croppedLogo = $bmp.Clone($rectLogo, $bmp.PixelFormat)
$croppedLogo.Save('D:\한우리\logo_stars.png', [System.Drawing.Imaging.ImageFormat]::Png)
$croppedLogo.Dispose()

$bmp.Dispose()
Write-Host "Cropped successfully!"
