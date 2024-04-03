const { Router } = require('express')
const { v4: uuidv4 } = require('uuid')
const ImageRepository = require('../repositories/imageRepository')
const ImageService = require('../services/imageService')
const ImageController = require('../controllers/imageController.js')
const multer  = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '/tmp/uploads')
    },
    filename: function (req, file, cb) {
      const uniqueFilename = uuidv4()
      const fileExtension = file.mimetype.split("/")[1]
      cb(null, `${uniqueFilename}.${fileExtension}`)
    }
})
const upload = multer({ storage })
const router = Router()
const imageController = new ImageController(new ImageRepository(), new ImageService())
router.post('/image', upload.single(), imageController.uploadImage)
router.get('/image/:identifier', imageController.getImage)

module.exports = router