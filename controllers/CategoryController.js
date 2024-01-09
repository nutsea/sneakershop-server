const { Category } = require('../models/models')
const ApiError = require('../error/ApiError')

class CategoryController {
    async create(req, res, next) {
        try {
            const {name} = req.body
            const category = await Category.create(name)
            return res.json(category)
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async update(req, res, next) {
        try {
            const {id, name} = req.query
            const category = await Category.findOne({where: {id}})
            category.name = name
            await category.save()
            return res.json(category)
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async delete(req, res, next) {
        try {
            const {id} = req.query
            const category = await Category.findOne({where: {id}})
            await category.destroy()
            return res.json(category)
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new CategoryController()