const Image = require('../models/image')

class ImageController {
    constructor(imageRepository, imageService) {
        this.imageRepository = imageRepository
        this.imageService = imageService
        this.uploadImage = this.uploadImage.bind(this)
        this.getImage = this.getImage.bind(this)
    }

    uploadImage(req, res) {
        const { filename, path, mimetype } = req.file
        const identifier = filename.split('.')[0]
        const extension = mimetype.split('/')[1]
        const image = new Image(identifier, path, extension)
        console.log("store image with identifier:", image.id)
        this.imageRepository.storeImage(image)
        res.status(201).json({
            identifier: image.id
        })
    }

    async getImage(req, res) {
        const { identifier } = req.params
        const { type } = req.query
        console.log("get image with identifier:", identifier, "type:", type)
        const image = this.imageRepository.findImage(identifier)
        if(!image) {
            res.status(404).send()
        } else {
            let newImage = image
            if(type) {
                newImage = await this.imageService.convert(image, type)
            }
            res.sendFile(newImage.getPath())
        }
    }
}

module.exports = ImageController