if (!location.href.endsWith('/login.html')) {
	const token = localStorage.getItem('token')
	if (!token) {
		location.href = '/login.html'
	}
}

jQuery.prototype.serializeObject = function () {
	var obj = new Object()
	$.each(this.serializeArray(), function(index, param){
		if (!(param.name in obj)) {
			obj[param.name]=param.value
		}
	})
	return obj
}

if (window.dayjs) {
	// 加载 dayjs 的插件
	dayjs.extend(window.dayjs_plugin_relativeTime)
	
	// art-template 过滤器，获取相对时间
	template.defaults.imports.relativeTime = function (value) {
		return dayjs().to(dayjs(value))
	}
}

// // 修改 art-template 的界定符为 [[  ]]
// const rule = template.defaults.rules[1];
// rule.test = new RegExp(rule.test.source.replace('{{', '\\\[\\\[').replace('}}', '\\\]\\\]'));


// // 获取url上的参数
function getQuery (queryStr) {
	let query = {}
	queryStr = queryStr.replace('?', '')
	const arr = queryStr.split('&')
	arr.forEach(item => {
		// item => id=1
		const keyValuePair = item.split('=')
		query[keyValuePair[0]] = keyValuePair[1]
	})
	return query
}


// // sidebar 高亮选中功能
// const pathname = location.pathname
// // 移除所有 a 的高亮
// $('.sidebar a').each(function (index, item) {
// 	const $link = $(item)
// 	$link.removeClass('active')
// 	const href = $link.attr('href')
// 	if (pathname === href) {
// 		$link.addClass('active')
// 	}
// })

// sidebar 订阅用户列表
