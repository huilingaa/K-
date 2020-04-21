<template>
  <div ref="divklinechart" style="height:1000px;background-color:#0e1a28">
    <!--当日行情-->
    <div class="headTitle" ref="divsymbol">
      <div class="price">
        <span
          :style="{color:Number(upDown)>=0?'#03ad90':'#D44964'}"
        >{{price.toFixed(FloatPrecision)}}</span>
        <p>
          ≈{{(price*rateData).toFixed(2)}}CNY
          <span
            :style="{color:Number(upDown)>=0?'#03ad90':'#D44964'}"
          >{{(upDown*100).toFixed(2)}}%</span>
        </p>
      </div>
      <div class="high">
        <p>
          <span>{{$t("kline.high")}}</span>
          <span>{{high24.toFixed(2)}}</span>
        </p>
        <p>
          <span>{{$t("kline.low")}}</span>
          <span>{{low24.toFixed(2)}}</span>
        </p>
        <p>
          <span>24H</span>
          <span>{{amount.toFixed(0)}}</span>
        </p>
      </div>
    </div>
    <!--k线周期-->
    <div class="tabs" ref="divperiod">
      <p class="tabsTitle">
        <span
          v-for="(item,index) in Period.Menu.slice(0,4)"
          :key="index"
          :class="{active : item.Name == Period.SelItem.Name}"
          @click="ChangePeriod(item)"
        >{{$t('kline.'+item.I18n)}}</span>

        <!-- 周期列表显示时为白色，如果选中隐藏的周期，为蓝色，其余的为默认颜色 -->
        <span
          @click="()=>{this.periodShow = !this.periodShow;this.indexIsShow = false;}"
          :style="{color:periodShow?'#e1ecf2':((more==='更多'||more==='More')?'':'#0066ee')}"
          :class="(more==='更多'||more==='More')?'':'active'"
        >{{more}}</span>
        <span>{{$t("kline.depth")}}</span>

        <!-- 指标切换 -->
        <img
          v-if="!indexIsShow"
          src="../assets/img/index.png"
          alt="index"
          @click="()=>{this.indexIsShow=!this.indexIsShow;this.periodShow = false;}"
        />
        <img
          v-else
          src="../assets/img/index_link.png"
          alt="index"
          @click="()=>{this.indexIsShow=!this.indexIsShow}"
        />
      </p>
      <!-- 周期选择 -->
      <div class="period" v-show="periodShow">
        <div>
          <span
            v-for="(item,index) in Period.Menu.slice(4)"
            :key="index"
            :class="{active : item.Name == Period.SelItem.Name}"
            @click="ChangePeriod(item)"
          >{{$t('kline.'+item.I18n)}}</span>
        </div>
      </div>
      <!-- 指标选择 -->
      <div class="wrap" ref="divindex" v-show="indexIsShow">
        <div>
          <span class="indexItem">{{$t("kline.main")}}</span>
          <span
            :key="index2"
            v-for="(item,index2) in Index.Menu.slice(0,2)"
            @click="ChangeIndex(item)"
            class="indexItem"
            :style="{color:(Index.SelItem[0].Name===item.Name)?'#ced3e9':''}"
          >{{$t('kline.'+item.I18n)}}</span>
        </div>
        <div>
          <span class="indexItem">{{$t("kline.sub")}}</span>
          <span
            :key="index2"
            v-for="(item,index2) in Index.Menu.slice(2)"
            @click="ChangeIndex(item)"
            class="indexItem"
            :style="{color:(Index.SelItem[1].Name===item.Name)?'#ced3e9':''}"
          >{{$t('kline.'+item.I18n)}}</span>
        </div>
      </div>
    </div>
    <!-- k线图 -->
    <div ref="klineBox" @click="hide">
      <div class="klineWrap" id="kline" ref="divkline" v-show="KLine.IsShow"></div>
      <div class="klineWrap" id="kline" ref="divkminute" v-show="Minute.IsShow"></div>
    </div>
  </div>
</template>

<script>
import HQChart from "hqchart";
import "hqchart/src/jscommon/umychart.resource/css/tools.css";
import "hqchart/src/jscommon/umychart.resource/font/iconfont.css";

import { axios } from "../util/network.js";
// import AppService from "../../../service/AppService.js";
import qs from "qs";

// 导入Option配置
import DefaultData from "../util/DefaultData.js";

// 导入风格配置
import HQChartStyle from "../util/style.js";

var JSCommon = HQChart.Chart;
var JSConsole = JSCommon.JSConsole;

// 关闭日志打印
JSConsole.Chart.Log = function() {};
JSConsole.Complier.Log = function() {};

//控制全局缩放速度
let zoom = JSCommon.JSChart.GetKLineZoom();
let ZOOM_SEED = //0=柱子宽度  1=间距
  [
    [49, 10],[48,10],[47,10],
    [46, 9],[45,9],[44,9],
    [43, 8],[42,8],
    [41, 7.5],[40,7.5],
    [39, 7],[38,7],
    [37, 6],[36,6],[35,6],[34,6],[33,6],[32,6],
    [31, 5.5],[30,5.5],[29,5.5],[28,5.5],
    [27, 5],[26,5],[25,5],[24,5],
    [23, 4.5],[22,4.5],
    [21, 4],[20,4],[19,4],
    [18, 3.5],[17,3.5],
    [16, 3],[15,3],[14,3],
    [13, 2.5],[12,2.5],
    [11, 2],[10,2],[9,2],
    [8, 1.5],[7,1.5],
    [6, 1],[5,1],[4,1],[3,1],
    [3, 0.6],[2.5,0.6],
    [2.2, 0.5],
    [1.1, 0.3],
  ];
zoom.length = 0;
ZOOM_SEED.forEach(item => {
  zoom.push(item);
});

export default {
  name: "BitKLine",
  props: [
    "DefaultPairName", //代码
    "DefaultName", //名称
    "DefaultfloatPrecision", //小数位数
    "DefaultPeriod" //周期
  ],
  data() {
    return {
      rateData:7.2,//USDT兑换CNY汇率
      Symbol: "",
      Name: "",
      PairName: "", //货币代码
      FloatPrecision: 2, //品种的小数位数
      indexIsShow: false, //指标选择是否显示
      periodShow: false, //更多周期是否显示
      more: this.$t("kline.more"), // 更多周期
      WS: null,
      open: false,// ws是否连接
      price: 0.0, // 最新价
      upDown: 0.0, // 今日涨跌幅
      high24: 0.0, // 24小时最高价
      low24: 0.0, // 24小时最低价
      amount: 0, // 成交总量
      hiddenTime: 0, // 屏幕亮起时间
      visibleTime: 0, // 屏幕熄灭时间，用户检测移动端息屏事件，检测到一段时间屏幕重新亮起后重新连接ws
      //K线
      KLine: {
        JSChart: null,
        Option: DefaultData.GetKlineOption(),
        IsShow: true
      },
      //分时 (使用K线面积图来做分时图)
      Minute: {
        JSChart: null,
        Option: DefaultData.GetKMinuteOption(),
        IsShow: false
      },
      //周期菜单
      Period: {
        Menu: DefaultData.GetPeriod(), //菜单项
        SelItem: DefaultData.GetPeriod()[6] //当前选中1天
      },
      //指标菜单
      Index: {
        Menu: DefaultData.GetIndexMenu(), //菜单项
        SelItem: [DefaultData.GetIndexMenu()[0], DefaultData.GetIndexMenu()[2]] // 默认选中指标，以数组存储选中[主图，副图]
      }
    };
  },

  created() {
    // 基础设置
    if (this.DefaultPairName) this.PairName = this.DefaultPairName;
    if (this.DefaultName) this.Name = this.DefaultName;
    if (this.DefaultfloatPrecision)
      this.FloatPrecision = parseInt(this.DefaultfloatPrecision);
    if (this.DefaultPeriod) {
      let periodItem = this.GetPeriodInfo(this.DefaultPeriod);
      if (periodItem) this.Period.SelItem = periodItem;
    }
    this.Symbol = this.PairName;

    // 获取初始行情
    this.RequestPrice(this.Symbol);

    // websocket连接
    this.WebSocketLink();

    //检测后台自动关闭websocket重连机制
    this.heartCheck();
  },

  mounted() {
    this.OnSize();
    this.CreateKLine();
    this.usdtToCny();//获取实时USDT=>Cny，现由于数据需登录WSC后获取，本文件暂不使用，于WSC-App中有具体使用
  },

  beforeDestroy() {
    this.WS.send(JSON.stringify({ topic: "unsubscribeall", action: 0 }));
    this.WS.close();
  },

  methods: {
    async usdtToCny(){//获取实时USDT=>CNY，与WSC-App中接口路径一致，目前待解决问题，获取需要登录后的token，下个版本替换时解决
      /* let res = await AppService.getUsdtCnyRate();
      if(res) this.rateData = Number(res.data) */
    },
    heartCheck() {//检测息屏时间，用于重新连接ws
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "hidden") {
          this.hiddenTime = new Date().getTime();
        } else {
          this.visibleTime = new Date().getTime();
          if ((this.visibleTime - this.hiddenTime) / 1000 > 10) {// 当息屏时间超过10s时重新连接
            this.WS.close();
            this.open = false;
            setTimeout(() => {
              this.WebSocketLink();
              if (this.Minute.JSChart) this.CreateMinute();
              else this.CreateKLine();
              setTimeout(() => {
                this.WS.send(
                  JSON.stringify({
                    topic:
                      "kline:" + this.Symbol + ":" + this.Period.SelItem.per,
                    action: 1
                  })
                );
              }, 500);
            }, 500);
          }
        }
      });
    },
    toDB(time) {//由于Hqchart插件传入时间需要以，例如：2020-04-20，以20200420类型传入，此处为数据转换
      if ((time + "").length !== 2) {
        return "0" + time;
      } else {
        return time;
      }
    },
    hide() {// 点击K线时隐藏周期和指标列表
      this.periodShow = false;
      this.indexIsShow = false;
    },
    // 动态调整
    OnSize() {
      let divKLineChart = this.$refs.divklinechart;
      let height = divKLineChart.offsetHeight; //获取总高度
      let width = divKLineChart.offsetWidth;

      let divPeriod = this.$refs.divperiod;
      let divSymbol = this.$refs.divsymbol;

      let divKLine = this.$refs.divkline;
      let klineHeight =
        height - divPeriod.offsetHeight - divSymbol.offsetHeight - 4; //总的高度减去其他控件高度就是图形高度
      divKLine.style.width = width + "px";
      divKLine.style.height = klineHeight + "px";
      if (this.KLine.JSChart) this.KLine.JSChart.OnSize();

      let divKMinute = this.$refs.divkminute;
      let kMinuteHeight =
        height - divPeriod.offsetHeight - divSymbol.offsetHeight - 4; //总的高度减去其他控件高度就是图形高度
      divKMinute.style.width = width + "px";
      divKMinute.style.height = kMinuteHeight + "px";
      if (this.Minute.JSChart) this.Minute.JSChart.OnSize();
    },
    // 建立websocket连接
    WebSocketLink() {
      if (!window.WebSocket) {
        window.WebSocket = window.MozWebSocket;
      }
      if (window.WebSocket) {
        //this.WS = new window.WebSocket("ws://47.110.155.158:8082/ws");
        this.WS = new window.WebSocket("ws://ws.wscbank.info/ws");
        this.WS.onmessage = event => {
          // 接收消息分别处理不同订阅的消息
          let receivedData = event.data;
          if (!JSON.parse(receivedData).data) return;
          if (receivedData.indexOf("price") !== -1) {
            let data = JSON.parse(JSON.parse(receivedData).data);
            this.price = data[0];
            this.upDown = data[1];
            this.high24 = data[2];
            this.low24 = data[3];
            this.amount = data[4];
          } else {
            if (
              receivedData.indexOf("h") !== -1 ||
              receivedData.indexOf("m") !== -1
            ) {
              this.handlerMessage("minute", receivedData, {
                Name: this.Name,
                Symbol: this.Symbol
              });
            } else {
              this.handlerMessage("day", receivedData, {
                Name: this.Name,
                Symbol: this.Symbol
              });
            }
          }
        };
        this.WS.onopen = () => {
          this.open = true;
          this.WS.send(
            JSON.stringify({ topic: "price:" + this.Symbol, action: 1 })
          );
        };
        this.WS.onclose = () => {
          this.open = false;
        };
      }
    },
    // 切换股票
    ChangeSymbol(symbol, name, floatPrecision) {
      //取消K线和行情订阅
      if (this.open) {
        this.WS.send(JSON.stringify({ topic: "unsubscribeall", action: 0 }));
      } else {
        this.WebSocketLink();
      }

      if (this.PairName == symbol) return;
      this.PairName = symbol;
      this.Symbol = symbol;
      this.Name = name;
      this.FloatPrecision = floatPrecision;
      if (this.KLine.JSChart)
        this.KLine.JSChart.ChangeSymbol(this.Symbol + ".BIT");// 切换股票时传入.BIT后缀是由于Hqchart根据该后缀判断K线图的类型，如果不传入，默认配置文件中FloatPrecision不起作用
      if (this.Minute.JSChart)
        this.Minute.JSChart.ChangeSymbol(this.Symbol + ".BIT");
      if (this.open) {
        this.RequestPrice(this.Symbol);
        this.WS.send(
          JSON.stringify({ topic: "price:" + this.Symbol, action: 1 })
        );
      } else {
        this.WebSocketLink();
      }
    },
    // 切换指标
    ChangeIndex(item) {
      this.$set(this.Index.SelItem, item.WindowIndex, item);

      if (this.KLine.JSChart)
        this.KLine.JSChart.ChangeIndex(item.WindowIndex, item.ID);
    },
    // 切换周期
    ChangePeriod(item) {
      // 取消之前的K线订阅
      if (this.open) {
        this.WS.send(
          JSON.stringify({
            topic: "kline:" + this.Symbol + ":" + this.Period.SelItem.per,
            action: 0
          })
        );
      } else {
        this.WebSocketLink();
      }

      this.Period.SelItem = item;
      this.periodShow = false;
      if (item.index === 1) {
        this.more = this.$t("kline." + item.I18n);
        item.Name;
      } else {
        this.more = this.$t("kline.more");
      }
      if (item.Name === "分时") {
        if (!this.Minute.JSChart) this.CreateMinute();
        this.Index.IsShow = false;
        this.KLine.IsShow = false;
        this.Minute.IsShow = true;
      } else {
        if (this.KLine.JSChart) this.KLine.JSChart.ChangePeriod(item.Period);
        else this.CreateKLine();

        this.Index.IsShow = true;
        this.KLine.IsShow = true;
        this.Minute.IsShow = false;
      }
    },
    // 创建K线图
    CreateKLine() {
      if (this.KLine.JSChart) return;

      // 自定义样式
      JSCommon.JSChart.SetStyle(
        HQChartStyle.GetStyleConfig(2) // 2 黑色风格
      );

      // 不同品种虚拟币，使用不同小数位数symbol
      JSCommon.MARKET_SUFFIX_NAME.GetBITDecimal = () => {
        return this.FloatPrecision;
      };

      // 将K线图绑定到一个DIV上
      let divKLine = this.$refs.divkline;
      this.KLine.JSChart = JSCommon.JSChart.Init(divKLine);

      // K线图配置
      this.KLine.Option.KLine.Period = this.Period.SelItem.Period;
      this.KLine.Option.Symbol = this.Symbol + ".BIT";

      // 网络请求回调函数
      this.KLine.Option.NetworkFilter = (data, callback) => {
        this.NetworkFilter(data, callback);
      };

      // K线图Option设置
      this.KLine.JSChart.SetOption(this.KLine.Option);
    },
    // 创建分时图
    CreateMinute() {
      if (this.Minute.JSChart) return;

      // 不同品种虚拟币，使用不同小数位数symbol
      JSCommon.MARKET_SUFFIX_NAME.GetBITDecimal = () => {
        return this.FloatPrecision;
      };

      // div绑定
      let divKLine = this.$refs.divkminute;
      this.Minute.JSChart = JSCommon.JSChart.Init(divKLine);

      // 配置
      this.Minute.Option.Symbol = this.Symbol + ".BIT";

      // 网络请求回调函数
      this.Minute.Option.NetworkFilter = (data, callback) => {
        this.MinuteNetworkFilter(data, callback);
      };

      // 设置Option
      this.Minute.JSChart.SetOption(this.Minute.Option);
    },
    // 获取当前指标
    GetPeriodInfo(period) {
      for (let i in this.Period.Menu) {
        let item = this.Period.Menu[i];
        if (item.Period == period) return item;
      }
      return null;
    },
    // 把最新收到的ws实时数据转成hqchart数据格式
    handlerMessage(topic, receivedData, stockData) {
      let recvData = JSON.parse(receivedData);
      let klineData = null,
        hqChartData = null;
      if (recvData.code === 200) {
        klineData = this.ParseData(recvData);
        hqChartData = { code: 0, data: klineData, ver: 2.0 }; //数字货币使用ver2.0数据格式
        hqChartData.symbol = stockData.Symbol + ".BIT";
        hqChartData.name = stockData.Name;
        if (this.Minute.IsShow) {
          this.Minute.JSChart.JSChartContainer.RecvMinuteRealtimeData(
            hqChartData
          );
        } else {
          this.KLine.JSChart.JSChartContainer.RecvMinuteRealtimeData(
            hqChartData
          );
        }
      }
    },
    // 分时图网络回调函数
    MinuteNetworkFilter(data, callback) {
      switch (data.Name) {
        case "KLineChartContainer::ReqeustHistoryMinuteData": //分钟全量数据下载
          this.ReqeustHistoryMinuteData(data, callback, { PageSize: 40 });
          break;
      }
    },
    // K线图网络回调函数
    NetworkFilter(data, callback) {
      switch (data.Name) {
        case "KLineChartContainer::ReqeustHistoryMinuteData": //分钟全量数据下载
          this.ReqeustHistoryMinuteData(data, callback, { PageSize: 40 });
          break;
        case "KLineChartContainer::RequestHistoryData": //日线全量数据下载
          this.RequestHistoryData(data, callback);
          break;
      }
    },
    // 获取行情初始数据
    RequestPrice(symbol) {
      axios.post("/price", qs.stringify({ symbol })).then(receData => {
        if (receData.code === 200) {
          let data = JSON.parse(receData.data);
          this.price = data[0];
          this.upDown = data[1];
          this.high24 = data[2];
          this.low24 = data[3];
          this.amount = data[4];
        }
      });
    },
    // 分钟线历史数据请求
    async ReqeustHistoryMinuteData(data, callback, option) {
      data.PreventDefault = true;
      let period = data.Self.Period; //获取周期
      let symbol = this.Symbol;
      let name = this.Name;
      let peirodMenu = this.GetPeriodInfo(period);
      let recvData = await axios.post(
        "/kline",
        qs.stringify({
          symbol: symbol,
          period: peirodMenu.per,
          size: 2000
        })
      );
      if (recvData.code === 200) {
        this.RecvMinuteHistoryData(
          recvData,
          callback,
          {
            Name: name,
            Symbol: symbol,
            Chart: data.Self,
            period: peirodMenu.per
          },
          option
        );
      }
    },
    // 处理分钟线历史数据
    RecvMinuteHistoryData(recvData, callback, stockData, option) {
      let klineData = this.ParseData(recvData);
      let hqChartData = { code: 0, data: klineData };
      hqChartData.symbol = stockData.Symbol + ".BIT";
      hqChartData.name = stockData.Name;
      stockData.Chart.PageSize = option.PageSize;

      callback(hqChartData);

      setTimeout(() => {
        if (this.open) {
          this.WS.send(
            JSON.stringify({
              topic: "kline:" + stockData.Symbol + ":" + stockData.period,
              action: 1
            })
          );
        } else {
          this.WebSocketLink();
        }
      }, 200);
    },
    // 日线历史数据请求
    async RequestHistoryData(data, callback) {
      data.PreventDefault = true;
      let period = data.Self.Period; // 获取周期
      let symbol = this.Symbol;
      let name = this.Name;
      let peirodMenu = this.GetPeriodInfo(period);
      let recvData = await axios.post(
        "/kline",
        qs.stringify({
          symbol: symbol,
          period: peirodMenu.per,
          size: 2000
        })
      );
      if (recvData.code === 200) {
        this.RecvHistoryData(recvData, callback, {
          Name: name,
          Symbol: symbol,
          Chart: data.Self,
          period: peirodMenu.per
        });
      }
    },
    // 处理日线历史数据
    RecvHistoryData(recvData, callback, stockData) {
      let klineData = this.ParseData(recvData);
      let hqChartData = { code: 0, data: klineData };
      hqChartData.symbol = stockData.Symbol + ".BIT";
      hqChartData.name = stockData.Name;
      stockData.Chart.PageSize = 40;

      callback(hqChartData);

      setTimeout(() => {
        if (this.open) {
          this.WS.send(
            JSON.stringify({
              topic: "kline:" + stockData.Symbol + ":" + stockData.period,
              action: 1
            })
          );
        } else {
          this.WebSocketLink();
        }
      }, 200);
    },

    // 分钟，日线数据转化为hqchart数据格式
    // hqchart数据格式date-日期, yClose, open-开盘价, high-最高价, low-最低价, close-收盘价, vol-成交量, time-时间
    ParseData(recvData) {
      let data = JSON.parse(recvData.data);
      let yClose = null;
      let klineData = [];
      for (let i in data) {
        let item = data[i];
        let date = new Date(item[0] * 1000);
        let y = date.getFullYear(),
          m = date.getMonth() + 1,
          d = date.getDate(),
          h = date.getHours(),
          mi = date.getMinutes();
        date = Number("" + y + this.toDB(m) + this.toDB(d));
        let time = Number("" + this.toDB(h) + this.toDB(mi));
        time = time === 0 ? 2400 : time;
        let open = parseFloat(item[1]);
        let close = parseFloat(item[2]);
        let high = parseFloat(item[3]);
        let low = parseFloat(item[4]);
        let vol = parseFloat(item[5]);
        klineData.push([date, yClose, open, high, low, close, vol, null, time]);

        yClose = close;
      }
      return klineData;
    }
  }
};
</script>

<style lang="scss" scoped>
/*页面头部*/
.headTitle {
  padding: 4% 4%;
  display: flex;
  justify-content: space-between;
  flex: 1;
  position: relative;
  color: rgb(113, 134, 165);
  background: #131e30;
  .price {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    p {
      color: #6d87a8;
      font-size: 0.14rem;
      span {
        font-size: 0.14rem;
        font-weight: normal;
      }
    }
    span {
      color: #03ad90;
      font-size: 0.28rem;
      font-weight: bold;
    }
  }
  .high {
    min-width: 24%;
    line-height: 1.6em;
    font-size: 0.14rem;
    p {
      display: flex;
      justify-content: space-between;
      span:nth-of-type(2) {
        color: #ced3e9;
        margin-left: 0.08rem;
      }
    }
  }
}

/*k线周期列表*/
.tabs {
  background: #131e30;
  display: flex;
  align-items: center;
  padding-right: 4%;
  position: relative;
  > span {
    color: #e1ecf2;
    height: 0.28rem;
    line-height: 0.28rem;
  }
}
.tabsTitle {
  background: #131e30;
  height: 0.28rem;
  line-height: 0.28rem;
  border-bottom: 1px solid #171928;
  border-top: 1px solid #171928;
  padding-left: 2%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 1;
  > img {
    height: 0.15rem;
    width: 0.15rem;
  }
  span {
    height: 0.27rem;
    line-height: 0.27rem;
    font-size: 0.12rem;
    border-bottom: 2px solid transparent;
    display: inline-block;
    text-align: center;
    vertical-align: top;
    color: rgb(113, 134, 165);
    position: relative;
  }
  span.active {
    border-bottom-color: #0066ee;
    color: #0066ee;
  }
  > span:nth-last-of-type(2) {
    width: 14%;
  }
  > span:nth-last-of-type(2)::after {
    content: "";
    border: 3px solid rgb(113, 134, 165);
    border-left-color: transparent;
    border-top-color: transparent;
    position: absolute;
    bottom: 5px;
    right: -6px;
  }
}

/* K线图 */
.klineWrap {
  float: left;
  position: relative;
  overflow: hidden;
}

/* 更多周期/指标 */
.wrap,
.period {
  background-color: #0e1b2b;
  font-size: 0.12rem;
  overflow: hidden;
  position: absolute;
  top: 0.34rem;
  left: 0.02rem;
  right: 0.02rem;
  z-index: 100;
  border: solid #253243 0.5px;
  > div {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    .indexItem.active {
      color: #ced3e9;
    }
    span {
      width: 16%;
      display: block;
      line-height: 0.35rem;
      text-align: center;
      color: rgb(113, 134, 165);
    }
    span.active {
      color: #0b64da;
    }
  }
}
</style>
