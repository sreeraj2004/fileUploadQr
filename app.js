const express = require('express');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const qr = require('qrcode');

const app = express();
const port = 3000;

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file , cb)=>{
        cb(null , Date.now()+path.extname(file.originalname));
    },
});

const upload = multer({storage});

app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/index.html');
})

app.post('/upload' , upload.single('file') , async (req,res)=>{
    if(!req.file) res.send("No file is uploaded");
    const localIP = '192.168.161.128'; 
    const filePath = `${req.protocol}://${localIP}:${port}/uploads/${req.file.filename}`;
    const qrCode = await qr.toDataURL(filePath);
    res.send(`<img src=${qrCode} />`);
})

app.listen(port , ()=>{
    console.log(`Server is listening at ${port}`);
})