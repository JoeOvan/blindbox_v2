<template>
	<view class="wrapper">
		<cu-custom bgColor="text-white bg-header" :isBack="true">
			<block slot="backText">填写领取信息</block>
		</cu-custom>

		<!-- 头部 -->
		<view class="navbar">
			<view v-for="(item, index) in navList" :key="index" class="nav-item"
				:class="{ current: tabCurrentIndex === index }" @click="tabClick(index)">
				{{ item.text }}
			</view>
		</view>

		<view class="address-form-wrap" :class="{ isShow: tabCurrentIndex === 0 }">
			<form @submit="addressForm" class="address-form">
				<view class="address-form-item">
					<view class="label">收货地址：</view>
					<view class="form-item-wrap">
						<!-- <image class="icon-location" src="../../static/images/icon-location.png"></image> -->
						<AddressPicker class="address-input" @change="change" :level="3">{{planLocate}}
						</AddressPicker>
						<image class="icon-arrows" src="../../static/images/icon-arrows-grey.png"></image>
					</view>
				</view>
				<view class="address-form-item">
					<text class="label">门牌号：</text>
					<view class="form-item-wrap"><input type="text" placeholder-style="color:#888888"
							class="address-input" placeholder="详细地址，例1层101室" :value="order"
							v-model.trim="order"></view>
				</view>
				<view class="address-form-item">
					<text class="label">联系人：</text>
					<view class="form-item-wrap">
						<input type="text" placeholder-style="color:#888888" class="address-input"
							placeholder="请填写收货人姓名" :value="consignee" v-model.trim="consignee">
					</view>
				</view>
				<view class="address-form-item">
					<text class="label">手机号：</text>
					<view class="form-item-wrap"><input type="text" placeholder-style="color:#888888"
							class="address-input" placeholder="请填写收货人手机号码" :value="moblie"
							v-model.trim="moblie"></view>
				</view>
				<view class="address-form-item">
					<button form-type="submit" class="btn-address-submit">提交配送信息</button>
				</view>
			</form>
		</view>

		<view class="qrcode-wrap" :class="{ isShow: tabCurrentIndex === 1 }">
			<view class="qrcode-cover">
				<!-- <image class="qrcode" src="https://z3.ax1x.com/2021/07/06/RoPJSJ.png"></image> -->
				<view class="canvas">
					<canvas canvas-id="qrcode" :style="{width: `${qrcodeSize}px`, height: `${qrcodeSize}px`}" />
				</view>
			</view>
			<view class="text">请向店员出示二维码1233</view>
		</view>

	</view>
</template>

<script>
	import AddressPicker from "@/components/address-picker/AddressPicker.vue"
	import uQRCode from '@/components/uni-qrcode/uqrcode.js'
	export default {
		components: {
			AddressPicker,
		},
		data() {
			return {

				tabCurrentIndex: 0,// 页面显示是默认选中第一个
				navList: [{
						state: 0,
						text: '快递配送',
						orderList: []
					},
					{
						state: 1,
						text: '到店使用',
						orderList: []
					}
				],

				//地址表单
				planLocate: '点击选择收货地址', //选择地址
				address: null,
				consignee: null, //收件人
				moblie: null, //收件人手机
				order: null, //快递地址

				//生成二维码
				qrcodeSize: uni.upx2px(350),
				qrcodeMargin: uni.upx2px(20),
				qrcodeText: null,
				
				// 中奖记录Id
				prizeLogId: "",
			}
		},
		onLoad(options) {
			
			//中奖生成二维码
			this.qrcodeText = options.serialNo;
			//中奖记录Id
			this.prizeLogId = options.prizeLogId;

		},

		methods: {
			changeTab(e) {
				console.log(e);
				this.tabCurrentIndex = e.target.current;
			},
			//顶部tab点击
			tabClick(index) {
				console.log(index);
				this.tabCurrentIndex = index;
				
				if(index == 1) {
					//生成二维码
					this.make();
				}
				
			},
			change(result) {
				console.log(JSON.stringify(result.data));
				this.planLocate = '';
				result.data.forEach((item, index) => {
					if (index === 0) {
						this.planLocate += item.name
					} else {
						this.planLocate += '-' + item.name
					}
				});

				let arr = this.planLocate.split('-');
				// console.log(arr)
				this.address = arr.join('');
				// alert(this.address);
			},
			async addressForm() {
				let data = {};
				let address = this.address; //收件地址
				let order = this.order; //详细地址
				let consignee = this.consignee; //收件人
				let moblie = this.moblie; //收件人手机

				//收件地址
				if (address && address != "点击选择收货地址") {
					//地址拼接
					data.address = address + order;
				} else {
					uni.showToast({
						title: '输入收件地址',
						icon: 'none',
						duration: 2000
					});
					return;
				};

				//填写收货人姓名
				if (consignee) {
					data.consignee = consignee;
				} else {
					console.log(consignee);
					uni.showToast({
						title: '请填写收货人姓名',
						icon: 'none',
						duration: 2000
					});
					return;
				};

				let regex = new RegExp(/^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/);
				//收件地址
				if (regex.test(moblie)) {
					data.moblie = moblie;
				} else {
					uni.showToast({
						title: '请填写正确的收货人手机号码',
						icon: 'none',
						duration: 2000
					});
					return;
				};

				data.prizeLogId = this.prizeLogId;

				let token = uni.getStorageSync('token');
				// let data = {};
				//保存配送地址
				let res = await this.$request({
					url: this.$url.saveExpressInfoUrl,
					method: 'post',
					data: {
						...data
					},
					header: {
						"content-type": "application/x-www-form-urlencoded",
						"X-Winzkj-Token": token
					}
				});
				
				if(res.data.code == 0) {
					this.getPayPrize();
				}
			},
			async getPayPrize() {
				
				let token = uni.getStorageSync('token');
				
				let prizeLogId = this.prizeLogId;

				//发起运费支付请求
				let res = await this.$request({
					url: this.$url.payExpressUrl+"?prizeLogId="+prizeLogId,
					method: 'get',
					header: {
						"content-type": "application/x-www-form-urlencoded",
						"X-Winzkj-Token": token
					}
				});
			
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
						url: `/pages/record/record-list`
					})
				
				}, function(res) {
					alert("失败");
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
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #ffffff;
	}

	.swiper-box {
		height: calc(100% - 40px);
	}

	.list-scroll-content {
		height: 100%;
	}

	.navbar {
		display: flex;
		height: 40px;
		background: #FFF0ED;
		;
		position: relative;
		z-index: 10;

		.nav-item {
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			font-size: 15px;
			color: #666666;
			position: relative;

			&.current {
				color: #000000;
				background: #ffffff;
			}
		}
	}


	.address-form-wrap {
		display: none;
		&.isShow {
			display: block;
		}
		.address-form-item {
			display: flex;
			line-height: 30rpx;
			font-size: 28rpx;
			padding: 40rpx 20rpx;
			margin: 0 20rpx;
			border-bottom: 1rpx solid #F1F1F1;
			align-items: center;

			&:nth-last-child(1) {
				border: none;
			}

			.label {
				display: inline-block;
				width: 190rpx;
				// flex: 1;
				font-size: 28rpx;
				font-weight: 400;
				color: #000000;
				flex-shrink: 0;
			}

			.form-item-wrap {
				position: relative;
				width: 520rpx;

				.address-input {
					font-size: 28rpx;
					font-weight: 400;
					color: #888888;
					display: inline-block;
					vertical-align: middle;
				}

				.icon-location {
					display: inline-block;
					width: 17rpx;
					height: 21rpx;
					vertical-align: top;
					margin-top: 3rpx;
					margin-right: 5rpx;
				}

				.icon-arrows {
					position: absolute;
					right: 0;
					top: 15rpx;
					display: inline-block;
					width: 13rpx;
					height: 25rpx;
				}
			}

			.btn-address-submit {
				font-size: 30rpx;
				font-family: Source Han Sans CN;
				font-weight: 400;
				color: #FFFFFF;
				width: 350rpx;
				height: 68rpx;
				line-height: 68rpx;
				background: #FD5C40;
				border-radius: 34rpx;
			}
		}
	}

	//二维码
	.qrcode-wrap {
		display: none;
		text-align: center;
		&.isShow {
			display: block;
		}
		.qrcode-cover {
			// display: flex;
			// justify-content: center;
			width: 400rpx;
			height: 400rpx;
			margin: 110rpx auto 0 auto;
		}

		.qrcode {
			display: inline-block;
			width: 100%;
			height: 100%;
		}

		.text {
			display: inline-block;
			margin-top: 60rpx;
			font-size: 30rpx;
			font-weight: 400;
			color: #000000;
		}
	}
	
	.canvas {
		// margin-top: 50rpx;
		width: 100%;
		height: 100%;
		text-align: center;
	}
	
	.canvas canvas {
		margin: 0 auto;
	}
	
	.image {
		width: 354rpx;
		margin-top: 50rpx;
		text-align: center;
	}
	
	.image image {
		display: block;
		// width: 354rpx;
		// height: 354rpx;
	}
	


</style>
