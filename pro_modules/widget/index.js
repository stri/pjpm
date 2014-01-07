/**
 * widget基类
 * @authors Stri (stri.vip@gmail.com)
 * @date    2013-10-11 15:02:35
 * @version 1.0
 */
define(function(module){
	require('Callbacks');
	var channel = require('channel');

	module.exports = function(Opts){
		var that = {},
			conf = {},
			bindEvent,
			destroy;

		// param
		conf = $.extend({},Opts);

		/**
		 * 获取参数
		 */
		function getConfig(){
			return conf;
		}

		/**
		 * 设置参数
		 * @param {String|Object} [key] [要配置的参数名称]也可以为一个对象
		 * @param {Any} 
		 */
		function setConfig(key,value){
			if(typeof key == 'object'){
				for(var p in key){
					if(key.hasOwnProperty(p)){
						that.setConfig(p,key[p]);
					}
				}
				return;
			}
			conf[key] = value;
		}

		/**
		 * 获取容器
		 * @return  {[type]}  [description]
		 */
		function getBox(){
			return conf.box ? $(conf.box) : null;
		}

		// bindEvent
		bindEvent = function(){};

		// destroy
		destroy = function(){};

		// init
		init = function(){
			bindEvent();
		};

		// api
		that.destroy = destroy;
		that.channel = channel;
		that.setConfig = setConfig;
		that.getConfig = getConfig;
		that.getBox = getBox;
		that.init = init;

		return that;
	};
});