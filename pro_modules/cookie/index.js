/**
 * cookie组件
 * @param   {[type]}  module  [description]
 * @return  {[type]}          [description]
 */
define(function(module){
	var that = {
		set: function(sKey, sValue, oOpts){
			var arr = [];
			var d, t;
			var cfg = $.extend({
				'expire': null,
				'path': '/',
				'domain': null,
				'secure': null,
				'encode': true
			}, oOpts);
			
			if (cfg.encode == true) {
				sValue = escape(sValue);
			}
			arr.push(sKey + '=' + sValue);

			if (cfg.path != null) {
				arr.push('path=' + cfg.path);
			}
			if (cfg.domain != null) {
				arr.push('domain=' + cfg.domain);
			}
			if (cfg.secure != null) {
				arr.push(cfg.secure);
			}
			if (cfg.expire != null) {
				d = new Date();
				t = d.getTime() + cfg.expire * 3600000;
				d.setTime(t);
				arr.push('expires=' + d.toGMTString());
			}
			document.cookie = arr.join(';');
		},
		get: function(sKey){
			sKey = sKey.replace(/([\.\[\]\$])/g, '\\\$1');
			var rep = new RegExp(sKey + '=([^;]*)?;', 'i');
			var co = document.cookie + ';';
			var res = co.match(rep);
			if (res) {
				return res[1] || "";
			}
			else {
				return '';
			}
		},
		remove: function(sKey, oOpts){
			oOpts = oOpts || {};
			oOpts.expire = -10;
			that.set(sKey, '', oOpts);
		}
	};

	module.exports = that;
});