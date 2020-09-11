<template>

	<view :hover-class="(!clickable && !link )? '' : 'uni-list-chat--hover'" class="uni-list-chat" @click="onClick">
		<view :class="{'uni-list--border':border,'uni-list-chat--first':arrayIndex===0}"></view>
		<view class="uni-list-chat__container">
			<view class="uni-list-chat__header-warp">
				<view v-if="avatarCircle || avatarList.length == 0" class="uni-list-chat__header" :class="{'header--circle':avatarCircle}">
					<image class="uni-list-chat__header-image" :style="{'width':(avatarWidth+10)+'rpx','height':(avatarWidth+10)+'rpx'}"
					 :src="avatar" mode="aspectFill"></image>
				</view>
				<!-- 头像组 -->
				<view v-else class="uni-list-chat__header" :style="{'width':(avatarWidth+10)+'rpx','height':(avatarWidth+10)+'rpx'}">
					
					<view v-for="(item,index) in avatarList" :key="index" class="uni-list-chat__header-box" :class="computedAvatar"
					 :style="{width:imageWidth+'rpx',height:imageWidth+'rpx'}">
						<image class="uni-list-chat__header-image" :style="{width:(imageWidth)+'rpx',height:(imageWidth)+'rpx'}" :src="$store.state.user.utils.getImageCache(item)"
						 mode="aspectFill"></image>
					</view>
					
				</view>
			</view>
			<view v-if="badgeText&& badgePositon === 'left'" class="uni-list-chat__badge uni-list-chat__badge-pos" :class="[isSingle]"><text
				 class="uni-list-chat__badge-text">{{badgeText === 'dot' ?'':badgeText}}</text></view>
			<view class="uni-list-chat__content">
				<view class="uni-list-chat__content-main" :style="!note ? 'justify-content:center' : ''">
					<text class="uni-list-chat__content-title uni-ellipsis" v-if="title">{{title}}</text>
					<text class="uni-list-chat__content-note uni-ellipsis" v-if="note">{{note}}</text>
				</view>
				<view class="uni-list-chat__content-extra">
					<slot>
						<text class="uni-list-chat__content-extra-text" style="font-size: 20rpx;">{{time}}</text>
						<view v-if="badgeText && badgePositon === 'right'" class="uni-list-chat__badge" :class="[isSingle,badgePositon==='right'?'uni-list-chat--right':'']"><text
							 class="uni-list-chat__badge-text">{{badgeText === 'dot' ?'':badgeText}}</text></view>
					</slot>
				</view>
			</view>
		</view>
	</view>

</template>

<script>
	// 头像大小
	const avatarWidth = 90


	/**
	 * ListChat 聊天列表
	 * @description 聊天列表,用于创建聊天类列表
	 * @tutorial https://ext.dcloud.net.cn/plugin?id=24
	 * @property {String} 	title 							标题
	 * @property {String} 	note 							描述
	 * @property {Boolean} 	clickable = [true|false] 		是否开启点击反馈，默认为false
	 * @property {String} 	badgeText						数字角标内容
	 * @property {String}  	badgePositon = [left|right]		角标位置，默认为 right
	 * @property {String} 	link = [false｜navigateTo|redirectTo|reLaunch|switchTab] 是否展示右侧箭头并开启点击反馈，默认为false
	 *  @value false	 	不开启
	 *  @value navigateTo 	同 uni.navigateTo()
	 * 	@value redirectTo 	同 uni.redirectTo()
	 * 	@value reLaunch   	同 uni.reLaunch()
	 * 	@value switchTab  	同 uni.switchTab()
	 * @property {String} 	to  							跳转目标页面
	 * @property {String} 	time							右侧时间显示
	 * @property {Boolean} 	avatarCircle = [true|false]		是否显示圆形头像，默认为false
	 * @property {String} 	avatar							头像地址，avatarCircle 不填时生效
	 * @property {Array} 	avatarList 						头像组，格式为 [{url:''}]
	 * @event {Function} 	click 							点击 uniListChat 触发事件
	 */
	import {
		mapState
	} from 'vuex'
	export default {
		name: 'UniListChat',
		props: {
			arrayIndex: {
				type: Number,
				default: 0
			},
			title: {
				type: String,
				default: ''
			},
			note: {
				type: String,
				default: ''
			},
			clickable: {
				type: Boolean,
				default: false
			},
			link: {
				type: [Boolean, String],
				default: false
			},
			to: {
				type: String,
				default: ''
			},
			badgeText: {
				type: [String, Number],
				default: ''
			},
			badgePositon: {
				type: String,
				default: 'right'
			},
			time: {
				type: String,
				default: ''
			},
			avatarCircle: {
				type: Boolean,
				default: false
			},
			avatar: {
				type: [String,Boolean],
				default: false
			},
			avatarWidth: {
				type: Number,
				default: 90
			},
			avatarList: {
				type: Array,
				default: () => []
			},
			groupId: {
				type: [String,Boolean],
				default: false
			},
			
		},
		// inject: ['list'],
		computed: {
			...mapState({
				webSocket: state => state.user.webSocket,
			}),
			isSingle() {

				if (this.badgeText === 'dot') {
					return 'uni-badge--dot'
				} else {
					const badgeText = this.badgeText.toString()
					if (badgeText.length > 1) {
						return 'uni-badge--complex'
					} else {
						return 'uni-badge--single'
					}
				}

			},
			computedAvatar() {

				if (this.avatarList.length > 4) {
					this.imageWidth = this.avatarWidth * 0.31
					return "avatarItem--3"
				} else if (this.avatarList.length > 1) {
					this.imageWidth = this.avatarWidth * 0.47
					return "avatarItem--2"
				} else {
					this.imageWidth = this.avatarWidth
					return "avatarItem--1"
				}
			}
		},
		data() {
			return {
				isFirstChild: false,
				border: true,
				 
				imageWidth: 50,
				
			}
		},
		mounted() {
			// if (!this.list.firstChildAppend) {
			// 	this.list.firstChildAppend = true
			// 	this.isFirstChild = true
			// }
			//this.border = this.list.border
			 
		},
		watch:{
			 
		},
		created() {
 
		},
		methods: {
			onClick() {
				this.$emit("click");
			}
		}
	}
</script>

<style lang="scss" scoped>
	$background-color : #fff;
	$divide-line-color : #e5e5e5;
	$avatar-width : 90rpx;
	$avatar-border-radius: 10rpx;
	$avatar-border-color: #eee;
	$avatar-border-width: 2rpx;
	$title-size : 34rpx;
	$title-color : #3b4144;
	$title-weight : normal;
	$note-size : 28rpx;
	$note-color : #999;
	$note-weight : normal;
	$right-text-size : 20rpx;
	$right-text-color : #999;
	$right-text-weight : normal;
	$badge-left: 0px;
	$badge-top: 0px;
	$dot-width: 20rpx;
	$dot-height: 20rpx;
	$badge-size : 36rpx;
	$badge-font : 24rpx;
	$badge-color : #fff;
	$badge-background-color : #ff5a5f;
	$badge-space : 12rpx;
	$hover : #f5f5f5;

	.uni-list-chat {
		font-size: $uni-font-size-lg;
		position: relative;
		flex-direction: column;
		justify-content: space-between;
		background-color: $background-color;

	}

	// .uni-list-chat--disabled {
	// 	opacity: 0.3;
	// }

	.uni-list-chat--hover {
		background-color: $hover;
	}

	.uni-list--border {
		position: relative;
		margin-left: $uni-spacing-row-lg;
		/* #ifdef APP-PLUS */
		border-top-color: $divide-line-color;
		border-top-style: solid;
		border-top-width: 1rpx;
		/* #endif */
	}

	/* #ifndef APP-NVUE */
	.uni-list--border:after {
		position: absolute;
		top: 0;
		right: 0;
		left: 0;
		height: 2rpx;
		content: '';
		-webkit-transform: scaleY(.5);
		transform: scaleY(.5);
		background-color: $divide-line-color;
	}

	.uni-list-item--first:after {
		height: 0px;
	}

	/* #endif */

	.uni-list-chat--first {
		border-top-width: 0px;
	}

	.uni-ellipsis {

		overflow: hidden;
		/* #ifndef APP-NVUE */
		white-space: nowrap;
		/* #endif */
		text-overflow: ellipsis;
		/* #ifdef APP-NVUE */
		lines: 1;
		/* #endif */
	}

	.uni-ellipsis-2 {
		/* #ifndef APP-NVUE */
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		/* #endif */

		/* #ifdef APP-NVUE */
		lines: 2;
		/* #endif */
	}

	.uni-list-chat__container {
		position: relative;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		flex: 1;
		padding: $uni-spacing-row-base $uni-spacing-row-lg;
		position: relative;
		overflow: hidden;
	}

	.uni-list-chat__header-warp {
		position: relative;
	}

	.uni-list-chat__header {
		/* #ifndef APP-NVUE */
		display: flex;
		align-content: center;
		/* #endif */
		flex-direction: row;
		justify-content: center;
		align-items: center;
		flex-wrap: wrap-reverse;
		/* #ifdef APP-NVUE */
		width: 100rpx;
		height: 100rpx;
		/* #endif */
		/* #ifndef APP-NVUE */
		width: $avatar-width;
		height: $avatar-width;
		/* #endif */

		border-radius: $avatar-border-radius;
		border-color: $avatar-border-color;
		border-width: $avatar-border-width;
		border-style: solid;
		overflow: hidden;
	}

	.uni-list-chat__header-box {
		/* #ifndef APP-PLUS */
		box-sizing: border-box;
		display: flex;
		width: $avatar-width;
		height: $avatar-width;
		/* #endif */
		/* #ifdef APP-NVUE */
		width: 100rpx;
		height: 100rpx;
		/* #endif */
		overflow: hidden;
		border-radius: 4rpx;
	}

	.uni-list-chat__header-image {
		
		/* #ifdef APP-NVUE */
		margin: 2rpx;
		width: 100rpx;
		height: 100rpx;
		/* #endif */
		/* #ifndef APP-NVUE */
		width: $avatar-width;
		height: $avatar-width;
		/* #endif */
		border-radius: 10rpx;
	}

	/* #ifndef APP-NVUE */
	.uni-list-chat__header-image {
		display: block;
		width: 100%;
		height: 100%;
	}

	.avatarItem--1 {
		width: 100%;
		height: 100%;
	}

	.avatarItem--2 {
		width: 47%;
		height: 47%;
	}

	.avatarItem--3 {
		width: 32%;
		height: 32%;
	}

	/* #endif */
	.header--circle {
		border-radius: 50%;
	}

	.uni-list-chat__content {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		flex: 1;
		overflow: hidden;
		/* #ifdef APP-NVUE */
		padding: 6rpx 0;
		/* #endif */
	}


	.uni-list-chat__content-main {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		justify-content: space-between;

		padding-left: $uni-spacing-row-base;
		flex: 1;
		overflow: hidden;
	}

	.uni-list-chat__content-title {
		font-size: $title-size;
		color: $title-color;
		font-weight: $title-weight;
		overflow: hidden;
	}

	.uni-list-chat__content-note {

		color: $note-color;
		font-size: $note-size;
		font-weight: $title-weight;
		overflow: hidden;
	}

	.uni-list-chat__content-extra {
		/* #ifndef APP-NVUE */
		flex-shrink: 0;
		display: flex;
		/* #endif */
		flex-direction: column;
		justify-content: space-between;
		align-items: flex-end;
		margin-left: 10rpx;
	}

	.uni-list-chat__content-extra-text {
		color: $right-text-color;
		font-size: $right-text-size;
		font-weight: $right-text-weight;
		overflow: hidden;
	}

	.uni-list-chat__badge-pos {
		position: absolute;
		/* #ifdef APP-NVUE */
		left: 110rpx;
		top: 6rpx;
		/* #endif */
		/* #ifndef APP-NVUE */
		left: calc(#{$avatar-width} + 10px - #{$badge-space} + #{$badge-left});
		top: calc(#{$uni-spacing-row-base}/2 + 1px + #{$badge-top});
		/* #endif */
	}

	.uni-list-chat__badge {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		justify-content: center;
		align-items: center;
		border-radius: 200rpx;
		background-color: $badge-background-color;
	}

	.uni-list-chat__badge-text {
		color: $badge-color;
		font-size: $badge-font;
	}

	.uni-badge--single {

		/* #ifndef APP-NVUE */
		left: calc(#{$avatar-width} + 7px + #{$badge-left});
		/* #endif */
		width: $badge-size;
		height: $badge-size;
	}

	.uni-badge--complex {
		/* #ifdef APP-NVUE */
		left: 100rpx;
		/* #endif */
		/* #ifndef APP-NVUE */
		width: auto;
		/* #endif */
		height: $badge-size;
		padding: 0 $badge-space;
	}

	.uni-badge--dot {
		/* #ifdef APP-NVUE */
		left: 120rpx;
		top: 12rpx;
		/* #endif */
		/* #ifndef APP-NVUE */
		left: calc(#{$avatar-width} + 15px - #{$dot-width}/2 + 1px + #{$badge-left});
		/* #endif */
		width: $dot-width;
		height: $dot-height;
		padding: 0;
	}

	.uni-list-chat--right {
		/* #ifdef APP-NVUE */
		left: 0;
		/* #endif */
	}
</style>
