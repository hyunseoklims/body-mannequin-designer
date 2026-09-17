Add-Type -AssemblyName System.Drawing
$drawingAssembly=[System.Drawing.Bitmap].Assembly.Location
Add-Type -ReferencedAssemblies $drawingAssembly -TypeDefinition @"
using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;
public static class ReferenceAlphaFast {
  public static void Convert(string source,string destination,int baselineY) {
    Bitmap original=new Bitmap(source);
    Bitmap input=original.Clone(new Rectangle(0,0,original.Width,original.Height),PixelFormat.Format32bppArgb);
    Bitmap output=new Bitmap(input.Width,input.Height,PixelFormat.Format32bppArgb);
    var rect=new Rectangle(0,0,input.Width,input.Height);
    var inputData=input.LockBits(rect,ImageLockMode.ReadOnly,PixelFormat.Format32bppArgb);
    var outputData=output.LockBits(rect,ImageLockMode.WriteOnly,PixelFormat.Format32bppArgb);
    int stride=Math.Abs(inputData.Stride),length=stride*input.Height;
    var sourceBytes=new byte[length];var targetBytes=new byte[length];
    Marshal.Copy(inputData.Scan0,sourceBytes,0,length);input.UnlockBits(inputData);
    for(int y=0;y<input.Height;y++)for(int x=0;x<input.Width;x++){
      int i=y*stride+x*4,b=sourceBytes[i],g=sourceBytes[i+1],r=sourceBytes[i+2],brightness=(r+g+b)/3;byte alpha=0;
      bool blueBaseline=Math.Abs(y-baselineY)<=3&&b>r+35&&b>g+10;
      if(blueBaseline||brightness>245||(brightness<115&&NearWhite(sourceBytes,stride,input.Width,input.Height,x,y)))alpha=255;
      targetBytes[i]=(byte)b;targetBytes[i+1]=(byte)g;targetBytes[i+2]=(byte)r;targetBytes[i+3]=alpha;
    }
    Marshal.Copy(targetBytes,0,outputData.Scan0,length);output.UnlockBits(outputData);output.Save(destination,ImageFormat.Png);
    output.Dispose();input.Dispose();original.Dispose();
  }
  static bool NearWhite(byte[] data,int stride,int width,int height,int x,int y){
    for(int dy=-5;dy<=5;dy++)for(int dx=-5;dx<=5;dx++){int nx=x+dx,ny=y+dy;if(nx<0||ny<0||nx>=width||ny>=height)continue;int i=ny*stride+nx*4;if(data[i]>238&&data[i+1]>238&&data[i+2]>238)return true;}return false;
  }
}
"@
[ReferenceAlphaFast]::Convert((Resolve-Path 'references\male-front-reference.png'),(Join-Path (Get-Location) 'public\male-front-reference-alpha.png'),1469)
[ReferenceAlphaFast]::Convert((Resolve-Path 'references\female-front-reference.png'),(Join-Path (Get-Location) 'public\female-front-reference-alpha.png'),1471)
