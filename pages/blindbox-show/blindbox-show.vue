<template>
	<view class="wrapper">
		<view class="user-info-wrap" v-if="userInfo">
			<view class="avatar-wrap">
				<!-- <image class="avatar" :src="userInfo.headImgUrl" @error="errorAvatar()"></image> -->
				<fr-image class="avatar" :src="userInfo.headImgUrl" loading-ing-img="../../static/images/default-image.jpg"/>
			</view>
			<view class="user-info">
				<text class="name">{{ userInfo.nickname }}</text>
				<navigator class="record" url="/pages/record/record-list">购买记录<image class="icon-arrows" src="../../static/images/icon-arrows.png"></image></navigator>
			</view>
			<view class="icon-wrap" @click="saoma()" v-if="userInfo.userType == 2">
				<image class="icon-scan-qrcode" src="../../static/images/icon-scan.png"></image>
			</view>
		</view>
		
		<!-- 盲盒列表 -->
		<view class="blindbox-show-wrap">
			<view class="title-wrap">
				<view class="title">
					<image class="icon-choose" src="../../static/images/icon-choose.png"></image>精选盲盒
				</view>
				<view class="news-wrap">
					<view class="icon-news-wrap">
						<image class="icon-news" src="../../static/images/icon-news.png"></image>
					</view>
					<view class="news-area">
						<notice-bar ref='notice' color="#000000" bgColor="#FFF8AB" :direction="'level'" :scrollable="true" :text="textes" :speed=".12"/>						
					</view>
					<!-- <view class="text">恭喜 <text class="user-name">小小笑笑</text> 喜提盲盒！</view> -->
					</view>
			</view>
			<view class="blindbox-list" v-if="prizePoolList">

				<block v-for="(item,index) of prizePoolList" :key="index">
					<view class="list-item" >
						<view class="item-wrap">						
							<navigator class="link" :url="`/pages/prize/prize?prizePoolId=`+item.prizePoolId">
								<!-- <image class="cover" :src="baseUrl+item.imgUrl" @error="error(index)"></image> -->
								<!-- <image class="cover" :src="baseUrl+item.imgUrl"></image> -->
								<fr-image class="cover" :src="item.imgUrl !==null ? (baseUrl+item.imgUrl) : '../../static/images/default-image.jpg'" loading-ing-img="../../static/images/default-image.jpg"/>
								<view class="name">{{item.title}}</view>
							</navigator>
						</view>
						<view class="btn-pay" @tap="showModal('Modal',item.prizePoolId)">{{item.price}}元/次</view>
					</view>
				</block>
				
			</view>
		</view>
		<!-- 盲盒列表end -->
		
		
		<!-- 活动规则 -->
		<view class="cu-modal rule-modal" :class="modalName=='Modal'?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end modal-head">
					<view class="content">活动规则</view>
				</view>
				<view class="modal-content">
					1、本活动使用微信登录和微信支付。<br/>
					2、选择心仪的盲盒系列，每次需要支付金额购买。<br/>
					3、幸运盲盒将根据用户抽中的系列随机发放，以用户收到的实物为准。<br/>
					4、抽中盲盒后，请及时填写收件人相关信息，从抽中之时起超过48小时未填写，将视为自动放弃。<br/>
					5、本次活动的最终解释权归活动举办方所有。
				</view>
				<view class="btn-read" @tap="hideModal" :data-prizePoolId="prizePoolId">我已阅读并了解</view>
			</view>
		</view>
		<!-- 活动规则end -->
		
	</view>
</template>

<script>
	
	import noticeBar from '../../components/xyh-notice-bar/xyh-notice-bar.vue';
	import wx from 'weixin-js-sdk';
	import FrImage from '@/components/fr-image/fr-image.vue';
	export default {
		components:{noticeBar},
		data() {
			return {
				modalName: null,
				userInfo: null,//用户信息
				//中奖展示信息
				textes:[],
				
				//盲盒列表
				prizePoolList: [],
				baseUrl: this.$url.baseUrl,
				
				//奖品ID
				prizePoolId: null,
				
			}
		},
		onLoad(e) {
			
			let token = uni.getStorageSync('token');
			let userInfo = uni.getStorageSync('userInfo');
			
			if(token !== null || token !== "") { 
			
				this.userInfo = userInfo;
				
			}
			
			//中奖轮播展示
			this.getPrizeLogListUrl();
			
			//盲盒抽奖展示
			this.getPrizePoolListUrl();
			
			this.getSign();
			
		},
		mounted() {
		    
		},
		methods: {
			showModal(modal, id) {
				this.modalName = modal;
				
				let prizePoolId = id;
				
				this.prizePoolId = prizePoolId;
				
			},
			hideModal(e) {
				this.modalName = null;
				
				let prizePoolId = e.currentTarget.dataset.prizepoolid;
				
				this.getPayPrize(prizePoolId);
				
				
			},
			getUrlCode (name) {
				return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ''])[1].replace(/\+/g, '%20')) || null
			},
			//中奖展示轮播
			async getPrizeLogListUrl() {
				
				let res = await this.$request({
					url: this.$url.prizeLogListUrl,
				});
				
				let arr = res.data.data;

				let newArr = [];
				for (var i = 0; i < arr.length; i++) {
				  newArr.push(arr[i].nickName);
				}
				
				this.textes = newArr;
				
				//初始化中奖展示
				this.$refs.notice.init(this.textes);
				
			},
			//获取抽奖列表
			async getPrizePoolListUrl() {
				
				let res = await this.$request({
					url: this.$url.prizePoolListUrl,
				});
				
				// let data = res.data.data
				
				this.prizePoolList = res.data.data;

			},
			async getPayPrize(prizePoolId) {
				
				let token = uni.getStorageSync('token');
				
				//发起抽奖支付请求
				let res = await this.$request({
					url: this.$url.payPrizeUrl+"?prizePoolId="+prizePoolId,
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
						url: `/pages/blindbox/blindbox?prizePoolId=${prizePoolId}&tradeNo=${tradeNo}`
					})
				
				}, function(res) {
					// alert("失败");
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
			//jssdk授权信息
			async getSign() {
				let token = uni.getStorageSync('token');
				
				// alert(location.href.split('#')[0]);return;
				
				let url = "http://"+location.hostname+"/";
				// alert()
				//请求jssdk授权信息
				let res = await this.$request({
					url: this.$url.getSignUrl,
					method: 'post',
					data:{
					   "url": url
					},
					header: {
						"content-type": "application/x-www-form-urlencoded",
						"X-Winzkj-Token": token
					}
				});
				
				if(res.data.code == 0) {
					this.wxConfig(res.data.data.appId,res.data.data.timestamp,res.data.data.nonceStr,res.data.data.signature) //以vue为例
				}
			},
			wxConfig(_appid,_timestamp,_nonceStr,_signature){
			  var that = this;
			  wx.config({ 
			      debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。   
			      appId: _appid, // 必填，公众号的唯一标识
			      timestamp: _timestamp, // 必填，生成签名的时间戳
			      nonceStr: _nonceStr, // 必填，生成签名的随机串
			      signature: _signature,// 必填，签名
			      jsApiList: [
			                  'checkJsApi',
			                  'startRecord',
			                  'stopRecord',
			                  'translateVoice',
			                  'scanQRCode',// 微信扫一扫接口
			                  'openCard'
			                  ] // 必填，需要使用的JS接口列表 
			  }); 
			  //config信息验证失败会执行error函数
			  wx.error(function(res) {
			      alert("error：-----" + res.errMsg);
			  });
			  
			  // config信息验证后会执行ready方法,config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中
			  wx.ready(function() {
			      wx.checkJsApi({
			          jsApiList : ['scanQRCode'],
			          success : function(res) {
			          }
			      });
			  });
			},
			
			saoma(){//页面点击扫码按钮
				// alert("开始扫码");
				let that = this;
			    wx.scanQRCode({
			        needResult : 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
			        scanType : [ "qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
			        success : function(res) {
						var result = res.resultStr;
			            if(res.resultStr.indexOf(',') > -1){
			                result = res.resultStr.split(',')[1]; // 当needResult 为 1 时，扫码返回的结果
			            }

						let token = uni.getStorageSync('token');
						
						uni.request({
							url: that.$url.confirmCashPrizeUrl+"?serierNo="+result,
							method: "get",
							header: {
								"content-type": "application/x-www-form-urlencoded",
								"X-Winzkj-Token": token
							},
							success: (resPrize) => {
								alert(JSON.stringify(resPrize.data.msg));
							},
							fail: (resPrize) => {
								alert(JSON.stringify(resPrize));
							}
						});
						
			        },
			        fail : function(){
			            console.log('error');
			        }
			    });
			},
		}
	}
</script>

<style lang="scss">
	page {
		background: #ffffff;
	}
	// .wrapper {
	// } 
	//用户信息 
	.user-info-wrap {
		display: flex;
		width: 750rpx;
		height: 180rpx;
		padding: 30rpx;
		background: #FD5C40;
		border-radius: 0 0 0 90rpx;
		box-sizing: border-box;
		align-items: center;
		.avatar-wrap {
			display: inline-block;
			width: 120rpx;
			height: 120rpx;
			margin-right: 20rpx;
			flex-shrink: 0;
			.avatar {
				width: 100%;
				height: 100%;
				background: #D2D2D2;
				border-radius: 50%;
				overflow: hidden;
			}
		}
		.user-info {
			width: 500rpx;
			.name {
				line-height: 70rpx;
				font-size: 34rpx;
				font-weight: bold;
				color: #FFF4DA;
			}
			.record {
				font-size: 24rpx;
				font-weight: 400;
				color: #FFFEFE;
				.icon-arrows {
					display: inline-block;
					width: 10rpx;
					height: 17rpx;
					margin-left: 20rpx;
				}
			}
		}
		.icon-wrap {
			text-align: center;
			width: 80rpx;
			height: 80rpx;
			flex-shrink: 0;
			font-size: 24rpx;
			.icon-scan-qrcode {
				display: inline-block;
				width: 100%;
				height: 100%;
			}
		}
	}
	
	//盲盒列表
	.blindbox-show-wrap {
		padding: 20rpx 15rpx;
		.title-wrap {
			display: flex;
			justify-content: space-between;
			padding: 0 15rpx;
			.title {
				font-size: 30rpx;
				font-weight: 400;
				color: #000000;
				.icon-choose {
					display: inline-block;
					width: 32rpx;
					height: 38rpx;
					margin-right: 8rpx;
					vertical-align: sub;
				}
			}
			.news-wrap {
				display: flex;
				width: 370rpx;
				height: 50rpx;
				line-height: 50rpx;
				background: #FFF8AB;
				border-radius: 25rpx;
				font-size: 24rpx;
				// vertical-align: middle;
				overflow: hidden;
				.icon-news-wrap {
					width: 29rpx;
					height: 21rpx;
					margin: 15rpx;
					flex-shrink: 0;
					.icon-news {
						display: inline-block;
						width: 100%;
						height: 100%;
						vertical-align: top;
					}
				}
				.news-area {
					width: 100%;
					.notice {
						height: 50rpx;
						line-height: 50rpx;
						box-sizing: border-box;
					}
					.user-name {
						color: #FD5C40;
					}
				}
			}
		}
		.blindbox-list {
			.list-item {
				display: inline-block;
				width: 360rpx;
				padding: 20rpx 15rpx;
				box-sizing: border-box;
				.item-wrap {
					width: 100%;
					height: 460rpx;
					background: #F0F0F0;
					border-radius: 30rpx;
					overflow: hidden;
					.link {
						width: 100%;
						.cover {
							width: 100%;
							display: block;
							height: 330rpx;
							border-radius: 30rpx 30rpx 0 0;
						}
						.name {
							display: -webkit-box;
							// height: 130rpx;
							font-size: 28rpx;
							font-weight: 400;
							margin: 20rpx;
							box-sizing: border-box;
							-webkit-box-orient: vertical;
							-webkit-line-clamp: 2;
							overflow: hidden;
						}
					}
				}
				.btn-pay {
					margin: -25rpx auto 0 auto;
					width: 170rpx;
					height: 50rpx;
					line-height: 50rpx;
					font-size: 28rpx;
					font-weight: bold;
					color: #FFFFFF;
					background: #FD5C40;
					border-radius: 25px;
					text-align: center;
				}
			}
		}
	}

	// 活动规则
	.rule-modal {
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
			padding: 28rpx 33rpx;
			font-size: 28rpx;
			font-weight: 400;
			color: #000000;
			line-height: 40rpx;
			text-align: left;
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
