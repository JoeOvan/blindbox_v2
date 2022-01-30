<template>
	<view class="wrapper">
		<cu-custom bgColor="text-white bg-header" :isBack="true">
			<block slot="backText">购买记录</block>
		</cu-custom>
		
		<view class="content" v-if="recordStatusData">
			
			<!-- 店名 -->
			<view class="shop-wrap">
				<image class="icon-shop" src="../../static/images/icon-shop.png"></image>
				<view class="shop-name">
					{{recordStatusData.shop.name}}
				</view>
				<image class="icon-arrows" src="../../static/images/icon-arrows-grey.png"></image>
			</view>
			
			<!-- 奖品 -->
			<view class="cart-goods-item">
				<view class="goods-cover">
					<!-- <image class="cover" :src="baseUrl+recordStatusData.prizeImgUrl" mode="aspectFill" @error="error(index)"></image> -->
					<fr-image class="cover" :src="recordStatusData.prizeImgUrl !==null ? (baseUrl+recordStatusData.prizeImgUrl) : '../../static/images/default-image.jpg'" loading-ing-img="../../static/images/default-image.jpg" mode="aspectFill"/>
				</view>
				<view class="goods-info">
					<view class="title">{{recordStatusData.prizeName}}</view>
					<view class="intro">x 1次</view>
					<view class="price-wrap">
						<view class="price">{{recordStatusData.prizePoolPrice}}元/次</view>
						<view class="count-wrap" v-if="recordStatusData.cashStatus == '未使用'">
							<!-- <view class="btn-again">再来一次</view> -->
							<view class="btn-edit-address" @tap="editPrizeInfo()">快递配送</view>
						</view>
					</view>
				</view>
			</view>
			
			<!-- //已使用 -->
			<block v-if="recordStatusData.cashStatus == '未使用'">
					
				<view class="prize-status-wrap">
					<view class="prize-cover">
						<!-- <image class="cover" src="https://z3.ax1x.com/2021/07/06/RoPJSJ.png"></image> -->
						<view class="cover">
							<canvas canvas-id="qrcode" :style="{width: `${qrcodeSize}px`, height: `${qrcodeSize}px`}" />
						</view>
						
					</view>
				</view>
				
				
				<!-- 奖品信息 -->
				<view class="prize-info-wrap">
					<view class="prize-info-item">
						<view class="label">有效期限：</view>
						<view class="text">{{recordStatusData.endCashPriceTime}}</view>
					</view>
					<view class="prize-info-item">
						<view class="label">兑奖方式：</view>
						<view class="text">到店使用</view>
					</view>
				</view>
				
			</block>
			
			<block v-if="recordStatusData.cashStatus == '已使用'">
				
				<!-- 配送 -->
				<block v-if="recordStatusData.cashPrizeType == 1">
					
					<view class="prize-status-wrap">
						<view class="prize-cover">
							<image class="cover" src="../../static/images/cover-delivery.png"></image>
							<view class="prize-status">
								<image class="status" src="../../static/images/icon-delivery.png"></image>
							</view>
						</view>
					</view>
					
					
					<!-- 奖品信息 -->
					<view class="prize-info-wrap">
						<view class="prize-info-item">
							<view class="label">收货人：</view>
							<view class="text">{{recordStatusData.order.consignee}}</view>
						</view>
						<view class="prize-info-item">
							<view class="label">联系电话：</view>
							<view class="text">{{recordStatusData.order.moblie}}</view>
						</view>
						<view class="prize-info-item">
							<view class="label">收货地址：</view>
							<view class="text">{{recordStatusData.order.address}}</view>
						</view>
						<view class="prize-info-item">
							<view class="label">物流信息：</view>
							<view class="text">{{recordStatusData.order.expressName}}&nbsp;&nbsp;{{recordStatusData.order.expressNo}}</view>
						</view>
						<view class="prize-info-item">
							<view class="label">抽奖时间：</view>
							<view class="text">{{recordStatusData.createTime}}</view>
						</view>
						<view class="prize-info-item">
							<view class="label">有效期限：</view>
							<view class="text">{{recordStatusData.endCashPriceTime}}</view>
						</view>
						<view class="prize-info-item">
							<view class="label">兑奖时间：</view>
							<view class="text">{{recordStatusData.cashPrizeTime}}</view>
						</view>
						<view class="prize-info-item">
							<view class="label">兑奖方式：</view>
							<view class="text">快递配送</view>
						</view>
					</view>
					
				</block>
				
				<!-- 到店使用 -->
				<block v-if="recordStatusData.cashPrizeType == 2">
					
					<view class="prize-status-wrap">
						<view class="prize-cover">
							<view class="cover">
								<canvas canvas-id="qrcode" :style="{width: `${qrcodeSize}px`, height: `${qrcodeSize}px`}" />
							</view>
							<view class="mask"></view>
							<view class="prize-status">
								<image class="status" src="../../static/images/icon-used.png"></image>
							</view>
						</view>
					</view>
					
					<!-- 奖品信息 -->
					<view class="prize-info-wrap">
						<view class="prize-info-item">
							<view class="label">抽奖时间：</view>
							<view class="text">{{recordStatusData.createTime}}</view>
						</view>
						<view class="prize-info-item">
							<view class="label">有效期限：</view>
							<view class="text">{{recordStatusData.endCashPriceTime}}</view>
						</view>
						<view class="prize-info-item">
							<view class="label">兑奖时间：</view>
							<view class="text">{{recordStatusData.cashPrizeTime}}</view>
						</view>
						<view class="prize-info-item">
							<view class="label">兑奖方式：</view>
							<view class="text">快递配送</view>
						</view>
					</view>
					
					
				</block>

				
			</block>
			
			
			<block v-if="recordStatusData.cashStatus == '已过兑奖时间'">
				
				<view class="prize-status-wrap">
					<view class="prize-cover">
						<image class="cover" src="../../static/images/cover-invalid.png"></image>
						<view class="prize-status">
							<image class="status" src="../../static/images/icon-invalid.png"></image>
						</view>
					</view>
				</view>
				
				<!-- 奖品信息 -->
				<view class="prize-info-wrap">
					<view class="prize-info-item">
						<view class="label">抽奖时间：</view>
						<view class="text">{{recordStatusData.createTime}}</view>
					</view>
					<view class="prize-info-item">
						<view class="label">有效期限：</view>
						<view class="text">{{recordStatusData.endCashPriceTime}}(已过期)</view>
					</view>
				</view>
				
			</block>
			
		</view>

	</view>
</template>

<script>
	import uQRCode from '@/components/uni-qrcode/uqrcode.js';
	import FrImage from '@/components/fr-image/fr-image.vue';
	export default {
		data() {
			return {
				recordStatusData: null,//记录状态数据
				baseUrl: this.$url.baseUrl, //图片基本路径
				
				//生成二维码
				qrcodeSize: uni.upx2px(350),
				qrcodeMargin: uni.upx2px(20),
				qrcodeText: null,
				
				prizeLogId: null,//中奖记录Id
			}
		},
		onLoad(options) {
			
			
			//查询当前用户的某个中奖记录
			this.prizeLogId = options.prizeLogId;
			this.getQueryPrizeLog();
		},
		methods: {
			async getQueryPrizeLog() {
				
				let token = uni.getStorageSync('token');
				//查询当前用户的某个中奖记录
				let res = await this.$request({
					url: this.$url.queryPrizeLogUrl+"?prizeLogId="+this.prizeLogId,
					method: 'get',
					header: {
						"content-type": "application/x-www-form-urlencoded",
						"X-Winzkj-Token": token
					}
				});
				
				console.log(res.data.data);
				this.recordStatusData = res.data.data;
				
				this.qrcodeText = res.data.data.serialNo;
				
				console.log(this.qrcodeText);
				
				//生成二级码
				this.make();
			},
			editPrizeInfo() {
				let serialNo = this.qrcodeText;
				// let serialNo = "20210713224448354";
				let prizeLogId = this.prizeLogId;
				uni.navigateTo({
					url: `/pages/address/edit-address?serialNo=${serialNo}&prizeLogId=${prizeLogId}`
				})
			},
			async make() {
			
				let that = this;
				// 同步等待
				var res = await uQRCode.make({
					canvasId: 'qrcode',
					componentInstance: this,
					text: that.qrcodeText,
					size: that.qrcodeSize,
					margin: 10,
					backgroundColor: '#ffffff',
					foregroundColor: '#000000',
					fileType: 'jpg',
					correctLevel: uQRCode.errorCorrectLevel.H
				})
				// console.log(res)
			},
		}
	}
</script>

<style lang="scss">
	page {
		background: #ffffff;
	}
	
	.shop-wrap {
		padding: 20rpx 30rpx;
		.icon-shop {
			display: inline-block;
			width: 32rpx;
			height: 28rpx;
			margin-right: 10rpx;
		}
		.shop-name {
			display: inline-block;
			font-size: 30rpx;
			font-weight: 400;
			color: #FD5C40;
			vertical-align: bottom;
		}
		.icon-arrows {
			display: inline-block;
			width: 13rpx;
			height: 25rpx;
			margin-left: 15rpx;
		}
	}
	
	// 奖品展示
	.cart-goods-item {
		display: flex;
		padding: 5rpx 0 15rpx 0;
		margin: 0 30rpx;
		background: #ffffff;
		border-bottom: 1rpx solid #f1f1f1;
		.goods-cover {
			// flex: 1;
			width: 120rpx;
			height: 120rpx;
			margin-right: 20rpx;
	
			.cover {
				display: inline-block;
				width: 100%;
				height: 100%;
			}
		}
	
		.goods-info {
			flex: 5;
			text-align: left;
	
			.title {
				height: 45rpx;
				line-height: 45rpx;
				font-size: 30rpx;
				font-weight: 400;
				color: #000000;
			}
	
			.intro {
				height: 40rpx;
				line-height: 40rpx;
				font-size: 24rpx;
				font-weight: 400;
				color: #010101;
			}
	
			.price-wrap {
				display: flex;
				justify-content: space-between;
	
				.price {
					font-size: 28rpx;
					height: 40rpx;
					line-height: 40rpx;
					color: #010101;
	
					.sign {
						font-size: 24rpx;
					}
				}
	
				.count-wrap {
					position: relative;
					bottom: 20rpx;
					height: 50rpx;
					line-height: 50rpx;
					.btn-again {
						height: 46rpx;
						line-height: 46rpx;
						padding: 0 18rpx;
						background: #FD5C40;
						border-radius: 23rpx;
						font-size: 24rpx;
						font-weight: 400;
						color: #FFFFFF;
					}
					.btn-edit-address {
						height: 46rpx;
						line-height: 46rpx;
						padding: 0 18rpx;
						background: #FD5C40;
						border-radius: 23rpx;
						font-size: 24rpx;
						font-weight: 400;
						color: #FFFFFF;
					}
				}
			}
		}
	}
	
	//奖品状态
	.prize-status-wrap {
		padding: 86rpx;
		.prize-cover {
			position: relative;
			width: 363rpx;
			height: 363rpx;
			margin: 0 auto;
			.cover {
				display: inline-block;
				width: 100%;
				height: 100%;
			}
			.mask {
				position: absolute;
				top: 0;
				left: 0;
				display: inline-block;
				width: 100%;
				height: 100%;
				background: #ffffff;
				opacity: 0.89;
			}
			.prize-status {
				position: absolute;
				bottom: 0;
				right: 0;
				.status {
					display: inline-block;
					width: 162rpx;
					height: 160rpx;
				}
			}
		}
	}
	//奖品信息
	.prize-info-wrap {
		.prize-info-item {
			display: flex;
			padding: 0 30rpx;
			line-height: 50rpx;
			.label {
				flex: 2;
				width: 104rpx;
				height: 23rpx;
				font-size: 24rpx;
				font-family: Source Han Sans CN;
				font-weight: 400;
				color: #666666;
			}
			.text {
				flex: 7;
				font-size: 24rpx;
				font-weight: 400;
				color: #000000;
			}
		}
	}

	
</style>
