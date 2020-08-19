'use strict';
const TcbRouter = require('tcb-router')
const db = uniCloud.database()
const uniID = require('uni-id')
exports.main = async (event, context) => {
	const app = new TcbRouter({
		event
	});
	app.use(async (ctx, next) => {
		ctx.data = {};
		await next();
	});
 
	/*用户注册*/
	app.router('regist', async (ctx, next) => {
		ctx.body = await uniID.register(event.data)
		await next();
	});
	/*用户登录*/
	app.router('login', async (ctx, next) => {
		ctx.body = await uniID.login(event.data)
		await next();
	});
	/*用户退出*/
	app.router('logout', async (ctx, next) => {
		ctx.body = await uniID.logout(event.data.token)
		await next();
	});
	

	return app.serve();

};
