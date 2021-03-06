create database smartalarm;

use smartalarm;


CREATE TABLE tbl_orderno_mng
(
    ser_no integer PRIMARY KEY AUTO_INCREMENT,
    branch_no integer,
    order_no integer,
    dr_time date,
    call_time date,
    status_cd integer,
    wait_status_cd integer,
    push_yn integer,
    device_token VARCHAR(256)
);


CREATE TABLE tbl_branch_info
(
    id integer PRIMARY KEY AUTO_INCREMENT,
    branch_no integer,
    branch_name VARCHAR(20),
    position_x integer,
    position_y integer,
    address VARCHAR(100),
    status_cd integer
);

    date_format(dr_time, '%H:%i:%s'),
    TIMESTAMPDIFF(minute, dr_time, curtime())