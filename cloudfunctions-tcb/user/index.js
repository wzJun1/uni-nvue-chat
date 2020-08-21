'use strict';
const TcbRouter = require('tcb-router')
const db = uniCloud.database()
const uniID = require('uni-id')
exports.main = async (event, context) => {
	const app = new TcbRouter({
		event
	});
	const users_collection = db.collection('uni-id-users');
	
	
	const user_chat_friends_collection = db.collection('uni-chat-friends');
	const user_chat_detail_collection = db.collection('uni-chat-detail');
	const user_chat_group_collection = db.collection('uni-chat-group');
	const user_chat_group_users_collection = db.collection('uni-chat-group-users');
	const user_chat_group_detail_collection = db.collection('uni-chat-group-detail');
	const user_chat_group_detail_ids_collection = db.collection('uni-chat-group-detail-ids');
	
	
	
	const dbCmd = db.command;
	
	const auth = {"code":1 , "msg":"登录失效，请重新登录"};
	if(event.token){
		 const payload = await uniID.checkToken(event.token)
		 console.log(payload)
		 if(payload.code === 0){
			 auth.code = 0;
			 auth.msg = "登录验证成功";
		 }else{
			 return payload;
		 }
	}else{
		return auth;
	}
	app.use(async (ctx, next) => {
		 await next();
	});
	
	/*添加好友*/
	app.router('addFriend', async (ctx, next) => {
		try {
			let uParam = {
				user_id: event.data.user_id,
				friend_id: event.data.friend_id
			};
			let uGet = await user_chat_friends_collection.limit(1).where(uParam).get();
			if(!uGet.data[0]){
				await user_chat_friends_collection.add(uParam);
			}
			let fParam = {
				user_id: event.data.friend_id,
				friend_id: event.data.user_id
			};
			let fGet = await user_chat_friends_collection.limit(1).where(fParam).get();
			if(!fGet.data[0]){
				await user_chat_friends_collection.add(fParam);
			}
			ctx.body = {
				success: true,
				data:{
					uGet,
					fGet
				}
			}
		} catch (e) {
			ctx.body = {
				success: false,
				error: e
			}
		}
		await next();
	});
	/* 设置好友备注 */
	app.router('updateFriendPetName', async (ctx, next) => {
	
		let uParam = {
			user_id: event.data.user_id,
			friend_id: event.data.friend_id,
		};
		let uGet = await user_chat_friends_collection.limit(1).where(uParam).get();
		if(uGet.data[0]){
			ctx.body = await user_chat_friends_collection.where(uParam).update({
				pet_name: event.data.pet_name
			});
		}else{
			ctx.body = {
				code:1,
				msg:'设置失败'
			}
		}
		await next();
	});
	
	/*删除好友，双向删除*/
	app.router('deleteFriend', async (ctx, next) => {
		let uParam = {
			user_id: event.data.user_id,
			friend_id: event.data.friend_id,
		};
		let fParam = {
			user_id: event.data.friend_id,
			friend_id: event.data.user_id
		};
		
		await user_chat_friends_collection.where(uParam).remove();
		await user_chat_friends_collection.where(fParam).remove();
		
		await next();
	});

	/*获取用户的所有好友id*/
	app.router('getFriendIds', async (ctx, next) => {

		let field = (event.data.field != undefined) ? event.data.field : {};
		ctx.body = await user_chat_friends_collection.field(field).where({
			user_id: dbCmd.in(event.data.ids)
		}).get();
		await next();
	});
	
	/*获取用户所有的好友*/
	app.router('getFriendListByIds', async (ctx, next) => {
		//ctx.body = await uniID.login(event.data)
		ctx.body = await users_collection.field({
			'_id': true,
			'nickname': true,
			'username': true,
			'avatar': true,
		}).where({
			_id: dbCmd.in(event.data.ids)
		}).get();
		await next();
	});
	
	/*获取用户所有的群组*/
	app.router('getGroups', async (ctx, next) => {
		 
		var result = await user_chat_group_users_collection.field({
			'group_id': true
		}).where({
			user_id: event.data.id
		}).get();
		var groupIds = [];
		if(result.data[0]){
			result.data.forEach((item,index)=>{
				groupIds.push(item.group_id)
			})
		}
		if(groupIds){
			ctx.body = await user_chat_group_collection.where({
				_id: dbCmd.in(groupIds)
			}).get();
		}else{
			ctx.body = null;
		}
		
		await next();
	});
	
	/*通过username获取用户*/
	app.router('getByUserName', async (ctx, next) => {
		//ctx.body = await collection.limit(10).get();
		ctx.body = await users_collection.limit(1).where({
			username: event.data.username
		}).get()
		await next();
	});

	/*通过id获取用户*/
	app.router('getUserByUid', async (ctx, next) => {
		//ctx.body = await collection.limit(10).get();
		 
		ctx.body = await users_collection.limit(1).where({
			_id: event.data.uid
		}).get()

		await next(); 
	});
	
	/*修改用户资料*/
	app.router('updateUserById', async (ctx, next) => {
		ctx.body = await uniID.updateUser(event.data)
		await next();
	});
	
	/*修改用户密码*/
	app.router('updateUserPass', async (ctx, next) => {
		ctx.body = await uniID.updatePwd(event.data);
		await next();
	});
	
	app.router('getGroupById', async (ctx, next) => {
		//ctx.body = await collection.limit(10).get();
		ctx.body = await user_chat_group_collection.limit(1).where({
			_id: event.data.id
		}).get()
		await next();
	});

	/*写入聊天记录*/
	app.router('addChatDetail', async (ctx, next) => {
		ctx.body = await user_chat_detail_collection.add(event.data);
		await next();
	});
	
	app.router('addChatGroupDetail', async (ctx, next) => {
		ctx.body = await user_chat_group_detail_collection.add(event.data);
		await next();
	});
	
	app.router('addChatGroupDetailIds', async (ctx, next) => {
		ctx.body = await user_chat_group_detail_ids_collection.add(event.data);
		await next();
	});
	 
	/*更新聊天记录发送状态*/
	app.router('updateChatDetailStatus', async (ctx, next) => {
		ctx.body = await user_chat_detail_collection.doc(event.data.messageId).update({
			sendStatus: event.data.sendStatus
		});
		await next();
	});
	app.router('updateChatGroupDetailStatus', async (ctx, next) => {
		ctx.body = await user_chat_group_detail_ids_collection.where({
			messageId: dbCmd.eq(event.data.messageId),
			userId: dbCmd.in(event.data.onlineUserId)
			}).update({
			sendStatus: event.data.sendStatus
		});
		await next();
	});
	
	app.router('getNoReadHistory', async (ctx, next) => {
		ctx.body = await user_chat_detail_collection.where({
			to_uid: event.data.uid,
			sendStatus: 'pending'
		}).orderBy("create_time", "asc").get()
		await next();
	});
	
	app.router('getNoReadGroupHistory', async (ctx, next) => {
		var ids = await user_chat_group_detail_ids_collection.field({ 'messageId': true }).where({
			userId: event.data.uid,
			sendStatus: 'pending'
		}).orderBy("create_time", "asc").get();
		var noReadIds = [];
		if(ids.data[0]){
			ids.data.forEach((item,index)=>{
				noReadIds.push(item.messageId)
			}) 
		}
		if(noReadIds){
			ctx.body = await user_chat_group_detail_collection.where({
				_id: dbCmd.in(noReadIds)
			}).orderBy("create_time", "asc").get();
		}else{
			ctx.body = null;
		}
		await next();
		
	});
	
	app.router('updateNoReadHistory', async (ctx, next) => {
		let res = await user_chat_detail_collection.where({
			_id: dbCmd.in(event.data.ids)
		}).update({
			sendStatus: 'success'
		})
		await next();
	});
	
	app.router('updateNoReadGroupHistory', async (ctx, next) => {
		let res = await user_chat_group_detail_ids_collection.where({
			messageId: dbCmd.in(event.data.ids)
		}).update({
			sendStatus: 'success'
		})
		await next();
	});
	 
	app.router('addChatGroup', async (ctx, next) => {
		ctx.body = await user_chat_group_collection.add(event.data);
		 
		await next();
	});
	
	app.router('addChatGroupUsers', async (ctx, next) => {
		let isExist = await user_chat_group_users_collection.limit(1).where({
				group_id: event.data.group_id,
				user_id:event.data.user_id
			}).get();
		 
		if(!isExist.data[0]){
			ctx.body = await user_chat_group_users_collection.add(event.data);
		}
		 
		await next();
	});
	
	return app.serve();

};
