<template>
	<!-- 此页面为空白页，只为去掉扫码页面的code -->
	<view class="blank">
		登录中...
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		onLoad(options) {
			
			//清除缓存
			// uni.clearStorageSync();
			
			let token = uni.getStorageSync('token');
			
			if(token == null || token == "") {
				//如果为空获取code发起请求
				let code = this.getUrlCode('code');
				console.log(code)
				// alert(code);
				if(code !== null || code !== "") {
					this.getOpenidAndUserinfo(code)
				}
			} else {
				
				this.goIndex();
				
			}
			
		},
		methods: {
			getUrlCode (name) {
				return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ''])[1].replace(/\+/g, '%20')) || null
			},
			async getOpenidAndUserinfo(code) {
				let res = await this.$request({
					url: this.$url.wxloginUrl,
					method: 'post',
					data: {
						code: code,
					}
				});
				
				if(res.data.code == 0) {
					
					let userInfo = res.data.data.userInfo;
					userInfo.userType = res.data.data.userType;
					
					let token = res.data.data.token;
					
					uni.setStorageSync('userInfo', userInfo);
					uni.setStorageSync('token', token);
				
				}
				
				this.goIndex();

			},
			goIndex() {
				let url = this.$url.frontEndUrl + '/#/pages/blindbox-show/blindbox-show';
				window.location.href = url;
			},
		}
	}
</script>

<style lang="scss">
	
	.blank {
		font-size: 34rpx;
		text-align: center;
		padding-top: 300rpx;
		line-height: 100rpx;
	}

</style>
