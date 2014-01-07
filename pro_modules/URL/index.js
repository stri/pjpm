/**
 * URL工具
 * @authors Stri (stri.vip@gmail.com)
 * @date    2013-10-14 18:37:52
 * @version $Id$
 */
define([],function(module){
	var IS_URL = /(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/g;

	module.exports = {
		parse: function(url){
			var parse_url = /^(?:([A-Za-z]+):(\/{0,3}))?([0-9.\-A-Za-z]+\.[0-9A-Za-z]+)?(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/;
			var names = ['url', 'scheme', 'slash', 'host', 'port', 'path', 'query', 'hash'];
			var results = parse_url.exec(url);
			var that = {};
			for (var i = 0, len = names.length; i < len; i += 1) {
				that[names[i]] = results[i] || '';
			}
			return that;
		},
		isURL: function(url){
			return IS_URL.test(url);
		},
		getFileType: function(url){
			var pasreUrl = this.parse(url),
				path = pasreUrl.path || '';
			return path ? path.split('.').reverse()[0] : path;
		}
	};
});