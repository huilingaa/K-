<template>
  <div id="kline" ref="kline" style="height:100%">
    <div class="header">
      <img src="../assets/img/left_white.png" alt="back" @click="back" />
      <img src="../assets/img/menu.png" alt="menu" @click="showList" />
      {{name}}
    </div>
    <div class="main" ref="main">
      <stockHq
        :DefaultPairName="pairName"
        :DefaultName="name"
        :DefaultfloatPrecision="floatPrecision"
        DefaultPeriod=0
        ref="klinechart"
      ></stockHq>
    </div>
    <coinList :show="listshow" @toggleShow="showList" @ChangeSymbol="ChangeSymbol" :pairName="pairName" />
  </div>
</template>

<script>
import stockHq from "./stockHq.vue";
import coinList from './coinList.vue';
import DefaultData from "../util/DefaultData.js";
export default {
  name: "BitDemo",
  data() {
    return {
      pairName: 'btcusdt',
      name:'BTC/USDT',
      floatPrecision:2,
      listshow: false,
      BitList: DefaultData.BitList()
    };
  },
  computed:{
    index(){
      let symbol = 'btcusdt',res = 0;
      if(location.hash.split('?')[1]){
        let params = location.hash.split('?')[1].split('&');
        for(let key in params){
          if(params[key].split('=')[0]==='symbol'){
            symbol = params[key].split('=')[1]
          }
        }
      }else{
        symbol = 'btcusdt'
      }
      this.BitList.forEach((item,index)=>{
        if(symbol === item.Symbol){
          res = index
        }
      })
      return res
    }
  },
  components: {
    stockHq,
    coinList
  },
  beforeMount(){
    this.pairName = this.BitList[this.index].Symbol;
    this.name = this.BitList[this.index].Name;
    this.floatPrecision = this.BitList[this.index].FloatPrecision;
  },
  mounted() {
    this.OnSize();
  },
  methods: {
    showList(){
      if(this.listshow){
        setTimeout(()=>{
          this.listshow = false
        },500)
      }else{
        this.listshow = true
      }
    },
    ChangeSymbol(symbol,name,floatPrecision){//转发切换股票数据到图形
      var klineChart = this.$refs.klinechart;
      klineChart.ChangeSymbol(symbol, name, floatPrecision);
      this.changePairName(symbol,name)
    },
    OnSize() {
      //调整大小
      var klineChart = this.$refs.klinechart;
      klineChart.$refs.divklinechart.style.height = "84%"; //动态调整K线图控件高度
      this.$nextTick(() => {
        klineChart.OnSize();
      });
    },
    changePairName(pairName,name){
      this.pairName = pairName;
      this.name = name
    },
    back(){
      this.$router.back()
    }
  }
};
</script>
<style lang="scss" scoped>
 ::-webkit-scrollbar {display:none}
#kline{
  width: 100%;
  height: 100%;
  background: #071724;
  overflow: hidden;
  padding-top: 10%;
  box-sizing: border-box;
}
.header{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 7%;
  color: #f7f7f7;
  background: #131e30;
  z-index: 1001;
  display: flex;
  align-items: center;
  padding: 0 4%;
  font-size: .16rem;
  font-weight: bold;
  >img:nth-of-type(1){
    height: .14rem;
    padding-right: .25rem;
  }
  &::after{
    content: '';
    height: .18rem;
    width: .005rem;
    background: #7186a5;
    position: absolute;
    left: .49rem;
    top: 50%;
    transform: translate(0, -50%);
    z-index: 3;
  }
  >img:nth-last-of-type(1){
    height: .14rem;
    width: .18rem;
    margin: 0 .08rem;
  }
}
.main{
  height: 100%;
  width: 100%;
  overflow-y: auto;
  background: #071724;
}
* {
  margin: 0;
  padding: 0;
}
body,
html {
  color: #333;
  background: #333;
}
body {
  background-color: #f7f7f7;
  min-height: 100%;
  height: initial !important;
}
html,
body,
div,
a,
img,
table {
  -webkit-tap-highlight-color: transparent;
}
div:active {
  background: transparent;
}
a {
  text-decoration: none;
}
ul,
ol {
  list-style: none;
}
.clear:after {
  content: " ";
  height: 0;
  display: block;
  overflow: hidden;
  clear: both;
}
</style>
