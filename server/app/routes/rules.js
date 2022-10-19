const Router = require('koa-router');
const router  = new Router({
    prefix: '/api'
});
const { find, findById, create,findByIdAndUpdate, del } = require('../controllers/rules');

router.get('/rules', find)
router.post('/rules', create)
router.get('/rules/:id', findById)
router.put('/rules/:id', findByIdAndUpdate)
router.delete('/rules/:id', del)

module.exports = router