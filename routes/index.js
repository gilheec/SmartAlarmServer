var express = require('express');
var router = express.Router();


var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'test1234',
  database : 'smartalarm'
});
connection.connect();



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'SmartAlarm' });
});

router.put('/branch', function(req, res) {
	var branch_no = req.body.branch_no;
	var branch_name = req.body.branch_name;
	var position = req.body.position;
	res.send(JSON.stringify({branch_no:branch_no,branch_name:branch_name,position:position}));
});

router.delete('/branch', function(req, res) {
	var rowid = req.body.rowid;
	res.send(JSON.stringify({}));
});

router.get('/branch/list', function(req, res) {
	//var position = req.query.position;
	//res.send(JSON.stringify({position:position}));

	var obj = { result:true, ny:[] }

	connection.query(
		'select branch_name, address, position_x, branch_no \
	       from tbl_branch_info \
	      order by position_x',
		function(err,results,fields) {
			if (err) {
				res.send(JSON.stringify({result:false,err:err}));
			} else {
				for (var i = 0; i < results.length; i++) {
					obj.ny.push(results[i]);
				}
				res.send(JSON.stringify(obj));
			}
		});
});

router.post('/orderno', function(req, res) {
	var branch_no = req.body.branch_no;
	var seqno = req.body.seqno;
	var device_token = req.body.device_token;

	var branch_no = req.body.branch_no;
	var order_no = req.body.order_no;
	var device_token = req.body.device_token;	

	connection.query(
        'insert into tbl_orderno_mng \
            (branch_no, order_no, call_time, status_cd, wait_status_cd, push_yn, device_token) \
            values (?,?,?,?,?,?,?)',
        [branch_no, order_no, '120000', 1, 1, 0, device_token],
		function(err, result) {
			if (err) {
				res.send(JSON.stringify({result:false,err:err}));
			} else {
				res.send(JSON.stringify({result:true,db_result:result}));
			}
		})
});

router.put('/orderno', function(req, res) {
	var branch_no = req.body.branch_no;
	var seqno = req.body.seqno;
	res.send(JSON.stringify({branch_no:branch_no,seqno:seqno}));
});

router.delete('/orderno', function(req, res) {
	var rowid = req.body.rowid;
	res.send(JSON.stringify({}));
});

router.get('/orderno', function(req, res) {
	var branch_no = req.query.branch_no;;
	var seqno = req.query.seqno;
	res.send(JSON.stringify({branch_no:branch_no,seqno:seqno}));
});

router.get('/orderno/status', function(req, res) {
	var branch_no = req.query.branch_no;
	res.send(JSON.stringify({branch_no:branch_no}));
});

router.get('/orderno/call', function(req, res) {
	var branch_no = req.query.branch_no;
	var seqno = req.query.seqno;
	res.send(JSON.stringify({branch_no:branch_no,seqno:seqno}));
});

///////////////////////////////////////////////////////////////////

router.post('/user/login', function(req, res) {
	var id = req.body.id;
	var password = req.body.password;
	res.send(JSON.stringify({id:id,password:password}));
});

router.post('/user', function(req, res) {
	var id = req.body.id;
	var password = req.body.password;
	res.send(JSON.stringify({id:id,password:password}));
});

router.get('/user', function(req, res) {
	var rowid = req.query.rowid;
	res.send(JSON.stringify({rowid:rowid}));
});

router.put('/user', function(req, res) {
	var rowid = req.body.rowid;
	var id = req.body.id;
	var password = req.body.password;
	res.send(JSON.stringify({rowid:rowid,id:id,password:password}));
});

router.delete('/user', function(req, res) {
	var rowid = req.body.rowid;
	res.send(JSON.stringify({}));
});

router.get('/user/list', function(req, res) {
	res.send(JSON.stringify([]));
});

///////////////////////////////////////////////////////////////////

module.exports = router;
