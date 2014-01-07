/**
 * 监听viewport，进行相关的判断
 * @authors bangbang (bangbang@staff.sina.com.cn)
 * @date    2013-08-24 11:10:34
 * @version $Id$
 */

define(function(module){
  var _JSON = require('JSON'),
    widget = require('widget'),
    that = null,
    mediaObj,
    timer,
    evt = $.Callbacks(),
    ie6 = /MSIE 6.0/gi.test(navigator.userAgent),
    isSupport =  !(ie6 || (document.documentMode && document.documentMode <= 8));

  mediaObj = function(Opts){
    var init,
      conf,
      bindEvent,
      destroy;

    // 如果已经初始化过
    if(that){
      return that;
    }

    // param
    conf = $.extend({
      id: 'media_viewport_js_helper'
    },Opts);

    that = widget(conf);

    /**
     * 是否支持
     * @return  {Boolean}  [description]
     */
    function isSupportMedia(){
      return isSupport;
    }

    /** 
     * 即当range发生必然导致target发生时 range=>target，或者者说 target包含了range
     * @param   {String}   target  [description]
     * @param   {String}   range  [description]
     * @return  {Boolean}        [description]
     */
    function isContain(target,range){
      var targetObj = that.getParamsByObj(target), 
        rangeObj = that.getParamsByObj(range);

      var _w = targetObj.w,
        _mw = targetObj.mw,
        _Mw = targetObj.Mw,
        w = rangeObj.w,
        mw = rangeObj.mw,
        Mw = rangeObj.Mw;

      // value
      if(w && (w == _w || (!_mw && w <= _Mw) || (!_Mw && w >= _mw) || (w >= _mw && w <= _Mw))){
        return true;
      }

      // range
      if(mw && Mw && ((_w <= Mw && _w >= mw) || (!_mw && Mw <= _Mw) || (!_Mw && mw >= _mw) || (Mw <= _Mw && mw >= _mw))){
        return true;
      }

      // other1 
      if(!mw && Mw && ((_w && Mw >= _w) || (_Mw && Mw <= _Mw))){
        return true;
      }

      // other2
      if(mw && !Mw && ((_w && mw <= _w) || (_mw && mw >= _mw))){
        return true;
      }

      return false;
    }

    /** 
     * 获取参数的对象形式
     * @param   {[type]}  target  [description]
     * @return  {[type]}          [description]
     */
    function getParamsByObj(target){
      var obj = _JSON.queryToJson(target);
      return {
        w: parseInt(obj['width']) || 0,
        mw: parseInt(obj['min-width']) || 0,
        Mw: parseInt(obj['max-width']) || 0
      }
    }

    /** 
     * 获取参数
     * @return  {[type]}  [description]
     */
    function getParams(){
      var newDiv = $('<div style="display:none;">'),
        re = [];
      newDiv.attr('id',conf.id);
      $(document.body).append(newDiv);
      re.push({
        key: 'min-width',
        value: newDiv.css('min-width')
      });
      re.push({
        key: 'max-width',
        value: newDiv.css('max-width')
      });

      re.push({
        key: 'width',
        value: newDiv.css('width')
      });
      newDiv.remove();
      return re;
    }

    /** 
     * 格式为min-width=200&max-width=300的串
     * @param   {[type]}  param  [description]
     * @return  {[type]}         [description]
     */
    function stringify(param){
      var obj = {};
      $.each(param,function(index,value){
        var val = parseInt(value.value);
        if(val){
           obj[value.key] = val;
        }
      });

      if(obj['min-width'] || obj['max-width']){
        delete obj['width'];
      }
      return $.param(obj);
    }

    // event callback
    function eventCallback(){
      var str = that.stringify(that.getParams());

      var eventArr = [str],
        _arr = str.split('&');

      if(_arr.length > 1){
        eventArr = eventArr.concat(_arr);
      }

      that.channel.fire('media/viewport',{
        origin: str, // CSS标识的
        context: that, // 作用域上下文件
        scope: null // 可能包括的值
      });
    };

    // resize callback
    function fn() {
      clearTimeout(timer);
      timer = setTimeout(evt.fire, 10);
    }

    // bindEvent
    bindEvent = function(){
      $(window).on('resize', fn);
    };

    // destroy
    destroy = function(){
      $(window).off('resize', fn);
       evt.remove(eventCallback);
    };

    // init
    init = function(){
      bindEvent();
      evt.add(eventCallback);
    };

    that.destroy = destroy;
    that.getParams = getParams;
    that.stringify = stringify;
    that.isContain = isContain;
    that.isSupportMedia = isSupportMedia;
    that.getParamsByObj = getParamsByObj;
    that.fire = evt.fire;

    init();

    return that;
  };

  module.exports = mediaObj();
});