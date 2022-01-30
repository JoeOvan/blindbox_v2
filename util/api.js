// let BASE_URL = 'http://192.168.0.140:3333';
// let BASE_URL = 'http://192.168.31.9:3333';
//API地址
let BASE_URL = 'http://lucky.winzkj.com';
// let BASE_URL = 'http://192.168.0.178:8085';

//前端地址
// let FRONTEND_URL = 'http://luckyweb.winzkj.com';
let FRONTEND_URL = 'http://21471yw772.51mypc.cn';

let API_URL = {
	baseUrl: BASE_URL,
	//前端地址
	frontEndUrl: FRONTEND_URL,
	//获取用户协议
	agreementUrl: BASE_URL + "/api/prize/getAgreement",
	//微信登录
	wxloginUrl: BASE_URL + "/api/wx/login",
	//盲盒列表
	prizePoolListUrl: BASE_URL + "/api/prize/getPrizePoolList",
	//奖品
	prizePollUrl: BASE_URL + "/api/prize/getPrizePoll/",
	//发起购买盲盒支付
	payPrizeUrl: BASE_URL + "/api/pay/payPrize",
	//抽奖
	luckPrizeUrl: BASE_URL + "/api/prize/getLuckPrize",
	//保存订单地址
	saveExpressInfoUrl: BASE_URL + "/api/prize/saveExpressInfo",
	// 查询当前用户的中奖记录
	prizeLogListBySelfUrl: BASE_URL + "/api/prize/prizeLogListBySelf",
	// 查询当前用户的某个中奖记录
	queryPrizeLogUrl: BASE_URL + "/api/prize/queryPrizeLog",
	//发起微信支付（支付快递费用）
	payExpressUrl: BASE_URL + "/api/pay/payExpress",
	//获取jssdk授权信息
	getSignUrl: BASE_URL + "/api/wx/getSign",
	//扫码兑奖：确定兑奖
	confirmCashPrizeUrl: BASE_URL + "/api/prize/confirmCashPrize",
	//中奖展示
	prizeLogListUrl: BASE_URL + "/api/prize/prizeLogList",


};


const request = (options) => {
	return new Promise((resolve, reject) => {
		uni.request({
			url: options.url,
			method: options.method || 'GET',
			data: options.data || {},
			header: options.header || {
				"content-type": "application/x-www-form-urlencoded",
				"X-Winzkj-Token": uni.getStorageSync('token')
			},
			success: (res) => {
				// console.log(res);

				const code = res.statusCode.toString();

				if (code.startsWith('2')) {
					resolve(res);
					let code = res.data.code;
					if (code == 401) {
						uni.clearStorageSync('token');

						uni.navigateTo({
							url: `/pages/index/index`
						})

					}
				} else {

					reject();

				}
				// resolve(res)
			},
			fail: (err) => {
				uni.showToast({
					title: '请求接口失败'
				})
				reject(err)
			}
		})
	})
}

export {
	request,
	API_URL
};
