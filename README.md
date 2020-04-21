# K线图组件（hqchart）

### websocket

* 建立web Socket连接之后，发送{"topic":"kline:btcusdt:1m",action:1}JSON格式类型请求表示订阅哪些话题
* {"topic":"kline:btcusdt:1m",action:1}表示订阅btcusdt的1分钟K线更新
* 服务端只要有数据更新就会回复一个带有data的K线数据
* 将最新的K线数据与例是K线数据最后一条对比，根据时间戳判断是跟你更新还是插入
* 取消订阅示例：(action为1表示订阅，0表示取消订阅)，传入的数据类型为JSON格式
    * `{"topic": "unsubscribeall", action: 0 }`为取消所有订阅（包括行情和K线）
    * `{"topic":"kline:btcusdt:1m",action:0}`为取消btc周期为1个月的K线订阅
    * `{"topic":"price:btcusdt",action:0}`为取消btc的行情订阅

---

### http+ws更新K线

* 首先初始化，获取当前行情（最新价格，最高最低等）以及初始屏周期（1天）的历史数据，同时在加载时建立websocket连接

    获取最新行情方法：`RequestPrice()`插入数据
    拉取历史数据：根据相应接口确定传入传出的参数，将获取到的历史数据修改为hqchartData的格式

* 初始化完成后，在保证websocket在连接状态时发送请求，订阅数据，将订阅推送的数据作相应的处理

    转换为hqchartData格式数据后，调用`this.KLine.JSChart.JSChartContainer.RecvMinuteRealtimeData(hqChartData);`更新数据
    目前日线更新方法暂时与日线历史数据不兼容，暂时使用分线实时更新方法，置换为分线方法格式

* 关于分时，根据`this.Minute.IsShow`判断当前是否为分时，切换周期或币种时选择相应的方法重新绘制图

* 关于息屏检测，由于js会在息屏一段时间后自动停止，`heartCheck()`方法检测息屏时间后重新与后台建立ws连接

---

### 切换时ws订阅以及取消订阅

* **切换周期：**
    切换周期时取消之前的K线订阅，再订阅切换后的K线

* **切换币种：**
    切换币种时取消所有订阅，重新订阅新的行情以及K线

---

## K线组件

### 组件目录配置
```
|--src
    |--assets
        |--img
    |--i18n 该文件在WSC-App中有具体使用
        |--cn.json 中文
        |--en.json 英文
        |--index.js 中英文配置文件
    |--pages
        |--coinList.vue 币种列表
        |--stockHq.vue K线组件
        |--index.vue 包括3个部分，头部，K线，币种列表
    |--util
        |--DefaultData.js K线默认配置环境
        |--network.js axios 配置环境
        |--style.js K线样式配置
    |--App.vue
    |--main.js
```

### K线组件的具体使用
目前该组件的具体使用于WSC-App中，其中i18n多语言配置文件，rem.js移动端适配文件都为WSC项目中存在的

在将本组件放入其他项目中时，将除去i18n文件的其余文件放入项目中，并安装本组件所需依赖`cnpm i hqchart axios qs jquery -S`，K线以及行情的数据获取均于`/util/network.js`配置完成，获取实时USDT转CNY接口暂无，目前在WSC项目中，该接口需要登录后才能使用，下一个版本上线之前修改。

测试ID：`H58129CB3`

**引入插件**
`cnpm i hqchart axios qs jquery -S`
