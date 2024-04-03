const ImageController = require("../../src/controllers/imageController")
const ImageRepository = require("../../src/repositories/imageRepository")
const ImageService = require("../../src/services/imageService")
const Image = require("../../src/models/image")
jest.mock('../../src/repositories/imageRepository')
jest.mock('../../src/services/imageService')

describe('Image', () => {
    beforeEach(() => {
        ImageRepository.mockClear();
        ImageService.mockClear();
    });

    it('should be uploaded correctly', async () => {
        const mockImageRepository = new ImageRepository()
        const mockImageService = new ImageService()
        const imageController = new ImageController(mockImageRepository, mockImageService)
        const mockReq = {
            file: {
                filename: 'testUniqueFilename.jpeg', 
                path: '/tmp/uploads/testUniqueFilename.jpeg', 
                mimetype: 'image/jpeg'
            }
        }
        const mockRes = {}
        mockRes.json = jest.fn()
        mockRes.status = jest.fn(() => mockRes)

        imageController.uploadImage(mockReq, mockRes)

        const expectedImage = new Image('testUniqueFilename', mockReq.file.path, 'jpeg')
        expect(mockImageRepository.storeImage).toBeCalledWith(expectedImage)
        expect(mockRes.status).toBeCalledWith(201)
        expect(mockRes.json).toBeCalledWith({ identifier: 'testUniqueFilename'})
    })

    it('should be retrieved correctly', async () => {
        const mockImageRepository = new ImageRepository()
        const mockImageService = new ImageService()
        const imageController = new ImageController(mockImageRepository, mockImageService)
        const mockReq = {
            params: {
                identifier: 'testUniqueIdentifier'
            },
            query: {}
        }
        const image = new Image('testUniqueIdentifier', 'testUniquePath.jpeg', 'jpeg')
        mockImageRepository.findImage.mockReturnValue(image)
        const mockRes = {
            sendFile: jest.fn()
        }

        imageController.getImage(mockReq, mockRes)

        expect(mockImageRepository.findImage).toBeCalledWith(mockReq.params.identifier)
        expect(mockImageService.convert).not.toBeCalledWith()
        expect(mockRes.sendFile).toBeCalledWith(image.getPath())
    })

    it('should be retrieved correctly with type', async () => {
        const mockImageRepository = new ImageRepository()
        const mockImageService = new ImageService()
        const imageController = new ImageController(mockImageRepository, mockImageService)
        const mockReq = {
            params: {
                identifier: 'testUniqueIdentifier'
            },
            query: {
                type: 'png'
            }
        }
        const image = new Image('testUniqueIdentifier', 'testUniquePath.jpeg', 'jpeg')
        mockImageRepository.findImage.mockReturnValue(image)
        const convertedImage = new Image('testUniqueIdentifier', 'testUniquePath.png', 'png')
        mockImageService.convert.mockReturnValue(convertedImage)
        let mockRes = {
            sendFile: jest.fn()
        }

        await imageController.getImage(mockReq, mockRes)

        expect(mockImageRepository.findImage).toBeCalledWith(mockReq.params.identifier)
        expect(mockImageService.convert).toBeCalledWith(image, mockReq.query.type)
        expect(mockRes.sendFile).toBeCalledWith(convertedImage.getPath())
    })

    it('should return not found when identifier was not found', async () => {
        const mockImageRepository = new ImageRepository()
        const mockImageService = new ImageService()
        const imageController = new ImageController(mockImageRepository, mockImageService)
        const mockReq = {
            params: {
                identifier: 'testUniqueIdentifier'
            },
            query: {}
        }
        const image = new Image('testUniqueIdentifier', 'testUniquePath.jpeg', 'jpeg')
        mockImageRepository.findImage.mockReturnValue(null)
        const mockRes = {}
        mockRes.send = jest.fn()
        mockRes.status = jest.fn(() => mockRes)

        imageController.getImage(mockReq, mockRes)

        expect(mockImageRepository.findImage).toBeCalledWith(mockReq.params.identifier)
        expect(mockRes.status).toBeCalledWith(404)
        expect(mockRes.send).toBeCalledWith()
    })
})