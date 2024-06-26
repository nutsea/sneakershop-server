const { Item, Image } = require('../models/models')
const ApiError = require('../error/apiError')
const uuid = require('uuid')
const path = require('path')
const fs = require('fs')
const { Sequelize } = require('../db')
const { Op } = require('sequelize');
const e = require('cors')

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
                size_eu,
                size_ru,
                size_us,
                size_uk,
                size_sm,
                size_clo,
                category,
                model,
                color,
                tags,
                sub_category
            } = req.body
            let trueSale = sale && sale > 0 ? sale : null
            if (sale === 0) trueSale = null
            let trueSubCategory = sub_category && sub_category.length > 0 ? sub_category : null
            if (req.files && 'img' in req.files) {
                const { img } = req.files
                let fileName = uuid.v4() + ".jpg"
                img.mv(path.resolve(__dirname, '..', 'static', fileName))
                const item = await Item.create({
                    code,
                    brand,
                    name,
                    description,
                    price,
                    sale: trueSale,
                    count,
                    size_eu,
                    size_ru,
                    size_us,
                    size_uk,
                    size_sm,
                    size_clo,
                    category,
                    sub_category: trueSubCategory,
                    model,
                    color,
                    img: fileName,
                    tags
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
                        sale: trueSale,
                        count,
                        size_eu,
                        size_ru,
                        size_us,
                        size_uk,
                        size_sm,
                        size_clo,
                        category,
                        sub_category: trueSubCategory,
                        model,
                        color,
                        tags
                    })
                    return res.json(item)
                } else {
                    const item = await Item.create({
                        code,
                        brand,
                        name,
                        description,
                        price,
                        sale: trueSale,
                        count: 1,
                        size_eu,
                        size_ru,
                        size_us,
                        size_uk,
                        size_sm,
                        size_clo,
                        category,
                        sub_category: trueSubCategory,
                        model,
                        color,
                        tags
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
                size_eu,
                size_ru,
                size_us,
                size_uk,
                size_sm,
                size_clo,
                category,
                model,
                color,
                tags,
                sub_category
            } = req.body
            let trueSale = sale && sale > 0 ? sale : null
            if (sale === 0) trueSale = null
            let trueSubCategory = sub_category && sub_category.length > 0 ? sub_category : null
            const item = await Item.findOne({ where: { id } })
            if (code) item.code = code
            if (brand) item.brand = brand
            if (name) item.name = name
            if (description) item.description = description
            if (price) item.price = price
            if (sale) item.sale = trueSale
            if (size_eu) item.size_eu = size_eu
            if (size_ru) item.size_ru = size_ru
            if (size_us) item.size_us = size_us
            if (size_uk) item.size_uk = size_uk
            if (size_sm) item.size_sm = size_sm
            if (size_clo) item.size_clo = size_clo
            if (category) item.category = category
            if (sub_category) item.sub_category = trueSubCategory
            if (model) item.model = model
            if (color) item.color = color
            if (count) item.count = count
            else item.count = 1
            if (tags) item.tags = tags
            if (req.files && 'img' in req.files) {
                const { img } = req.files
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
            await item.save()
            return res.json(item)
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async createMany(req, res, next) {
        try {
            let {
                sizes_count,
                code,
                brand,
                name,
                description,
                prices,
                sales,
                counts,
                sizes_eu,
                sizes_ru,
                sizes_us,
                sizes_uk,
                sizes_sm,
                sizes_clo,
                category,
                model,
                color,
                tags,
                sub_category
            } = req.body

            prices = JSON.parse(prices)
            sales = JSON.parse(sales)
            counts = JSON.parse(counts)
            sizes_eu = JSON.parse(sizes_eu)
            sizes_ru = JSON.parse(sizes_ru)
            sizes_us = JSON.parse(sizes_us)
            sizes_uk = JSON.parse(sizes_uk)
            sizes_sm = JSON.parse(sizes_sm)
            sizes_clo = JSON.parse(sizes_clo)

            let fileName = null
            if (req.files && 'img' in req.files) {
                const { img } = req.files
                fileName = uuid.v4() + ".jpg"
                img.mv(path.resolve(__dirname, '..', 'static', fileName))
            }

            let items = []

            for (let i = 0; i < sizes_count; i++) {
                if (prices[i] && counts[i]) {
                    if ((category === 'shoes' && (sizes_eu[i] || sizes_ru[i] || sizes_us[i] || sizes_uk[i] || sizes_sm[i])) || (category !== 'shoes' && sizes_clo[i])) {
                        let trueSale = sales[i] && sales[i] > 0 ? sales[i] : null
                        if (sales[i] === 0) trueSale = null
                        let trueSubCategory = sub_category && sub_category.length > 0 ? sub_category : null
                        if (counts[i]) {
                            const item = await Item.create({
                                code,
                                brand,
                                name,
                                description,
                                price: prices[i],
                                sale: trueSale,
                                count: counts[i],
                                size_eu: sizes_eu[i] ? sizes_eu[i] : null,
                                size_ru: sizes_ru[i] ? sizes_ru[i] : null,
                                size_us: sizes_us[i] ? sizes_us[i] : null,
                                size_uk: sizes_uk[i] ? sizes_uk[i] : null,
                                size_sm: sizes_sm[i] ? sizes_sm[i] : null,
                                size_clo: sizes_clo[i] ? sizes_clo[i] : null,
                                category,
                                sub_category: trueSubCategory,
                                model,
                                color,
                                img: fileName,
                                tags
                            })
                            items.push(item)
                        } else {
                            const item = await Item.create({
                                code,
                                brand,
                                name,
                                description,
                                price: prices[i],
                                sale: trueSale,
                                count: 1,
                                size_eu: sizes_eu[i],
                                size_ru: sizes_ru[i],
                                size_us: sizes_us[i],
                                size_uk: sizes_uk[i],
                                size_sm: sizes_sm[i],
                                size_clo: sizes_clo[i],
                                category,
                                sub_category: trueSubCategory,
                                model,
                                color,
                                img: fileName,
                                tags
                            })
                            items.push(item)
                        }
                    }
                }
            }
            return res.json(items)
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async updateMany(req, res, next) {
        try {
            let {
                sizes_count,
                ids,
                code,
                brand,
                name,
                description,
                prices,
                sales,
                counts,
                sizes_eu,
                sizes_ru,
                sizes_us,
                sizes_uk,
                sizes_sm,
                sizes_clo,
                category,
                model,
                color,
                tags,
                sub_category
            } = req.body

            ids = JSON.parse(ids)
            prices = JSON.parse(prices)
            sales = JSON.parse(sales)
            counts = JSON.parse(counts)
            sizes_eu = JSON.parse(sizes_eu)
            sizes_ru = JSON.parse(sizes_ru)
            sizes_us = JSON.parse(sizes_us)
            sizes_uk = JSON.parse(sizes_uk)
            sizes_sm = JSON.parse(sizes_sm)
            sizes_clo = JSON.parse(sizes_clo)

            let fileName = null
            if (req.files && 'img' in req.files) {
                const { img } = req.files
                fileName = uuid.v4() + ".jpg"
                img.mv(path.resolve(__dirname, '..', 'static', fileName))
            }

            let items = []

            for (let i = 0; i < sizes_count; i++) {
                if (prices[i] && (counts[i] || counts[i] === 0)) {
                    if (((category === 'shoes' && (sizes_eu[i] || sizes_ru[i] || sizes_us[i] || sizes_uk[i] || sizes_sm[i]))) || (category !== 'shoes' && sizes_clo[i])) {
                        let trueSale = sales[i] && sales[i] > 0 ? sales[i] : null
                        if (sales[i] === 0) trueSale = null
                        let trueSubCategory = sub_category && sub_category.length > 0 ? sub_category : null
                        const item = await Item.findOne({ where: { id: ids[i] } })
                        if (code) item.code = code
                        if (brand) item.brand = brand
                        if (name) item.name = name
                        if (description) item.description = description
                        if (prices[i]) item.price = prices[i]
                        item.sale = trueSale
                        item.size_eu = sizes_eu[i]
                        item.size_ru = sizes_ru[i]
                        item.size_us = sizes_us[i]
                        item.size_uk = sizes_uk[i]
                        item.size_sm = sizes_sm[i]
                        item.size_clo = sizes_clo[i]
                        if (category) item.category = category
                        if (sub_category) item.sub_category = trueSubCategory
                        if (model) item.model = model
                        if (color) item.color = color
                        if (counts) item.count = counts[i]
                        else item.count = 1
                        if (tags) item.tags = tags
                        if (fileName) {
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
                        await item.save()
                        items.push(item)
                    }
                }
            }
            return res.json(items)
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async createSame(req, res, next) {
        try {
            let {
                sizes_count,
                add_sizes_count,
                code,
                brand,
                name,
                description,
                prices,
                sales,
                counts,
                sizes_eu,
                sizes_ru,
                sizes_us,
                sizes_uk,
                sizes_sm,
                sizes_clo,
                category,
                model,
                color,
                tags,
                sub_category,
                old_filename
            } = req.body

            prices = JSON.parse(prices)
            sales = JSON.parse(sales)
            counts = JSON.parse(counts)
            sizes_eu = JSON.parse(sizes_eu)
            sizes_ru = JSON.parse(sizes_ru)
            sizes_us = JSON.parse(sizes_us)
            sizes_uk = JSON.parse(sizes_uk)
            sizes_sm = JSON.parse(sizes_sm)
            sizes_clo = JSON.parse(sizes_clo)

            let fileName = null
            if (req.files && 'img' in req.files) {
                const { img } = req.files
                fileName = uuid.v4() + ".jpg"
                img.mv(path.resolve(__dirname, '..', 'static', fileName))
            }

            let items = []

            for (let i = sizes_count; i < sizes_count + add_sizes_count; i++) {
                if (prices[i] && counts[i]) {
                    if ((category === 'shoes' && (sizes_eu[i] || sizes_ru[i] || sizes_us[i] || sizes_uk[i] || sizes_sm[i])) || (category !== 'shoes' && sizes_clo[i])) {
                        let trueSale = sales[i] && sales[i] > 0 ? sales[i] : null
                        if (sales[i] === 0) trueSale = null
                        let trueSubCategory = sub_category && sub_category.length > 0 ? sub_category : null
                        if (counts[i]) {
                            const item = await Item.create({
                                code,
                                brand,
                                name,
                                description,
                                price: prices[i],
                                sale: trueSale,
                                count: counts[i],
                                size_eu: sizes_eu[i] ? sizes_eu[i] : null,
                                size_ru: sizes_ru[i] ? sizes_ru[i] : null,
                                size_us: sizes_us[i] ? sizes_us[i] : null,
                                size_uk: sizes_uk[i] ? sizes_uk[i] : null,
                                size_sm: sizes_sm[i] ? sizes_sm[i] : null,
                                size_clo: sizes_clo[i] ? sizes_clo[i] : null,
                                category,
                                sub_category: trueSubCategory,
                                model,
                                color,
                                img: !fileName ? old_filename : fileName,
                                tags
                            })
                            items.push(item)
                        } else {
                            const item = await Item.create({
                                code,
                                brand,
                                name,
                                description,
                                price: prices[i],
                                sale: trueSale,
                                count: 1,
                                size_eu: sizes_eu[i],
                                size_ru: sizes_ru[i],
                                size_us: sizes_us[i],
                                size_uk: sizes_uk[i],
                                size_sm: sizes_sm[i],
                                size_clo: sizes_clo[i],
                                category,
                                sub_category: trueSubCategory,
                                model,
                                color,
                                img: !fileName ? old_filename : fileName,
                                tags
                            })
                            items.push(item)
                        }
                    }
                }
            }
            return res.json(items)
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async buyItems(req, res, next) {
        try {
            const { id, count } = req.body
            const item = await Item.findOne({ where: { id } })
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
            const { id } = req.params
            const item = await Item.findOne({ where: { id } })
            return res.json(item)
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async getSame(req, res, next) {
        try {
            const { code } = req.query
            const items = await Item.findAll({ where: { code } })
            return res.json(items)
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async getCart(req, res, next) {
        try {
            const { idArr } = req.query
            let numbers = idArr.map(i => Number(i.id))
            const items = await Item.findAll({
                where: {
                    id: { [Op.in]: numbers }
                }
            })
            return res.json(items)
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async getThreeSearched(req, res, next) {
        try {
            const { search } = req.query
            const searchWord = search.toLowerCase()
            if (search.length > 0) {
                let itemsCodes = await Item.findAll({
                    where: {
                        [Op.and]: [
                            {
                                [Op.or]: [
                                    {
                                        code: { [Op.iLike]: `%${searchWord}%` }
                                    },
                                    {
                                        name: { [Op.iLike]: `%${searchWord}%` }
                                    },
                                    {
                                        brand: { [Op.iLike]: `%${searchWord}%` }
                                    },
                                    {
                                        description: { [Op.iLike]: `%${searchWord}%` }
                                    },
                                    {
                                        tags: { [Op.iLike]: `%${searchWord}%` }
                                    }
                                ]
                            }

                        ]
                    },
                    attributes: ['code'],
                    group: ['code'],
                    limit: 3
                })
                let items = []
                for (let i of itemsCodes) {
                    let item = await Item.findOne({ where: { code: i.code } })
                    items.push(item)
                }
                for (let i of items) {
                    const same = await Item.findAll({ where: { code: i.code } })
                    let min = i.sale ? i.sale : i.price
                    for (let j of same) {
                        if (j.count > 0) {
                            if (j.sale && j.sale < min) {
                                min = j.sale
                            } else {
                                if (j.price < min) {
                                    min = j.price
                                }
                            }
                        }
                    }
                    i.price = min
                    i.sale = min
                }
                return res.json(items)
            } else {
                return res.json([])
            }
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async getAllAdmin(req, res, next) {
        try {
            const items = await Item.findAll()
            return res.json(items)
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async getNews(req, res, next) {
        try {
            const items = await Item.findAndCountAll({
                attributes: [
                    'code',
                    [Sequelize.fn('array_agg', Sequelize.col('count')), 'counts'],
                    [Sequelize.fn('array_agg', Sequelize.col('brand')), 'brand'],
                    [Sequelize.fn('array_agg', Sequelize.col('model')), 'model'],
                    [Sequelize.fn('array_agg', Sequelize.col('color')), 'color'],
                    [Sequelize.fn('array_agg', Sequelize.col('size_eu')), 'size_eu'],
                    [Sequelize.fn('array_agg', Sequelize.col('size_ru')), 'size_ru'],
                    [Sequelize.fn('array_agg', Sequelize.col('size_us')), 'size_us'],
                    [Sequelize.fn('array_agg', Sequelize.col('size_uk')), 'size_uk'],
                    [Sequelize.fn('array_agg', Sequelize.col('size_sm')), 'size_sm'],
                    [Sequelize.fn('array_agg', Sequelize.col('size_clo')), 'size_clo'],
                    [Sequelize.fn('array_agg', Sequelize.col('price')), 'price'],
                    [Sequelize.fn('array_agg', Sequelize.col('sale')), 'sale'],
                    [Sequelize.fn('array_agg', Sequelize.col('category')), 'category'],
                    [Sequelize.fn('array_agg', Sequelize.col('img')), 'img'],
                    [Sequelize.fn('array_agg', Sequelize.col('name')), 'name'],
                    [Sequelize.fn('array_agg', Sequelize.col('description')), 'description'],
                    [Sequelize.fn('array_agg', Sequelize.col('id')), 'id'],
                    [Sequelize.fn('array_agg', Sequelize.col('createdAt')), 'createdAt']
                ],
                order: [
                    ['createdAt', 'DESC']
                ],
                limit: 10,
                group: ['code', 'name']
            })
            let newItems = {
                count: items.count.length,
                rows: items.rows
            }
            return res.json(newItems)
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async getAll(req, res, next) {
        try {
            let { category, brands, models, colors, sizes_eu, sizes_ru, sizes_us, sizes_uk, sizes_sm, sizes_clo, priceMin, priceMax, sort, limit, page, in_stock, isModelsSet, isShoesSet, isClothesSet, search, sale, subcats } = req.query
            let categoriesArr = []
            if (category === undefined || category === 'all') {
                categoriesArr = ['shoes', 'clothes', 'accessories']
            } else {
                categoriesArr.push(category)
            }
            let count
            if (in_stock == 'true') count = { [Op.gt]: 0 }
            else count = { [Op.gte]: 0 }
            let order = []
            if (sort === 'priceup') {
                order.push(['price', 'ASC'])
            } else if (sort === 'pricedown') {
                order.push(['price', 'DESC'])
            } else if (sort === 'newup') {
                order.push(['createdAt', 'ASC'])
            } else if (sort === 'newdown') {
                order.push(['createdAt', 'DESC'])
            } else {
                order.push(['name', 'ASC'])
            }
            let subcatsNum = null
            if (Array.isArray(subcats)) subcatsNum = subcats.map(item => item.toString())
            if (subcatsNum && subcatsNum.length === 0) subcatsNum = null
            if (subcatsNum.includes('1')) subcatsNum = null
            page = page || 1
            limit = limit || 18
            let offset = page * limit - limit
            let searchWord = search && search !== 'all' ? search.toLowerCase() : ''
            const items = await Item.findAndCountAll({
                attributes: [
                    'code',
                    [Sequelize.fn('array_agg', Sequelize.col('count')), 'counts'],
                    [Sequelize.fn('array_agg', Sequelize.col('brand')), 'brand'],
                    [Sequelize.fn('array_agg', Sequelize.col('model')), 'model'],
                    [Sequelize.fn('array_agg', Sequelize.col('color')), 'color'],
                    [Sequelize.fn('array_agg', Sequelize.col('size_eu')), 'size_eu'],
                    [Sequelize.fn('array_agg', Sequelize.col('size_ru')), 'size_ru'],
                    [Sequelize.fn('array_agg', Sequelize.col('size_us')), 'size_us'],
                    [Sequelize.fn('array_agg', Sequelize.col('size_uk')), 'size_uk'],
                    [Sequelize.fn('array_agg', Sequelize.col('size_sm')), 'size_sm'],
                    [Sequelize.fn('array_agg', Sequelize.col('size_clo')), 'size_clo'],
                    [Sequelize.fn('array_agg', Sequelize.col('price')), 'price'],
                    [Sequelize.fn('array_agg', Sequelize.col('sale')), 'sale'],
                    [Sequelize.fn('array_agg', Sequelize.col('category')), 'category'],
                    [Sequelize.fn('array_agg', Sequelize.col('img')), 'img'],
                    [Sequelize.fn('array_agg', Sequelize.col('name')), 'name'],
                    [Sequelize.fn('array_agg', Sequelize.col('description')), 'description'],
                    [Sequelize.fn('array_agg', Sequelize.col('id')), 'id'],
                    [Sequelize.fn('array_agg', Sequelize.col('createdAt')), 'createdAt']
                ],
                where: {
                    [Op.and]: [
                        {
                            [Op.or]: [
                                {
                                    code: { [Op.iLike]: `%${searchWord}%` }
                                },
                                {
                                    name: { [Op.iLike]: `%${searchWord}%` }
                                },
                                {
                                    brand: { [Op.iLike]: `%${searchWord}%` }
                                },
                                {
                                    description: { [Op.iLike]: `%${searchWord}%` }
                                },
                                {
                                    tags: { [Op.iLike]: `%${searchWord}%` }
                                }
                            ]
                        },
                        {
                            brand: { [Op.in]: brands.map(item => item.brand) },
                            price: {
                                [Op.and]: [
                                    { [Op.gt]: Number(priceMin) - 1 },
                                    { [Op.lt]: Number(priceMax) + 1 }
                                ]
                            },
                            ...(isShoesSet === 'true' && sizes_eu && {
                                size_eu: { [Op.in]: sizes_eu.map(item => item.size_eu) },
                            }),
                            ...(isShoesSet === 'true' && sizes_ru && {
                                size_ru: { [Op.in]: sizes_ru.map(item => item.size_ru) },
                            }),
                            ...(isShoesSet === 'true' && sizes_us && {
                                size_us: { [Op.in]: sizes_us.map(item => item.size_us) },
                            }),
                            ...(isShoesSet === 'true' && sizes_uk && {
                                size_uk: { [Op.in]: sizes_uk.map(item => item.size_uk) },
                            }),
                            ...(isShoesSet === 'true' && sizes_sm && {
                                size_sm: { [Op.in]: sizes_sm.map(item => item.size_sm) },
                            }),
                            ...(isClothesSet === 'true' && sizes_clo && {
                                size_clo: { [Op.in]: sizes_clo.map(item => item.size_clo) },
                            }),
                            ...(isModelsSet === 'true' && {
                                model: { [Op.in]: models.map(item => item.model) },
                            }),
                            category: { [Op.in]: categoriesArr },
                            [Op.or]: [
                                {
                                    category: 'shoes',
                                },
                                {
                                    category: 'clothes',
                                },
                                {
                                    category: 'accessories'
                                },
                                {
                                    category: 'all',
                                }
                            ],
                            color: {
                                [Op.or]: colors.map(i => ({
                                    [Op.like]: `%${i.color}%`
                                }))
                            },
                            count: count,
                            ...(sale === 'sale' && {
                                sale: { [Op.not]: null },
                                sale: { [Op.not]: 0 }
                            }),
                            ...(subcatsNum && {
                                sub_category: { [Op.in]: subcatsNum }
                            })
                        }
                    ]
                },
                order: order,
                group: ['code', 'name'],
                limit,
                offset
            })
            let newItems = {
                count: items.count.length,
                rows: items.rows
            }
            return res.json(newItems)
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async getAllShoes(req, res, next) {
        try {
            let { brands, models, colors, sizes_eu, sizes_ru, sizes_us, sizes_uk, sizes_sm, priceMin, priceMax, sort, limit, page, in_stock } = req.query
            let count
            if (in_stock) count = { [Op.gt]: 0 }
            else count = { [Op.gte]: 0 }
            let order = []
            if (sort === 'priceup') {
                order.push(['price', 'ASC'])
            } else if (sort === 'pricedown') {
                order.push(['price', 'DESC'])
            } else if (sort === 'newup') {
                order.push(['createdAt', 'ASC'])
            } else if (sort === 'newdown') {
                order.push(['createdAt', 'DESC'])
            } else {
                order.push(['name', 'ASC'])
            }
            page = page || 1
            limit = limit || 18
            let offset = page * limit - limit
            const items = await Item.findAll({
                attributes: [
                    'code',
                    [Sequelize.fn('count', Sequelize.literal('1')), 'count'],
                    [Sequelize.fn('array_agg', Sequelize.col('brand')), 'brand'],
                    [Sequelize.fn('array_agg', Sequelize.col('model')), 'model'],
                    [Sequelize.fn('array_agg', Sequelize.col('color')), 'color'],
                    [Sequelize.fn('array_agg', Sequelize.col('size_eu')), 'size_eu'],
                    [Sequelize.fn('array_agg', Sequelize.col('size_ru')), 'size_ru'],
                    [Sequelize.fn('array_agg', Sequelize.col('size_us')), 'size_us'],
                    [Sequelize.fn('array_agg', Sequelize.col('size_uk')), 'size_uk'],
                    [Sequelize.fn('array_agg', Sequelize.col('size_sm')), 'size_sm'],
                    [Sequelize.fn('array_agg', Sequelize.col('size_clo')), 'size_clo'],
                    [Sequelize.fn('array_agg', Sequelize.col('price')), 'price'],
                    [Sequelize.fn('array_agg', Sequelize.col('sale')), 'sale'],
                    [Sequelize.fn('array_agg', Sequelize.col('category')), 'category'],
                    [Sequelize.fn('array_agg', Sequelize.col('img')), 'img'],
                    [Sequelize.fn('array_agg', Sequelize.col('name')), 'name'],
                    [Sequelize.fn('array_agg', Sequelize.col('description')), 'description'],
                    [Sequelize.fn('array_agg', Sequelize.col('id')), 'id'],
                    [Sequelize.fn('array_agg', Sequelize.col('createdAt')), 'createdAt']
                ],
                where: {
                    brand: { [Op.in]: brands.map(item => item.brand) },
                    price: {
                        [Op.and]: [
                            { [Op.gt]: Number(priceMin) - 1 },
                            { [Op.lt]: Number(priceMax) + 1 }
                        ]
                    },
                    model: { [Op.in]: models.map(item => item.model) },
                    color: { [Op.in]: colors.map(item => item.color) },
                    size_eu: { [Op.in]: sizes_eu.map(item => item.size_eu) },
                    size_ru: { [Op.in]: sizes_ru.map(item => item.size_ru) },
                    size_us: { [Op.in]: sizes_us.map(item => item.size_us) },
                    size_uk: { [Op.in]: sizes_uk.map(item => item.size_uk) },
                    size_sm: { [Op.in]: sizes_sm.map(item => item.size_sm) },
                },
                order: order,
                group: ['code', 'name'],
                count,
                limit,
                offset
            })
            let newItems = {
                count: items.length,
                rows: items
            }
            return res.json(newItems)

        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async getCombs(req, res, next) {
        try {
            const { code } = req.query
            const items = await Item.findAll({ where: { code } })
            let combs = []
            items.forEach((item, i) => {
                let thisSize = item.size
                let thisSizeType = item.size_type
                let thisPrice = item.price
                let thisCount = item.count
                combs.push({ thisSize, thisSizeType, thisPrice, thisCount })
            })
            return res.json(combs)
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async getAllBrands(req, res, next) {
        try {
            const brands = await Item.findAll({
                attributes: [
                    [Sequelize.fn('DISTINCT', Sequelize.col('brand')), 'brand']
                ]
            })
            return res.json(brands)
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async getBrands(req, res, next) {
        try {
            const { category } = req.query
            if (category) {
                let brands = await Item.findAll({
                    attributes: [
                        [Sequelize.fn('DISTINCT', Sequelize.col('brand')), 'brand']
                    ],
                    where: { category }
                })
                brands = brands.filter(item => item.brand !== 'null')
                brands = brands.filter(item => item.brand.length > 0)
                return res.json(brands)
            } else {
                let brands = await Item.findAll({
                    attributes: [
                        [Sequelize.fn('DISTINCT', Sequelize.col('brand')), 'brand']
                    ]
                })
                brands = brands.filter(item => item.brand !== 'null')
                brands = brands.filter(item => item.brand.length > 0)
                return res.json(brands)
            }
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async getModels(req, res, next) {
        try {
            let models = await Item.findAll({
                attributes: [
                    [Sequelize.fn('DISTINCT', Sequelize.col('model')), 'model']
                ],
            })
            models = models.filter(item => item.model !== 'null')
            models = models.filter(item => item.model.length > 0)
            return res.json(models)
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async getSizes(req, res, next) {
        try {
            let sizesEu = await Item.findAll({
                attributes: [
                    [Sequelize.fn('DISTINCT', Sequelize.col('size_eu')), 'size_eu']
                ]
            })
            sizesEu = sizesEu.filter(item => item.size_eu !== 'null')
            let sizesRu = await Item.findAll({
                attributes: [
                    [Sequelize.fn('DISTINCT', Sequelize.col('size_ru')), 'size_ru']
                ]
            })
            sizesRu = sizesRu.filter(item => item.size_ru !== 'null')
            let sizesUs = await Item.findAll({
                attributes: [
                    [Sequelize.fn('DISTINCT', Sequelize.col('size_us')), 'size_us']
                ]
            })
            sizesUs = sizesUs.filter(item => item.size_us !== 'null')
            let sizesUk = await Item.findAll({
                attributes: [
                    [Sequelize.fn('DISTINCT', Sequelize.col('size_uk')), 'size_uk']
                ]
            })
            sizesUk = sizesUk.filter(item => item.size_uk !== 'null')
            let sizesSm = await Item.findAll({
                attributes: [
                    [Sequelize.fn('DISTINCT', Sequelize.col('size_sm')), 'size_sm']
                ]
            })
            sizesSm = sizesSm.filter(item => item.size_sm !== 'null')
            let sizesClo = await Item.findAll({
                attributes: [
                    [Sequelize.fn('DISTINCT', Sequelize.col('size_clo')), 'size_clo']
                ]
            })
            sizesClo = sizesClo.filter(item => item.size_clo !== 'null')
            for (let i of sizesClo) {
            }
            sizesClo = sizesClo.filter(item => item.size_clo && item.size_clo.length > 0)
            let sizes = {
                sizesEu,
                sizesRu,
                sizesUs,
                sizesUk,
                sizesSm,
                sizesClo
            }
            return res.json(sizes)
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async getColors(req, res, next) {
        try {
            const { category } = req.query
            if (category) {
                const colors = await Item.findAll({
                    attributes: [
                        [Sequelize.fn('DISTINCT', Sequelize.col('color')), 'color']
                    ],
                    where: { category }
                })
                return res.json(colors)
            } else {
                const colors = await Item.findAll({
                    attributes: [
                        [Sequelize.fn('DISTINCT', Sequelize.col('color')), 'color']
                    ]
                })
                return res.json(colors)
            }
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async getMin(req, res, next) {
        try {
            const { category } = req.query
            const min = await Item.findOne({
                attributes: [[Sequelize.fn('MIN', Sequelize.col('price')), 'minValue']],
                where: { category }
            })
            return res.json(min)
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async getMax(req, res, next) {
        try {
            const { category } = req.query
            const max = await Item.findOne({
                attributes: [[Sequelize.fn('MAX', Sequelize.col('price')), 'minValue']],
                where: { category }
            })
            return res.json(max)
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async getRndCategory(req, res, next) {
        try {
            const { category } = req.query
            const items = await Item.findAll({
                where: { category },
                attributes: [
                    [Sequelize.fn('DISTINCT', Sequelize.col('code')), 'code']
                ]
            })
            let randomItems = [];
            if (items.length >= 4) {
                for (let i = 0; i < 4; i++) {
                    let randomIndex = Math.floor(Math.random() * items.length)
                    while (randomItems.includes(items[randomIndex])) {
                        randomIndex = Math.floor(Math.random() * items.length)
                    }
                    randomItems.push(items[randomIndex])
                }
            } else {
                randomItems = items
            }
            let finalItems = []
            for (let i of randomItems) {
                const sameItems = await Item.findAll({ where: { code: i.code } })
                if (sameItems.length > 0) {
                    const minimalItem = sameItems.reduce((min, current) => {
                        if (current.count > 0 && (min.count === undefined || current.price < min.price)) {
                            return current
                        } else {
                            return min
                        }
                    })
                    finalItems.push(minimalItem)
                }
            }
            return res.json(finalItems)
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async delete(req, res, next) {
        const { id } = req.query
        const item = await Item.findOne({ where: { id } })
        const same_items = await Item.findAll({ where: { code: item.code } })
        const images = await Image.findAll({ where: { item_id: id.toString() } })
        try {
            if (item.img && same_items.length <= 1) {
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
            if (images && same_items.length <= 1) {
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
        const { idArr } = req.query
        const items = await Item.findAll({
            where: {
                id: { [Op.in]: idArr }
            }
        })
        const same_items = await Item.findAll({ where: { code: items[0].code } })
        for (let item of items) {
            try {
                if (item.img && items.length === same_items.length) {
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
                const images = await Image.findAll({ where: { item_id: item.id.toString() } })
                if (images && items.length === same_items.length) {
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