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


// 미사용
router.put('/branch', function(req, res) {
	var branch_no = req.body.branch_no;
	var branch_name = req.body.branch_name;
	var position = req.body.position;
	res.send(JSON.stringify({branch_no:branch_no,branch_name:branch_name,position:position}));
});


// 미사용
router.delete('/branch', function(req, res) {
	var rowid = req.body.rowid;
	res.send(JSON.stringify({}));
});


// 가까운 영업점 리스트 출력
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


// 순번대기표 등록 처리
router.post('/orderno', function(req, res) {
	var branch_no = req.body.branch_no;
	var order_no = req.body.order_no;
	var device_token = req.body.device_token;	

	connection.query(
        'insert into tbl_orderno_mng \
            (branch_no, order_no, dr_time, call_time, status_cd, wait_status_cd, push_yn, device_token) \
            values (?,?,curtime(),?,?,?,?,?)',
        [branch_no, order_no, 0, 1, 1, 0, device_token],
		function(err, results) {
			if (err) {
				res.send(JSON.stringify({result:false,err:err}));
			} else {
				res.send(JSON.stringify({result:true,db_result:results}));
			}
		})
});


// 미사용
router.put('/orderno', function(req, res) {
	var branch_no = req.body.branch_no;
	var seqno = req.body.seqno;
	res.send(JSON.stringify({branch_no:branch_no,seqno:seqno}));
});


// 순번대기표 등록처리된 건 취소(상태를 9로 update)처리. 호출되지 않은건만 취소가능
router.delete('/orderno', function(req, res) {
	var device_token = req.body.device_token;

	connection.query(
	   'select max(ser_no) ser_no from tbl_orderno_mng \
	    where device_token = ? and status_cd = 1 and wait_status_cd = 1',
	    [device_token],
		function(err,results,fields) {
			if (err) {
				res.send(JSON.stringify({result:false,err:err}));
			} else {
				connection.query(
				   'update tbl_orderno_mng set status_cd = 9 where ser_no = ?',
				    [results[0].ser_no],
					function(err2,results2,fields2) {
						if (err2) {
							res.send(JSON.stringify({result:false,err:err2}));
						} else {
							res.send(JSON.stringify({result:true,db_result:results2}));
						}
					});
			}
		});
});

// 미사용
router.get('/orderno', function(req, res) {
	var branch_no = req.query.branch_no;;
	var seqno = req.query.seqno;
	res.send(JSON.stringify({branch_no:branch_no,seqno:seqno}));
});

// 순번대기 상황 조회 ///////////////////////////////////////////////////////
// 1. device_token 에 등록된 가장 큰 나의순번을 가지고 온다. 등록된 지점도..
// 2. 등록된 지점에 나의순번보다 작은 앞의 사람 10개 내역을 가지고 온다.
// 3. 순번 순서대로 정렬해서 화면에 보여준다. 맨 마지막이 내꺼.
///////////////////////////////////////////////////////////////////////////
router.post('/orderno/status', function(req, res) {
	var device_token = req.body.device_token;

	var obj = { result:true, ny:[] }

	connection.query(
	   'select order_no, wait_status_cd, dr_time, wait_mm, call_time \
		from \
		( \
			select \
				aa.order_no, \
				aa.wait_status_cd, \
				aa.dr_time, \
				TIMESTAMPDIFF(minute, aa.dr_time, curtime()) wait_mm, \
				aa.call_time \
			from tbl_orderno_mng aa, \
				 ( \
					 select order_no, branch_no \
					 from tbl_orderno_mng \
					 where device_token = ? \
					 and status_cd = 1 \
					 order by ser_no desc \
					 limit 1 \
				 ) bb \
			where aa.branch_no = bb.branch_no \
			and aa.order_no <= bb.order_no \
			and aa.status_cd = 1 \
			order by aa.order_no desc \
			limit 10 \
		) cc \
		order by cc.order_no',
	    [device_token],
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



// postman 으로 순번 호출처리 -> 호출된번호 뒤 2명에게 메세지 송신처리함
/*
서버키
AAAAPp1PiY8:APA91bFMDMYV2-HQBhJNmmIITMlSJQzoGH9xXALexgvcNvNjBWuPKjBsNiaRAlgn459BQeqQuUkIkCFO8S8MOqAAllgjqrX8Pfy8rGDvmdyzmLCJddCnrbTO_b9J_oNyQvcL9fYZWhiW
이전 서버 키 :
AIzaSyASkxhDjie8JJirBp88XiDkm1cgnJnlNIw
*/
var FCM = require('fcm-node');
var serverKey = 'AAAAPp1PiY8:APA91bFMDMYV2-HQBhJNmmIITMlSJQzoGH9xXALexgvcNvNjBWuPKjBsNiaRAlgn459BQeqQuUkIkCFO8S8MOqAAllgjqrX8Pfy8rGDvmdyzmLCJddCnrbTO_b9J_oNyQvcL9fYZWhiW'; //put your server key here
var fcm = new FCM(serverKey);

router.put('/orderno/call', function(req, res) {
	var branch_no = req.body.branch_no;
	var order_no = req.body.order_no;

	connection.query(
        'update tbl_orderno_mng \
         set call_time = curtime(), \
             wait_status_cd = 2 \
         where status_cd = 1 \
         and branch_no = ? \
         and order_no = ?',
        [branch_no, order_no],
		function(err, result) {
			if (err) {
				res.send(JSON.stringify({result:false,err:err}));
			} else {
				connection.query(
			        'select device_token, ser_no, push_yn \
			        from tbl_orderno_mng \
			        where status_cd = 1 \
			        and branch_no = ? \
			        and order_no > ? \
			        and wait_status_cd = 1 \
			        order by order_no \
			        limit 2',
			        [branch_no, order_no],
					function(err, results, fields) {
						if (err) {
							res.send(JSON.stringify({result:false,err:err}));
						} else {
							for (var ix = 0; ix < results.length; ix++)
							{
								var device_token = results[ix].device_token;
								var push_yn = results[ix].push_yn;

								if (ix == 0) {
									var ser_no_1 = results[ix].ser_no;
								} else {
									var ser_no_2 = results[ix].ser_no;
								}

								if (push_yn == 0)
								{
									var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
								        to: device_token, 
								        collapse_key: 'shinhan_collapse_key',
								        notification: {
								            title: '대기순번알람', 
								            body: '고객님의 순번이 다가옵니다. 영업점창구에서 대기해 주세요' 
								        },				        
								        data: {  //you can send only notification or only data(or include both)
								            data1: 'value1',
								            data2: 'value2'
								        }
								    };

								    fcm.send(message, function(err, response){
								        if (err) {
								            //res.send(JSON.stringify({result:false,err:err}));
								            console.log("fcm message send error !!!");
								        }
								        else
								        {
								        	console.log("fcm message send !!!");
								        }
								    });
								}
							}

							connection.query(
						        'update tbl_orderno_mng set push_yn = 1 where ser_no in (?,?) and push_yn = 0',
						        [ser_no_1, ser_no_2],
								function(err, results) {
									if (err) {
										res.send(JSON.stringify({result:false,err:err}));
									} else {
										res.send(JSON.stringify({result:true,db_result:results}));
									}
								})
						}
					});
			}
		});

});



// 최초 구동시 순번대기 등록여부 판단
router.post('/orderno/check', function(req, res) {
	var device_token = req.body.device_token;

	connection.query(
	   'select count(*) cnt from tbl_orderno_mng where device_token = ? and status_cd = 1',
	    [device_token],
		function(err,results,fields) {
			if (err) {
				res.send(JSON.stringify({result:false,err:err}));
			} else {
				res.send(JSON.stringify({result:true,cnt:results[0].cnt}));
			}
		});

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


/*
서버키
AAAAPp1PiY8:APA91bFMDMYV2-HQBhJNmmIITMlSJQzoGH9xXALexgvcNvNjBWuPKjBsNiaRAlgn459BQeqQuUkIkCFO8S8MOqAAllgjqrX8Pfy8rGDvmdyzmLCJddCnrbTO_b9J_oNyQvcL9fYZWhiW
이전 서버 키 :
AIzaSyASkxhDjie8JJirBp88XiDkm1cgnJnlNIw
*/
/*
var FCM = require('fcm-node');
var serverKey = 'AAAAPp1PiY8:APA91bFMDMYV2-HQBhJNmmIITMlSJQzoGH9xXALexgvcNvNjBWuPKjBsNiaRAlgn459BQeqQuUkIkCFO8S8MOqAAllgjqrX8Pfy8rGDvmdyzmLCJddCnrbTO_b9J_oNyQvcL9fYZWhiW'; //put your server key here
var fcm = new FCM(serverKey);
router.post('/user/push/:id',function(req,res) {
	connection.query(
		'select device_token from user_nologin where id=?',
		[ req.params.id ], 
		function(err, results, fields) {
			if (err) {
				res.send(JSON.stringify({result:false,err:err}));
			} else {
				if (results.length > 0) {
					var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
				        to: results[0].device_token, 
				        collapse_key: 'shinhan_collapse_key',
				        notification: {
				            title: '대기순번알람', 
				            body: '고객님의 순번이 다가옵니다. 영업점창구에서 대기해 주시기 바랍니다' 
				        },				        
				        data: {  //you can send only notification or only data(or include both)
				            data1: 'value1',
				            data2: 'value2'
				        }
				    };
				    fcm.send(message, function(err, response){
				        if (err) {
				            res.send(JSON.stringify({result:false,err:err}));
				        } else {
				        	res.send(JSON.stringify({result:true,response:response}));
				        }
				    });
				} else {
					res.send(JSON.stringify({result:false,err:'do not exist device token'}));
				}
			}
		});	
});
*/

///////////////////////////////////////////////////////////////////

module.exports = router;
