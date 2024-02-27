const Router = require('express')
const router = new Router()
const itemController = require('../controllers/ItemController')

router.post('/', itemController.create)
router.post('/update', itemController.update)
router.post('/buy', itemController.buyItems)
router.get('/one/:id', itemController.getOne)
router.get('/same', itemController.getSame)
router.get('/cart', itemController.getCart)
router.get('/search', itemController.getThreeSearched)
router.get('/all', itemController.getAll)
router.get('/allshoes', itemController.getAllShoes)
router.get('/combs', itemController.getCombs)
router.get('/allbrands', itemController.getAllBrands)
router.get('/brands', itemController.getBrands)
router.get('/models', itemController.getModels)
router.get('/sizes', itemController.getSizes)
router.get('/colors', itemController.getColors)
router.get('/min', itemController.getMin)
router.get('/max', itemController.getMax)
router.get('/rndcategory', itemController.getRndCategory)
router.delete('/', itemController.delete)
router.delete('/many', itemController.deleteMany)

module.exports = router