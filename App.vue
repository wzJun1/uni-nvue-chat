<script>
	export default {
		globalData: {  
            systemInfo:[]
        },
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
			getApp().globalData.systemInfo = uni.getSystemInfoSync();
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
</style>
