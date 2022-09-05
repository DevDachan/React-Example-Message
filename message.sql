
use message;
/*
CREATE TABLE super_user(
	id VARCHAR(20),
    pwd VARCHAR(20)
);
CREATE TABLE chat_list(
	title VARCHAR(20),
    state VARCHAR(20),
    user_id VARCHAR(20)
);
INSERT INTO super_user VALUE("dachan", "1234");*/
select * from super_user;
/*
DROP TABLE chat_list;
CREATE TABLE chat_list(
	title VARCHAR(50),
    code VARCHAR(50) PRIMARY KEY
);
CREATE TABLE user_chat(
    user_id VARCHAR(50),
	code VARCHAR(50),
    state VARCHAR(50),
	nickname VARCHAR(50)
);

INSERT INTO chat_list VALUE( "오석 35번 사물함", "111111");
INSERT INTO chat_list VALUE( "석기시대 팀","222222");
INSERT INTO chat_list VALUE( "고스트","333333");
*//*
ALTER TABLE admin_list ADD PRIMARY KEY (user_id, code);

INSERT INTO user_chat VALUE( "chn7894@handong.ac.kr","111111","관리자","Cute boy");
INSERT INTO user_chat VALUE( "chn7894@handong.ac.kr","222222","관리자","Sexy boy");
INSERT INTO user_chat VALUE( "chn7894@handong.ac.kr","333333","관리자","Powerful boy");

*//*
DROP TABLE user_chat;
CREATE TABLE user_chat(
    user_id VARCHAR(50),
	code VARCHAR(50),
    room_number VARCHAR(50),
    state VARCHAR(50),
	nickname VARCHAR(50),
    PRIMARY KEY(user_id,code,room_number)
);
DROP TABLE chat;
CREATE TABLE chat(
    user_id VARCHAR(50),
	code VARCHAR(50),
	room_number VARCHAR(50),
	content VARCHAR(520),
    time VARCHAR(50)
);*/

/*
INSERT INTO user_chat VALUE( "chn7894@handong.ac.kr","111111","1","관리자","cute_boy");
INSERT INTO user_chat VALUE( "chn7894@handong.ac.kr","222222","1","관리자","sexy_boy");
INSERT INTO user_chat VALUE( "chn7894@handong.ac.kr","333333","1","관리자","cute_boy");
*//*
DROP TABLE room_list;
CREATE TABLE room_list(
    title VARCHAR(50),
	code VARCHAR(50),
    admin VARCHAR(50)
);

INSERT INTO room_list VALUE("오석 35번 사물함","111111","chn7894@handong.ac.kr");

INSERT INTO room_list VALUE("석기시대팀","222222","chn7894@handong.ac.kr");

INSERT INTO room_list VALUE("고스트","333333","chn7894@handong.ac.kr"); 
*/

/*
CREATE TABLE admin_list (
	code VARCHAR(50),
    user_id VARCHAR(50)
);
*/

/*
SELECT * FROM 
(SELECT * FROM admin_list LEFT JOIN room_list USING(code) WHERE user_id = "chn7894@handong.ac.kr") AS k
UNION
(SELECT user_id, FROM user_chat LEFT JOIN room_list USING(code) WHERE user_id= "chn7894@handong.ac.kr"AND state <> "관리자");

*/
/*
INSERT INTO admin_list VALUE("chn7894@handong.ac.kr","111111");
INSERT INTO admin_list VALUE("chn7894@handong.ac.kr","222222");
INSERT INTO admin_list VALUE("chn7894@handong.ac.kr","333333");
*/
/*
INSERT INTO user_chat VALUE("dachan","333333","1","사용자","익명의 사용자"); 
INSERT INTO user_chat VALUE("dachan","333333","2","사용자","익명의 사용자"); 
INSERT INTO user_chat VALUE("dachan","111111","1","사용자","익명의 사용자"); 
*//*
SELECT * FROM chat LEFT JOIN user_chat USING(user_id,code,room_number)  WHERE room_number="1" AND chat.code ="111111" ORDER BY time;

SELECT * FROM
(SELECT * FROM user_chat LEFT JOIN room_list USING(code) WHERE user_id=? AND state = "관리자" GROUP BY code) AS k
UNION
(SELECT * FROM user_chat LEFT JOIN room_list USING(code) WHERE user_id=? AND state <> "관리자");*/
/*
DROP TABLE admin_list;
CREATE TABLE admin_list (
	user_id VARCHAR(50),
	code VARCHAR(50)
);
INSERT INTO admin_list VALUE("chn7894@handong.ac.kr","111111");
INSERT INTO admin_list VALUE("chn7894@handong.ac.kr","222222");
INSERT INTO admin_list VALUE("chn7894@handong.ac.kr","333333");
*/
/*
SELECT * FROM admin_list JOIN room_list USING(code) WHERE user_id="chn7894@handong.ac.kr";
*/
/*
DELETE FROM admin_list WHERE user_id = "" OR code = "";
*/
/*
DELETE FROM user_chat WHERE user_id ="dachan2";*/
/*
DELETE FROM user_chat WHERE user_id="dachan3";
*/
/*
UPDATE chat SET room_number="del3" WHERE room_number="3" AND code="111111";
*/
/*INSERT INTO super_user VALUE("super","1111");

*/

SELECT * FROM room_list;
SELECT * FROM user_chat;
select * from chat;
SELECT * FROM chat LEFT JOIN user_chat USING(user_id,code) WHERE code=111111 ORDER BY time;
SELECT * FROM admin_list;
SELECT * FROM user_chat WHERE code="111111" ORDER BY room_number;


SELECT * FROM report;
/*
CREATE TABLE report (
	user_id VARCHAR(50),
    state VARCHAR(50),
    code VARCHAR(50),
    room_number VARCHAR(50),
    time VARCHAR(50),
    PRIMARY KEY(user_id,code,room_number)
)*//*
DROP TABLE permission_report;
CREATE TABLE permission_report (
	code VARCHAR(50),
    room_number VARCHAR(50),
    primary key (code, room_number)
);
*/

DELETE FROM permission_report WHERE code = "222222";
SELECT * FROM permission_report;
