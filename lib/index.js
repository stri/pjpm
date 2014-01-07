(function(module) {
	var dox = require('dox'),
		path = require('path'),
		fs = require('fs'),
		dirWalk = require('./util/dirWalk');

	var pro_modules_path = path.normalize(__dirname + '/../pro_modules/'),
		baseDir = path.normalize(__dirname + '/../'),
		apiDocArr = [],
		apiDocHash = {};


	function apiMD(data, source) {
		var re = [];

		re.push('### Pro.js Document（版本：0.0.1）');
		re.push('=======');

		// 排序
		data = data.sort(function(a, b) {
			if (a.toLowerCase() > b.toLowerCase()) {
				return 1;
			}

			if (a.toLowerCase() < b.toLowerCase()) {
				return -1;
			}

			return 0;
		});

		// 生成文档
		data.forEach(function(name) {
			var value = source[name];

			re.push('* [' + value.id + '](' + value.url + ') ' + value.description);

			if (value.children) {
				value.children.forEach(function(value) {
					re.push('\t* `' + value.id + '` ' + value.description);
				});
			}
		});

		return re.join('\n');
	}


	module.exports = {
		path: pro_modules_path,
		doc: function() {
			var jss = dirWalk(pro_modules_path)['js'];
			jss.forEach(function(uri) {
				var buf = fs.readFileSync(uri),
					basename = path.basename(uri, '.js'),
					name = path.dirname(uri).replace(baseDir, ' '),
					version = basename.split('@')[1];

				var data = dox.parseComments(buf.toString()),
					source = {};

				if (data && data.length && name.split('/').length == 2 && uri.indexOf('index') != -1) {
					source = {
						name: name.split('/')[1],
						url: name,
						version: version,
						description: (data[0].description.full.split('>')[1] || ' ').split('<')[0]
					};

					if (version) {
						source.id = '@' + version;
					} else {
						source.id = source.name;
					}

					if (apiDocHash[source.name]) {
						apiDocHash[source.name].children = apiDocHash[source.name].children || [];
						apiDocHash[source.name].children.push(source);
					} else {
						apiDocArr.push(source.name);
						apiDocHash[source.name] = source;
					}

				}
			});

			fs.writeFileSync(baseDir + 'README.MD', apiMD(apiDocArr, apiDocHash));
		}
	};
})(module);