const sharp = require('sharp');
const ImageService = require("../../src/services/imageService")
const Image = require("../../src/models/image")
const mockPngImplementation = jest.fn().mockImplementation(() => { 
    return {
        toFile: jest.fn()
    }
})
const mockJpegImplementation = jest.fn().mockImplementation(() => { 
    return {
        toFile: jest.fn()
    }
})
const mockWebpImplementation = jest.fn().mockImplementation(() => { 
    return {
        toFile: jest.fn()
    }
})
jest.mock('sharp', () => {
    return jest.fn().mockImplementation(() => { 
        return {
            png: mockPngImplementation,
            jpeg: mockJpegImplementation,
            webp: mockWebpImplementation
        }
    })
});

describe('Image', () => {
    it('should be converted to png correctly', async () => {
        const imageService = new ImageService()
        const image = new Image('testIdentifier', 'testIdentifier.jpeg', 'jpeg')
        const targetExtension = 'png'

        const newImage = await imageService.convert(image, targetExtension)

        expect(sharp).toBeCalledWith(image.path)
        expect(mockPngImplementation).toBeCalledWith()
        const expectedNewImage = new Image('testIdentifier', '/tmp/converts/testIdentifier.png', 'png')
        expect(newImage).toEqual(expectedNewImage)
    })

    it('should be converted to jpeg correctly', async () => {
        const imageService = new ImageService()
        const image = new Image('testIdentifier', 'testIdentifier.png', 'png')
        const targetExtension = 'jpeg'

        const newImage = await imageService.convert(image, targetExtension)

        expect(sharp).toBeCalledWith(image.path)
        expect(mockJpegImplementation).toBeCalledWith({"mozjpeg": true})
        const expectedNewImage = new Image('testIdentifier', '/tmp/converts/testIdentifier.jpeg', 'jpeg')
        expect(newImage).toEqual(expectedNewImage)
    })

    it('should be converted to webp correctly', async () => {
        const imageService = new ImageService()
        const image = new Image('testIdentifier', 'testIdentifier.png', 'png')
        const targetExtension = 'webp'

        const newImage = await imageService.convert(image, targetExtension)

        expect(sharp).toBeCalledWith(image.path)
        expect(mockWebpImplementation).toBeCalledWith()
        const expectedNewImage = new Image('testIdentifier', '/tmp/converts/testIdentifier.webp', 'webp')
        expect(newImage).toEqual(expectedNewImage)
    })
})