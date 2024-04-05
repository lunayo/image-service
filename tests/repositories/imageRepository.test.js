const Image = require("../../src/models/image")
const ImageRepository = require("../../src/repositories/imageRepository")

describe('Image', () => {
    it('should be stored correctly', async () => {
        const imageRepository = new ImageRepository()
        const testImage = new Image("testIdentifier", "testIdentifier.png", "png")
        imageRepository.storeImage(testImage)

        const allImages = imageRepository.getAllImages()
        expect(allImages.length).toBe(1)
        expect(allImages[0]).toEqual(testImage)
    })

    it('should be retrieved correctly', async () => {
        const imageRepository = new ImageRepository()
        const testImage = new Image("testIdentifier", "testIdentifier.png", "png")
        imageRepository.storeImage(testImage)

        const image = imageRepository.findImage(testImage.getIdentifier())
        expect(image).toEqual(testImage)
    })
})