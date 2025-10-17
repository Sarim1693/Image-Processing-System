const sharp=require('sharp');
const fs=require('fs');
const path=require('path');
const {v4: uuid4}=require('uuid');

async function applyTransformations(inputPathOrBuffer, ops= {}){
    let img= sharp(inputPathOrBuffer);

    if(ops.rotate){
        img=img.rotate(Number(ops.rotate));
    }

    if(ops.resize){
        const {width, height}=ops.resize;
        img=img.resize(width ? Number(width):null, height ? Number(height): null, {
            fit:ops.resize.fit || 'cover'
        });
    }

    if(ops.crop){
        const {width, height, x=0, y=0}=ops.crop;
        img=img.extract({left:Number(x), top:Number(y), width:Number(width), height:Number(height)});
    }
    if(ops.flip){
        img=img.flip();
    }
    if(ops.flop || ops.mirror){
        img=img.flop();
    }

    if(ops.format){
        const fmt= ops.format.toLowerCase();
        if(fmt=='jpg' || fmt=='jpeg') img=img.jpeg({quality:ops.quality || 80});
        else if(fmt=='png') img=img.png({compressionLevel:9});
        else if(fmt=='webp') img=img.webp({quality:ops.quality || 80});
        else if(fmt=='avif') img=img.avif({quality:ops.quality || 50});
    }
    else{
        img=img.jpeg({quality:ops.quality || 80}).png();
    }
    //filter
    if(ops.filter){
        if(ops.filter.grayscale) img=img.grayscale();
        if(ops.filter.sepia){
             img = img.modulate({ saturation: 0.6 }).tint({ r: 112, g: 66, b: 20 });
        }
        if(ops.filter.blur) img=img.blur(Number(ops.filter.blur)|| 1);
    }

     if(ops.watermark && ops.watermark.text) {
    const watermarkText = ops.watermark.text;
    const svg = `
      <svg width="800" height="200">
        <style>
          .title { fill: rgba(255,255,255,${ops.watermark.opacity || 0.4}); font-size: ${ops.watermark.size || 48}px; font-family: Arial, sans-serif;}
        </style>
        <text x="10" y="${ops.watermark.size || 48}" class="title">${watermarkText}</text>
      </svg>`;
    const svgBuffer = Buffer.from(svg);
    img = await img.composite([{ input: svgBuffer, gravity: ops.watermark.gravity || 'southeast' }]);
  }

  const buffer = await img.toBuffer({ resolveWithObject: true });
  // buffer.data and buffer.info
  return buffer;
}

module.exports={applyTransformations};