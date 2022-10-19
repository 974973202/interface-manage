const Version = require('../models/version');

class VersionCtl {
  index(ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: true },
    });
    ctx.body = '123';
  }
  async find(ctx) {
    const { page = 0, size = 9999 } = ctx.query;
    const total = await Version.countDocuments();
    const data = await Version.find()
      .limit(size)
      .skip(page * size)
      .sort({ _id: -1 })
      .populate('module');
    ctx.body = {
      data,
      total,
    };
  }
  async findById(ctx) {
    ctx.body = await Version.findById(ctx.params.id).populate('module');
  }
  async findByIdAndUpdate(ctx) {
    ctx.body = await Version.findByIdAndUpdate(ctx.params.id, ctx.request.body);
  }
  async create(ctx) {
    ctx.verifyParams({
      version: { type: 'string', required: true },
    });
    const { version } = ctx.request.body;
    if (await Version.findOne({ version })) ctx.throw(409, '版本已存在');
    ctx.body = await new Version(ctx.request.body).save();
  }
  async del(ctx) {
    ctx.body = await Version.findByIdAndRemove(ctx.params.id);
  }
}

module.exports = new VersionCtl();
