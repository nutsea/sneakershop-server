const Router = require('express')
const router = new Router()
const imageController = require('../controllers/ImageController')

router.post('/', imageController.create)
router.get('/', imageController.getAll)
router.delete('/', imageController.delete)

module.exports = router