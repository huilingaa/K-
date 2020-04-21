<template>
  <div class="coinlist" v-if="show" @click.self="hideList" ref="list" :style="{background:bgColor}">
    <div :class="animationList">
      <div class="list_header">
          {{$t("kline.exchange")}}
      </div>
      <dl class="c_list" @click="ClickSymbol(item,index)" :key="item.Symbol" v-for="(item,index) in BitList">
        <dd :class="pairName===item.Symbol?'clicked':''">
          <span>{{item.Name}}</span>
        </dd>
      </dl>
    </div>
  </div>
</template>

<script>
import DefaultData from "../util/DefaultData.js";
export default {
  props: ["show","pairName"],
  data() {
    return {
      animationList: "list show",
      BitList: DefaultData.BitList(),
      bgColor:'rgba(0,0,0,.5)'
    };
  },
  methods: {
    hideList() {//显示列表
      this.animationList = "list hide";
      this.bgColor = 'transparent';
      this.$emit("toggleShow");
      setTimeout(() => {
        this.animationList = "list show";
        this.bgColor = 'rgba(0,0,0,.5)';
      }, 501);
    },
    ClickSymbol(item){//切换币种
      this.$emit('ChangeSymbol', item.Symbol, item.Name, item.FloatPrecision);
      this.hideList()
    },
  },
};
</script>

<style lang="scss" scoped>
.coinlist {
  background: rgba(0,0,0,.5);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1002;
  .list {
    width: 70%;
    height: 100%;
    background: #131e30;
    color: #ced3e9;
    padding: 15px 0;
    box-sizing: border-box;
    .list_header{
        height: 60px;
        font-size: 19px;
        font-weight: bold;
        line-height: 60px;
        padding: 0 15px;
    }
    dl{
        dd{
            height: 46px;
            line-height: 46px;
            border-bottom: #091626 1px solid;
            padding: 0 15px;
            font-size: .15rem;
        }
        dd.clicked{
            background: #172941;
        }
    }
  }
}
.show {
  animation: leftShow 0.5s;
}
.hide {
  animation: leftHide 0.5s;
}
@keyframes leftShow {
  0% {
    transform: translate(-100%, 0);
  }
  100% {
    transform: translate(0, 0);
  }
}
@keyframes leftHide {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(-100%, 0);
  }
}
</style>