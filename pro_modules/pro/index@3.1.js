/**
 * Pro 3.1版本
 * @authors Stri (stri.vip@gmail.com)
 * @date    2013-11-30 21:12:01
 * @version 3.1
 */
define([],function(module){
  require('pro@3.0');
  this.Pro.version = '3.1';

  var metaParse = require('metaParse'),
    os = require('os'),
    loadScriptStyle = require('loadScriptStyle'),
    scriptReady,
    version,
    jsFrameworks;

  metaParse.parse();
  jsFrameworks = metaParse.getMetaByName('responsive-framework');
  version = metaParse.getMetaByName('responsive-version');
  scriptReady = function(url){
    var param = {
      url: url,
      dataType: 'js',
      success: function(){
        window.Pro.init();
      }
    };

    // 添加版本号
    if(version && version.js){
      param.data = {
        version: version.js
      };
    }

    loadScriptStyle(param); 
  };

  if(jsFrameworks){
    for( var p in jsFrameworks){
      if(os[p] == true){
        scriptReady(jsFrameworks[p]);
        break;
      }
    }
  }else{
    try{
      window.Pro.init();
    }catch(e){}
  }

  module.exports = {
    metaParse: metaParse,
    loadScriptStyle: loadScriptStyle,
    os: os,
    Pro: window.Pro
  };
});
