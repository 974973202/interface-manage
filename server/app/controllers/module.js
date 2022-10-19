const Module = require('../models/module')


class ModuleCtl {
    async find(ctx) {
        const { page = 0, size = 9999, moduleName } = ctx.query;
        const total = await Module.countDocuments()
        const data = await Module.find({
            moduleName: new RegExp(moduleName)
        }).limit(size).skip(page * size).sort({ '_id': -1 });
        ctx.body = {
            data,
            total,
        }
    }
    async findById(ctx) {
        ctx.body = await Module.findById(ctx.params.id);
    }
    async findByIdAndUpdate(ctx) {
        ctx.body = await Module.findByIdAndUpdate(ctx.params.id, ctx.request.body);
    }
    async create(ctx) {
        ctx.verifyParams({
            moduleName: { type: 'string', required: true },
        });
        const { moduleName } =  ctx.request.body;
        if(await Module.findOne({ moduleName })) ctx.throw(409, '模块已存在')
        ctx.body = await new Module(ctx.request.body).save();
    }
    async del(ctx) {
        ctx.body = await Module.findByIdAndRemove(ctx.params.id);
    }
}

module.exports = new ModuleCtl()