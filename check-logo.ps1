Add-Type -AssemblyName System.Drawing

$imagePath = "logoImages/firstLogoImage.png"
$img = [System.Drawing.Image]::FromFile($imagePath)

Write-Host "Current logo dimensions:"
Write-Host "Width: $($img.Width) pixels"
Write-Host "Height: $($img.Height) pixels"

# Check if resizing is needed
if ($img.Width -ne 128 -or $img.Height -ne 128) {
    Write-Host "`nVS Code extension icons should be 128x128 pixels"
    Write-Host "Your image needs to be resized"
    
    # Create resized version
    $newImg = New-Object System.Drawing.Bitmap(128, 128)
    $graphics = [System.Drawing.Graphics]::FromImage($newImg)
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.DrawImage($img, 0, 0, 128, 128)
    
    $outputPath = "logoImages/icon-128x128.png"
    $newImg.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    
    Write-Host "Created resized icon: $outputPath"
    
    $graphics.Dispose()
    $newImg.Dispose()
} else {
    Write-Host "`nImage is already the correct size (128x128)"
}

$img.Dispose()