/**
 * 用于模块间的通信
 */
define(function(module) {
	var evts = {};

	module.exports = {
		/** 
		 * 监听频道
		 *
		 * @method add
		 *
		 * @param  {String}   channel  [description]
		 * @param  {Function} callback [description]
		 */
		add: function(channel, callback) {
			var evt = evts[channel] || (evts[channel] = $.Callbacks());
			evt.add(callback);
		},
		/**
		 * 取消监听
		 *
		 * @method remove
		 *
		 * @param  {String}   channel  [description]
		 * @param  {Function} callback [description]
		 */
		remove: function(channel, callback) {
			var evt = evts[channel] || (evts[channel] = $.Callbacks());
			evt.remove(callback);
		},
		/**
		 * 清空频道
		 *
		 * @method empty
		 *
		 * @param  {String} channel [description]
		 */
		empty: function(channel) {
			var evt = evts[channel] || (evts[channel] = $.Callbacks());
			evt.empty();
		},
		/**
		 * 触发频道
		 *
		 * @method fire
		 * @param {String} [channel] [频道名]
		 * @augments {Object} 其它参数 
		 */
		fire: function() {
			var args = $.makeArray(arguments),
				channel = args.shift();
			try {
				evts[channel].fire.apply(evts[channel], args);
			} catch (e) {}
		},
		/**
		 * 给组件或对象绑定频道
		 *
		 * @method bind
		 *
		 * @param  {Object} base        [description]
		 * @param  {Object} channelList [description]
		 */
		bind: function(base, channelList) {
			channelList = channelList || {};
			var _this = this;
			if (base && base.evt) {
				$.each(base.evt, function(key) {
					var name = channelList[key];
					if (name) {
						base.evt[key].add(function() {
							var args = [name].concat($.makeArray(arguments));
							_this.fire.apply(_this, args);
						});
					}
				});
			}
			return base;
		}
	};
});