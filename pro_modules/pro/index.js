/**
 * Pro.js core
 * @authors Stri (Stri@gmail.com)
 * @date    2013-05-24 12:55:44
 * @version 1.0
 */
;(function(win){
  var // define Module Param 
    define,
    require,
    Pro = {},
    _prefix = 'pro',
    moduleList = {},
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
      _id = _prefix+'_'+id;

    // if arguments's length !=2
    if(args.length != 2){
      console.error('Module define error');
    }

    callback = dependencies;

    // if id in moduleList
    if(_id in moduleList){
      return;
    }

    // 默认module属性
    var module = {
      id: id,
      exports: {}
    };

    // if is object, the module's exports == callback;
    if(typeof callback == 'object'){
      module.exports = callback;
    }else{
      try{
        callback.apply(win,[module,module.exports,require]);
      }catch(e){
        console.error(_id,' Module exports error: ',e.message);
      }
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

  // api
  Pro.define = define;
  Pro.require = require;

  // 私有属性(for 兼容CMD和AMD规范)
  Pro.define.pro = Pro.require.pro = {
    version: '2.0',
    origin: origin,
    _Pro: win.Pro || null
  };

  // global api
  win.Pro = Pro;
  win.define = win.define || Pro.define;
  win.require = win.require || Pro.require;
})(window);
