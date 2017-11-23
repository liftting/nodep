var express = require('express');
var router = express.Router();
var db = require('../controller/db')

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'WeChat', content: 'this is body info'});
});

router.get('/main', function (req, res) {
    res.render('main');
});


router.get('/hourse', function (req, res, next) {
    loadHourseInfo(res);
});

function loadHourseInfo(pageRes) {
    db.all(createQuerySql(), function (err, data) {
        console.log("has receive callback")
        if (!err) {
            pageRes.render("hourse", {hourse: data});
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
function createQuerySql() {
    var sql = "select hourse_info.he_id,he_price_total,he_hourse_name,he_hourse_area,he_age_type,he_price_time,he_desc,he_position,he_hourse_dir,he_large_position " +
        "from hourse_price left join hourse_info on hourse_price.he_id = hourse_info.he_id " +
        "where hourse_price.he_price_time between 20171123 and 20171123 and he_age_type = 3 and he_hourse_use like '%住宅%' order by he_price_total ASC"
    return sql;
}

/**
 *  hourse 信息类
 * @constructor
 */
function HourseInfo() {
    var he_id;
    var he_hourse_name;
    var he_hourse_area;
    var he_age;
    var he_price_total;


}


module.exports = router;
