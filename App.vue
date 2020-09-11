<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			// #ifdef  H5
			let path = "/paths" + window.location.href.split("/pages")[1];
			let user = uni.getStorageSync('user');
			if(!user){
				if(path != "/pages/index/login" || path != "/pages/index/regist"){
					uni.reLaunch({
						url: "/pages/index/login"
					})
				}
			}
			// #endif
		},
		onShow: function() {
			console.log('App Show')
			this.$store.dispatch('initLogin')
		},
		onHide: function() {
			console.log('App Hide')
			this.$store.dispatch('closeWebSocket')
		},
		onUnload:function(){
			console.log('App onUnload')
		},
		onError:function(err){
			console.log(err)
		}
		
	}
</script>

<style lang="scss">
	image {
		will-change: transform
	}
	.line{
		height: 20rpx;
		width: 750rpx;
		background-color: #ededed;
	}
	/*  #ifndef  APP-NVUE  */
		page{
			background-color: #ededed;
		}
	/*  #endif  */
	 
</style>
