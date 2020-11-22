<template>

	<view id="chatDetail" @click="hide" ref="chatDetail" class="flex-column-start">
		<view style="margin-bottom: 30rpx;">
			<text class="chat-time" v-if="showTime(item.create_time,index)">{{showTime(item.create_time,index)}}</text>
			<view class="padding-top align-center" :class="item.isSend ? 'nv-rowever padding-right' : 'padding-left nv-row'">
				<image v-if="item.isSend" class="chat-img" :src="$store.state.user.utils.getImageCache(user.avatar)" mode="aspectFill"></image>
				<image v-else class="chat-img" :src="getFromAvatar(item)" @click="showCard(item.from_id)" mode="aspectFill"></image>

				<view style="flex-direction: row;justify-content: center;align-items: center;">
					<view class="nv-chat" style="flex-direction: column;flex-wrap:wrap;">
						<view class="padding-chat" :class="item.isSend?'margin-right nv-rowever':'margin-left nv-row'" :style="'border-radius: 10rpx;align-items: center;margin-left:auto'"
						 v-if="item.msg_type == 'image'" style="">
							<image :lazy-load="true" :src="$store.state.user.utils.getImageCache(item.data)" @click="previewImage(item.data)"
							 mode="aspectFill" style="width: 260rpx;height: 260rpx;border-radius: 10rpx;"></image>
						</view>
						<view v-else-if="item.msg_type == 'audio'" :class="item.isSend?'margin-right white-bg nv-rowever':'margin-left gr-bg nv-row'"
						 class="padding-chat" :style="'border-radius: 10rpx;align-items: center;'" @click="playAudio(item.data,index)">

							<!-- #ifndef APP-PLUS -->
							<view class="" :class="item.isSend?'nv-rowever':'nv-row'" style="width:220rpx;position: relative;align-items: center;">
								<!-- #endif -->

								<!-- #ifdef APP-PLUS -->
								<view class="" :class="item.isSend?'nv-rowever':'nv-row'" v-bind:style="voiceBoxLength(item.data.duration)">
									<!-- #endif -->

									<image :src="voiceImage(index)" style="width: 60rpx;margin: 4rpx;height: 45rpx;">
									</image>
									<text v-if="item.isSend" :style="'margin-left:2px;margin-right:20rpx;font-size: 30rpx;word-wrap: break-word;word-break: break-all;'">{{item.data.duration/1000}}''</text>
									<text v-else :style="'margin-left:20rpx;font-size: 30rpx;word-wrap: break-word;word-break: break-all;'">{{item.data.duration/1000}}''</text>

								</view>
							</view>

							<view v-else :class="item.isSend?'margin-right white-bg nv-rowever':'margin-left gr-bg nv-row'" class="padding-chat"
							 :style="'border-radius: 10rpx;align-items: center;'">

								<text :style="'font-size: 36rpx;word-wrap: break-word;word-break: break-all;max-width:'+chatDetailBoxMaxWidth+'px'">{{item.data}}</text>
							</view>
						</view>
					</view>
				</view>
			</view>



		</view>

</template>

<script>
	import {
		mapState
	} from 'vuex'
	export default {
		name: 'UniChatDetail',
		props: {
			type: {
				type: String,
				default: 'user'
			},
			session: {},
			item: {
				type: Object,
				default: {}
			},
			index: {
				type: Number,
				default: 0
			},
			list: {
				type: Array,
				default: []
			},
		},
		computed: {
			...mapState({
				user: state => state.user.user,
				webSocket: state => state.user.webSocket,
				sessionList: state => state.user.sessionList,
			}),
			voiceImage() {
				return function(index) {
					let r = this.playVoiceAnimationIndex === index ? '../../static/images/play.gif' :
						'../../static/images/audio3.png';
					return r
				}
			},


		},
		created() {
			this.chatDetailBoxMaxWidth = this.systemInfo.screenWidth - 110;
		},
		data() {
			return {
				chatDetailBoxMaxWidth: 0,
				safeBottom: 0,
				systemInfo: uni.getSystemInfoSync(),
				innerAudioContext: uni.createInnerAudioContext(),
				playVoiceAnimationIndex: '',
				onPlay: false,

			};
		},
		methods: {
			getFromAvatar: function(item) {
				let avatar = "";
				if (this.type == 'user') {
					 
					avatar = this.session.avatar;
				} else {
					avatar = this.$store.state.user.utils.getImageCache(item.from_avatar)
				}
				return avatar;
			},
			voiceBoxLength: function(length) {
				let l = length / 1000;
				let w = 70;
				if (parseInt(l) < 2) {
					w = 70;
				} else if (parseInt(l) < 3) {
					w = 75;
				} else if (parseInt(l) < 5) {
					w = 85;
				} else if (parseInt(l) < 7) {
					w = 95;
				} else if (parseInt(l) < 10) {
					w = 110;
				} else if (parseInt(l) < 15) {
					w = 130;
				} else if (parseInt(l) < 20) {
					w = 150;
				} else if (parseInt(l) < 30) {
					w = 180;
				} else {
					w = 200;
				}
				w = w * 2;
				return 'width:' + w + 'rpx;position: relative;align-items: center;';
			},
			hide: function() {
				uni.hideKeyboard()
			},
			showTime: function(time, index) {
				var last_index = index - 1;
 
				if (last_index >= 0) {
					var last_time = this.list[last_index]['create_time'];
					var difference = parseInt(time.toString().slice(0, -3)) - parseInt(last_time.toString().slice(0, -3));

					if (difference < 60) {
						return false;
					} else {
						return this.$store.state.user.utils.formatChatTime(time)
					}
				} else {
					return this.$store.state.user.utils.formatChatTime(time)
				}
			},
			playAudio: function(data, index) {
				this.playVoiceAnimationIndex = "";
				this.innerAudioContext.src = "";
				try {
					var that = this;
					let mp3Url = data.file;
					if (that.onPlay) {
						that.innerAudioContext.stop();
						that.onPlay = false;
						that.playVoiceAnimationIndex = "";
					} else {
						that.innerAudioContext.src = mp3Url;
						that.innerAudioContext.play();
						that.innerAudioContext.onPlay(() => {
							console.log('开始播放');
							that.onPlay = true;
							that.playVoiceAnimationIndex = index;
						});
						that.innerAudioContext.onEnded(() => {
							console.log('自然播放结束');
							that.onPlay = false;
							that.playVoiceAnimationIndex = "";
						});
						that.innerAudioContext.onStop(() => {
							console.log('onStop');
							that.onPlay = false;
							that.playVoiceAnimationIndex = "";
						});
						that.innerAudioContext.onError((res) => {
							console.log(res.errMsg);
							console.log(res.errCode);
							that.onPlay = false;
							that.playVoiceAnimationIndex = "";
						});
					}
				} catch (err) {
					console.log(err)
					that.onPlay = false;
					that.playVoiceAnimationIndex = "";
				}
			},
			previewImage: function(image) {
				let images = [];
				images.push(image)
				uni.previewImage({
					urls: images,
					longPressActions: {
						itemList: ['发送给朋友', '保存图片', '收藏'],
						success: function(data) {
							console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
						},
						fail: function(err) {
							console.log(err.errMsg);
						}
					}
				});
			},
			showCard: function(uid,type = 'search') {
				uni.showLoading();
				var that = this;
				console.log(uid)
				uniCloud.callFunction({
					name: 'user',
					data: {
						$url: "getUserByUid",
						token: this.$store.state.user.user_token,
						data: {
							uid: uid
						}
					},
				}).then((res) => {
					uni.hideLoading();
					if (this.webSocket.checkResultData(res)) {
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
					console.log(err)
					uni.hideLoading()
					uni.showModal({
						title: '提示',
						content: err
					});
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.record {
		position: fixed;
		bottom: 150px;
		width: 350rpx;
		left: 200rpx;
		height: 350rpx;
		background-color: #4c4c4c;
		border-radius: 20rpx;
		justify-content: center;
		align-items: center;

	}

	.tis {
		width: 100%;
		height: 10vw;

		justify-content: center;
		font-size: 24rpx !important;
		color: white !important;
	}

	.ing {
		width: 100%;

	}

	.voice-icon {

		font-size: 120rpx;
		color: #f09b37;
		// color: white;
	}

	.header-dh {
		position: fixed;
		justify-content: flex-end;
		padding-bottom: 15rpx;
		width: 750rpx;
		background-color: #f1f1f1;
		z-index: 20;
	}

	.padding-chat {
		padding: 22rpx;
	}

	.margin-right {
		margin-right: 20rpx;
	}

	.margin-left {
		margin-left: 20rpx;
	}

	.padding-left {
		padding-left: 20rpx;
	}

	.flex-column-start {
		flex-direction: column;
		justify-content: center;
	}

	.chat-img {
		border-radius: 10rpx;
		width: 85rpx;
		height: 85rpx;
		background-color: #FFFFFF;
	}

	.flex-row-around {
		flex-direction: row;
		justify-content: space-around;
		align-items: center;
	}

	.flex-row-between {
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}

	.status_bar-fixed {
		width: 750rpx;
		background-color: #f1f1f1;
		z-index: 20;
	}

	.center-box {
		width: 720rpx;
		padding-left: 25rpx;
	}

	.dh-input {
		font-size: 30rpx;
		width: 560rpx;
		height: 70rpx;
		border-radius: 10rpx;
		padding-left: 15rpx;
		background-color: #FFFFFF;
	}

	.voice-nv {
		font-size: 34rpx;
		width: 560rpx;
		height: 70rpx;
		font-weight: bold;
		border-radius: 10rpx;
		padding-left: 15rpx;
		padding-top: 17rpx;
		background-color: #FFFFFF;
		text-align: center;
		color: #333333;
	}

	.tb-nv {
		width: 50rpx;
		height: 50rpx;
	}

	.wid {
		width: 480rpx;
	}

	.box-normal {
		width: 750rpx;
		height: 0;
		background-color: #FFFFFF;
	}

	.flex-row-around {
		flex-direction: row;
		justify-content: space-around;
		align-items: center;
		flex-wrap: wrap;
	}

	.tb-text {
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.flex-column-center {
		flex-direction: column;
		justify-content: center;
		align-items: center;
		position: fixed !important;
		background-color: #f3f3f3;
		border-radius: 10rpx;
		z-index: 9999999;
	}

	.safeArea {
		width: 750rpx;
		position: fixed;
		bottom: 0px;
		background-color: #f3f3f3;
	}


	.bottom-foot-char {
		background-color: #f1f1f1;
		//width: 750rpx;
		padding: 20rpx 0 20rpx 0;
		/* #ifndef APP-NVUE */
		flex-flow: row;
		/* #endif */
	}

	.padding-top {
		padding-top: 10rpx;
	}

	.padding-right {
		padding-right: 20rpx;
	}

	.justify-end {
		flex-direction: row-reverse;
	}

	.nv-chat {
		flex-wrap: wrap-reverse;
	}

	.nv-row {
		flex-direction: row
	}

	.nv-rowever {
		flex-direction: row-reverse
	}

	.white-bg {
		background-color: #95eb67;
	}

	.gr-bg {
		background-color: #ffffff;
	}

	.long-text {
		color: #ffffff;
		font-size: 28rpx;
		padding: 8 20rpx;
	}

	.more-layer {
		height: 220rpx;
		border-top-width: 2rpx;
		border-top-color: #e6e5e8;
	}


	.more-layer-list {
		flex-direction: row;
	}

	.more-layer-large {
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}



	.more-layer-span {
		font-size: 28rpx;
		color: gray;

	}

	.more-layer-box {
		width: 120rpx;
		height: 120rpx;
		border-radius: 20rpx;
		background-color: white;
		justify-content: center;
		align-items: center;
		margin: 20rpx 30rpx 20rpx 30rpx;
	}


	.emoji-layer {
		height: 500rpx;
		width: 750rpx;
		flex-wrap: wrap;
		border-top-width: 2rpx;
		border-top-color: #e6e5e8;
		// position: absolute;

	}

	.emoji-layer-list {
		flex-direction: row;
		width: 100%;
		justify-content: center;
		align-items: center;

	}

	.emoji-layer-large {
		width: 46rpx;
		height: 46rpx;
	}

	.chat-time {
		text-align: center;
		padding-top: 18rpx;
		font-size: 28rpx;
		color: #8f8f8f;
		margin-bottom: 20rpx;
	}

	.system-msg {
		text-align: center;
		padding-top: 18rpx;
		font-size: 24rpx;
		color: #8f8f8f;
	}

	.ing {
		top: 50rpx;
		position: absolute;
		text-align: center;
		justify-content: center;
		align-items: center;
	}

	.recording {
		width: 150rpx;
		height: 150rpx;
	}

	.recordTis {
		bottom: 50rpx;
		position: absolute;
		text-align: center;
		justify-content: center;
	}

	.recordTis-text {
		color: white;
		font-size: 30rpx;
	}

	.scroll-view_H {
		flex-direction: row;
		padding-top: 60rpx;
		padding-bottom: 60rpx;
		height: 380rpx;
		width: 750rpx;
		flex-wrap: wrap;
	}
</style>
