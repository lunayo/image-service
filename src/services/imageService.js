const sharp = require('sharp');
const Image = require('../models/image')

class ImageService {
    async convert(image, targetExtension) {
        if (!targetExtension || image.getExtension() === targetExtension) return image
        let client = sharp(image.path)
        switch(targetExtension) {
            case 'jpeg': 
                client = client.jpeg({ mozjpeg: true })
                break
            case 'webp': 
                client = client.webp()
                break
            case 'png':
                client = client.png()
                break
            default: throw new Error("Image extension type not supported")
        }
        const convertPath = '/tmp/converts'
        const targetPath = `${convertPath}/${image.id}.${targetExtension}`
        await client.toFile(targetPath)
        return new Image(image.id, targetPath, targetExtension)
    }
}

module.exports = ImageService