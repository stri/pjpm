/**
 * meta解析
 * @authors Stri (stri.vip@gmail.com)
 * @date    2013-11-30 17:42:19
 * @version $Id$
 */
define([],function(module){
	var metaCache = {};

	/**
	 * 解析
	 * @return  {[type]}  [description]
	 */
	function parse(){
		var i = 0,
			nodes = document.getElementsByTagName('meta');

		// 过滤
		for(;i<nodes.length;i++){
			var name = nodes[i].name,
				content = nodes[i].content;

			if(name && content){
				try{
					metaCache[name] = parseMetaContent(content);					
				}catch(e){
					console.log(e.message);
				}
			}
		}
	}

	/**
	 * 解析metaContent
	 */
	function parseMetaContent(content){
		var arr = content.replace(/\n/gi,'').split(','),
			re = {},
			i = 0;

		for(;i < arr.length;i++){
			var obj = arr[i].split('='),
				name = obj[0],
				value = obj[1];
			re[name] = decodeURIComponent(value);
		}

		return re;
	}

	module.exports = {
		parse: parse,
		parseMetaContent: parseMetaContent,
		getMetaByName: function(name){
			return metaCache[name];
		}
	};
});
