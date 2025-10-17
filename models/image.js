const mongoose=require('mongoose');
const { type } = require('os');
const path = require('path');
const imageSchema=new mongoose.Schema({
    owner:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:true
    },
    filename:{
        type:String,
        required:true
    },
    path:{
        type:String,
        required:true
    },
    url:{
        type:String,
        required:true,
    },
    mimeType:{
        type:String
    },
    size:{
        type:Number
    },
    width:{
        type:Number
    },
    height:{
        type:Number
    },
    originalImage:{
        type:mongoose.Schema.ObjectId,
        ref:'Image'
    },
    transformations:{
        type:Object
    },
}, {timestamps:true});

module.exports= mongoose.model('Image', imageSchema);