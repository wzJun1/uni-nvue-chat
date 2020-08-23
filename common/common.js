import $store from '@/store/index.js';
class common {
	constructor(arg) {
		this.timer = null
		this.url = arg.url
		this.isOnline = false
		this.socket = null
		this.reconnectTime = 0
		this.isOpenReconnect = true
		this.loadFinish = false;
		// 获取当前用户相关信息
		let user = uni.getStorageSync('user')
		this.user_token = uni.getStorageSync('token')
		this.user = user ? user : {},
		// 初始化聊天对象
		this.TO = false;
		// 连接和监听
		if (this.user) {
			this.connectSocket()
		}
	}
	// 断线重连
	reconnect() {
		console.log(this.isOnline)
		console.log("进入reconnect准备重新链接")
		if (this.isOnline) {
			return
		}
		if (this.reconnectTime >= 3) {
			return this.reconnectConfirm()
		}
		this.reconnectTime += 1
		console.log("重新链接")
		this.connectSocket();

	}
	// 连接socket
	connectSocket() {
		console.log("链接connectSocket")
		this.socket = uni.connectSocket({
			url: this.url,
			complete: () => {}
		})
		// 监听连接成功
		this.socket.onOpen(() => this.onOpen())
		// 监听接收信息
		this.socket.onMessage((res) => this.onMessage(res))
		// 监听断开
		this.socket.onClose((e) => this.onClose(e))
		// 监听错误
		this.socket.onError(() => this.onError())
	}
	sendMessage(message) {
		this.socket.send({
			data: message,
			success() {
				console.log('success')
			},
			fail() {
				console.log('fail')
			}
		})
	}
	onOpen() {
		// 用户上线
		this.isOnline = true
		console.log('websocket连接成功')
		this.isOpenReconnect = true
		// 获取用户离线消息
		if (this.socket != null) {
			 var that = this;
			 var login = {
			 	type:'login',
			 	client_name:this.user.username,
			 	uid:this.user._id,
			 	groupIds:[]
			 };
			 uniCloud.callFunction({
			 	name: 'user',
			 	data: {
			 		$url: "getGroups",
					token: this.user_token,
			 		data: {
			 			id: this.user._id
			 		}
			 	},
			 }).then((res) => {
			 	if(this.checkResultData(res)){
			 		res.result.data.forEach((item,index)=>{
			 			login.groupIds.push(item._id)
			 		})
			 	 }
			 	 that.initSocketLogin(login);
			 }).catch((err) => {
			 	 console.log(err);
				 that.initSocketLogin(login);
			 })
		}
	}
	
	// 监听关闭
	onClose(e) {
		// 用户下线
		this.isOnline = false
		this.socket = null
		console.log('socket连接已关闭')
		if (this.isOpenReconnect) {
			console.log("3秒后重新链接")
			var that = this;
			setTimeout(function() {
				that.reconnect();
			}, 3000);
		}
	}
	// 监听连接错误
	onError() {
		// 用户下线
		this.isOnline = false
		this.socket = null
		console.log('socket连接错误')
		if (!this.socket) {
			var that = this;
			setTimeout(function() {
				that.reconnect();
			}, 3000);
		}
	}
	// 监听接收消息
	onMessage(data) {
		let res = JSON.parse(data.data)
		switch (res['type']) {
			case 'ping':
				this.socket.send({
					data: '{"type":"pong"}',
					async success() {
						console.log("Socket心跳：" + new Date());
					}
				})
				break;
			case 'login':
				break;
			case 'say':
				this.handleOnMessage(res)
				break;
			case 'addfriend':
				this.handleOnMessage(res)
				break;
			case 'system':
				this.handleOnMessage(res)
				break;
			case 'sendCallback':
				this.handleSendCallBack(res);
				break;
			case 'kickout':
				this.kickout(res);
				break;
			case 'logout':

		}
	}
	// 处理消息
	async handleOnMessage(message, vibrateLong = true) {
		if (message.type == "say") {
			if(message.chat_type == "user"){
				this.addChatDetail(message, false)
				this.updateSessionList(message, false)
				uni.$emit('onMessage', message)
				if (message.msg_type !== undefined && message.msg_type == 'systen_agree_user') {
					$store.dispatch('getFriendIds');
				}
				if (vibrateLong) {
					uni.vibrateLong({
						success: function() {
							 
						}
					});
				}
			}else{
				if(message.from_id != this.user._id){
					this.addChatDetail(message, false)
					this.updateSessionList(message, false)
					uni.$emit('onMessage', message)
					if (vibrateLong) {
						uni.vibrateLong({
							success: function() {
								 
							}
						});
					}
				}
			}
		} else if (message.type == "addfriend") {
			this.addFriendApply(message)
			if (vibrateLong) {
				uni.vibrateLong({
					success: function() {
						console.log('success');
					}
				});
			}
		} else if (message.type == "system") {

		}

	}
	async handleSendCallBack(message) {
		
		if(message.chat_type == 'user'){
			uniCloud.callFunction({
				name: 'user',
				data: {
					$url: "updateChatDetailStatus",
					token: this.user_token,
					data: message
				},
			}).then((res) => {

			}).catch((err) => {
				console.log(err);
			
			});
		}else{
			uniCloud.callFunction({
				name: 'user',
				data: {
					$url: "updateChatGroupDetailStatus",
					token: this.user_token,
					data: message
				},
			}).then((res) => {
				 
			
			}).catch((err) => {
				console.log(err);
			});
			
		}
	}
	//踢下线
	kickout(){
		$store.dispatch("logout")
	}
	// 关闭连接
	close() {
		if (this.socket) {
			this.socket.close()
		}
		this.isOpenReconnect = false
	}
	initSocketLogin(login){
		this.socket.send({
			data: JSON.stringify(login),
			success() {
				console.log('用户IM登录成功:success')
			},
			fail(e) {
				console.log('用户IM登录失败fail:' + e)
			}
		})
		this.getUserHistoryMessage();
		this.getGroupHistoryMessage();
	}
	// 创建聊天对象
	createChatObject(detail) {
		this.TO = detail
	}
	// 销毁聊天对象
	destoryChatObject() {
		this.TO = false
	}
	// 断线重连提示
	reconnectConfirm() {
		this.connectSocket()
		this.reconnectTime = 0
	}
	// 验证是否上线
	checkOnline() {
		if (!this.isOnline) {
			// 断线重连提示
			this.reconnectConfirm()
			return false
		}
		return true
	}
	//收用户历史消息
	getUserHistoryMessage() {
		var that = this;
		var ids = [];
		uniCloud.callFunction({
			name: 'user',
			data: {
				$url: "getNoReadHistory",
				token: this.user_token,
				data: {
					uid: this.user._id
				}
			},
		}).then((res) => {
			if (this.checkResultData(res)) {
				var ds = res.result.data;
				ds.forEach((item, index) => {
					ids.push(item._id);
					that.handleOnMessage(item, false);

				})
				that.updateNoReadHistory(ids);
			}
			that.loadFinish = true;
		}).catch((err) => {
			console.log(err);
		});
	}
	//收群组历史消息
	getGroupHistoryMessage() {
		var that = this;
		var ids = [];
		uniCloud.callFunction({
			name: 'user',
			data: {
				$url: "getNoReadGroupHistory",
				token: this.user_token,
				data: {
					uid: this.user._id
				}
			},
		}).then((res) => {
			if (this.checkResultData(res)) {
				var ds = res.result.data;
				ds.forEach((item, index) => {
					ids.push(item._id);
					that.handleOnMessage(item, false);
				
				})
				that.updateNoReadGroupHistory(ids);
			}
			
		}).catch((err) => {
			console.log(err);
		});
	}
	//更新用户历史消息已读回执
	updateNoReadHistory(ids) {
		uniCloud.callFunction({
			name: 'user',
			data: {
				$url: "updateNoReadHistory",
				token: this.user_token,
				data: {
					ids: ids
				}
			},
		}).then((res) => {

		}).catch((err) => {
			console.log(err);
		});
	}
	//更新群组历史消息已读回执
	updateNoReadGroupHistory(ids) {
		uniCloud.callFunction({
			name: 'user',
			data: {
				$url: "updateNoReadGroupHistory",
				token: this.user_token,
				data: {
					ids: ids
				}
			},
		}).then((res) => {
			console.log(err);
		}).catch((err) => {
			console.log(err);
		});
	}
	// 组织发送信息格式
	formatSendData(params) {
		return {
			from_avatar: this.user.avatar, // 发送者头像
			from_name: this.user.nickname || this.user.username, // 发送者昵称
			from_id: this.user._id, // 发送者id
			to_id: params.to_id, // 接收人/群 id
			to_uid: params.to_id, // 接收人/群 id
			to_name: params.to_name, // 接收人/群 名称
			to_avatar: params.to_avatar, // 接收人/群 头像
			chat_type: params.chat_type, // 接收类型
			msg_type: params.msg_type, // 消息类型
			type: params.type,
			socket_type: params.socket_type,
			data: params.data, // 消息内容
			group: params.group ? params.group : '' ,
			//options: params.options ? params.options : {}, // 其他参数
			create_time: (new Date()).getTime(), // 创建时间
			isremove: 0, // 是否撤回
			sendStatus: params.sendStatus ? params.sendStatus : "pending" // 发送状态，success发送成功,fail发送失败,pending发送中
		}
	}
	// 发送消息
	send(message, onProgress = false) {
		if(message.chat_type === 'group' && message.group){
			uniCloud.callFunction({
				name: 'user',
				data: {
					token: this.user_token,
					$url: 'addChatGroupDetail',
					data: message
				},
			}).then((res) => {
			
				if (res.result.id !== undefined) {
					message._id = res.result.id;
					var detailIds = [];
					message.group.users.forEach((item,index)=>{
						
						var detailId = {
							messageId:res.result.id,
							userId:'',
							sendStatus:'pending',
							create_time: 0,
						};
						detailId.userId = item._id;
						detailId.create_time = (new Date()).getTime();
						detailIds.push(detailId)
					})
 
					uniCloud.callFunction({
						name: 'user',
						data: {
							$url: 'addChatGroupDetailIds',
							token: this.user_token,
							data: detailIds
						},
					}).then((res) => {
						uni.sendSocketMessage({
							data: JSON.stringify(message),
							success: () => {
								if (message.type == 'say') {
									this.addChatDetail(message)
									this.updateSessionList(message)
								}
							},
							fail: () => {
									
							}
						})
					}).catch((err) => {
						console.log(err);
					});
			
				}
			}).catch((err) => {
				console.log(err);
			});
			
		}else{
			uniCloud.callFunction({
				name: 'user',
				data: {
					$url: 'addChatDetail',
					token: this.user_token,
					data: message
				},
			}).then((res) => {
				if (res.result.id !== undefined) {
					message._id = res.result.id;
					uni.sendSocketMessage({
						data: JSON.stringify(message),
						success: () => {
							if (message.type == 'say') {
								this.addChatDetail(message)
								this.updateSessionList(message)
							}
						},
						fail: () => {
			
						}
					})
				}
			}).catch((err) => {
				console.log(err);
			});
		}
	}
	//收到好友申请
	addFriendApply(message) {
		let key = `friendApply_${this.user._id}`
		let list = uni.getStorageSync(key);
		list = list ? list : [];
		message.status = 0;
		message.apply_time = new Date().getTime();
		let index = list.findIndex(item => {
			return item.from_id === message.from_id
		})

		if (index === -1) {
			list.push(message);
		} else {
			list[index] = message;
		}
		uni.setStorageSync(key, list);
		uni.$emit('onUpdateFriendApply', list)
		uni.showTabBarRedDot({
			index: 1
		})

	}
	// 添加聊天记录
	addChatDetail(message, isSend = true) {
		// 获取对方id
		let id = message.chat_type === 'user' ? (isSend ? message.to_id : message.from_id) : message.to_id
		// key值：chatDetail_当前用户id_会话类型_接收人/群id
		let key = `chatDetail_${this.user._id}_${id}`
		// 获取原来的聊天记录
		let list = this.getChatDetail(key, id)
		list = list ? list : [];

		let index = list.findIndex(item => item._id === message._id)
		if (index === -1) {
			message.isSend = isSend;
			list.push(message)
			uni.setStorageSync(key, list)
		}

	}
	// 获取聊天记录
	getChatDetail(key = false, id = 0 , page = 1 , limit = 10) {
		key = key ? key : `chatDetail_${this.user._id}_${id}`;
		let storageDetail = uni.getStorageSync(key);
		let detail = [];
		if(storageDetail){
			try{
				storageDetail.reverse();
				detail = this.pagination(page,limit,storageDetail);
			}catch(e){
				console.log(e)
			}
		}
		 
		return detail;
	}
	pagination(pageNo, pageSize, array) {
		var offset = (pageNo - 1) * pageSize;
		// array.reverse();
		// console.log(array)
		var data = (offset + pageSize >= array.length) ? array.slice(offset, array.length) : array.slice(offset, offset +
			pageSize);
		// console.log(data)
		data.reverse();
		return data;
	}

	// 格式化会话最后一条消息显示
	formatChatItemData(message, isSend) {
		let data = message.data
		switch (message.msg_type) {
			case 'emoticon':
				data = '[表情]'
				break;
			case 'image':
				data = '[图片]'
				break;
			case 'audio':
				data = '[语音]'
				break;
			case 'video':
				data = '[视频]'
				break;
			case 'card':
				data = '[名片]'
				break;
		}
		if (message.chat_type == 'user') {
			data = isSend ? data : `${data}`
		} else {
			data = isSend ? data : `${message.from_name}: ${data}`
		}

		return data
	}
	// 更新会话列表
	updateSessionList(message, isSend = true) {
		//isSend = true 本人发起   isSend = flase 他人发起
		// 获取本地存储会话列表
		let list = this.getChatList()
		list = list ? list : [];
		// 是否处于当前聊天中
		let isCurrentChat = false
		let id = 0
		let avatar = ''
		let name = ''
		// 判断私聊还是群聊
		 
		if (message.chat_type === 'user') { // 私聊
			// 聊天对象是否存在
			isCurrentChat = this.TO ? (isSend ? this.TO.id === message.to_id : this.TO.id === message.from_id) : false
			id = isSend ? message.to_id : message.from_id
			avatar = isSend ? message.to_avatar : message.from_avatar
			name = isSend ? message.to_name : message.from_name
		} else { // 群聊
			isCurrentChat = this.TO && (this.TO.id === message.to_id)
			id = message.to_id
			avatar = message.to_avatar
			name = message.to_name
		}
		// 会话是否存在
		let index = list.findIndex(item => {
			return item.chat_type === message.chat_type && item.id === id
		})
		// 最后一条消息展现形式
		// let data = isSend ? message.data : `${message.from_name}: ${message.data}`
		let data = this.formatChatItemData(message, isSend)
		// 会话不存在，创建会话
		// 未读数是否 + 1
		let noreadnum = (isSend || isCurrentChat) ? 0 : 1;
		if (index === -1) {
			let chatItem = {
				id, // 接收人/群 id
				chat_type: message.chat_type, // 接收类型 user单聊 group群聊
				avatar, // 接收人/群 头像
				name, // 接收人/群 昵称
				update_time: message.create_time, // 最后一条消息的时间戳
				data, // 最后一条消息内容
				type: message.type, // 最后一条消息类型
				noreadnum, // 未读数
				istop: false, // 是否置顶
				shownickname: false, // 是否显示昵称
				nowarn: false, // 消息免打扰
				strongwarn: false, // 是否开启强提醒
			}
			// 群聊
			if (message.chat_type === 'group' && message.group) {
				chatItem.shownickname = true
				chatItem.name = message.to_name
				chatItem = {
					...chatItem,
					admin_id: message.group.user_id, // 群管理员id
					users:message.group.users ,
					avatarList:message.group.avatarList
				}
			}
			list.unshift(chatItem)
		} else { // 存在，更新会话
			// 拿到当前会话
			let item = list[index]
			// 更新该会话最后一条消息时间，内容，类型
			item.update_time = message.create_time
			// 群聊
			if(message.chat_type === 'group'){
				item.name = message.to_name
			}else{
				item.avatar = isSend ? message.to_avatar : message.from_avatar
				item.name = isSend ? message.to_name : message.from_name
			} 
			item.data = data
			item.type = message.type
			// 未读数更新
			if(this.TO.id == message.to_id){
				
			}
			item.noreadnum += noreadnum
			 
			// 置顶会话
			list = this.listToFirst(list, index)
		}
		list.sort(function(x, y) {
			return y["update_time"] - x["update_time"];
		});
		 
		// 存储
		let key = `chat_sessions_${this.user._id}`
		uni.setStorageSync(key, list)
		// 更新未读数
		this.updateBadge(list)
		// 通知更新vuex中的聊天会话列表
		uni.$emit('onUpdateSessionList', list)
		return list
	}
	// 更新未读数
	async updateBadge(list = false) {
		// 获取所有会话列表
		list = list ? list : this.getChatList()
		list = list ? list : [];
		// 统计所有未读数
		let total = 0
		list.forEach(item => {
			total += item.noreadnum
		})
		// 设置底部导航栏角标
		if (total > 0) {
			uni.setTabBarBadge({
				index: 0,
				text: total <= 99 ? total.toString() : '99+'
			})
		} else {
			uni.removeTabBarBadge({
				index: 0
			})
		}
		uni.$emit('tabBarBadge', total)
	}
	// 更新指定会话
	async updateChatItem(where, data) {
		// 获取所有会话列表
		let list = this.getChatList()
		// 找到当前会话
		let index = list.findIndex(item => item.id === where.id && item.chat_type === where.chat_type)
		if (index === -1) return;
		// 更新数据
		if (typeof data === 'function') {
			list[index] = data(list[index])
		} else {
			list[index] = data
		}  
		let key = `chat_sessions_${this.user._id}`
		uni.setStorageSync(key, list)
		// 更新会话列表状态 
		uni.$emit('onUpdateSessionList', list)
	}
	
	// 读取会话
	async readChatItem(id) {
		// 获取所有会话列表
		let list = this.getChatList()
		// 找到当前会话
		let index = list.findIndex(item => item.id === id)
		if (index !== -1) {
			list[index].noreadnum = 0
			let key = `chat_sessions_${this.user._id}`
			uni.setStorageSync(key, list)
			// 重新获取总未读数
			this.updateBadge()
			// 更新会话列表状态
			uni.$emit('onUpdateSessionList', list)
		}
	}
	// 删除指定会话
	async removeChatItem(id, chat_type) {
		// 获取所有会话列表
		let list = this.getChatList()
		// 找到当前会话
		let index = list.findIndex(item => item.id === id && item.chat_type === chat_type)
		if (index !== -1) {
			list.splice(index, 1)

			let key = `chat_sessions_${this.user.id}`
			this.setStorage(key, list)
			// 重新获取总未读数
			this.updateBadge()
			// 更新会话列表状态
			uni.$emit('onUpdateSessionList', list)
		}
	}
	// 清空聊天记录
	async clearChatDetail(id, chat_type) {
		let key = `chatDetail_${this.user.id}_${chat_type}_${id}`
		$U.removeStorage(key)

		// 获取所有会话列表
		let list = this.getChatList()
		// 找到当前会话
		let index = list.findIndex(item => item.id === id && item.chat_type === chat_type)
		if (index !== -1) {
			list[index].data = ''

			let key = `chat_sessions_${this.user.id}`
			this.setStorage(key, list)
			// 更新会话列表状态
			uni.$emit('onUpdateSessionList', list)
		}
	}
	// 获取本地存储好友申请
	getFriendApply() {
		let key = `friendApply_${this.user._id}`;
		let list = uni.getStorageSync(key);
		list = list ? list : [];
		return list;
	}
	// 清空本地存储好友申请
	clearFriendApply() {
		let key = `friendApply_${this.user._id}`;
		let list = [];
		uni.setStorageSync(key, list);
		uni.$emit('onUpdateFriendApply', list)
	}

	updateFriendApplyStatus(status, id) {
		let key = `friendApply_${this.user._id}`;
		let list = uni.getStorageSync(key);
		list = list ? list : [];
		let index = list.findIndex(item => item.from_id === id)
		if (index !== -1) {
			list[index].status = status;
		}
		uni.setStorageSync(key, list);
		uni.$emit('onUpdateFriendApply', list)
	}

	// 获取本地存储会话列表
	getChatList() {
		let key = `chat_sessions_${this.user._id}`;
		let list = uni.getStorageSync(key);
		list = list ? list : [];
		return list;
	}
	// 获取指定会话
	getChatListItem(id, chat_type) {
		// 获取所有会话列表
		let list = this.getChatList()
		// 找到当前会话
		let index = list.findIndex(item => item.id === id && item.chat_type === chat_type)
		if (index !== -1) {
			return list[index]
		}
		return false
	}
	//创建群组
	addChatGroup(group) {
		uni.showLoading({
		    title: '创建中...'
		});
		var that = this;
		uniCloud.callFunction({
			name: 'user',
			data: {
				$url: "addChatGroup",
				token: this.user_token,
				data: group
			},
		}).then((res) => {
			var groupId = res.result.id;
			if (groupId !== undefined) {
				group.users.forEach((item, index) => {
					let joinGroup = {
						type:'joinGroup',
						uid:item._id,
						groupId:groupId
					};
					uni.sendSocketMessage({
						data: JSON.stringify(joinGroup),
						success: () => {
							 
						},
						fail: () => {
					
						}
					})
					uniCloud.callFunction({
						name: 'user',
						data: {
							$url: "addChatGroupUsers",
							token: this.user_token,
							data: {
								group_id: groupId,
								user_id:item._id
							}
						},
					}).then((res) => {
					
					}).catch((err) => {
						console.log(err);
					});

				})
			}
			let message = that.formatSendData({
				type: 'say',
				data: "我发起了群聊，让我们来聊天吧！",
				to_id: groupId, // 接收人/群 id
				to_name: group.title, // 接收人/群 名称
				to_avatar: '', // 接收人/群 头像
				chat_type: 'group', // 接收类型
				msg_type: 'text',
				group:{
					user_id:that.user._id,
					users:group.users,
					avatarList:group.avatarList
				}
			}) 
			that.send(message);
			uni.hideLoading();
			uni.redirectTo({
			    url: '/pages/group/chatGroup' + '?id=' + groupId + "&name=" + group.title,
			});
			
		}).catch((err) => {
			console.log(err);
			uni.hideLoading();
			uni.showModal({
			    title: '提示',
			    content: err,
			    success: function (res) {
			       
			    }
			});
		});
	}
	async checkToken(){
		var that = this;
		uniCloud.callFunction({
			name: 'user',
			data: {
				$url: "getUserByUid",
				token: this.user_token,
				data: {
					uid: this.user._id
				}
			},
		}).then((res) => {
			if(this.checkResultData(res)){
				$store.dispatch('updateUser',res.result.data[0])
			}else{
				if(res.result.code === 1){
					uni.showModal({
					    title: '提示',
					    content: res.result.msg,
					    success: function (res) {
							$store.dispatch("logout");
					    }
					});
					
				}
			}
		 
		}).catch((err) => {
			 console.log(err)
		}); 
		
	}
	chatWindow(sessionId, name) {
		uni.navigateTo({
			url: '/pages/chat/chat?id=' + sessionId + "&name=" + name,
		})
	}
	chatGroupWindow(sessionId, name) {
		uni.navigateTo({
			url: '/pages/group/chatGroup?id=' + sessionId,
		})
	}
	queryUsers() {
		uni.navigateTo({
			url: '/pages/contact/queryUsers',
		})
	}
	showCard(uid,type = 'search') {
		uni.showLoading();
		var that = this;
		uniCloud.callFunction({
			name: 'user',
			data: {
				$url: "getUserByUid",
				token: this.user_token,
				data: {
					uid: uid
				}
			},
		}).then((res) => {
			uni.hideLoading();
			if (this.checkResultData(res)) {
				uni.setStorageSync("cardUser", res.result.data[0]);
				uni.navigateTo({
					url:'/pages/contact/card?type='+type
				})
			} else {
				uni.showToast({
					title: '该用户不存在',
					duration: 2000,
					icon: 'none'
				});
			}
		}).catch((err) => {
	
			uni.hideLoading()
			uni.showModal({
				title: '提示',
				content: err
			});
		})
	}
	logout(){
		uniCloud.callFunction({
			name: 'login',
			data: {
				$url: "logout",
				data: {
					token: this.user_token
				}
			},
		}).then((res) => {
			 
		}).catch((err) => {
			 
		})
	}
	// 数组置顶
	listToFirst(arr, index) {
		if (index != 0) {
			arr.unshift(arr.splice(index, 1)[0]);
		}
		return arr;
	}
	checkResultData(res){
		if(typeof res != 'undefined' && typeof res['result'] != 'undefined' && typeof res['result']['data'] != 'undefined' && typeof res['result']['data'][0] != 'undefined'){
			return true;
		}else{
			return false;
		}
	}
}
export default common
