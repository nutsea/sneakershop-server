const {Item, Image} = require('../models/models')
const ApiError = require('../error/ApiError')
const uuid = require('uuid')
const path = require('path')
const fs = require('fs')
const {Sequelize} = require('../db')
const {Op} = require('sequelize');

class ItemController {
    async create(req, res, next) {
        try {
            const {
                code,
                brand,
                name,
                description,
                price,
                sale,
                count,
                size,
                size_type,
                category,
                model,
                color
            } = req.body
            if (req.files && 'img' in req.files) {
                const {img} = req.files
                let fileName = uuid.v4() + ".jpg"
                img.mv(path.resolve(__dirname, '..', 'static', fileName))
                const item = await Item.create({
                    code,
                    brand,
                    name,
                    description,
                    price,
                    sale,
                    count,
                    size,
                    size_type,
                    category,
                    model,
                    color,
                    img: fileName
                })
                return res.json(item)
            } else {
                if (count) {
                    const item = await Item.create({
                        code,
                        brand,
                        name,
                        description,
                        price,
                        sale,
                        count,
                        size,
                        size_type,
                        category,
                        model,
                        color
                    })
                    return res.json(item)
                } else {
                    const item = await Item.create({
                        code,
                        brand,
                        name,
                        description,
                        price,
                        sale,
                        count: 1,
                        size,
                        size_type,
                        category,
                        model,
                        color
                    })
                    return res.json(item)
                }
            }
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async update(req, res, next) {
        try {
            const {
                id,
                code,
                brand,
                name,
                description,
                price,
                sale,
                count,
                size,
                size_type,
                category,
                model,
                color
            } = req.body
            const item = await Item.findOne({where: {id}})
            if (code) item.code = code
            if (brand) item.brand = brand
            if (name) item.name = name
            if (description) item.description = description
            if (price) item.price = price
            if (sale) item.sale = sale
            if (size) item.size = size
            if (size_type) item.size_type = size_type
            if (category) item.category = category
            if (model) item.model = model
            if (color) item.color = color
            if (count) item.count = count
            else item.count = 1
            if (req.files && 'img' in req.files) {
                const {img} = req.files
                let fileName = uuid.v4() + ".jpg"
                img.mv(path.resolve(__dirname, '..', 'static', fileName))
                const filePath = path.resolve(__dirname, '..', 'static', item.img)
                fs.unlink(filePath, (e) => {
                    if (e) {
                        console.log('Ошибка при удалении файла:', e)
                    } else {
                        console.log('Файл успешно удален')
                    }
                })
                item.img = fileName
            }
            console.log(item)
            await item.save()
            return res.json(item)
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async buyItems(req, res, next) {
        try {
            const {id, count} = req.body
            const item = await Item.findOne({where: {id}})
            if (item.count - count > 0) {
                item.count -= count
            } else {
                item.count = 0
            }
            await item.save()
            return res.json(item)
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async getOne(req, res, next) {
        try {
            const {id} = req.params
            const item = await Item.findOne({where: {id}})
            return res.json(item)
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async getSame(req, res, next) {
        try {
            const {code} = req.query
            const items = await Item.findAll({where: {code}})
            return res.json(items)
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async getAll(req, res, next) {
        try {
            let {brands, model, color, size, size_type, priceMin, priceMax, limit, page} = req.query
            page = page || 1
            limit = limit || 18
            let offset = page * limit - limit
            const items = await Item.findAndCountAll({
                where: {
                    brand: {[Op.in]: brands},
                    price: {
                        [Op.and]: [
                            {[Op.gt]: Number(priceMin) - 1},
                            {[Op.lt]: Number(priceMax) + 1}
                        ]
                    },
                    model,
                    color,
                    size,
                    size_type,
                    // count: {
                    //     [Op.gt]: 0
                    // }
                },
                order: [
                    ['name', 'ASC']
                ],
                limit,
                offset
            })
            return res.json(items)

        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async getCombs(req, res, next) {
        try {
            const {code} = req.query
            const items = await Item.findAll({where: {code}})
            let combs = []
            items.forEach((item, i) => {
                let thisSize = item.size
                let thisSizeType = item.size_type
                let thisPrice = item.price
                let thisCount = item.count
                combs.push({thisSize, thisSizeType, thisPrice, thisCount})
            })
            return res.json(combs)
        } catch (e) {

        }
    }

    async getBrands(req, res, next) {
        try {
            const {category} = req.query
            const brands = await Item.findAll({
                attributes: [
                    [Sequelize.fn('DISTINCT', Sequelize.col('brand')), 'brand']
                ],
                where: {category}
            })
            return res.json(brands)
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async getModels(req, res, next) {
        try {
            const {category} = req.query
            const models = await Item.findAll({
                attributes: [
                    [Sequelize.fn('DISTINCT', Sequelize.col('model')), 'model']
                ],
                where: {category}
            })
            return res.json(models)
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async getSizes(req, res, next) {
        try {
            const {category} = req.query
            const sizes = await Item.findAll({
                attributes: [
                    [Sequelize.fn('DISTINCT', Sequelize.col('size')), 'size']
                ],
                where: {category}
            })
            return res.json(sizes)
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async getMin(req, res, next) {
        try {
            const {category} = req.query
            const min = await Item.findOne({
                attributes: [[Sequelize.fn('MIN', Sequelize.col('price')), 'minValue']],
                where: {category}
            })
            return res.json(min)
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async getMax(req, res, next) {
        try {
            const {category} = req.query
            const max = await Item.findOne({
                attributes: [[Sequelize.fn('MAX', Sequelize.col('price')), 'minValue']],
                where: {category}
            })
            return res.json(max)
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async delete(req, res, next) {
        const {id} = req.query
        const item = await Item.findOne({where: {id}})
        const images = await Image.findAll({where: {item_id: id.toString()}})
        try {
            if (item.img) {
                const filePath = path.resolve(__dirname, '..', 'static', item.img)
                fs.unlink(filePath, (e) => {
                    if (e) {
                        console.log('Ошибка при удалении файла:', e)
                    } else {
                        console.log('Файл успешно удален')
                    }
                })
            }
            await item.destroy()
            if (images) {
                console.log(images)
                for (let i of images) {
                    const filePath = path.resolve(__dirname, '..', 'static', i.img)
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
            return res.json(item)
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async deleteMany(req, res, next) {
        const {idArr} = req.query
        const items = await Item.findAll({
            where: {
                id: {[Op.in]: idArr}
            }
        })
        for (let item of items) {
            try {
                if (item.img) {
                    const filePath = path.resolve(__dirname, '..', 'static', item.img)
                    fs.unlink(filePath, (e) => {
                        if (e) {
                            console.log('Ошибка при удалении файла:', e)
                        } else {
                            console.log('Файл успешно удален')
                        }
                    })
                }
                await item.destroy()
                const images = await Image.findAll({where: {item_id: item.id.toString()}})
                if (images) {
                    for (let i of images) {
                        const filePath = path.resolve(__dirname, '..', 'static', i.img)
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
            } catch (e) {
                console.log(e)
            }
        }
        return res.json('done')
    }
}

module.exports = new ItemController()