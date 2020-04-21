export default function DefaultData() { }
let language = ()=>localStorage.getItem("language")?localStorage.getItem("language").toUpperCase():'en';
// 获取K线
DefaultData.GetKlineOption = function () {
    let data = {
        Type: "历史K线图", // 创建图片类型
        Language: language() || 'CN',// 中英文配置，EN英文，CN中文

        //窗口指标，需要展示几种表
        Windows:
            [
                {
                    Index: "均线",
                    Modify: false,
                    Change: false
                },
                {
                    Index: "VOL",
                    Modify: false,
                    Change: false
                }
            ],
        Symbol: 'btcusdt', // 显示的股票代码
        IsAutoUpdate: false, // 是否自动更新最新行情，取消自动更新行情，使用websocket
        AutoUpdateFrequency: 3000, //数据更新频率 ms

        IsShowRightMenu: false, //是否显示右键菜单
        IsApiPeriod: true, //使用Api计算周期

        IsClickShowCorssCursor: true, //鼠标移动或手势点击出现十字光标
        IsCorssOnlyDrawKLine: true, //十字光标在K线中间
        CorssCursorTouchEnd: true, //手势离开屏幕十字光标自动隐藏
        EnableScrollUpDown: true, //允许手势上下操作滚动页面
        CorssCursorInfo: { Left: 0, Right: 2, Bottom: 1, IsShowCorss: true }, //十字光标刻度设置 Left, Right, Bottom十字光标刻度显示设置 0=不显示 1=现在在框外 2=显示在框内

        KLine: {
            DragMode: 1, //拖拽模式 0 禁止拖拽 1 数据拖拽 2 区间选择
            Right: 1, //复权 0 不复权 1 前复权 2 后复权
            Period: 0, //周期 0 日线 1 周线 2 月线 3 年线
            // MaxReqeustDataCount: 1000, //日线数据最近1000天,请求K线数据的最大个数
            // MaxRequestMinuteDayCount: 15, //分钟数据最近15天
            PageSize: 30, //初始一屏显示多少数据
            IsShowTooltip: false, //是否显示K线提示信息
            // RightSpaceCount:5
        },
        //标题设置
        KLineTitle: {
            IsShowName: true, // K线标题是否显示股票名称
            IsShowSettingInfo: true // K线标题是否周期/复权
        },
        MinuteLine: {
            IsShowAveragePrice: true
        },

        // 坐标边框到画布边框的间距
        Border: {
            Left: 0, //左边间距
            Right: 54, //右边间距
            Top: 0,
            Bottom: 20
        },
        // 指标窗口坐标设置
        // SplitCount-y轴刻度个数,IsShowLeftText-是否显示左侧Y轴刻度
        Frame:
            [
                {SplitType:1, SplitCount: 4,Height: 4, IsShowLeftText: false, Custom: [{ Type: 0 }] },
                {SplitType:1, SplitCount: 2,Height: 2, IsShowLeftText: false, },
            ],
        ExtendChart: [
            {
                Name: "KLineTooltip"
            }
        ]
    };
    return data;
};

// 获取分时
DefaultData.GetKMinuteOption = function () {
    let data = {
        Type: "历史K线图",
        //窗口指标
        Windows:
            [
                { Index: "EMPTY", Modify: false, Change: false, TitleHeight: 0 },
                { Index: "VOL", Modify: false, Change: false }
            ],
        Symbol: 'btcusdt',
        IsAutoUpdate: false,// 取消自动更新行情，使用websocket
        AutoUpdateFrequency: 3000, //数据更新频率 ms

        IsShowRightMenu: false, //右键菜单
        IsApiPeriod: true, //使用Api计算周期

        IsClickShowCorssCursor: true, //手势点击出现十字光标
        IsCorssOnlyDrawKLine: true, //十字光标在K线中间
        CorssCursorTouchEnd: true, //手势离开屏幕十字光标自动隐藏
        EnableScrollUpDown: true, //允许手势上下操作滚动页面
        CorssCursorInfo: { Left: 0, Right: 2, Bottom: 1, IsShowCorss: true }, //十字光标刻度设置 Left, Right, Bottom十字光标刻度显示设置 0=不显示 1=现在在框外 2=显示在框内

        KLine: {
            DragMode: 1, //拖拽模式 0 禁止拖拽 1 数据拖拽 2 区间选择
            Right: 1, //复权 0 不复权 1 前复权 2 后复权
            Period: 4, //周期 0 日线 1 周线 2 月线 3 年线
            // MaxReqeustDataCount: 1000, //日线数据最近1000天
            // MaxRequestMinuteDayCount: 15, //分钟数据最近15天
            PageSize: 30, //一屏显示多少数据
            IsShowTooltip: false, //是否显示K线提示信息
            DrawType: 4,// 面积图
        },
        //标题设置
        KLineTitle: {
            IsShowName: false, //不显示股票名称
            IsShowSettingInfo: false //不显示周期/复权
        },
        MinuteLine: {
            IsShowAveragePrice: true
        },
        //边框
        Border: {
            Left: 0, //左边间距
            Right: 54, //右边间距
            Top: 0,
            Bottom: 20
        },
        //子框架设置
        Frame: [
            {SplitType:1, SplitCount: 4, IsShowLeftText: false, Custom: [{ Type: 0 }] },
            {SplitType:1, SplitCount: 2, IsShowLeftText: false },
        ],

        ExtendChart: [{ Name: "KLineTooltip" }]
    };
    return data;
};

// 周期菜单
DefaultData.GetPeriod = function () {
    //Period作为参数传递给后端
    var data = [
        {I18n:'15min', Name: '15分钟', Period: 6, Type: 0, Min: '15', per: '15m', index: 0 },// index表示展示在列表还是在更多
        {I18n:'1hour', Name: '1小时', Period: 8, Type: 0, Min: '60', per: '1h', index: 0 },
        {I18n:'4hour', Name: '4小时', Period: 12, Type: 0, Min: '240', per: '4h', index: 0 },
        {I18n:'1day', Name: '1天', Period: 0, Type: 1, Min: '0', per: '1d', index: 0 },
        {I18n:'line', Name:'分时', Period:4, Type:0, Min:'1', per: '1m', index: 1 },
        {I18n:'1min', Name: '1分钟', Period: 4, Type: 0, Min: '1', per: '1m', index: 1 },
        {I18n:'5min', Name: '5分钟', Period: 5, Type: 0, Min: '5', per: '5m', index: 1 },
        {I18n:'30min', Name: '30分钟', Period: 7, Type: 0, Min: '30', per: '30m', index: 1 },
        {I18n:'1week', Name: '1周', Period: 1, Type: 2, Min: '0', per: '1w', index: 1 },
        {I18n:'1mon', Name: '1月', Period: 2, Type: 3, Min: '0', per: '1M', index: 1 }
    ];
    return data;
};

// 指标菜单配置
DefaultData.GetIndexMenu = function () {//host,vice
    //ID=指标ID Name=菜单显示的名字  WindowIndex=切换指标对应的窗口索引 
    /* 
     * WindowIndex无法将非主图置于主图，原因是插件设置某些指标为主图，未设置的不可置于主图
     * umychart.vue.js-JSIndexScript系统指标库
     */
    let data = [
        {I18n:'ma', Name: "均线", ID: "均线", WindowIndex: 0 },// 主
        {I18n:'boll', Name: "BOLL", ID: "BOLL", WindowIndex: 0 },// 主
        {I18n:'vol', Name: "VOL", ID: "VOL", WindowIndex: 1 },// 副
        {I18n:'macd', Name: "MACD", ID: "MACD", WindowIndex: 1 },// 副
        {I18n:'kdj', Name: "KDJ", ID: "KDJ", WindowIndex: 1 },// 副
        {I18n:'rsi', Name: "RSI", ID: "RSI", WindowIndex: 1 },// 副
        {I18n:'wr', Name: "WR", ID: "WR", WindowIndex: 1 },// 副
    ];
    return data
};

// 币种菜单
DefaultData.BitList=function()
{
    var data=
    [
        // { Name:'WSC/USDT', Symbol:"wscusdt", FloatPrecision:2, Vol:{Text:'', Value:null}, Price:{Text:'', Value:null }},
        { Name:'BTC/USDT', Symbol:"btcusdt", FloatPrecision:2, Vol:{Text:'', Value:null}, Price:{Text:'', Value:null } },
        { Name:'ETH/USDT', Symbol:"ethusdt", FloatPrecision:2, Vol:{Text:'', Value:null}, Price:{Text:'', Value:null } },
        { Name:'LTC/USDT', Symbol:"ltcusdt", FloatPrecision:4, Vol:{Text:'', Value:null}, Price:{Text:'', Value:null } },
        { Name:'XRP/USDT', Symbol:"xrpusdt", FloatPrecision:6, Vol:{Text:'', Value:null}, Price:{Text:'', Value:null } },
        { Name:'BCH/USDT', Symbol:"bchusdt", FloatPrecision:2, Vol:{Text:'', Value:null}, Price:{Text:'', Value:null } },
    ];
    return data;
}
