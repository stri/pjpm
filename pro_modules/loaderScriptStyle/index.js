/**
 * 批量加载
 * @authors Stri (stri.vip@gmail.com)
 * @date    2013-11-29 18:21:17
 * @version $Id$
 */
define(function(module){
  var loadScriptStyle = require('loadScriptStyle'),
    URL = require('URL');

  /**
   * 判断当前JS是否加载过
   * @return  {Boolean}  [description]
   */
  function isLoaded(url,domain){
    var currentKey = getScriptKey(url,domain),
      re = false;
    $.map($('script'),function(node){
      var url = node.src;
      if(url && (getScriptKey(url,domain) == currentKey) ){
        re = true;
      }
    });
    return re;
  }

  /**
   * 获取script的key值
   * @return  {[type]}  [description]
   */
  function getScriptKey(url,domain){
    var _parse = URL.parse(url);
    return domain ? _parse.host+_parse.path : _parse.path;
  }

  // 如果有ajax
  if($ && $.ajax){
    var baseAjax = $.ajax,
      newAjax;

    newAjax = function(conf){
      if($.inArray(conf.dataType,['linkstyle','script','js','css']) != -1){
        loadScriptStyle(conf);
      }else{
        baseAjax(conf);
      }
    };

    $.ajax = newAjax;   
  }

  module.exports = function(param, Opts) {
    var conf;
    conf = $.extend({
      cache: false,
      isDepand: true,
      domain: true,
      onSuccess: null,
      onFail: null
    }, Opts);

    // 加载
    function load(ajaxConf){
      if(conf.cache && isLoaded(ajaxConf.url,conf.domain)){
        ajaxConf.success();
      }else{
        loadScriptStyle(ajaxConf);
      }
    };

    // 递归加载
    function _loader(params) {
      var ajaxConf = params.shift();
      ajaxConf.success = function() {
        if (params.length) {
          _loader(params);
        } else {
          try {
            conf.onSuccess();
          } catch (e) {}
        }
      };
      ajaxConf.fail = ajaxConf.error = function() {
        try {
          conf.onFail();
        } catch (e) {}
      };

      load(ajaxConf);
    }

    if(conf.isDepend){
      _loader([].concat(param));
    }else{
      var len = param.length,
        successCount = 0,
        errorCount = 0;

      $.map(param,function(ajaxConf){
        // 成功
        ajaxConf.success = function(){
          successCount++;
          if(len = successCount){
            try{
              conf.onSuccess();
            }catch(e){}
          }
        };

        // 失败
        ajaxConf.error = function(){
          errorCount++;
          if(errorCount+successCount == len){
            try{
              conf.onFail();
            }catch(e){}
          }
        };

        load(ajaxConf);
      });
    }
  };
});