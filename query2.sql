use smartalarm;


select * from tbl_orderno_mng;

branch_no, order_no, call_time, push_yn, device_token

drop table tbl_orderno_mng;

CREATE TABLE tbl_orderno_mng
(
    ser_no integer PRIMARY KEY AUTO_INCREMENT,
    branch_no integer,
    order_no integer,
    dr_time time,
    call_time time,
    status_cd integer,
    wait_status_cd integer,
    push_yn integer,
    device_token VARCHAR(256)
);


select *, curtime(), curdate() from tbl_branch_info;

select count(*) cnt from tbl_orderno_mng where device_token = 'aa';

select * from tbl_orderno_mng;
select * from tbl_orderno_mng;

delete from tbl_orderno_mng where 1=1;

insert into tbl_orderno_mng(branch_no, order_no, call_time, status_cd, wait_status_cd, push_yn, device_token)
 values(3001, 1234, "120000", 1, 1, 0, "abcd1234567890");

 order_no || ' - 대기중 (대기시간 ' || datediff(minute(), now(), dr_time) || '분)' wait_ctnt,

;
    date_format(dr_time, '%H:%i:%s'),
    TIMESTAMPDIFF(minute, dr_time, curtime())


select order_no, wait_status_cd, dr_time, wait_mm, call_time
from
(
	select 
		aa.order_no,
		aa.wait_status_cd,
		aa.dr_time,
		TIMESTAMPDIFF(minute, aa.dr_time, curtime()) wait_mm,
		aa.call_time
	from tbl_orderno_mng aa,
		 (
			 select order_no, branch_no
			 from tbl_orderno_mng
			 where device_token = 'cf6U2KLGCrI:APA91bHHa3-qUtdw2E0Y0DKCtpA7JCzfCnnGhlqnvjYT-cmfPocwq4OVlieb2u_MfjoQSpwUTQZpbkObjT9Di6vNg1pcI7gSMnEOZo348z6T--bjB0IQMFMyZUZS2XwzngG7J96kDkg_'
			 and status_cd = 1
			 order by ser_no desc
			 limit 1
		 ) bb
	where aa.branch_no = bb.branch_no
	and aa.order_no <= bb.order_no
	and aa.status_cd = 1
	order by aa.order_no desc
	limit 5
) cc
order by cc.order_no
;


;


select * from tbl_branch_info;




delete from tbl_orderno_mng where ser_no = (select min(ser_no) from tbl_orderno_mng where order_no = 1239);






	   select order_no, wait_status_cd, dr_time, wait_mm, call_time 
		from 
		( 
			select 
				aa.order_no, 
				aa.wait_status_cd, 
				aa.dr_time, 
				TIMESTAMPDIFF(minute, aa.dr_time, curtime()) wait_mm, 
				aa.call_time 
			from tbl_orderno_mng aa, 
				 ( 
					 select order_no, branch_no 
					 from tbl_orderno_mng 
					 where device_token = ?
					 and status_cd = 1 
					 order by ser_no desc 
					 limit 1 
				 ) bb 
			where aa.branch_no = bb.branch_no 
			and aa.order_no <= bb.order_no 
			and aa.status_cd = 1 
			order by aa.order_no desc 
			limit 5 
		) cc 
		order by cc.order_no
        ;

update tbl_orderno_mng set wait_status_cd = 1 where ser_no = 2;
select * from tbl_orderno_mng;

update tbl_orderno_mng set push_yn = 0 where ser_no in (12,11);


select device_token, ser_no, push_yn 
        from tbl_orderno_mng 
        where status_cd = 1 
        and branch_no = 1001
        and order_no > 1235
        and wait_status_cd = 1 
        order by order_no
        limit 1

update tbl_orderno_mng set status_cd = 9 where ser_no = 2;
update tbl_orderno_mng set push_yn = 0 where ser_no = 10;

select min(ser_no) ser_no 
from tbl_orderno_mng 
where device_token = 'cf6U2KLGCrI:APA91bHHa3-qUtdw2E0Y0DKCtpA7JCzfCnnGhlqnvjYT-cmfPocwq4OVlieb2u_MfjoQSpwUTQZpbkObjT9Di6vNg1pcI7gSMnEOZo348z6T--bjB0IQMFMyZUZS2XwzngG7J96kDkg_'
 and status_cd = 1
;


select device_token, ser_no, push_yn 
			        from tbl_orderno_mng 
			        where status_cd = 1 
			        and branch_no = 1001
			        and order_no > 1247
			        and wait_status_cd = 1 
			        order by order_no 
			        limit 2;

select * from tbl_orderno_mng;
