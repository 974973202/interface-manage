const Router = require('koa-router');
const router = new Router({
  prefix: '/api',
});
const {
  index,
  find,
  findById,
  create,
  findByIdAndUpdate,
  del,
} = require('../controllers/version');

// const jwt = require('koa-jwt');
// const auth  = jwt({ secret: 'lzx' })

const auth = async (ctx, next) => {
  // 认证
  const { authorization } = ctx.require.header;
  const token = authorization.replace('Bearer ', '');
  try {
    const user = jsonwebtoken.verify(token, secret);
    ctx.state.user = user;
  } catch (error) {
    ctx.throw(401, error.message);
  }
  await next();
};

const checkOwner = async (ctx, next) => {
  // 授权
  if (ctx.params.id !== ctx.state.user._id) ctx.throw(403);
  await next();
};

// router.get('/', auth, checkOwner, index)
router.get('/version', find);
router.post('/version', create);
router.get('/version/:id', findById);
router.put('/version/:id', findByIdAndUpdate);
router.delete('/version/:id', del);

module.exports = router;
