/**
 * 加载CSS和JS
 * @authors Stri (stri.vip@gmail.com)
 * @date    2013-11-29 11:49:48
 * @version $Id$
 */
define([],function(module){

  /** 
   *  加载资源
   * @param Opts {Object} 参数
   *      url {String} 资源地址
   *      data {Object} 参数
   *      dataType {String} 资源类型，只支持css和js
   *      callback {Function} 成功或失败的回调
   *      charset {String} 编码类型，默认为utf-8
   */
  var loader = function(Opts){
    var that = {},
        init,
        initStyle,
        initScript,
        headNode = document.getElementsByTagName('head')[0],
        createScript,
        createStyle,
        checkURLType,
        styleObj,
        scriptObj,
        destroy;
    
    /** 
     * 创建script标签
     */
    createScriptObj = function(Opts){
      var Opts = Opts || {},
          charset = Opts.charset || 'utf-8',
          url = Opts.url,
          async = Opts.async || false,
          re;
         
         re = document.createElement('script');
         re.type = "text/javascript";
         re.src = addParamToUrl(url,Opts.data);
         re.charset = charset;
         re.async = async;
       return re;
    };
    
     /** 
      * 创建link标签
      */
     createStyleObj = function(Opts){
       var obj = document.createElement('link'),
           Opts = Opts || {},
           url = addParamToUrl(Opts.url,Opts.data),
           charset = Opts.charset || 'utf-8',
           rel = 'stylesheet',
           type = 'text/css';
           
        obj.type = type;
        obj.charset = charset;
        obj.rel = rel;
        obj.href = url;
       return obj;
     };
     
    /** 
     * 获取URL的文件类型
     * @param url {String} 文件的URL
     * @param type {String} 文件的类型 [可选]如果为空，则判断URL
     */
    checkURLType = function(url,type){
      var re,
          type = type ? type.toLowerCase() : 0;
      if(/js|css/gi.test(type)){
        re = type;
      }else if(/linkstyle/gi.test(type) || /\.css$|\.css\?(.*)$|\.css\#(.*)$/gi.test(url)){
        re = 'css';
      }else if(/script/gi.test(type) || /\.js$|\.js\?(.*)$|\.js\#(.*)$/gi.test(url)){
        re = 'js'
      };
      return re;
    };


	   /**
	    * 监听JS是否加载成功
      * @param {HTMLElement} [node] [要监听的节点]
      * @param {Object} [Opts] [参数]
      *                        @param {String} [timeout] [时间]
	    */
	  function scriptObjOnload(node,Opts){
	    var _UA = navigator.userAgent;
	    if(/msie/.test(_UA.toLowerCase())){
	      node['onreadystatechange'] = function(){
	        if(node.readyState.toLowerCase() == 'loaded' || node.readyState.toLowerCase() == 'complete') {
	          try{
	            node['onreadystatechange'] = null;
	          }catch(e){}
	           
	          try{
	            Opts.success();
	          }catch(e){}
	        }
	      };
	    }else{
	      node['onload'] = function(){
	        try{
	          Opts.success();
	        }catch(e){}
	      };

	      node['onerror'] = function(){
	        try{
	          Opts.error();
	        }catch(e){}
	      };
	    }
	  };

	   /** 
	  * 监听CSS是否加载成功
	  * @param node {HTMLElement} 要监听的节点
	  * @param callback{Function} 回调
	  * @param timeout {Number} 超时大小
	  */
	 	function styleObjOnload(node,Opts,timeout){
	    var isReady = false,
	        fn,
	        iCount = 0,
	        timeout = timeout || 180000; // 超时时间
	   
	    // 回调
	    fn = function(error){
	      isReady = true;
	      fn = function(){};
	      try{
	         error ? Opts.error() : Opts.success();
	      }catch(e){}
	    };
	    
	    if(isReady){
	      fn();
	      return;
	    }
	    
	    (function(){
	      var _sheet = node.sheet,
	           args = arguments;
	      iCount++;
	      
	      if(iCount > timeout){
	        fn(1);
	        return;
	      }
	      
	      // 参考：https://github.com/seajs/seajs/blob/master/src/util-request.js
	      if(isOldWebKit && _sheet){
	        fn();
	        return;
	      }
	      
	      try{
	        if(_sheet.cssRules){
	          fn();
	        }
	      }catch(e){
	        if(e.name == 'NS_ERROR_DOM_SECURITY_ERR'){
	          fn();
	        }else{
	          setTimeout(function(){
	            args.callee();
	          },10);
	       }
	     }
	    })();
	  };

    /**
     * 添加参数
     */
    function addParamToUrl(url,param){
      var query = [],
        _urls = url.split('?'),
        _url = _urls[0],
        _query = _urls[1];

      for(var p in param){
        query.push(p+'='+decodeURIComponent(param[p]));
      }

      if(_query){
        query.push(_query);
      }

      return query.length ? _url+'?'+query.join('&') : url;
    }
    
    // 初始化JS
    initScript = function(){
      var scriptObj = createScriptObj(Opts);
      try{
      	scriptObjOnload(scriptObj,Opts);
      }catch(e){
      	console.log(e.message);
      }
      headNode.appendChild(scriptObj);
    };
    
    // 初始化CSS
    initStyle = function(){
      var styleObj = createStyleObj(Opts);
      styleObjOnload(styleObj,Opts);
      headNode.appendChild(styleObj);
    };
    
    // 定义初始化
    init = function(){
      var type;
      Opts = Opts || {};
      type = checkURLType(Opts.url,Opts.dataType);
      
      if(type == 'js'){
        initScript();
      }else if(type == 'css'){
        initStyle();
      }
    };
    
    // 执行初始化
    init();
    
    return that;
  };
  
  // 老版本Chrome
  var isOldWebKit = (navigator.userAgent.replace(/.*AppleWebKit\/(\d+)\..*/, "$1")) * 1 < 536;

  module.exports = loader;
});
