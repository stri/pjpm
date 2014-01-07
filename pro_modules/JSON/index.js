/**
 * JSON操作工具
 * @authors Stri (stri.vip@gmail.com)
 * @date    2013-10-11 13:47:57
 * @version $Id$
 */
define(function(module){
	var JSON = window.JSON || {};
	var _fdata = function(data, isEncode) {
		data = data == null ? '' : data;
		data = $.trim(data.toString());
		if (isEncode) {
			return encodeURIComponent(data);
		}
		return data;

	};
	module.exports = {
		stringify: JSON.stringify,
		parse: JSON.parse,
		jsonToQuery: function(JSON,isEncode){
			var _Qstring = [];
			if (typeof JSON == "object") {
				for (var k in JSON) {
					if (k === '$nullName') {
						_Qstring = _Qstring.concat(JSON[k]);
						continue;
					}
					if (JSON[k] instanceof Array) {
						for (var i = 0, len = JSON[k].length; i < len; i++) {
							_Qstring.push(k + "=" + _fdata(JSON[k][i], isEncode));
						}
					} else {
						if (typeof JSON[k] != 'function') {
							_Qstring.push(k + "=" + _fdata(JSON[k], isEncode));
						}
					}
				}
			}
			if (_Qstring.length) {
				return _Qstring.join("&");
			}
			return "";
		},
		queryToJson: function(QS,isDecode){
			var _Qlist = $.trim(QS).split("&");
			var _json  = {};
			var _fData = function(data){
				if(isDecode){
					return decodeURIComponent(data);
				}else{
					return data;
				}
			};
			for(var i = 0, len = _Qlist.length; i < len; i++){
				if(_Qlist[i]){
					var _hsh = _Qlist[i].split("=");
					var _key = _hsh[0];
					var _value = _hsh[1];
					
					// 如果只有key没有value, 那么将全部丢入一个$nullName数组中
					if(_hsh.length < 2){
						_value = _key;
						_key = '$nullName';
					}
					// 如果缓存堆栈中没有这个数据
					if(!_json[_key]) {
						_json[_key] = _fData(_value);
					}
					// 如果堆栈中已经存在这个数据，则转换成数组存储
					else {
						if($.isArray(_json[_key]) != true) {
							_json[_key] = [_json[_key]];
						}
						_json[_key].push(_fData(_value));
					}
				}
			}
			return _json;
		}
	};
});
