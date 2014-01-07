/**
 * media
 * @authors Stri (stri.vip@gmail.com)
 * @date    2013-12-01 17:25:24
 * @version $Id$
 */
define(function(module){

	/**
	 * 是否为media查询
	 * @return  {Boolean}  [description]
	 */
	function isMediaQuery(type){
		return /\:|\(|\)/gi.test(type);
	}

	/**
	 * 判断是否支持
	 * @return  {Boolean}  [description]
	 */
	function isSupportMedia(){
		return 'matchMedia' in window;
	}

	/**
	 * 添加监听
	 * @param  {[type]}    type      [description]
	 * @param  {Function}  callback  [description]
	 */
	function addMediaListener(type,callback){
		var mql,
			fn;
		if(!isSupportMedia()) return;
		mql = window.matchMedia(type);
		
		// 回调
		fn = function(mql){
			if(mql.matches){
				try{
					mql.removeListener(arguments.callee);
				}catch(e){}
				try{
					callback();
				}catch(e){}
			}
		};

		// 监听
		mql.addListener(fn);

		fn(mql);
	}
		

	// media
	module.exports = {
		isMediaQuery: isMediaQuery,
		addListener: addMediaListener,
		isSupport: isSupportMedia
	};
});

