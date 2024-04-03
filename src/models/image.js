class Image {
    constructor(id, path, extension) {
        this.id = id
        this.path = path
        this.extension = extension
    }

    getExtension() {
        return this.extension
    }

    getPath() {
        return this.path
    }

    getIdentifier() {
        return this.id
    }
}

module.exports = Image