const Router = require('express')
const router = new Router()
const categoryController = require('../controllers/CategoryController')

router.post('/', categoryController.create)
router.post('/update', categoryController.update)
router.delete('/', categoryController.delete)

module.exports = router