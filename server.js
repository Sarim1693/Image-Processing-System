const bodyParser = require('body-parser');
const express=require('express');
const app=express();
const path=require('path');
require('dotenv').config();
const db=require('./db');

const PORT=process.env.PORT || 3000;
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(bodyParser.json());

const userRoutes=require('./routes/userRoutes');
app.use('/users', userRoutes);
const imagesRoutes=require('./routes/imageRoutes');
app.use('/images', imagesRoutes);
app.listen(PORT, ()=>{
    console.log(`Server is running at ${PORT}`);
});