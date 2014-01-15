/**
 * Pro 3.0版本
 * @authors Stri (stri.vip@gmail.com)
 * @date    2013-11-27 17:12:02
 * @version $Id$
 */
;(function(win){
  var Pro = {},
    _prefix = 'pro'+(new Date().getTime()),
    _init,
    moduleList = {},
    scriptReady = ScriptReady(),
    origin = {
      define: win.define,
      require: win.require
    };

  // prefix
  Pro.prefix = _prefix;

  /*
   * define a Module
   * @param id {String} module's id
   * @param dependencies {Array} 依赖[可选]
   * @param callback {Function || object} define function or object for this module
   */
  define = function(id,dependencies,callback){
    var args = arguments,
      isDepend = true,
      fn,
      _id = _prefix+'_'+id;

    // param
    if(args.length == 2){
      callback = dependencies;
      isDepend = true;
    }else if(args.length == 3){
      isDepend = dependencies.length > 1 ? true : false;
    }else{
      console.error(id,' Module define error');
    }

    // if the module is already register,return
    if(_id in moduleList){
      return;
    }

    // module's default property
    var module = {
      id: id,
      isDepend: isDepend,
      exports: {},
      _isProModule_: true
    };

    // if is object, the module's exports == callback;
    if(typeof callback == 'function'){
      fn = function(){
        try{
          callback.apply(win,[module]);
        }catch(e){
          alert(id+e.message);
          throw new Error(id+':'+e.message);
        }
      };

      // if has depend module,execut module when script ready.
      if(isDepend){
        scriptReady.add(fn);
      }else{
        fn();
      }
    }else{
      module.exports = callback;
    }

    moduleList[_id] = module;
  };

  /*
   * require a Module 
   * @param id {String} Module's id
   */
  require = function(id){
    var _id = _prefix+'_'+id,
      _module = moduleList[_id];
    return _module && _module.exports;
  };

  /**
   * Script ready Callbacks
   * @param   {[type]}  calllback  [description]
   * @return  {[type]}             [description]
   */
  function ScriptReady(callback){
  	var arr = [],
  		isFire;

  	return {
  		add: function(callback){
  			if(isFire){
  				callback();
  			}else{
  				arr.push(callback);
  			}
  		},
  		fire: function(){
  			var fn;

  			while(fn = arr.shift()){
  				fn();
  			}

  			isFire = true;
  		}
  	};
  }

  /**
   * init script ready
   * @return  {[type]}  [description]
   */
  function init(){
  	scriptReady.fire();
  }

  // api
  Pro.define = define;
  Pro.require = require;
  Pro.version = '3.0';
  Pro.init = init;

  // 私有属性(for 兼容CMD和AMD规范)
  Pro.define.pro = Pro.require.pro = {
    origin: origin,
    _Pro: win.Pro || null
  };

  win.Pro = win.Pro || Pro;
  win.define = win.define || Pro.define;
  win.require = win.require || Pro.require;
})(window);