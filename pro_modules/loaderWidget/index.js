/**
 * 加载器
 * @authors Stri (stri.vip@gmail.com)
 * @date    2013-11-28 11:34:38
 * @version $Id$
 */
define(function(module){
  var parseParam = require('parseParam'),
    URL = require('URL'),
    Callbacks = require('Callbacks'),
    loaderScriptStyle = require('loaderScriptStyle'),
    inVisibleArea = require('inVisibleArea'),
    lazyload = require('lazyload'),
    media = require('media@1.0'),
    widget = require('widget'),
    path = require('path'),
    _widget = require('./widget/index');

  /**
   * widget
   * @return  {[type]}  [description]
   */
  
  module.exports = function(Opts){
    var that,
      conf,
      init,
      define,
      widgets = [],
      widgetStack = [],
      _eventHash = {},
      _fireEventList = [],
      visibleWidgetStack = [],
      widgetLoadedStack = [],
      bindEvent,
      destroy;

    // param
    conf = parseParam({
      version: {},
      host: {}
    },Opts);

    that = widget(conf);
    that.media = media;

    // 获取module info
    function getModuleInfo(fn){
      var args = fn.arguments;
      if (args.length == 1 && args[0]._isProModule_ === true){
        return args[0];
      }else if (typeof fn == 'function'){
        return getModuleInfo(fn.caller);
      }else {
        return {};
      }
    }

    /**
     * 定义widget
     * @param   {[type]}  widget  [description]
     * @return  {[type]}          [description]
     */
    define = function(widget){
      widget.module = widget.module || getModuleInfo(arguments.callee.caller);
      widgets.push(widget);
    }

    /**
     * 获取版本号
     * @return  {[type]}  [description]
     */
    function getSourceVersion(){
      var conf = that.getConfig();
      return conf.version || {};
    }

    /**
     * 获取资源路径
     * @return  {[type]}  [description]
     */
    function getSourceHost(){
      var conf = that.getConfig();
      return conf.host || {};
    }

    /** 
     * 监听模块加载事件
     * @param type {String} 事件类型
     * @param callback {Function} 回调
     */
    function addEvent(type,callback){
      var evt;
      if(typeof(type) == 'string'){
        // 支持多个事件类型
        if(type.split('|').length > 1){
          $.map(type.split('|'),function(time){
            that.addEvent(time,callback);
          });
          return;
        }

        // 如果是media
        if(that.media.isMediaQuery(type)){
          evt = that.media.addListener(type,callback);
        }else{
          evt = _eventHash[type] || (_eventHash[type] = Callbacks('once memory'));
          if($.isFunction(callback)){
            if(type == 'DOMContentLoaded'){
              $(document).ready(callback);
            }else{
              evt.add(callback);

              // 如果已经fire过的事件，则再次fire告诉
              if(that.isFiredEvent(type)){
                that.fireEvent(type);
              }
            }
          }
        }
      }
    };

    /** 
     * 派发模块加载事件
     * @param type {String} 事件类型
     */
    function fireEvent(type){
      var evt;

      if(typeof(type) == 'string'){
        if($.inArray(type,_fireEventList) == -1){
          _fireEventList.push(type);
        }

        if(evt = _eventHash[type]){
          evt.fire();
        }
      }
    };
    
    /**
     * 判断类型是否fired
     * @param   {[type]}   type  [description]
     * @return  {Boolean}        [description]
     */
    function isFiredEvent(type){
      return $.inArray(type,_fireEventList) != -1;
    };

    /**
     * 初始化widget
     * @param   {[type]}  widget  [description]
     * @return  {[type]}          [description]
     */
    function initWidget(widget){
      var conf = widget.getConfig(),
        fn = function(){
          // 如果有执行初始化逻辑
          if (conf.initialize){
            var requires = $.isArray(conf.require) ? conf.require : [conf.require];
            $.map(requires,function(key){
              try{
                var obj = require(path.resolve(conf.module.id,key));
                if (obj.init){
                  obj.init();
                }
              }catch(e){}

              try{
                conf.exports.call(obj,conf);
              }catch(e){}
            });
          }else {
            try{
              conf.exports(conf);
            }catch(e){
            }
          }

        };

      if(conf.initTime){
        that.addEvent(conf.initTime,fn);
      }else{
        fn();
      }
    }

    /**
     * 加载widget
     * @param   {[type]}  widget  [description]
     * @return  {[type]}          [description]
     */
    function loadWidget(widget,callback){
      var conf = widget.getConfig(),
          ajaxConf = [],
          require = conf.require || [],
          fn;
      
      // 转换成数组
      require = $.isArray(require) ? require : [require];

      // 如果已经加载过了，不在处理
      if($.inArray(widget,widgetLoadedStack) != -1){
        if($.isFunction(callback)){
          callback();
        }
        return;
      }

      widgetLoadedStack.push(widget);

      // 设置版本号
      conf.requireParam = conf.requireParam || [];
      $.each(require,function(index,url){
        var param = conf.requireParam[index],
          version = getSourceVersion(),
          fileType = path.extname(url) || 'js',
          tempParam = version[fileType] ? {
            version: version[fileType]
          } : {};
        conf.requireParam[index] = $.extend({},tempParam,param);
      });

      // 加载完的回调
      fn = function(){
        if($.isFunction(callback)){
          callback();
        }
        // 初始化widget
        that.initWidget(widget);
      };

      if(require.length){
        // 添加到队列中
        $.map(require,function(url,index){
          var param = conf.requireParam[index],
            fileType = path.extname(url) || 'js',
            _url = url;

          if (!/^http/gi.test(_url)){
            _url = path.resolve(conf.module.id,url);
            _url = getSourceHost()[fileType]+_url;
          }
          ajaxConf.push({
            url: _url,
            data: param
          });
        })

        // 加载script
        loaderScriptStyle(ajaxConf,{
          cache: true,
          isDepend: conf.isDepend,
          onSuccess: fn
        });
      }else{
        fn();
      }
    }

    /**
     * 添加widget监听
     * @param  {[type]}  widget  [description]
     */
    function addWidgetListener(widget,notMedia){
      var conf = widget.getConfig(),
        box = conf.box,
        fn = function(){
          loadWidget(widget);
        };

      // 监听事件
      if(!notMedia && conf.media && that.media.isSupport()){
        that.addEvent(conf.media,function(){
          that.addWidgetListener(widget,true);
        });
      }else if(conf.loadTime){
        that.addEvent(conf.loadTime,fn);
      }else if(box && inVisibleArea(box)){
        visibleWidgetStack.push(widget);
      }else if(box){
        // 延迟加载
        lazyload(box.node,fn);
      }else{
        fn();
      }
    }

    /**
     * 开始加载
     * @return  {[type]}  [description]
     */
    function start(){     
      // 创建
      createWidgetToStack();
      // 按照优化级排序
      sortWidgetsByRate();

      var _stack = [].concat(widgetStack),
        widget;

      // 遍历进行监听并处理加载(可视区别不进行监听)
      while(widget = widgetStack.shift()){
        var conf = widget.getConfig();
        if(conf.platform){
          addWidgetListener(widget);
        }
      }

      // 首屏资源
      (function(){
        var widget,
            conf,
            args = arguments;
        if(widget = visibleWidgetStack.shift()){
          conf = widget.getConfig();
          if(conf.async){
            loadWidget(widget);
          }else{
            loadWidget(widget,args.callee);
          }
        }else{
          that.channel.fire('loaderWidget/firstViewLoaded');
        }
      })();
    }

    /**
     * 对widgets进行排序
     * @return  {[type]}  [description]
     */
    function sortWidgetsByRate(){
      widgetStack.sort(function(a,b){
        return a.rate - b.rate < 0
      });
    }

    /**
     * 创建widget
     * @return  {[type]}  [description]
     */
    function createWidgetToStack(Opts){
      var conf = that.getConfig();
      $.map([].concat(widgets).concat(conf.widgets),function(value){
        if(value){
          widgetStack.push(_widget(value));
        }
      });
    }

    // bindEvent
    bindEvent = function(){
      // 绑定DOMContentLoaded事件
      $(document).ready(function(){
        that.fireEvent('DOMContentLoaded');
      });

      // onload
      $(window).on('load',function(){
        that.fireEvent('onload');
      });

      // 监听事件
      that.channel.add('loaderWidget/fireEvent',function(type){
        if(type && (typeof type == 'string')){
          that.fireEvent(type);
        }
      });
    };

    // destroy
    destroy = function(){};

    // init
    init = function(){
      bindEvent();
    };

    // api
    that.start = start;
    that.define = define;
    that.initWidget = initWidget;
    that.loadWidget = loadWidget;
    that.fireEvent = fireEvent;
    that.addEvent = addEvent;
    that.isFiredEvent = isFiredEvent;
    that.getSourceHost = getSourceHost;
    that.getSourceVersion = getSourceVersion;
    that.addWidgetListener = addWidgetListener;

    init();

    return that;
  };
});