class ImageRepository {
    constructor() {
        this.images = []
    }

    storeImage(image) {
        this.images.push(image)
    }

    findImage(identifier) {
        const image = this.images.find(i => i.id === identifier)
        return image
    }

    removeImage(identifier) {
        this.images = this.images.filter(i => i.id !== identifier)
    }

    getAllImages() {
        return this.images
    }
}

module.exports = ImageRepository