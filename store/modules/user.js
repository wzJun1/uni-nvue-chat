import WebSocket from '@/common/common.js';
import Utils from '@/common/utils.js';
export default {
	state: {
		url:'ws://127.0.0.1:32255',
		user: false,
		systemInfo:[],
		webSocket: null,
		utils: null,
		sessionList: [],
		friendApply: [],
		friendList: [],
		friendIds:[],
		friendListLetterSort: [],
		groupList:[],
		tabBarBadge:0,
		user_token : ''
	},
	mutations: {
		updateUser(state, {
			k,
			v
		}) {
			if (state.user) {
				state.user[k] = v
				uni.setStorageSync('user', state.user)
			}
		}
	},
	actions: {
		// 登录后处理
		login({
			state,
			dispatch
		}, res) {
			// 存到状态中
			state.user = res
			state.user_token = uni.getStorageSync('token');
			// 存储到本地存储中
			uni.setStorageSync('user', res)
			uni.setStorageSync('uid', res._id)
			// 连接socket
			state.webSocket = new WebSocket({
				url: state.url
			})
			state.utils = new Utils()
			// 获取会话列表
			dispatch('getSessionList')
			// 获取好友申请列表
			dispatch('getFriendApply')
			// 获取好友列表
			dispatch('getFriendIds') 
			// 获取群组列表
			dispatch('getGroupIds')
			// 初始化总未读数角标
			dispatch('updateBadge')
		},
		updateUser({
			state,
			dispatch
		}, res) {
			// 存到状态中
			state.user = res
			// 存储到本地存储中
			uni.setStorageSync('user', res)
			uni.setStorageSync('uid', res._id)
		},
		getUserInfo({
			state,
			dispatch
		}) {
			// 存到状态中
			var that = this;
			uniCloud.callFunction({
				name: 'user',
				data: {
					$url: "getUserByUid",
					token: state.user_token,
					data: {
						uid: state.user._id
					}
				},
			}).then((res) => {
				dispatch('updateUser',res.result.data[0])
			}).catch((err) => {
				 
			}); 
		},
		logout({
			state,
			dispatch
		}) {
			 
			dispatch('closeWebSocket')
			state.webSocket.logout()
			state.user = false
			state.webSocket = null
			state.sessionList = false
			state.friendApply = false
			state.friendList = false
			state.tabBarBadge = 0
			state.friendList = false
			state.user_token = ""
			// 清除本地存储数据
			uni.removeStorageSync('token');
			uni.removeStorageSync('user');
			uni.removeStorageSync('uid');
			uni.removeStorageSync('friendIds')
			uni.removeStorageSync('groupList')
			uni.removeStorageSync('friendList')
			// 跳转到登录页
			uni.reLaunch({
				url: "/pages/index/login"
			})
		},
		initLogin({
			state,
			dispatch
		}) {
			// 拿到存储
			let user = uni.getStorageSync('user')
			if (user) {
				// 初始化登录状态
				state.user = user
				state.user_token = uni.getStorageSync('token');
				state.friendList = uni.getStorageSync('friendList') ? uni.getStorageSync('friendList') : [];
				state.groupList = uni.getStorageSync('groupList') ? uni.getStorageSync('groupList') : [];
				state.friendIds = uni.getStorageSync('friendIds') ? uni.getStorageSync('friendIds') : [];
				//state.friendIds = uni.setStorageSync('friendIds') ? uni.getStorageSync('friendIds') : [];
				// 连接socket
				state.webSocket = new WebSocket({
					url: state.url 
				})
				state.utils = new Utils()
				// 获取会话列表
				dispatch('getSessionList')
				// 获取好友申请列表
				dispatch('getFriendApply')
				// 获取好友列表
				dispatch('getFriendIds')
				// 获取群组列表
				dispatch('getGroupIds')
				// 初始化总未读数角标
				dispatch('updateBadge')
				state.webSocket.checkToken();
			}  
		},
		
		closeWebSocket({state}){
			if(state.webSocket){
				state.webSocket.close();
			}
		},
		
		// 获取会话列表
		getSessionList({
			state
		}) {
			state.sessionList = state.webSocket.getChatList()
			// 监听会话列表变化
			uni.$on('onUpdateSessionList', (list) => {
				state.sessionList = list
			})
		},
 
		// 获取申请列表
		getFriendApply({
			state
		}) {
			state.friendApply = state.webSocket.getFriendApply()
			uni.$on('onUpdateFriendApply', (list) => {
				state.friendApply = list
			})
		},

		//获取好友列表
		getFriendIds({
			state,
			dispatch
		}) { 
			//uni.showLoading();
			uniCloud.callFunction({
				name: 'user',
				data: {
					$url: "getFriendIds",
					token: state.user_token,
					data: {
						ids: [state.user._id]
					}
				},
			}).then((res) => {
				dispatch('getFriendListByIds',res)
			}).catch((err) => {
				console.log(err);
			})
		},
		getFriendListByIds({
			state,
			dispatch
			
		}, res) {
			if(state.webSocket.checkResultData(res)){
				state.friendIds = res.result.data;
				let friendIds = [];
				uni.setStorageSync('friendIds', res.result.data)
				res.result.data.forEach((item) => {
					friendIds.push(item.friend_id);
				})
				if(!friendIds){return;}
				uniCloud.callFunction({
					name: 'user',
					data: {
						$url: "getFriendListByIds",
						token: state.user_token,
						data: {
							ids: friendIds
						}
					},
				}).then((res) => {
					if(res.result.data){
						state.friendList = res.result.data;
						uni.setStorageSync('friendList', res.result.data)
						uni.hideLoading();
						state.friendListLetterSort = state.utils.sortFriendList(res.result.data)
					}
				}).catch((err) => {
					console.log(err);
					uni.hideLoading();
				})
			}else{
				if(res.result.data.length == 0){
					state.friendList = [];
					uni.setStorageSync('friendList', [])
					state.friendListLetterSort = [];
				}
				// console.log(res)
				// uni.showModal({
				//     title: '提示',
				//     content: res.result.msg,
				//     success: function () {
				// 		if(res.result.code == 30201){
				// 			dispatch('logout')
				// 		}
				//     }
				// });
				uni.hideLoading();
			}
		},
		
		getGroupIds({
			state,
			dispatch
		}) {
			// 监听会话列表变化
			uni.$on('onUpdateGroupList', (list) => {
				state.groupList = list
			})
			uniCloud.callFunction({
				name: 'user',
				data: {
					$url: "getGroups",
					token: state.user_token,
					data: {
						id: state.user._id
					}
				},
			}).then((res) => {
				 if(res.result.data){
				
					uni.setStorageSync('groupList', res.result.data)
				 	state.groupList = res.result.data
				 }
			}).catch((err) => { 
				console.log(err);
			})
		},
		
		// 初始化总未读数角标
		updateBadge({state}){
			// 开启监听总未读数变化
			uni.$on('tabBarBadge',(num)=>{
				state.tabBarBadge = num
			})
			state.webSocket.updateBadge()
		}
	}
}
