/**
 * 工具方法
 * @authors Stri (stri.vip@gmail.com)
 * @date    2013-10-07 15:15:36
 * @version $Id$
 */
define(function(module){
	module.exports = {
		/**
		 * 判断结点是否在页面中
		 * @param   {[type]}   node  [description]
		 * @return  {Boolean}        [description]
		 */
		isElement: function(node){
			return this.isNode(node) && node.parentNode;
		},
		/**
		 * 判断是否为结点
		 * @param   {[type]}   node  [description]
		 * @return  {Boolean}        [description]
		 */
		isNode: function(node){
			return node && node.nodeType == 1;
		},
    /**
     * 合并多个node为一个node
     * @param elements {Array}
     */
    merge : function(elements) {
      var buffer = document.createDocumentFragment();

      $.map(elements, function(node) {
        buffer.appendChild(node);
      });

      return buffer;
    }
	};
});