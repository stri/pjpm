/**
 * Pro 3.2版本
 * @authors Stri (stri.vip@gmail.com)
 * @date    2013-11-30 21:12:01
 * @version 3.2
 */
define(function(module){
	var projs = require('pro@3.1'),
		loaderWidget = require('loaderWidget'),
		metaParse = projs.metaParse,
		version = metaParse.getMetaByName('responsive-version'),
		host = metaParse.getMetaByName('responsive-host'),
		loader;

	// 设置加载器
	loader = loaderWidget({
		version: version,
		host: host
	});

	// 设置版本号
	projs.Pro.version = '3.2';
	projs.loader = loader;

	module.exports = projs;
});
