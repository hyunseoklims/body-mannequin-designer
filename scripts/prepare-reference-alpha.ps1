Add-Type -AssemblyName System.Drawing

function Convert-ReferenceToAlpha([string]$source,[string]$destination,[int]$baselineY) {
  $inputBitmap=[System.Drawing.Bitmap]::FromFile((Resolve-Path $source))
  $outputBitmap=New-Object System.Drawing.Bitmap($inputBitmap.Width,$inputBitmap.Height,[System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  for($y=0;$y -lt $inputBitmap.Height;$y++) {
    for($x=0;$x -lt $inputBitmap.Width;$x++) {
      $pixel=$inputBitmap.GetPixel($x,$y)
      $alpha=0
      $bright=($pixel.R+$pixel.G+$pixel.B)/3
      $blueBaseline=($y - $baselineY -le 3) -and ($baselineY - $y -le 3) -and $pixel.B -gt ($pixel.R+35) -and $pixel.B -gt ($pixel.G+10)
      if($blueBaseline) { $alpha=255 }
      elseif($bright -gt 245) { $alpha=255 }
      elseif($bright -lt 115) {
        $nearWhite=$false
        for($dy=-5;$dy -le 5 -and -not $nearWhite;$dy++) {
          for($dx=-5;$dx -le 5 -and -not $nearWhite;$dx++) {
            $nx=$x+$dx; $ny=$y+$dy
            if($nx -ge 0 -and $nx -lt $inputBitmap.Width -and $ny -ge 0 -and $ny -lt $inputBitmap.Height) {
              $near=$inputBitmap.GetPixel($nx,$ny)
              if($near.R -gt 238 -and $near.G -gt 238 -and $near.B -gt 238) { $nearWhite=$true }
            }
          }
        }
        if($nearWhite) { $alpha=255 }
      }
      if($alpha -gt 0) { $outputBitmap.SetPixel($x,$y,[System.Drawing.Color]::FromArgb($alpha,$pixel.R,$pixel.G,$pixel.B)) }
      else { $outputBitmap.SetPixel($x,$y,[System.Drawing.Color]::Transparent) }
    }
  }
  $outputBitmap.Save((Join-Path (Get-Location) $destination),[System.Drawing.Imaging.ImageFormat]::Png)
  $outputBitmap.Dispose(); $inputBitmap.Dispose()
}

Convert-ReferenceToAlpha 'references\male-front-reference.png' 'public\male-front-reference-alpha.png' 1469
Convert-ReferenceToAlpha 'references\female-front-reference.png' 'public\female-front-reference-alpha.png' 1471
