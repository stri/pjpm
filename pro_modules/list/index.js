/**
 * list组件
 * @authors Stri (stri.vip@gmail.com)
 * @date    2013-10-07 15:13:58
 * @version $Id$
 */
define(function(module){
	var util = require('./util'),
		widget = require('widget'),
		$ET = require('easyTemplate'),
		$builder = require('builder');

	/**
	 * list基础组件
	 * @param   {[type]}  box   [容器]
	 * @param   {[type]}  Opts  [配置参数]
	 * @return  {[type]}        [description]
	 */
	module.exports = function(Opts){
		var that = {},
			init,
			conf,
			box,
			nodeListCache = [],
			templateCache = {},
			bindEvent,
			destroy;

		// param
		conf = $.extend({
			box: null,
			nodeType: 'x-list',
			template: ''
		},Opts);

		// valid param
		if(!conf.nodeType || !conf.template){
			console.error('param error.');
		}

		that = widget(conf);

		/**
		 * 插入list结点
		 * @param   {[type]}  Opts  [description]
		 * @return  {[type]}        [description]
		 */
		function insert(Opts){
			var _conf,
				pos,
				target,
				source,
				nodeOperation,
				newNode,
				newNodeBox,
				newNodeList,
				newCount = 0;

			// param
			_conf = $.extend({
				position: 'center',
				source: null,
				target: null,
				template: null
			},Opts);
			pos = _conf.position;
			source = _conf.source;
			target = _conf.target;

			// 创建新节点
			newNode = that.create(_conf.source,_conf.template)
			newNodeList = newNode.list;
			newNodeBox = newNode.box;
			newCount = newNodeList.length;
			// 如果有新节点
			if(newCount){
				(pos == 'top') && (target = (target || that.getFirstNode()));
				(pos == 'bottom') && (target = (target || that.getLastNode()));
				(pos == 'center') && (target = target);

				nodeOperation = {
					top: 'before',
					bottom: 'after',
					center: 'replaceWith'
				};

				var _nodelistbox = that.getNodeListBox();

				// 如果有目标结点
				if(target){
					$(target)[nodeOperation[pos]](_nodelistbox ? util.merge(newNodeList) : newNodeBox);
				}else{
					var _box = _nodelistbox || box;
					that.removeNodeList();
					$(_box).append(_nodelistbox ? util.merge(newNodeList) : newNodeBox);
				}
			}

			// 更新
			updateNodeListCache(pos,newNodeList,target);

			// fire event
			that.evt.insert.fire($.extend(_conf,{
				count: newCount || 0
			}));
		}

		/**
		 * 创建list节点
		 * @param   {[type]}  source    [description]
		 * @param   {[type]}  template  [description]
		 * @return  {[type]}            [description]
		 */
		function createNodeList(source,template){
			var re,
				html,
				list;
			
			html = $ET(template,source).toString();
			re = $builder(html);
			list = re.list[conf.nodeType] || [];

			return {
				html: html,
				list: list,
				box: re.box
			};
		}

		/**
		 * 更新nodelist
		 * @param   {[type]}  pos          [description]
		 * @param   {[type]}  newNodeList  [description]
		 * @param   {[type]}  target       [description]
		 * @return  {[type]}               [description]
		 */
		function updateNodeListCache(pos,newNodeList,target){
      var key = $.map(nodeListCache,function(node,key){
        if(node == target){
          return key;
        }
      })[0], 
          len = nodeListCache.length, 
          step = 0, 
          index = key || 0;

      if (pos == 'bottom') {
        index++;
      } else {
        step = pos == 'top' ? 0 : 1;
        nodeListCache = (pos == 'top' || key ) ? nodeListCache : [];
      }

      Array.prototype.splice.apply(nodeListCache, [index, step].concat(newNodeList));
		}

		/**
		 * 创建list结点
		 * @param   {[type]}  source    [数据]
		 * @param   {[type]}  template  [模板]
		 * @return  {[type]}            [description]
		 */
		function create(source,template){
			var re;

			// 如果有新模板，则重新设置list模板
			if(template){
				that.setTemplate('list',template);
			}

			// 创建节点
			re = createNodeList(source,that.getTemplate('list'));

			// fire event
			that.evt.create.fire(re);

			return re;
		}

		/**
		 * 移除结点
		 * @param   {[type]}   nodes   [description]
		 * @param   {Boolean}  isCust  [description]
		 * @return  {[type]}           [description]
		 */
		function removeNode(nodes,isCust){
      var nodelist = [].concat(nodes);

      $.map(nodeListCache, function(node, key) {
        if ($.inArray(node, nodelist) != -1 && util.isNode(node)) {
          $(node).remove();
          nodeListCache[key] = null;
        }
      });
      
      if(isCust){
        that.evt.remove.fire({
          list: nodelist
        });
      }
		}

		/**
		 * 移除所有节点
		 * @param   {Boolean}  isCust  [description]
		 * @return  {[type]}           [description]
		 */
		function removeNodeList(isCust){
			that.removeNode(nodeListCache,isCust);
			nodeListCache = [];
		}

		/**
		 * 获取当前的节点列表
		 * @return  {[type]}  [description]
		 */
		function getNodeList(){
			var re = [];
			$.map(nodeListCache,function(node){
				if(util.isElement(node)){
					re.push(node);
				}else{
					nodeListCache[key] = null;
				}
			});
			return re;
		}

		/**
		 * 获取指定索引的结点
		 * @param   {[type]}  index  [description]
		 * @return  {[type]}         [description]
		 */
		function getItem(index){
			var nodelist = that.getNodeList();
			return nodelist[index];
		}

		/**
		 * 获取当前列表的长度
		 * @return  {[type]}  [description]
		 */
		function getLength(){
			var nodelist = that.getNodeList();
			return nodelist.length;
		}

		/**
		 * 获取第一个节点
		 */
		function getFirstNode(){
			var nodelist = that.getNodeList();
			return nodelist[0];
		}

		/**
		 * 获取最后一个结点
		 * @return  {[type]}  [description]
		 */
		function getLastNode(){
			var nodelist = that.getNodeList();
			return nodelist[nodelist.length - 1];
		}

		/**
		 * 获取配置
		 * @return  {[type]}  [description]
		 */
		function getConfig(){
			return conf;
		}

		/**
		 * 设置配置
		 * @param  {[type]}  key    [description]
		 * @param  {[type]}  value  [description]
		 */
		function setConfig(key,value){
			conf[key] = value;
		}

		/**
		 * 获取模板
		 * @param   {[type]}  key  [description]
		 * @return  {[type]}       [description]
		 */
		function getTemplate(key){
			return templateCache[key];
		}

		/**
		 * 设置模板
		 * @param  {[type]}  key    [description]
		 * @param  {[type]}  value  [description]
		 */
		function setTemplate(key,value){
			templateCache[key] = value;
		}

		/**
		 * [getNodeListBox description]
		 * @return  {[type]}  [description]
		 */
		function getNodeListBox(){
			var firstNode = that.getFirstNode();
			return firstNode && firstNode.parentNode;
		}

		// bindEvent
		bindEvent = function(){};

		// destroy
		destroy = function(){};

		// init
		init = function(){
			conf = that.getConfig();
			box = conf.box || that.getBox();

			// 设置tpl
			if(conf.template){
				that.setTemplate('list',conf.template);
			}
			bindEvent();
		};

		// api
		that.destroy = destroy;
		that.create = create;
		that.getConfig = getConfig;
		that.setConfig = setConfig;
		that.getTemplate = getTemplate;
		that.setTemplate = setTemplate;
		that.getNodeList = getNodeList;
		that.getFirstNode = getFirstNode;
		that.getLastNode = getLastNode;
		that.getItem = getItem;
		that.getLength = getLength;
		that.removeNode = removeNode;
		that.removeNodeList = removeNodeList;
		that.getNodeListBox = getNodeListBox;
		that.insert = insert;
		that.init = init;
		that.evt = {
			insert: $.Callbacks(),
			create: $.Callbacks(),
			remove: $.Callbacks()
		};

		return that;
	};
});
