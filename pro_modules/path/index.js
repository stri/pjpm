//  path
define(function(module) {
	// 获取
	var args = function(param, index) {
		var re = [],
			index = index || 0;

		for (var i = 0; i < param.length; i++) {
			if (i >= index) {
				re.push(param[i]);
			}
		}
		return re;
	};

	// 减去
	var reduce = function(arr, count) {
		var len = arr.length;
		count = count || 0;

		if (len >= count) {
			arr.length = len - count;
		}

		return arr;
	};

	// 转换成数组
	var argToArray = function(args) {
		var i = 0,
			re = [];

		for (; i < args.length; i++) {
			re.push(args[i]);
		}

		return re;
	};

	module.exports = {
		root: '',

		// Normalize a string path, taking care of '..' and '.' parts.
		normalize: function(p) {
			var np = p.replace(/\/\//gi, '/'),
				ps = np.split('/'),
				re = [];

			for (var i = 0; i < ps.length; i++) {
				var key = ps[i];
				if (key == '..') {
					re = reduce(re, 1);
				} else if (key == '.') {
					re = re;
				} else {
					re.push(key);
				}
			}

			return re.join('/');
		},

		// Join all arguments together and normalize the resulting path.
		join: function() {
			var i = 1,
				re = [arguments[0]];

			for (; i < arguments.length; i++) {
				var key = arguments[i];

				// 如果是根目录，则从根目录开始
				if (key.indexOf('/') == 0) {
					return this.join.apply(this, args(arguments, i));
				}

				// 如果是向一级目录，则去掉两个
				if (key == '..') {
					re = reduce(re, 1);
				} else if (key == '.') {
					re = re;
				} else {
					re.push(key);
				}
			}
			return this.normalize(re.join('/'));
		},
		resolve: function(from) {
			var re = [],
				to,
				args,
				i = 0;
			args = argToArray(arguments);
			if (!/^\//gi.test(from) && this.root) {
				re = [this.root];
			}

			to = args[args.length - 1];
			args.length--;

			while (i <= args.length) {
				if (args[i]) {
					re.push(this.dirname(args[i]));
				}
				i++;
			}

			re.push(to);

			return this.join.apply(this, re);
		},
		dirname: function(p) {
			var np = this.normalize(p),
				lastIndex = np.lastIndexOf('/');
			if (lastIndex == -1) {
				return p;
			} else {
				return np.slice(0, lastIndex);
			}
		},
		extname: function(p){
			var ps = p.split('/').reverse(),
				index = ps[0].lastIndexOf('.');
			return index != -1 ? ps[0].slice(index+1) : '';
		}
	};
});