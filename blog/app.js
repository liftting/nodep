var express = require('express');
var path = require('path');
// var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./app_server/routes/index');

var swig = require('swig');

var app = express();

// 设置模板目录
app.set('views', path.join(__dirname, "app_server", 'views'));
// // 设置模板引擎
// app.set('view engine', 'ejs');
// //设置引擎后缀.  index.html 中的内容可以是 ejs 代码
// app.engine('.html', require('ejs').__express);

//设置swig页面不缓存
swig.setDefaults({
    cache: false
})
app.set('view cache', false);
// app.set('views','./views/pages/');
app.set('view engine', 'html');
app.engine('html', swig.renderFile);

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'home_fav.ico')));

//配置使用大量的中间件
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
//配置静态模板文件
app.use(express.static(path.join(__dirname, 'public')));

//路由控制器配置，
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

//错误处理配置
// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
