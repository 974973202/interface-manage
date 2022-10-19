const Interface = require('../models/interface');

class InterfaceCtl {
  async find(ctx) {
    const { page = 0, size = 9999, module, version } = ctx.query;
    const searchParams = {};
    if (module) searchParams.module = module;
    if (version) searchParams.version = version;
    const total = await Interface.countDocuments();
    const data = await Interface.find({ ...searchParams, size })
      .limit(size)
      .skip(page * size)
      .populate(['module', 'version']);
    ctx.body = {
      data,
      total,
    };
  }
  async findById(ctx) {
    ctx.body = await Interface.findById(ctx.params.id);
  }
  async findByIdAndUpdate(ctx) {
    ctx.body = await Interface.findByIdAndUpdate(
      ctx.params.id,
      ctx.request.body
    );
  }
  async create(ctx) {
    ctx.verifyParams({
      interfaceAddress: { type: 'string', required: true },
    });
    const { interfaceAddress } = ctx.request.body;
    if (await Interface.findOne({ interfaceAddress }))
      ctx.throw(409, '接口地址已存在');
    ctx.body = await new Interface(ctx.request.body).save();
  }
  async del(ctx) {
    ctx.body = await Interface.findByIdAndRemove(ctx.params.id);
  }
}

module.exports = new InterfaceCtl();
