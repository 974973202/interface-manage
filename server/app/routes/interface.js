const Router = require('koa-router');
const router  = new Router({
    prefix: '/api/interface'
});
const { find, findById, create,findByIdAndUpdate, del } = require('../controllers/interface');

router.get('/', find)
router.post('/', create)
router.get('/:id', findById)
router.put('/:id', findByIdAndUpdate)
router.delete('/:id', del)

module.exports = router