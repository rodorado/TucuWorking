const multer = require('multer')
const path = require('path')

module.exports = multer({
    storage: multer.diskStorage({}),
    fileFilter: (req, file, cb)=>{
        console.log(file)
        const extension = path.extname(file.originalname)
        

        if(extension !== '.JPG' && extension !== '.png' && extension !== '.jepg'){
             return cb(new Error('Formato incorrecto'), false)
             
            } 
            cb(null, true)
    }
})