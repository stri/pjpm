/**
 * 过滤参数
 * @authors Stri (stri.vip@gmail.com)
 * @date    2013-10-21 17:35:33
 * @version $Id$
 */
define([],function(module){
	module.exports = function(oSource, oParams, isown){
    var key, obj = {};
    oParams = oParams || {};
    for (key in oSource) {
      obj[key] = oSource[key];
      if (oParams[key] != null) {
        if (isown) {// 仅复制自己
          if (oSource.hasOwnProperty[key]) {
            obj[key] = oParams[key];
          }
        }
        else {
          obj[key] = oParams[key];
        }
      }
    }
    return obj;
  };
});