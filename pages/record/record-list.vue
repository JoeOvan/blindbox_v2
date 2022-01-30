<template>
	<view class="wrapper">
		<cu-custom bgColor="text-white bg-header" :isBack="true">
			<block slot="backText">购买记录</block>
		</cu-custom>

		<view class="record-list-wrap" v-if="recordList">
			<block v-for="(item, index) in recordList" :key="index">
				
				<!-- //未使用 -->
				<block v-if="item.cashStatus == '未使用'">					
					<view class="record-list-item" @click="goToRecord(item.logId)">
						<view class="record-cover">
							<!-- <image class="cover" :src="baseUrl+item.shop.logoUrl" @error="error(index)"></image> -->
							<fr-image class="cover" :src="item.shop.logoUrl !==null ? (baseUrl+item.shop.logoUrl) : '../../static/images/default-image.jpg'" loading-ing-img="../../static/images/default-image.jpg" />
						</view>
						<view class="record-info">
							<view class="title">抽中{{item.prizePoolTitle}}</view>
							<view class="time">{{item.createTime}}</view>
						</view>
						<view class="record-status">
							<view class="btn btn-unused">未使用</view>
						</view>
						<image class="icon-arrows" src="../../static/images/icon-arrows-grey.png"></image>
					</view>
				</block>
				
				<!-- //已使用 -->
				<block v-if="item.cashStatus == '已使用'">					
					<view class="record-list-item" @click="goToRecord(item.logId)">
						<view class="record-cover">
							<!-- <image class="cover" :src="baseUrl+item.shop.logoUrl" @error="error(index)"></image> -->
							<fr-image class="cover" :src="item.shop.logoUrl !==null ? (baseUrl+item.shop.logoUrl) : '../../static/images/default-image.jpg'" loading-ing-img="../../static/images/default-image.jpg" />
						</view>
						<view class="record-info">
							<view class="title">抽中{{item.prizePoolTitle}}</view>
							<view class="time">{{item.createTime}}</view>
						</view>
						<view class="record-status">
							<view class="btn btn-used">已使用</view>
						</view>
						<image class="icon-arrows" src="../../static/images/icon-arrows-grey.png"></image>
					</view>
				</block>
				
				<!-- //已失效 -->
				<block v-if="item.cashStatus == '已过兑奖时间'">					
					<view class="record-list-item" @click="goToRecord(item.logId)">
						<view class="record-cover">
							<!-- <image class="cover" :src="baseUrl+item.shop.logoUrl" @error="error(index)"></image> -->
							<fr-image class="cover" :src="item.shop.logoUrl !==null ? (baseUrl+item.shop.logoUrl) : '../../static/images/default-image.jpg'" loading-ing-img="../../static/images/default-image.jpg" />
						</view>
						<view class="record-info">
							<view class="title">抽中{{item.prizePoolTitle}}</view>
							<view class="time">{{item.createTime}}</view>
						</view>
						<view class="record-status">
							<view class="btn btn-invalid">已失效</view>
						</view>
						<image class="icon-arrows" src="../../static/images/icon-arrows-grey.png"></image>
					</view>
				</block>
			
			</block>
		</view>
	</view>
</template>

<script>
	import FrImage from '@/components/fr-image/fr-image.vue';
	export default {
		data() {
			return {
				recordList: null,
				baseUrl: this.$url.baseUrl,  //图片基本路径
			}
		},
		onLoad() {
			
			this.getQueryPrizeLogUrl();
		},
		methods: {
			async getQueryPrizeLogUrl() {
				let token = uni.getStorageSync('token');
				let res = await this.$request({
					url: this.$url.prizeLogListBySelfUrl,
					method: 'get',
					header: {
						"content-type": "application/x-www-form-urlencoded",
						"X-Winzkj-Token": token
					}
				});
				
				console.log(res);
				
				this.recordList = res.data.data;
				
			},
			goToRecord(prizeLogId) {
				//跳转传参
				uni.navigateTo({
					url: `/pages/record/record-status?prizeLogId=${prizeLogId}`
				})
			},
		}
	}
</script>

<style lang="scss">
	page {
		background: #ffffff;
	}

	.record-list-item {
		display: flex;
		padding: 27rpx 0;
		margin: 0 20rpx;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1rpx solid #f1f1f1;

		.record-cover {
			width: 100rpx;
			margin-right: 10rpx;

			.cover {
				display: inline-block;
				width: 100%;
				height: 70rpx;
			}
		}

		.record-info {
			width: 400rpx;
			height: 70rpx;
			font-weight: 400;
			color: #000000;
			.title {
				width: 100%;
				height: 45rpx;
				font-size: 28rpx;
				overflow: hidden;
				text-overflow:ellipsis;
				white-space: nowrap;
			}

			.time {
				font-size: 24rpx;
				color: #888888;
			}
		}

		.record-status {
			display: inline-block;
			width: 130rpx;

			.btn {
				display: inline-block;
				color: #ffffff;
				padding: 0 17rpx;
				height: 40rpx;
				line-height: 40rpx;
				border-radius: 20rpx;
				text-align: center;
				font-size: 20rpx;
				vertical-align: middle;
			}

			.btn-unused {
				background: #FD5C40;
			}

			.btn-used {
				background: #38CD54;
			}

			.btn-invalid {
				color: #888888;
				background: #eeeeee;
			}
		}

		.icon-arrows {
			display: inline-block;
			width: 13rpx;
			height: 25rpx;
			margin-left: 40rpx;
		}

	}
</style>
