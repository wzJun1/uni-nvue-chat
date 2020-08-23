import $store from '@/store/index.js';
import pinyin from './getPingYin.js';
class utils {
	constructor(arg) {

	}
	
	//返回上一页
	back(delta = 1){
		uni.navigateBack({
			delta:delta
		})
	}
	
	//获取好友备注，没有返回昵称
	getNickName(friend_id,nickname){
		var friendIds = uni.getStorageSync("friendIds");
		if(friendIds.length){
			let petName = nickname;
			friendIds.forEach((item)=>{
				if(friend_id == item.friend_id){
					if(item.pet_name != undefined){
						petName = item.pet_name;
					}
				}
			})
			return petName;
		}else{
			return nickname;
		}
	}
	
	getGroupById(id){
		let groups = uni.getStorageSync("groupList");
		let info = [];
		if(groups.length){
			groups.forEach((item)=>{
				if(id == item._id){
					info = item;
				}
			})
		}
		return info;
	}
	
	getFriendInfoById(id){
		let friends = $store.state.user.friendList;
		let info = [];
		if(friends.length){
			friends.forEach((item)=>{
				if(id == item._id){
					info = item;
				}
			})
		}
		return info;
	}
	
	//获取缓存头像
	getImageCache(url) {
		let key = `images_cache`;
		let list = uni.getStorageSync(key);
		list = list ? list : [];
		let index = list.findIndex(item => item.url === url)
		if (index !== -1) {
			return list[index]['cache'];
		} else {
			var cache = {
				url: url,
				cache: url,
			};
			uni.downloadFile({
				url: url,
				success: (res) => {
					if (res.statusCode === 200) {
						cache.cache = res.tempFilePath;
						list.push(cache);
						uni.setStorageSync(key, list);
					}
				},
				fail: (e) => {
			
				}
			});
			return cache.cache;
		}
	}
	
	//好友列表按首字母排序
	sortFriendList(data) {
		var friendList = data;
		var letter = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T",
			"U", "V", "W", "X", "Y", "Z" ,"#"
		];
		var indexData = [];
		letter.forEach((letterItem, letterIndex) => {
			var letterData = {
				letter: letterItem,
				data: []
			}
			friendList.forEach((friendListItem, friendListIndex) => {
				var firstLetter = friendListItem.nickname.substr(0, 1);
				var p = /[a-z]/i;
				var b = p.test(firstLetter);
				if(b){
					var firstWord = firstLetter.toUpperCase();
				}else{
					var firstWord = pinyin.initial(firstLetter);
				}
				var p2 = /[A-Z]/i;
				var b2 = p2.test(firstWord);
				if(!b2 && letterItem === "#"){
					letterData.data.push(friendListItem);
				}
				if (b2 && letterItem === firstWord) {
					letterData.data.push(friendListItem);
				}
			})
			if (letterData.data.length > 0) {
				indexData.push(letterData);
			}
		})
		return indexData;
	}
	//格式化时间
	formatChatTime(time) {
		time = this.dateFormat("YY-mm-dd HH:MM:SS", new Date(time));
		var date = time.toString();
		var year = date.split("-")[0];
		var month = date.split("-")[1];
		var day = date.split("-")[2];
		var d1 = new Date(year + '/' + month + '/' + day.split(" ")[0]);
		var d3 = new Date(date.replace(/-/g, "/"));
		var dd = new Date();
		var y = dd.getFullYear();
		var m = dd.getMonth() + 1;
		var d = dd.getDate();
		var d2 = new Date(y + '/' + m + '/' + d);
		var iday = parseInt(d2 - d1) / 1000 / 60 / 60 / 24;
		var hours = d3.getHours();
		var minutes = d3.getMinutes();
		if (minutes < 10) {
			minutes = '0' + minutes;
		}
		if (hours < 10) {
			hours = '0' + hours;
		}
		if (iday == 0) {
			if (hours >= 12) {
				return "下午 " + hours + ":" + minutes;
			} else {
				return "上午 " + hours + ":" + minutes;;
			}
		} else if (iday == 1) {
			var dt = "";
			if (hours >= 12) {
				dt = "下午 " + hours + ":" + minutes;
			} else {
				dt = "上午 " + hours + ":" + minutes;;
			}
			return "昨天 " + dt;
		} else if (iday == 2) {
			var dt = "";
			if (hours >= 12) {
				dt = "下午 " + hours + ":" + minutes;
			} else {
				dt = "上午 " + hours + ":" + minutes;;
			}
			return "前天 " + dt;
		} else {
			return year + '/' + month + "/" + d1.getDate()
		}
	}
	dateFormat(fmt, date) {
		let ret;
		const opt = {
			"Y+": date.getFullYear().toString(), // 年
			"m+": (date.getMonth() + 1).toString(), // 月
			"d+": date.getDate().toString(), // 日
			"H+": date.getHours().toString(), // 时
			"M+": date.getMinutes().toString(), // 分
			"S+": date.getSeconds().toString() // 秒
		};
		for (let k in opt) {
			ret = new RegExp("(" + k + ")").exec(fmt);
			if (ret) {
				fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
			};
		};
		return fmt;
	}
	 
}
export default utils
