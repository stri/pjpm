/**
 * builder
 * @authors Stri (stri.vip@gmail.com)
 * @date    2013-10-07 15:27:12
 * @version $Id$
 */
define(function(module) {
	
	/**
	 * 把HTML串转成结点对象并返回其node-type节点
	 * @param   {[type]}  html  [HTML串]
	 * @param {Boolean} [isParse] [如果是true，则node-type每一项则是一个结点，
	 *                             如果是flase，则为所有node-type的数组，默认为flase]
	 * @return  {[type]}        [description]
	 */
	module.exports = function(html,isParse){
		var isHTML = typeof html == 'string',
			_div = isHTML ? $('<div>') : html,
			re = {},
			domBox = !isHTML && $(_div);

		// 插入到临时div中
		isHTML && _div.html(html);

		// 列表
		re.list = {};
		$.map($('[node-type]',_div),function(node){
			var key = $(node).attr('node-type');
			if(key){
				if(isParse){
					if(!re.list[key]){
						re.list[key] = node;
					}
				}else{
					re.list[key] = re.list[key] || [];
					re.list[key].push(node);
				}
			}
		});

		// 容器
		if(isHTML){
			re.box = null;
	    domBox = $(document.createDocumentFragment());
	    _div = _div.get(0);
	    while (_div.childNodes[0]) {
	      domBox.append(_div.childNodes[0]);
	    }
		}

		re.box = $(domBox)[0];

    

		return re;
	};
});