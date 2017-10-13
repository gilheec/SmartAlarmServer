var express = require('express');
var router = express.Router();

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
	var position = req.query.position;
	res.send(JSON.stringify({position:position}));
});

router.post('/orderno', function(req, res) {
	var branch_no = req.body.branch_no;
	var seqno = req.body.seqno;
	var device_token = req.body.device_token;
	res.send(JSON.stringify({branch_no:branch_no,seqno:seqno,device_token:device_token}));
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
