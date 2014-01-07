/**
 * 定义widget
 * @authors Stri (stri.vip@gmail.com)
 * @date    2013-11-28 11:45:32
 * @version 0.1
 */
define(function(module){
	var parseParam = require('parseParam'),
		widget = require('widget');

	module.exports = function(Opts){
		var that,
			conf,
			init,
			destroy;

		// 参数
		conf = parseParam({
			id: '', // 容器id
			module: null,
			require: [], // 依赖的JS,CSS
			exports: null, // 加载完成之后的回调
			async: false, // 串行加载
			isDepend: true, // 加载的资源是否互相依赖
			requireParams: [], // 加载的资源，如果需要配置参数
			initialize: false, // 是否初始化(模块需要有init方法)
			rate: 0, // 加载的优先级，优先级越高，加载越靠前
			media: false, // 加载的media的大小,格式为min-width=480px。默认为全部,此方式不对IE9以下支持
			platform: true, // 要加载的平台，默认为全部
			template: '', // 相关的模板
			loadTime: '', // 加载时机
			initTime: '' // 执行时机
		},Opts);

		that = widget(conf);

		/**
		 * 获取容器节点
		 * @return  {[type]}  [description]
		 */
		function getBox(){
			var box = $('#'+conf.id);
			return box[0] && box;
		};

    /** 
     * 获取模板
     * @param   {[type]}  id  [description]
     * @return  {[type]}      [description]
     */
    function getTemplate(id){
      var tpl,
      	conf = that.getConfig();
      try{
        tpl = $('#'+id).html();
      }catch(e){
        tpl = '';
      }

      if(!tpl){
      	tpl = conf.template && conf.template[id];
      }

      return tpl;
    }

		init = function(){
			var conf,
				box;
			if(box = getBox()){
				that.setConfig('box',box);
				conf = that.getConfig();
			}

			if(conf && box && that.inVisibleArea()){
				that.setConfig('rate',conf.rate++);
			}
		};

		// api
		that.getTemplate = getTemplate;
		that.init = init;

		return that;
	};
});

