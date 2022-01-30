<template>
	<div class="container">
		<canvas id="snowfall"></canvas>
		<div id="merrywrap" class="merrywrap">
			<div class="giftbox animation" @click="start">
				<div class="cover">
					<div></div>
				</div>
				<div class="box">

				</div>
				<div class="bg-box"></div>
			</div>

			<!-- 奖品展示 -->
			<div class="icons" v-if="prizeList">
				<div class="row">
					<block v-for="(item,index) of prizeList[0]" :key="'one_'+index">
						<span>
							<!-- <img class="cover" :src="baseUrl+item.imgUrl" alt="" mode="widthFix" @error="error(0,index)"> -->
							<fr-image class="cover" :src="item.imgUrl !==null ? (baseUrl+item.imgUrl) : '../../static/images/default-image.jpg'" loading-ing-img="../../static/images/default-image.jpg" mode="widthFix" />
						</span>
					</block>
				</div>
				<div class="row">
					<block v-for="(item,index) of prizeList[1]" :key="'two_'+index">
						<span>
							<!-- <img class="cover":src="baseUrl+item.imgUrl" alt="" mode="widthFix" @error="error(1,index)"> -->
							<fr-image class="cover"
								:src="item.imgUrl !==null ? (baseUrl+item.imgUrl) : '../../static/images/default-image.jpg'"
								loading-ing-img="../../static/images/default-image.jpg" mode="widthFix" />
						</span>
					</block>
				</div>
				<div class="row">
					<block v-for="(item,index) of prizeList[2]" :key="'three_'+index">
						<span>
							<!-- <img class="cover" :src="baseUrl+item.imgUrl" alt="" mode="widthFix" @error="error(2,index)"> -->
							<fr-image class="cover"
								:src="item.imgUrl !==null ? (baseUrl+item.imgUrl) : '../../static/images/default-image.jpg'"
								loading-ing-img="../../static/images/default-image.jpg" mode="widthFix" />
						</span>
					</block>
				</div>
			</div>
			<!-- 中奖展示 -->
			<div class="background" @click="stop">
				<div class="prize-wrap">
					<div class="prize-title">恭喜中奖了！</div>
					<div class="prize-box-wrap">
						<div class="prize-cover" v-if="prizeData">
							<!-- <img :src="https://z3.ax1x.com/2021/07/06/RIRpb8.png" alt="">	 -->
							<!-- <img :src="baseUrl+prizeData.prize.imgUrl" alt="" mode="widthFix"> -->
							<fr-image class="cover" :src="prizeData.prize.imgUrl !==null ? (baseUrl+prizeData.prize.imgUrl) : '../../static/images/default-image.jpg'" loading-ing-img="../../static/images/default-image.jpg" mode="widthFix" />
						</div>
						<div class="prize-box"></div>
					</div>
					<div class="get-prize-wrap">
						<div class="btn-get-prize" @tap="editPrizeInfo">填写领取信息</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	// import rectangleEmitter from "../../static/js/rectangleEmitter.js";
	import snow from '../../static/js/snow.js';
	import blindbox from '../../static/js/main.js';
	// import classie  from '../../static/js/classie.js';

	import FrImage from '@/components/fr-image/fr-image.vue';

	import Vue from 'vue'
	import VueConfetti from 'vue-confetti'

	Vue.use(VueConfetti)

	export default {
		data() {
			return {

				prizePoolId: null, //奖池id
				tradeNo: null, //微信支付流水号
				prizeData: null, //奖品数据
				baseUrl: this.$url.baseUrl, //图片基本路径

				//中奖Id
				prizeLogId: null,

				prizeList: null, //奖品列表
			}
		},
		onLoad(options) {

			this.prizePoolId = options.prizePoolId;
			this.tradeNo = options.tradeNo;

			//奖品展示请求
			this.getPrizePoll(this.prizePoolId);
		},
		mounted() {
			blindbox.init();
		},
		onReady() {

		},
		methods: {
			start() {

				//开始抽奖动画
				var that = this;
				setTimeout(function() {
					that.$confetti.start(
						// {
						//   particles: [
						// 	{
						// 	  type: 'heart',
						// 	  colors: [
						// 		'red',
						// 		'pink',
						// 	  ],
						// 	},
						// 	{
						// 	  type: 'circle',
						// 	  colors: [
						// 		'#ba0000',
						// 	  ],
						// 	},
						// 	{
						// 	  type: 'image',
						// 	  size: 15,
						// 	  url: 'https://s4.aconvert.com/convert/p3r68-cdx67/azl4r-8jmea.svg',
						// 	},
						//   ],
						//   defaultDropRate: 5,
						//   defaultSize: 5,
						// }
					);
				}, 3000);

				// return;
				//抽奖
				this.getLuckPrize();

			},
			stop() {
				this.$confetti.stop();
			},
			async getPrizePoll(prizePoolId) {
				//请求抽奖活动奖品信息
				let res = await this.$request({
					url: this.$url.prizePollUrl + prizePoolId,
				});

				this.prize = res.data.data.prize;

				// console.log(this.prize);

				let prizeArr = this.prize;

				let prize;

				//奖品数量不足9个,复制够9个,多于9个只展示前9个
				if (prizeArr.length >= 9) {

					this.prizeList = prizeArr.slice(0, 9);

				} else {

					//复制一直到9个
					prize = this.mergeArray(prizeArr);
				}

				console.log(prize);

				this.splitArray(prize);

			},
			// 传进数组按指定个数，进行合并
			mergeArray(array) {

				const length = array.length;

				let newArray = array.concat(array);

				if (newArray.length <= 9) {

					//合并
					return this.mergeArray(newArray);


				} else {

					//截取
					newArray = newArray.slice(0, 9);

				}

				return newArray;

			},
			//拆分为三个数组
			splitArray(chartArr) {
				var allData = []; //用来装处理完的数组
				var currData = []; //子数组用来存分割完的数据

				//循环需要处理的数组
				for (var i = 0; i < chartArr.length; i++) {
					//将chartArr[i]添加到子数组
					currData.push(chartArr[i]);
					// console.log(i)
					//在这里求3的余数,如果i不等于0,且可以整除 或者考虑到不满3个或等于3个的情况就要加上  i等于当前数组长度-1的时候
					if ((i != 0 && (i + 1) % 3 == 0) || i == chartArr.length - 1) {
						//把currData加到allData里
						allData.push(currData);
						//在这里清空currData
						currData = [];
					}
				};

				this.prizeList = allData;

				console.log(this.prizeList);
			},
			async getLuckPrize() {

				let token = uni.getStorageSync('token');
				//发起抽奖请求
				let res = await this.$request({
					url: this.$url.luckPrizeUrl + "?prizePoolId=" + this.prizePoolId + "&tradeNo=" + this
						.tradeNo,
					method: 'get',
					header: {
						"content-type": "application/x-www-form-urlencoded",
						"X-Winzkj-Token": token
					}
				});

				console.log(res);

				if (res.data.code == 0) {
					this.prizeData = res.data.data;

					// alert(JSON.stringify(res.data.data));

					this.prizeLogId = res.data.data.logId;
				}
			},
			editPrizeInfo() {
				let serialNo = this.prizeData.serialNo;
				// let serialNo = "20210713224448354";
				let prizeLogId = this.prizeLogId;
				uni.navigateTo({
					url: `/pages/payment/payment?serialNo=${serialNo}&prizeLogId=${prizeLogId}`
				})
			},
		},
		onUnload() {
			this.stop();
		}
	}
</script>

<style>
	@import url("../../static/css/normalize.css");
	@import url("../../static/css/demo.css");
	@import url("../../static/css/component.css");

	/*动画效果*/
	.animation {
		animation: jiggle 2s ease-in infinite;
	}

	@keyframes jiggle {

		48%,
		62% {
			transform: scale(1.0, 1.0)
		}

		50% {
			transform: scale(1.1, 0.9)
		}

		56% {
			transform: scale(0.9, 1.1) translate(0, -5px)
		}

		59% {
			transform: scale(1.0, 1.0) translate(0, -3px)
		}
	}
</style>
