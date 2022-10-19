const Koa = require('koa');
const koaBody = require('koa-body');
const error = require('koa-json-error');
const parameter = require('koa-parameter');
const koaStatic = require('koa-static');
const routers = require('./routes');

const path = require('path');
const app = new Koa();

const mongoose = require('mongoose');
const { connectionStr } = require('./config');

mongoose.connect(
  connectionStr,
  {
    useNewUrlParser: true,
    authSource: 'admin',
  },
  () => console.log('mongoose connect success')
);
mongoose.connection.on('error', console.error);

// app.use(async (ctx, next) => {
//     try {
//         await next()
//     } catch(error) {
//         ctx = {
//             status: error.status || error.statusCode || 500,
//             body: {
//                 message: error.message
//             }
//         }
//     }
// })
app.use(koaStatic(path.join(__dirname, 'public')));
app.use(
  error({
    postFormat: (error, { stack, ...rest }) =>
      process.env.NODE_ENV === 'production' ? rest : { stack, ...rest },
  })
);

app.use(
  koaBody({
    multipart: true,
    formidable: {
      uploadDir: path.join(__dirname, '/public/uploads'),
      keepExtensions: true,
    },
  })
);
app.use(parameter(app));
routers(app);
app.listen(4399, () => console.log('启动'));
