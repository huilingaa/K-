function GetDevicePixelRatio()
{
    return window.devicePixelRatio || 1;
}

// 黑色风格
const BLACK_STYLE = {
    BGColor: 'rgb(0,0,255)', //背景色
    // TooltipBGColor: "rgb(255, 255, 0)", //背景色
    // TooltipAlpha: 0.92, //透明度

    SelectRectBGColor: "rgba(1,130,212,0.06)", //背景色
    //  SelectRectAlpha: 0.06;                  //透明度

    //K线颜色
    UpBarColor: "#03AC91", //上涨#eb475e红色为跌，#27A17C绿色为涨
    DownBarColor: "#D44964", //下跌
    UnchagneBarColor: "rgb(113,134,165)", //平盘

    FrameLatestPrice: {
      TextColor:'#3a82e3',   //最新价格文字颜色
      UpBarColor:"rgba(255,255,255,.9)",    //上涨
      DownBarColor:"rgba(255,255,255,.9)",   //下跌
      UnchagneBarColor:"rgba(255,255,255,.9)",   //平盘
      BGAlpha:0.6
    },

    DefaultTextColor: "rgb(113,134,165)",// 默认字体颜色
    DefaultTextFont: 14 * GetDevicePixelRatio() + 'px 微软雅黑',
    TitleFont: 12 * GetDevicePixelRatio() + 'px 微软雅黑', //标题字体(动态标题 K线及指标的动态信息字体)

    // K线信息
    UpTextColor: "#03AC91",
    DownTextColor: "#D44964",
    UnchagneTextColor: "rgb(113,134,165)",

    // 分时图
    CloseLineColor: "rgb(80,132,205)",
    CloseLineAreaColor: ['rgba(80,132,205,0.3)','rgba(80,132,205,0)'],

    // 背景
    FrameBorderPen: "rgba(236,236,236,0)", //边框rgba(236,236,236,0.13)
    FrameSplitPen: "rgba(236,236,236,0.13)", //分割线
    FrameSplitTextColor: "#7085a2", //刻度文字颜色
    FrameSplitTextFont: 12 * GetDevicePixelRatio() + 'px 微软雅黑', //坐标刻度文字字体
    FrameTitleBGColor: "#0e1a28", //标题栏背景色

    CorssCursorBGColor: "rgb(43,54,69)", //十字光标背景
    CorssCursorTextColor: "rgb(255,255,255)",
    CorssCursorTextFont: 12 * GetDevicePixelRatio() + "px 微软雅黑",
    CorssCursorPenColor: "#fff", //十字光标线段颜色
    KLine: {
      // K线最大最小值显示
      MaxMin: {
        Font: 12 * GetDevicePixelRatio() + 'px 微软雅黑',
        Color: "#fff"
      }
    },

    Index: {
      //指标线段颜色
      LineColor: [
        "rgb(237,219,169)",// 鹅黄
        "rgb(117,200,192)",// 
        "rgb(192,155,235)",
        "rgb(243,150,122)",
        "rgb(100,180,234)",
        "rgb(251,145,181)",
        "rgb(0,128,255)",
        "rgb(252,96,154)",
        "rgb(42,230,215)",
        "rgb(24,71,178)"
      ],
      NotSupport: { Font: 12 * GetDevicePixelRatio() + 'px 微软雅黑', TextColor: "rgb(52,52,52)" }
    },

    //自定义指标默认颜色
    ColorArray: [
      "rgb(255,174,0)",
      "rgb(25,199,255)",
      "rgb(175,95,162)",
      "rgb(236,105,65)",
      "rgb(68,114,196)",
      "rgb(229,0,79)",
      "rgb(0,128,255)",
      "rgb(252,96,154)",
      "rgb(42,230,215)",
      "rgb(24,71,178)"
    ],

    //画图工具
    DrawPicture: {
      LineColor: "rgb(30,144,255)",
      PointColor: "rgb(105,105,105)"
    },

    TooltipPaint: {
      BGColor: "rgba(17,18,32,1)", //背景色
      BorderColor: "rgba(100,100,100,1)", //边框颜色

      TitleColor: "rgb(210,210,210)" //标题颜色
      // TitleFont: 13 * GetDevicePixelRatio() + 'px 微软雅黑' //字体
    }
  };

  var STYLE_TYPE_ID = {
    BLACK_ID: 2 // 黑色风格
  };
  
  HQChartStyle.GetStyleConfig = function(
      styleid // 获取一个风格的配置变量
  ) {
    switch (styleid) {
      case STYLE_TYPE_ID.BLACK_ID:
        return BLACK_STYLE;
      default:
        return null;
    }
  };

  export default function HQChartStyle() {}