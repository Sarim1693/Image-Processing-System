const express=require('express');
const router=express.Router();
const multer=require('multer');
const fs=require('fs');
const path=require('path');
const auth=require('./../middleware/auth');
const {applyTransformations}=require('./../utils/imageProcessor');
const sharp=require('sharp');
const {v4: uuidv4}=require('uuid');
const Image=require('./../models/image');
const { connection } = require('mongoose');
const UPLOAD_DIR=process.env.UPLOAD_DIR || './uploads';
if(!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, {recursive:true});
require('dotenv').config();
const storage=multer.diskStorage({
    destination: (req, file, cb)=> cb(null, UPLOAD_DIR),
    filename: (req, file, cb)=> cb(null, `${Date.now()}-${uuidv4()}${path.extname(file.originalname)}`)
});
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const upload= multer({storage, limits:{fileSize: 10*1024*1024}});
router.post('/', auth, upload.single('image'), async(req, res)=>{
    try{
        if(!req.file) return res.status(400).json({err: "No file Being Uploaded"});
        const filePath=path.resolve(req.file.path);
        const metaData=await sharp(filePath).metadata();
        const url=`${BASE_URL || 'http://localhost:3000'}/uploads/${path.basename(filePath)}`;
        const image= new Image({
            owner: req.user._id,
            filename:req.file.originalname,
            path:filePath,
            url,
            mimeType:req.file.mimetype,
            size:req.file.size,
            width:metaData.width,
            height:metaData.height
        });
        const response=await image.save();
        res.status(200).json(response);
    }
    catch(err){
        console.log(err);
        res.status(500).json({err: "Internal Server Error"});
    }
});

router.post('/:id/transform', auth, async(req, res)=>{
    try{
        const {id}=req.params;
        const ops=req.body.transformations || req.body || {};
        const original= await Image.findById(id);
        if(!original) return res.status(404).json({err : "Image not found"});
        if(String(original.owner)!==String(req.user._id)){
            res.status(403).json({err: "Forbidden"});
        }
        const output= await applyTransformations(original.path, ops);
        let ext='.jpg';
        if(ops.format) ext='.'+ops.format;
        else{
            const mt=original.mimeType || '';
            if(mt.includes('png')) ext= '.png';
            else if(mt.includes('webp')) ext='.webp';
            else if(mt.includes('jpeg'|| mt.includes('jpg'))) ext='.jpg';
        }

        const outFilename=`${Date.now()}-${uuidv4()}${ext}`;
        const outPath=path.join(UPLOAD_DIR,outFilename);
        fs.promises.writeFile(outPath, output.data);

        const meta=output.data || await sharp(outPath).metadata();
        const url=`${BASE_URL||'http://localhost:3000'}/uploads/${outFilename}`;

        const response=new Image({
            owner:req.user._id,
            filename:outFilename,
            path:outPath,
            url,
            mimeType:meta.format?`image/${meta.format}`: original.mimeType,
            size:(await fs.promises.stat(outPath)).size,
            width:meta.width,
            height:meta.height,
            originalImage:original._id,
            transformations:ops
        });
        await response.save();
        res.status(200).json(response);
    }
    catch(err){
        console.log(err);
        res.status(500).json({err: "Internal Server Error"});
    }
});

router.get('/:id', auth, async(req, res)=>{
    try{
        const {id}=req.params;
        const img= await Image.findById(id);
        if(!img) return res.status(404).json({err: "Image not found"});
        if(String(img.owner)!== String(req.user._id)) return res.status(403).json({err: "Forbidden"});

        if(req.query.data==true) return res.json(img);

        res.sendFile(path.resolve(img.path));
    }
    catch(err){
        console.log(err);
        res.status(500).json({err: "Internal Server Error"});
    }
});

router.get('/', auth, async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page || '1'));
    const limit = Math.max(1, parseInt(req.query.limit || '10'));
    const skip = (page - 1) * limit;
    const owner = req.user._id;

    const [images, total] = await Promise.all([
      Image.find({ owner }).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Image.countDocuments({ owner })
    ]);

    // ✅ Add BASE_URL for complete image access
    const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

    const updatedImages = images.map(img => ({
      ...img,
      url: `${BASE_URL}/uploads/${path.basename(img.path)}`
    }));

    res.json({
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      total,
      data: updatedImages
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports=router;
