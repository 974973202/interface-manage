const Router = require('koa-router');
const router  = new Router({
    prefix: '/api'
});
const { find, findById, create,findByIdAndUpdate, del } = require('../controllers/module');

router.get('/module', find)
router.post('/module', create)
router.get('/module/:id', findById)
router.put('/module/:id', findByIdAndUpdate)
router.delete('/module/:id', del)

module.exports = router