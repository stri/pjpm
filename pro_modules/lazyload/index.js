/**
 * 延迟加载组件
 * @authors Stri (stri.vip@gmail.com)
 * @date    2013-11-28 11:56:28
 * @version 0.1
 */
define(function(module){
	var isBind,
	    timer,
	    $channel = require('channel'),
	    Callbacks = require('Callbacks'),
	    lazyloadEvent = Callbacks('memory'),
	    inVisibleArea = require('inVisibleArea');
	 
	/** 
	 * @param node {HTMLElement} 结点
	 * @param callback {Callback} 回调参数
	 * @param threshold {Number} 敏感数值
	 * @param timeout [second] [超时时间]，单位s
	 */
	function lazyload(node,callback,threshold,timeout){
	  var time = false;

	  if(!isBind){
	    isBind = true;
	    $(window).on('scroll',fn);
	    $(window).on('resize',fn);
	  }

	  /**
	   * 绑定的回调
	   * @return  {Function}  [description]
	   */
	  var _fn = function(){
	    if(time || inVisibleArea(node,threshold)){
	      try{
	        callback.apply(node);
	      }catch(e){
	      }
	      lazyloadEvent.remove(_fn);
	      _fn = function(){};
	    }
	  };

	  timeout > 0 && setTimeout(function(){
	    time = true;
	    _fn();
	  },timeout * 1000);

	  // 绑定事件
	  lazyloadEvent.add(_fn);

	  // 绑定时就进行判断
	  _fn();

	  return this;
	}

	/** 
	 *  监听事件
	 */
	function fn(){
	   fire();
	};

	/** 
	 * fire
	 */
	function fire(){
	  lazyloadEvent.fire();
	};

	/** 
	 * 销毁组件
	 */
	function destroy(){
	  if(isBind){
	    isBind = false;
	    $(window).off('scroll',fn);
	    $(window).off('resize',fn);
	  }
	}

	// 公共API
	lazyload.fire = fire;
	lazyload.destroy = destroy;

	// 监听频道
	$channel.add('lazyload/fire',function(){
	  lazyload.fire();
	});

	module.exports = lazyload;
});