<template>
	<view class="content">
		<image class="logo" src="/static/logo.png"></image>
		<view >
			<button class="bg-blue" @click="saoma()">扫码</button>
		</view>
	</view>
</template>

<script>
	import wx from 'weixin-js-sdk';
	export default {
		data() {
			return {
				title: 'Hello'
			}
		},
		//所有需要使用JS-SDK的页面必须先注入配置信息，否则无法调用。
		onLoad() {
			
			this.getSign();
			

			// uni.request({
			//    url:'https://www.×××.com/lk/app/user/getSign',
			//    data:{
			// 	   "url":location.href.split('#')[0]
			//    },
			//    method:"get"
			// }).then((res) => {
			// 	console.log(res[1])
			//    this.wxConfig(res[1].data.data.appId,res[1].data.data.timestamp,res[1].data.data.nonceStr,res[1].data.data.signature) //以vue为例
			// })
		},
		
		methods: {
			async getSign() {
				let token = uni.getStorageSync('token');
				
				// alert(location.href.split('#')[0]);return;
				// alert(location.hostname);return;
				
				let url = "http://"+location.hostname+"/";
				alert()
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
				
				console.log(res)
				if(res.data.code == 0) {
					alert(JSON.stringify(res));
					this.wxConfig(res.data.data.appId,res.data.data.timestamp,res.data.data.nonceStr,res.data.data.signature) //以vue为例
				}
			},
			wxConfig(_appid,_timestamp,_nonceStr,_signature){
			  var that = this;
			  wx.config({ 
			      debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。   
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
			      alert("error：" + res.errMsg);
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
				alert("开始扫码");
			    wx.scanQRCode({
			        needResult : 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
			        scanType : [ "qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
			        success : function(res) {
 						var result = res.resultStr;
			            if(res.resultStr.indexOf(',') > -1){
			                result = res.resultStr.split(',')[1]; // 当needResult 为 1 时，扫码返回的结果
			            }
			        },
			        fail : function(){
			            console.log('error');
			        }
			    });
			}
		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
</style>

