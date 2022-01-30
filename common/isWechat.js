

const isWechat = {
	
	created() {
		
		//判断是否是微信端
		var ua = navigator.userAgent.toLowerCase();
		var isWeixin = ua.indexOf('micromessenger') != -1;
		if (!isWeixin) {
		   document.head.innerHTML = '<title>抱歉，出错了</title><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=0"><link rel="stylesheet" type="text/css" href="https://res.wx.qq.com/open/libs/weui/0.4.1/weui.css">';
		   document.body.innerHTML = '<div class="weui_msg"><div class="weui_icon_area"><i class="weui_icon_info weui_icon_msg"></i></div><div class="weui_text_area"><h4 class="weui_msg_title">请在微信客户端打开链接</h4></div></div>';
		   
		   return;
		}

	}

}


export default isWechat