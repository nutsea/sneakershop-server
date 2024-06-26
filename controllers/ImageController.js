const { Item, Image } = require('../models/models')
const ApiError = require('../error/apiError')
const uuid = require('uuid')
const path = require('path')
const { Op } = require('sequelize')
const fs = require('fs')

class ImageController {
    async create(req, res, next) {
        try {
            const { item_id } = req.body
            console.log(item_id)
            if (req.files && 'img' in req.files) {
                const { img } = req.files
                if (!Array.isArray(img)) {
                    let fileName = uuid.v4() + ".jpg"
                    img.mv(path.resolve(__dirname, '..', 'static', fileName))
                    const image = await Image.create({ name: fileName, item_id })
                    return res.json(image)
                } else {
                    for (let i of img) {
                        let fileName = uuid.v4() + ".jpg"
                        i.mv(path.resolve(__dirname, '..', 'static', fileName))
                        await Image.create({ name: fileName, item_id })
                    }
                    return res.json(item_id)
                }
            } else {
                return res.json(item_id)
            }
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async getAll(req, res, next) {
        try {
            const { code } = req.query
            const images = await Image.findAll({ where: { item_id: code } })
            return res.json(images)
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async delete(req, res, next) {
        try {
            const { toDelete } = req.query
            if (toDelete) {
                const images = await Image.findAll({ where: { id: { [Op.in]: toDelete } } })
                if (images) {
                    for (let i of images) {
                        const filePath = path.resolve(__dirname, '..', 'static', i.name)
                        fs.unlink(filePath, (e) => {
                            if (e) {
                                console.log('Ошибка при удалении файла:', e)
                            } else {
                                console.log('Файл успешно удален')
                            }
                        })
                        await i.destroy()
                    }
                }
                return res.json('done')
            } else {
                return res.json('no images to delete')
            }
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new ImageController()