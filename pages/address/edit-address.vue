<template>

	<view class="wrapper">
		<cu-custom bgColor="text-white bg-header" :isBack="true">
			<block slot="backText">填写领取信息</block>
		</cu-custom>

	<!-- 快递配送 -->
	<!-- <block v-if="tabCurrentIndex === 0"> -->
		<view class="address-form-wrap">
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
	<!-- </block> -->

	</view>

</template>

<script>
	import AddressPicker from "@/components/address-picker/AddressPicker.vue"
	export default {
		components: {
			AddressPicker,
		},
		data() {
			return {
				//地址表单
				planLocate: '点击选择收货地址', //选择地址
				consignee: null, //收件人
				moblie: null, //收件人手机
				order: null, //快递地址
				
			}
		},
		onLoad(options) {
			
			//中奖生成二维码
			this.qrcodeText = options.serialNo;
			//中奖记录Id
			this.prizeLogId = options.prizeLogId;

		},
		methods: {
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
				// alert(data);
				let that = this;
				this.onBridgeReady(data, function(res) {
					
					// alert("支付成功");
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

	//编辑地址
	.address-form-wrap {
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

</style>
