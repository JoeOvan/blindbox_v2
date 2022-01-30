<template>
	<view class="wrapper">
		<view class="login-cover">
			<image class="cover" src="../../static/images/login-cover.png" mode="widthFix"></image>
		</view>
		<view class="login-wrap">
			<view class="btn-login" @click="login()">微信登录</view>
			<view class="tips" @click="tipsChecked()">
				<label for="read">
					<checkbox name="read" :class="checked?'checked':''" :checked="checked?true:false" value="A"></checkbox>
					登录注册即表示同意<text class="link" @click="getAgreement()">用户协议</text>
				</label>
			</view>
		</view>
		
		<!-- 用户协议 -->
		<view class="cu-modal agreement-modal" :class="modalName=='Modal'?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end modal-head">
					<view class="content">用户协议</view>
				</view>
				<view class="modal-content">
					<view v-html="noticeContent"></view>
				</view>
				<view class="btn-read" @tap="hideModal">
					我已阅读并了解
				</view>
			</view>
		</view>
		<!-- 用户协议end -->
	</view>
</template>

<script>
	// import { mapState } from 'vuex'
	export default {
		// computed: mapState(['forcedLogin', 'hasLogin', 'userName']),//对全局变量进行监控
		data() {
			return {
				isWeixin: false,
				modalName: null, //弹出窗口
				
				checked: false,  //已阅读是不勾选
				noticeContent: null, //用户协议内容
			}
		},
		onLoad() {
			
			let token = uni.getStorageSync('token');
			
			if(token) {
				//如果存在token直接跳转
				let url = this.$url.frontEndUrl + '/#/pages/blindbox-show/blindbox-show';
				window.location.href = url;
			}
			
		},
		methods: {
			login() {
				//判断是否已勾选
				let checked = this.checked;
				// alert(checked);
				if(checked) {
					
					// let url = encodeURIComponent('http://21471yw772.51mypc.cn/#/pages/blank/blank');
					let frontEndUrl = this.$url.frontEndUrl;
					let url = encodeURIComponent(frontEndUrl+'/#/pages/blank/blank');
					window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx1c9d77f2a708e46d&redirect_uri=${url}&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect`;
					
					
					
				} else {
					uni.showToast({
						title: '勾选已阅读并同意',
						icon: 'none',
						duration: 2000
					});
					return;
				}
					
			},
			
			async getAgreement()  {
				
				// this.modalName = "Modal";
				
				//请求用户协议
				let res = await this.$request({
					url: this.$url.agreementUrl,
					method: 'get',
				});
				
				console.log(res);
				
				this.noticeContent = res.data.data.noticeContent;
				// this.noticeContent = JSON.stringify(res.data.data.noticeContent);
				
				this.modalName = "Modal";

				// alert(this.noticeContent);
			},
			hideModal(e) {
				
				this.modalName = null;

			},
			tipsChecked() {
				this.checked = !this.checked;
			}
		}
	}
</script>

<style lang="scss">
	.wrapper {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background-image: url(../../static/images/bg-login.png);
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
	}
	
	.login-cover {
		position: absolute;
		top: 20%;
		width: 100%;
		.cover {
			display: block;
			width: 100%;
		}
	}
	
	.login-wrap {
		position: absolute;
		width: 100%;
		top: 900rpx;
		text-align: center;
		.btn-login {
			display: inline-block;
			width: 400rpx;
			height: 100rpx;
			line-height: 100rpx;
			font-size: 44rpx;
			font-weight: bold;
			color: #FF3C00;
			margin: 0 auto;
			border: 4rpx solid #D73140;
			background: linear-gradient(0deg, #FFF3D5 0%, #FFFFFF 100%);
			border-radius: 50rpx;
		}
		.tips {
			font-size: 24rpx;
			font-weight: 400;
			color: #FFFFFF;
			.link {
				display: inline-block;
				margin-top: 70rpx;
				text-decoration: underline;
			}
			checkbox {
				margin-right: -5rpx;
				transform: scale(0.5,0.5);
				vertical-align: 3rpx;
			}
		}
	}
	
	// 用户协议
	.agreement-modal {
		.cu-dialog{
			width: 600rpx;
			border-radius: 30rpx;
		}
		.modal-head {
			height: 80rpx;
			font-size: 34px;
			font-weight: bold;
			color: #FFFFFF;
			background: #FD5C40;
			border-radius: 30rpx 30rpx 0 0;
		}
		.modal-content {
			height: 750rpx;
			padding: 28rpx 33rpx;
			font-size: 28rpx;
			font-weight: 400;
			color: #000000;
			line-height: 40rpx;
			text-align: left;
			overflow-y: auto;
			
		}
		.btn-read {
			width: 300rpx;
			height: 70rpx;
			line-height: 70rpx;
			margin: 10rpx auto 30rpx auto;
			font-size: 30rpx;
			font-weight: 400;
			color: #FFFFFF;
			background: #FD5C40;
			border-radius: 35rpx;
		}
	}
</style>
