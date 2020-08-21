const animation = uni.requireNativePlugin('animation');

export default {
	data() {
		return {
			systemInfo: [],
			searchTranslateX: 0,
			pageheadHeight:0,
			showSearch:false,
			friendSearchResult:[],
			groupSearchResult:[]
		}
	},
	created() {
		this.systemInfo = getApp().globalData.systemInfo;
		if(this.systemInfo.screenWidth == 768){
			this.searchTranslateX = parseInt(this.systemInfo.screenWidth / 2 - 88);
		}else if(this.systemInfo.screenWidth == 834){
			this.searchTranslateX = parseInt(this.systemInfo.screenWidth / 2 - 138);
		}else if(this.systemInfo.screenWidth == 1024){
			this.searchTranslateX = parseInt(this.systemInfo.screenWidth / 2 - 220);
		}else if(this.systemInfo.screenWidth > 700){
			this.searchTranslateX = parseInt(this.systemInfo.screenWidth / 2 - 100);
		}else{
			this.searchTranslateX = parseInt(this.systemInfo.screenWidth / 2 - 50) * 2;
			  
		} 
 
	}, 
	mounted() {
		var query = uni.createSelectorQuery()
		query.select('#pagehead').boundingClientRect(data => {
			this.pageheadHeight = data.height;
		}).exec(); 
	},
	beforeDestroy() {
	},
	methods: {
		searchInput(originalFriendList,groupList,e) {
			var friends = originalFriendList;
			var groups = groupList;
			var friendResult = [];
			var groupResult = [];
			if (e.value) {
				if (friends) {
					friends.forEach((item, index) => {
						if (item['nickname'].search(e.value) != -1) {
							friendResult.push(item);
						}
					})
				}
				if (groups) {
					groups.forEach((item, index) => {
						if (item['title'].search(e.value) != -1) {
							groupResult.push(item);
						}
					})
				}
			}
			this.friendSearchResult = friendResult;
			this.groupSearchResult = groupResult;
		},
		searchBarClick: function() {
			 
			var that = this;
			this.showSearch = true;
			
			setTimeout(function(){
				uni.hideTabBar();
				let navbar = that.getEl(that.$refs.navbar);
				let searchbar = that.getEl(that.$refs.searchbar);
				let pagehead = that.getEl(that.$refs.pagehead);
				let searchpanel = that.getEl(that.$refs.searchpanel);
				let navbar_move = uni.upx2px(300);
				let searchbar_move = uni.upx2px(88);
 
				animation.transition(navbar, {
					styles: { 
						transform: 'translateY(-'+navbar_move+')',
					},
					duration: 400, //ms
					timingFunction: 'linear',
					needLayout: false,
					delay: 0 //ms
				}, function() {
				
				})
				animation.transition(searchbar, {
					styles: {
						transform: 'translateY(-'+searchbar_move+')',
					},
					duration: 400, //ms
					timingFunction: 'linear',
					needLayout: false,
					delay: 0 //ms
				}, function(res) {
					 
				})
				
				animation.transition(searchpanel, {
					styles: {
						transform: 'translateY(-'+searchbar_move+')',
					},
					duration: 400, //ms
					timingFunction: 'linear',
					needLayout: false,
					delay: 0 //ms
				}, function(res) {
					 
				})
				
				var statusBarHeight = that.systemInfo.statusBarHeight;
				var navBarHeight = 44;
				var searchBarHeight = 36 + 6;
				var pageheadHeight = 0;
				if (that.systemInfo.platform == "android") {
					pageheadHeight = that.pageheadHeight - navBarHeight;
				} else {
					pageheadHeight = statusBarHeight + searchBarHeight;
				}
				 
				animation.transition(pagehead, {
					styles: {
						height: uni.upx2px(pageheadHeight*2),
					},
					duration: 400, //ms  
					timingFunction: 'linear',
					needLayout: false,
					delay: 0 //ms
				}, function() {
				
				})
				
			},100)
		},
		searchBarCancel: function() {

			var that = this;
			setTimeout(function(){
				
				let navbar = that.getEl(that.$refs.navbar);
				let searchbar = that.getEl(that.$refs.searchbar);
				let pagehead = that.getEl(that.$refs.pagehead);
				let searchpanel = that.getEl(that.$refs.searchpanel);
				animation.transition(navbar, {
					styles: {
						transform: 'translateY(0)',
					},
					duration: 300, //ms
					timingFunction: 'linear',
					needLayout: false,
					delay: 0 //ms
				}, function() {
					
				})
				animation.transition(searchbar, {
					styles: {
						transform: 'translateY(0)',
					},
					duration: 400, //ms
					timingFunction: 'linear',
					needLayout: false,
					delay: 0 //ms
				}, function() {
					 
				})
				animation.transition(searchpanel, {
					styles: {
						transform: 'translateY(0)',
					},
					duration: 400, //ms
					timingFunction: 'linear',
					needLayout: false,
					delay: 0 //ms
				}, function() {
					that.showSearch = false;
					uni.showTabBar();
				})
				var statusBarHeight = that.systemInfo.statusBarHeight;
				var navBarHeight = 44;
				var searchBarHeight = 36 + 5;
				if (that.systemInfo.platform == "android") {
					var h = statusBarHeight + that.pageheadHeight;
					animation.transition(pagehead, {
						styles: {
							height: that.pageheadHeight,
						},
						duration: 400, //ms
						timingFunction: 'linear',
						needLayout: false,
						delay: 0 //ms
					}, function() { 
				
					})
				}
			
			},100)
			
			
		 
		},
		getEl(el) {
			if (typeof el === 'string' || typeof el === 'number') return el;
			if (WXEnvironment) {
				return el.ref;
			} else {
				return el instanceof HTMLElement ? el : el.$el;
			}
		},
	}
}
