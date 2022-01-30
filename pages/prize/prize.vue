<template>
	<view class="wrapper">
		<cu-custom bgColor="text-white bg-header" :isBack="true">
			<block slot="backText" v-if="prizeInfo">{{prizeInfo.title}}</block>
		</cu-custom>
		
		<view class="intro-cover" v-if="prizeInfo">
			<!-- <image class="cover" :src="baseUrl+prizeInfo.imgUrl"></image> -->
			<fr-image class="cover" :src="prizeInfo.imgUrl !==null ? (baseUrl+prizeInfo.imgUrl) : '../../static/images/default-image.jpg'" loading-ing-img="../../static/images/default-image.jpg"/>
		</view>
		
		<!-- 奖品列表 -->
		<view class="prize-list" v-if="prizeInfo">
			
			<block v-for="(item,index) of prizeInfo.prize" :key="index">				
				<view class="list-item-wrap">				
					<view class="list-item">				
						<view class="cover-wrap">
							<!-- <image class="cover" :src="baseUrl+item.imgUrl" @error="error(index)"></image> -->
							<!-- <image class="cover" :src="baseUrl+item.imgUrl" mode="widthFix"></image> -->
							<fr-image class="cover" :src="item.imgUrl !==null ? (baseUrl+item.imgUrl) : '../../static/images/default-image.jpg'" loading-ing-img="../../static/images/default-image.jpg" mode="aspectFill"/>
						</view>
						<view class="name">{{item.name}}</view>
					</view>
				</view>
			</block>
			
		</view>
		<!-- 奖品列表end -->
		
		
		<view class="shop-info-wrap">
			<view class="shop-logo">
				<!-- <image class="logo" :src="baseUrl + prizeInfo.shop.logoUrl"></image> -->
				<fr-image class="cover" :src="prizeInfo.shop.logoUrl !==null ? (baseUrl+prizeInfo.shop.logoUrl) : '../../static/images/default-image.jpg'" loading-ing-img="../../static/images/default-image.jpg"/>
			</view>
			<view class="shop-info">
				<view class="name">{{prizeInfo.shop.name}}</view>
				<view class="info">
					<view class="info-item">地址：{{prizeInfo.shop.address}}</view>
					<view class="info-item">电话：{{prizeInfo.shop.mobile}}</view>
				</view>
			</view>
		</view>
		
		
		<view class="rule-wrap" v-if="prizeInfo">
			<view class="title"><view class="sign"></view>活动规则说明：</view>
			<view class="rule-content" v-html="prizeInfo.content">
				
			</view>
		</view>
		
		
		<view class="tabbar-wrap">
			<view class="btn-pay" v-if="prizeInfo" @tap="getPayPrize(prizeInfo.prizePoolId)">{{prizeInfo.price}}元/次</view>
		</view>
		
	</view>
</template>

<script>
	import FrImage from '@/components/fr-image/fr-image.vue';
	export default {
		data() {
			return {
				prizeInfo: null, //奖品列表
				baseUrl: this.$url.baseUrl,  //图片基本路径
				prizePoolId: null,
			}
		},
		onLoad(option){

			this.prizePoolId = option.prizePoolId;
			
			//抽奖
			this.getPrizePoll(this.prizePoolId);
		
		},
		methods: {
			async getPrizePoll(prizePoolId) {
				//请求抽奖活动信息
				let res = await this.$request({
					url: this.$url.prizePollUrl + prizePoolId,
				});
				
				this.prizeInfo = res.data.data;
				
			},
			async getPayPrize(prizePoolId) {
				
				let token = uni.getStorageSync('token');
				
				//请求支付所需参数
				let res = await this.$request({
					url: this.$url.payPrizeUrl+"?prizePoolId="+prizePoolId,
					method: 'get',
					header: {
						"content-type": "application/x-www-form-urlencoded",
						"X-Winzkj-Token": token
					}
				});
				
				console.log(res);
				
				//发起微信支付
				this.weChatPayment(res.data.data);
				
			},
			//微信支付
			weChatPayment(data) {

				let that = this;
				this.onBridgeReady(data, function(res) {
					
					uni.showToast({
						title: '支付成功',
						icon: 'none',
						duration: 2000
					});
					
					let prizePoolId = that.prizePoolId;
					let tradeNo = data.tradeNo;
					
					uni.navigateTo({
						url: `/pages/blindbox/blindbox?prizePoolId=${prizePoolId}&tradeNo=${tradeNo}`
					})
				
				}, function(res) {
					uni.showToast({
						title: '支付失败',
						icon: 'none',
						duration: 2000
					});
				});
			},
			/* 微信支付调起函数 */
			onBridgeReady(param, successCallBack, failCallBack) {
				WeixinJSBridge.invoke( //自带的
					'getBrandWCPayRequest', {
						"appId": param.appId, //公众号名称，由商户传入
						"timeStamp": param.timeStamp, //时间戳，自1970年以来的秒数
						"nonceStr": param.nonceStr, //随机串
						"package": param.package,
						"signType": param.signType, //微信签名方式：
						"paySign": param.paySign //微信签名
					},
					function(res) {
						// alert(res);
						if (res.err_msg == "get_brand_wcpay_request:ok") {
							// 使用以上方式判断前端返回,微信团队郑重提示：
							//res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
							if (typeof successCallBack == "function") {
								successCallBack(res);
							}
						} else {
							if (typeof failCallBack == "function") {
								failCallBack(res);
							}
						}
					}
				);
			},
		}
	}
</script>

<style lang="scss">
	// .bg-header {
	// 	color: #ffffff;
	// 	background-color: #FD5C40;
	// }
	page {
		background: #ffffff;
	}
	.wrapper {
		padding-bottom: 90rpx;
	}
	
	.intro-cover {
		width: 750rpx;
		height: 400rpx;
		.cover {
			width: 100%;
			height: 100%;
		}
	}
	
	//奖品列表
	.prize-list {
		.list-item-wrap {
			padding: 30rpx 15rpx 0 15rpx;
			display: inline-block;
			.list-item {
				width: 220rpx;
				box-sizing: border-box;
				.cover-wrap {
					width: 220rpx;
					height: 220rpx;
					.cover {
						display: inline-block;
						width: 100%;
						height: 100%;
					}
				}
				.name {
					font-size: 28rpx;
					font-weight: 400;
					color: #000000;
					line-height: 38rpx;
				}
			}
		
		}
	}
	
	
	//商家信息
	.shop-info-wrap {
		display: flex;
		margin: 15rpx;
		padding: 20rpx 0;
		background: #ffffff;
		border-top: 1rpx solid #DDDDDD;
		border-bottom: 1rpx solid #DDDDDD;
		.shop-logo {
			display: inline-block;
			width: 100rpx;
			height: 70rpx;
			margin-right: 15rpx;
			flex-shrink: 0;
			.logo {
				display: inline-block;
				width: 100%;
				height: 100%;
			}
		}
		.shop-info {
			
			.name {
				font-size: 30rpx;
				color: #000000;
			}
			.info {
				font-size: 24rpx;
				color: #666666;
				.info-item {
					line-height: 38rpx;
				}
			}
		}
	}
	
	//活动规则
	.rule-wrap {
		margin: 15rpx;
		padding: 20rpx 15rpx;
		font-size: 24rpx;
		font-weight: 400;
		color: #666666;
		line-height: 50rpx;
		background: #F4F4F4;
		.title {
			.sign {
				display: inline-block;
				width: 6rpx;
				height: 30rpx;
				margin-right: 5rpx;
				background: #CCCCCC;
				vertical-align: middle;
			}
		}
	}
	
	.tabbar-wrap {
		display: flex;
		position: fixed;
		bottom: 0;
		width: 100%;
		align-items: center;
		height: 90rpx;
		text-align: center;
		background: #FFFFFF;
		box-shadow: 0 5rpx 15rpx 1rpx rgba(0, 0, 0, 0.3);
		.btn-pay {
			width: 170rpx;
			height: 50rpx;
			line-height: 50rpx;
			font-size: 28rpx;
			font-weight: bold;
			margin: 0 auto;
			color: #ffffff;
			background: #FD5C40;
			border-radius: 25px;
		}
	}
	

</style>
