const Rules = require('../models/rules')


class RulesCtl {
    async find(ctx) {
        const { page = 0, size = 9999 } = ctx.query;
        const total = await Rules.countDocuments()
        const data = await Rules.find().limit(size).skip(page * size).sort({ '_id': -1 });
        ctx.body = {
            data,
            total,
        }
    }
    async findById(ctx) {
        ctx.body = await Rules.findById(ctx.params.id);
    }
    async findByIdAndUpdate(ctx) {
        ctx.body = await Rules.findByIdAndUpdate(ctx.params.id, ctx.request.body);
    }
    async create(ctx) {
        ctx.verifyParams({
            ruleName: { type: 'string', required: true },
        });
        const { ruleName } =  ctx.request.body;
        if(await Rules.findOne({ ruleName })) ctx.throw(409, '规则库名已存在')
        ctx.body = await new Rules(ctx.request.body).save();
    }
    async del(ctx) {
        ctx.body = await Rules.findByIdAndRemove(ctx.params.id);
    }
}

module.exports = new RulesCtl()