const Router = require('express')
const router = new Router()
const itemRouter = require('./ItemRouter')
const imageRouter = require('./ImageRouter')
const categoryRouter = require('./CategoryRouter')

router.use('/item', itemRouter)
router.use('/image', imageRouter)
router.use('/category', categoryRouter)

module.exports = router