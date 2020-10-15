<template>
	<view class="uni-searchbar">
		<view :style="{borderRadius:radius+'rpx',backgroundColor: bgColor}" class="uni-searchbar__box" @click="searchClick">
			<!-- #ifdef MP-ALIPAY -->
			<view class="uni-searchbar__box-icon-search">
				<uni-icons color="#a8a8a8" size="36" type="search" />
			</view>
			<!-- #endif -->
			<!-- #ifndef MP-ALIPAY -->
			<view class="" ref="iconRef" :style="'margin-left:'+searchTranslateX+'rpx'">
				<uni-icons color="#a8a8a8" class="uni-searchbar__box-icon-search" size="36" type="search" />
			</view>
			<!-- #endif -->
			<input :disabled="disabled" :focus="showSync" @blur="blur" @focus="searchClick" @click="searchClick" @input="searchInput" :placeholder="placeholder" :maxlength="maxlength" @confirm="confirm" class="uni-searchbar__box-search-input" ref="inputRef" confirm-type="search" type="text" v-model="searchVal" />
		 
			 
			<view v-if="show && (clearButton==='always'||clearButton==='auto'&&searchVal!=='')" class="uni-searchbar__box-icon-clear" @click="clear">
				<uni-icons @click="clear" color="#a8a8a8" class="" size="48" type="clear" />
			</view>
		</view> 
		
		<text @click="cancel" class="uni-searchbar__cancel" v-if="cancelButton ==='always' || show && cancelButton ==='auto'">{{cancelText}}</text>
		
	</view>
</template>

<script>
	import uniIcons from "../uni-icons/uni-icons.vue";
	// #ifdef APP-PLUS
	const Binding = uni.requireNativePlugin('bindingx');
	const animation = uni.requireNativePlugin('animation');
	// #endif
	 
	export default {
		name: "UniSearchBar",
		components: {
			uniIcons
		},
		props: {
			placeholder: {
				type: String,
				default: "请输入搜索内容"
			},
			radius: {
				type: [Number, String],
				default: 5
			},
			clearButton: {
				type: String,
				default: "auto"
			},
			cancelButton: {
				type: String,
				default: "auto"
			},
			cancelText: {
				type: String,
				default: '取消'
			},
			bgColor: {
				type: String,
				default: "#F8F8F8"
			},
			maxlength: {
				type: [Number, String],
				default: 100
			},
			searchTranslateX: {
				type: [Number, String],
				default: 0
			},
		},
		data() {
			return {
				show: false,
				showSync: false,
				disabled:true,
				searchVal: "",
				center:'text-align:center',
			}
		},
		watch: {
			searchVal() {
				this.$emit("input", {
					value: this.searchVal
				})
			}
		},
	 
		methods: {
			searchClick() {
			 
				if (this.show) {
					return
				}
				 
				this.searchVal = ""
				this.show = true;
				this.$nextTick(() => {
					this.disabled = false;
					this.showSync = true;
				})
				this.$emit("searchBarClick");
				// #ifdef APP-PLUS
				let inputRef = this.getEl(this.$refs.inputRef);
				let iconRef = this.getEl(this.$refs.iconRef);
				let searchTranslateX = uni.upx2px(this.searchTranslateX);
				animation.transition(inputRef, {
				    styles: {
				        transform: 'translateX(-'+searchTranslateX+')',
				    },
				    duration: 1, //ms
				    timingFunction: 'linear',
				    needLayout:false,
				    delay: 0 //ms
				}, function () {
				      
				})
				 
				animation.transition(iconRef, {
				    styles: {
				        transform: 'translateX(-'+searchTranslateX+')',
				    },
				    duration: 1, //ms
				    timingFunction: 'linear',
				    needLayout:false,
				    delay: 0 //ms
				}, function () {
				      
				})
				// #endif
				
				
			},
			blur(){
				this.disabled = true;
			},
			getEl(el) {
				if (typeof el === 'string' || typeof el === 'number') return el;
				// #ifndef APP-PLUS
				// let WXEnvironment = false;
				// let HTMLElement = false;
				// if (WXEnvironment) {
				// 	return el.ref;
				// } else {
				// 	return el instanceof HTMLElement ? el : el.$el;
				// }
				// #endif
				
				// #ifdef APP-PLUS
				 
				if (WXEnvironment) {
					return el.ref;
				} else {
					return el instanceof HTMLElement ? el : el.$el;
				}
				// #endif
				 
			},
			clear() {
				console.log("cla")
				this.searchVal = ""
				
			},
			cancel() {
				this.$emit("cancel", {
					value: this.searchVal
				});
				this.searchVal = ""
				this.show = false
				this.showSync = false
				// #ifndef APP-PLUS
				uni.hideKeyboard()
				// #endif
				// #ifdef APP-PLUS
				plus.key.hideSoftKeybord()
				// #endif
				 
				// #ifdef APP-PLUS
				let inputRef = this.getEl(this.$refs.inputRef);
				let iconRef = this.getEl(this.$refs.iconRef);
				
				animation.transition(inputRef, {
				    styles: {
				        transform: 'translateX(0)',
				    },
				    duration: 300, //ms
				    timingFunction: 'linear',
				    needLayout:false,
				    delay: 0 //ms
				}, function () {
				      
				})
				
				animation.transition(iconRef, {
				    styles: {
				        transform: 'translateX(0)',
				    },
				    duration: 300, //ms
				    timingFunction: 'linear',
				    needLayout:false,
				    delay: 0 //ms
				}, function () {
				      
				})
				// #endif
			},
			confirm() {
				// #ifndef APP-PLUS
				uni.hideKeyboard();
				// #endif
				// #ifdef APP-PLUS
				plus.key.hideSoftKeybord()
				// #endif
				this.$emit("confirm", {
					value: this.searchVal
				})
			},
			searchInput(e){
				 
				this.$emit("input", {
					e: e
				})
			}
			
		}
	};
</script>

<style lang="scss" scoped>
	$uni-searchbar-height: 72rpx;

	.uni-searchbar {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		position: relative;
		padding: $uni-spacing-col-base;
		background-color: #EDEDED;
	}

	.uni-searchbar__box {
		/* #ifndef APP-NVUE */
		display: flex;
		box-sizing: border-box;
		/* #endif */
		overflow: hidden;
		position: relative;
		flex: 1;
		justify-content: center;
		flex-direction: row;
		align-items: center;
		height: $uni-searchbar-height;
		padding: 10rpx 16rpx 10rpx 0px;
		// border-width: 0.5px;
		// border-style: solid;
		// border-color: $uni-border-color;
	}

	.uni-searchbar__box-icon-search {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		width: 64rpx;
		justify-content: center;
		align-items: center;
		color: #a8a8a8;
	}

	.uni-searchbar__box-search-input {
		flex: 1;
		font-size: 35rpx;
		color: #a8a8a8;
	}

	.uni-searchbar__box-icon-clear {
		align-items: center;
		line-height: 48rpx;
		padding-left: 10rpx;
	}

	.uni-searchbar__text-placeholder {
		font-size: 32rpx;
		color: #a8a8a8;
		margin-left: 10rpx;
	}

	.uni-searchbar__cancel {
		padding-left: 20rpx;
		line-height: $uni-searchbar-height;
		font-size: 28rpx;
		color: $uni-text-color;
	}
	.input-placeholder{
		margin-left: 264rpx;
	}
</style>
