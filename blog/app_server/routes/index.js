var express = require('express');
var router = express.Router();
// var db = require('../controller/db')
var sqlite3 = require('sqlite3')


/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'WeChat', content: 'this is body info'});
});

router.get('/main', function (req, res) {
    var map = new HashMap();
    map.put("key", [{name: 'say hello'}, {name: 'again say'}]);
    res.render('main', {data: map});
});

router.get('/hourse', function (req, res, next) {
    var dbname = req.query.dn;//解析get请求参数 dn是key

    if (dbname == null || dbname.length == 0) {
        dbname = "shunyi";
    }

    var curDate = getSearchDate();//当天的数据

    loadHourseInfo(res, dbname, curDate);
});

function getSearchDate() {
    var date = new Date();
    var seperator1 = "";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
    // currentdate = "20171121";
    return currentdate;
}

function loadHourseInfo(pageRes, dbname, curdate) {

    var db = new sqlite3.Database('public/databases/' + dbname + '.db', function (err) {

    });

    db.all(createQuerySql(curdate), function (err, data) {
        console.log("has receive callback")

        var map = operateData(data);

        if (!err) {
            pageRes.render("aui/hourse", {data: map});
            // pageRes.render("main", {data: map});
        }
        else {
            console.log(err);
        }

    });
    //he_large_position
}

/**
 * select hourse_info.he_id,he_price_total,he_hourse_name,he_hourse_area,he_age_type,he_price_time from hourse_price
 * left join hourse_info on hourse_price.he_id = hourse_info.he_id where hourse_price.he_price_time between 20171120 and 20171122
 * @returns {string}
 */
function createQuerySql(curdate) {
    var sql = "select hourse_info.he_id,he_price_total,he_hourse_name,he_hourse_area,he_age_type,he_price_time,he_desc,he_position,he_hourse_dir,he_large_position " +
        "from hourse_price left join hourse_info on hourse_price.he_id = hourse_info.he_id " +
        "where hourse_price.he_price_time between " + curdate + " and " + curdate + " and he_age_type = 3 and he_hourse_use like '%住宅%' order by he_price_total ASC"
    return sql;
}

/**
 * 在处理数据
 * HashMap<String,List>
 * @param data
 */
function operateData(data) {

    var map = new HashMap();

    //遍历数据
    for (var i in data) {
        var largeName = data[i].he_large_position;
        if (map.containsKey(largeName)) {
            //包含
            var array = map.get(largeName);
            array.push(data[i]);
        } else {
            var ary = new Array();
            ary.push(data[i]);
            map.put(largeName, ary);
        }
    }

    return map;

}

function HashMap() {
    //定义长度
    var length = 0;
    //创建一个对象
    var obj = new Object();

    /**
     * 判断Map是否为空
     */
    this.isEmpty = function () {
        return length == 0;
    };

    /**
     * 判断对象中是否包含给定Key
     */
    this.containsKey = function (key) {
        return (key in obj);
    };

    /**
     * 判断对象中是否包含给定的Value
     */
    this.containsValue = function (value) {
        for (var key in obj) {
            if (obj[key] == value) {
                return true;
            }
        }
        return false;
    };

    /**
     *向map中添加数据
     */
    this.put = function (key, value) {
        if (!this.containsKey(key)) {
            length++;
        }
        obj[key] = value;
    };

    /**
     * 根据给定的Key获得Value
     */
    this.get = function (key) {
        return this.containsKey(key) ? obj[key] : null;
    };

    /**
     * 根据给定的Key删除一个值
     */
    this.remove = function (key) {
        if (this.containsKey(key) && (delete obj[key])) {
            length--;
        }
    };

    /**
     * 获得Map中的所有Value
     */
    this.values = function () {
        var _values = new Array();
        for (var key in obj) {
            _values.push(obj[key]);
        }
        return _values;
    };

    /**
     * 获得Map中的所有Key
     */
    this.keySet = function () {
        var _keys = new Array();
        for (var key in obj) {
            _keys.push(key);
        }
        return _keys;
    };

    /**
     * 获得Map的长度
     */
    this.size = function () {
        return length;
    };

    /**
     * 清空Map
     */
    this.clear = function () {
        length = 0;
        obj = new Object();
    };

}

module.exports = router;
