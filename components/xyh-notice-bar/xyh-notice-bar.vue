<template>
	<view class="notice" :style="{width: text.length*100+'%',background:bgColor,color:color,display:(direction=='level'?'flex':'block'),fontSize:fontS}">
		<view v-for="(item,index) in text" :key='index' class="rowup text" :style="{transform: 'translate3d('+x+'%,'+y+'%,10px)',height:(direction=='level'?'':'80rpx')}">恭喜 <text class="user-name">{{item}}</text> 喜提盲盒！</view>
	</view>
</template>

<script>
	export default {
		data(){
			return {
				x:0,
				y:0
			}
		},
		props:{
			text:{
				type:Array,
				default:()=> {
					['请传入内容','请传入内容']
				}
			},
			bgColor:{
				type:String,
				default:'blue'
			},
			color:{
				type:String,
				default:'#fff'
			},
			direction:{
				type:String,
				default:'level'
			},
			speed:{
				type:Number,
				default:.1
			},
			fontS:{
				type:Number,
				default:30
			}
		},
		mounted() {
			
			// if(this.text.length){
			// 	this.startMove()
			// }
		},
		methods:{
			init(list){
				if(list.length){
					list.push(list[0])
					this.startMove()
				}
			},
			startMove(){
				let that = this;
				setInterval(function(){
					if(that.direction == 'level'){
						that.x-= that.speed
						if(that.x -60 < (-(that.text.length-1)*100)){
							that.x = 60
						}
					}
					if(that.direction == 'vertical'){
						that.y-= that.speed
						if(that.y  < (-(that.text.length-1)*100)){
							that.y = 0
						}
					}
					
				},2)
			}
		}
	}
</script>

<style scoped>
	* {
		box-sizing: border-box;
	}
	.text {
		width: 100%;
	}
	.notice {
		overflow: hidden;
/* 		padding: 20rpx 20rpx;
		max-height: 80rpx; */
	}
	.flex {
		display: flex;
	}
	.user-name {
		color: #FD5C40;
	}
</style>
