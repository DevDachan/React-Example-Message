var template = require('./lib/template.js');
const express = require('express');
var app = express();
var fs = require('fs');

const cors = require('cors');

var path = require('path');
var sanitizeHtml = require('sanitize-html');
var db = require("./lib/db.js");
var nodemailer = require('nodemailer');

var qs = require('querystring');
var bodyParser = require('body-parser');
var session = require('express-session')
var compression = require('compression');
var flash = require('connect-flash');
const PORT = process.env.PORT || 4000;


app.use(bodyParser.urlencoded({extended: false}));

app.use(compression());
app.use(session({
  secret: 'asadlfkj!@#!@#dfgasdg',
  resave: false,
  saveUninitialized: true
}));

app.use(flash());
// 위로 올리면 error

app.use(cors());
app.use(express.static(path.join(__dirname, 'message/build')));



app.get('/', function(request, response){
  response.sendFile(path.join(__dirname, 'message/build/index.html'));
});

app.get('/main', function(request, response){
  response.sendFile(path.join(__dirname, 'message/build/index.html'));
});

app.get('/room', function(request, response){
  response.sendFile(path.join(__dirname, 'message/build/index.html'));
});

app.get('/room_admin', function(request, response){
  response.sendFile(path.join(__dirname, 'message/build/index.html'));
});

app.get('/super_user', function(request, response){
  response.sendFile(path.join(__dirname, 'message/build/index.html'));
});
app.get('/super_admin', function(request, response){
  response.sendFile(path.join(__dirname, 'message/build/index.html'));
});
app.get('/super_room', function(request, response){
  response.sendFile(path.join(__dirname, 'message/build/index.html'));
});





app.get('/login', function(request, response){0
  db.query(`SELECT * FROM super_user WHERE id=? AND pwd=?`,[request.query.id, request.query.pwd],function(error,state){
    if(error){
      throw error;
    }
    response.send({result: state.length !== 0 , inp:request.query.id, inpt:request.query.pwd});
  })
});


app.get('/create_room', function(request, response){
  var post = request.query;
  db.query(`SELECT * FROM room_list WHERE code=?`,[post.code],function(error,check_list){
    if(error){
      throw error;
    }
    if(check_list.length !== 0){
      response.send({result: false});
    }
    else{
        db.query(`INSERT INTO room_list VALUE(?,?)`,[post.title,post.code],function(error2,state){
          if(error2){
            throw error2;
          }
          if(post.admin !== undefined){
            for(var i = 0; i< post.admin.length; i++){
              db.query(`INSERT INTO admin_list VALUE(?,?,?,?)`,[post.admin[i],post.code,post.nickname,"관리자"],function(error3,state2){
                if(error3){
                  throw error3;
                }
              });
              //**********************************
              let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: 'dachan9524@gmail.com',  // gmail 계정 아이디를 입력
                  pass: 'bkmjptvcdfcvnpqy'          // gmail 계정의 비밀번호를 입력
                }
              });
              let mailOptions = {
                from: 'dachan9524@gmail.com',    // 발송 메일 주소 (위에서 작성한 gmail 계정 아이디)
                to: `${post.admin[i]}` ,                     // 수신 메일 주소
                subject: "사서함 초대 알림 메일",   // 제목
                text: `${post.title} 사서함에 초대 되었습니다`  // 내용
              };

              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                }
                else {
                  console.log('Email sent: ' + info.response);
                }
              });

              //*********************************
            }
          }
            db.query(`INSERT INTO admin_list VALUE(?,?,?,?)`,[post.user,post.code,post.nickname,,"관리자"],function(error3,state2){
              if(error3){
                throw error3;
              }
                response.send({result: true});
            });
        })
    }
  })
});

app.get('/insert_admin', function(request, response){
  var post = request.query;
  db.query(`SELECT * FROM room_list WHERE code=?`,[post.code],function(er, room_name){
    if(er){
      throw er;
    }
    db.query(`SELECT * FROM admin_list WHERE code=?`,[post.code],function(error, list){
      if(error){
        throw error;
      }
      var temp = true;
      for(var i =0; i< list.length; i++){
        if(list[i].user_id === post.admin_id){
          temp = false;
          break;
        }
      }
      if(temp === true){
        db.query(`INSERT INTO admin_list VALUE(?,?,?,?)`,[post.admin_id,post.code,list[0].nickname,"관리자"],function(error2, state){
          if(error2){
            throw error2;
          }
          response.send({result:true});
        });
        //**********************************
        let transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'dachan9524@gmail.com',  // gmail 계정 아이디를 입력
            pass: 'bkmjptvcdfcvnpqy'          // gmail 계정의 비밀번호를 입력
          }
        });
        let mailOptions = {
          from: 'dachan9524@gmail.com',    // 발송 메일 주소 (위에서 작성한 gmail 계정 아이디)
          to: `${post.admin_id}` ,                     // 수신 메일 주소
          subject: "사서함 초대 알림 메일",   // 제목
          text: `${room_name[0].title} 사서함에 초대 되었습니다`  // 내용
        };

        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
          }
          else {
            console.log('Email sent: ' + info.response);
          }
        });

        //*********************************
      }
      else{
        response.send({result:false});
      }
    })
  })
})



app.get('/login_user', function(request, response){
  request.login(request.query.user, function(err){
    return response.send({result:"success"});
  });
})


app.get('/plz_room', function(request, response){
  if(request.query.user === "super"){
    db.query(`SELECT DISTINCT code, title,state FROM room_list LEFT JOIN admin_list USING(code)`,function(err,state){
      if(err){
        throw err;
      }
      response.send({adminlist:state});
    })
  }else{
    db.query(`SELECT * FROM admin_list JOIN room_list USING(code) WHERE user_id=?`,[request.query.user],function(error,admin_list){
      if(error){
        throw error;
      }
      db.query(`SELECT * FROM user_chat LEFT JOIN room_list USING(code) WHERE user_id=? AND state <> "관리자"`,
            [request.query.user],function(err,user_list){
        if(err){
          throw err;
        }
        response.send({userlist:user_list, adminlist:admin_list});
      });
    });
  }
})

app.get('/del_room', function(request, response){
  db.query(`SELECT room_number FROM user_chat WHERE user_id=? AND code=?`,[request.query.user,request.query.code],function(er,user){
    if(er){
      throw er;
    }
    var room_num = 0;
    if(user.length !== 0){
      room_num = user[0].room_number;
    }
    db.query(`DELETE FROM user_chat WHERE room_number=? AND code=?`,[room_num,request.query.code ],function(err,state){
        if(err){
          throw err;
        }
        var temp = 'admin';
        if(user.length !== 0){
          temp = user[0].room_number;
        }
        db.query("UPDATE chat SET room_number=? WHERE room_number=? AND code=?",[temp+"del" ,temp,request.query.code],function(erch,ch_st){
          if(erch){
            throw erch;
          }
          if(request.query.state === "관리자" ){
              db.query(`DELETE FROM room_list WHERE code=?`,[request.query.code ],function(err,state2){
                if(err){
                  throw err;
                }
                db.query(`DELETE FROM admin_list WHERE code=?`,[request.query.code], function(err2,state3){
                  if(err2){
                    throw err2;
                  }
                  db.query(`DELETE FROM user_chat WHERE code=?`,[request.query.code], function(err3,state4){
                    if(err3){
                      throw err3;
                    }
                  response.send({result:true});
                });
              });
            });
          }
          response.send({result:true});
      });
    });
  });
})

app.get('/plz_chat',function(request,response){
  var post = request.query;
  db.query(`
SELECT * FROM
(SELECT * FROM chat LEFT JOIN user_chat USING(user_id, code, room_number) WHERE room_number=? AND code =? AND state IS NOT NULL) AS k
UNION
(SELECT * FROM chat LEFT JOIN admin_list USING(user_id, code) WHERE room_number=? AND code =? AND state IS NOT NULL)
ORDER BY time;
`,[post.room_num,post.room,post.room_num,post.room],function(err,chat_list){
    if(err){
      throw err;
    }
    db.query(`SELECT * FROM room_list WHERE code=?`,[request.query.room],function(error,room_name){
      if(error){
        throw error;
      }
          response.send({chat_list:chat_list, room_name:room_name[0].title});
    })
  })
})

app.get('/del_chat',function(request,response){
  var post = request.query;
  db.query(`SELECT room_number FROM user_chat WHERE user_id=? AND code=?`,[post.user,post.code],function(er,user){
    if(er){
      throw er;
    }
    db.query(`DELETE FROM user_chat WHERE room_number=? AND code=?`,[post.room_num,post.code ],function(err,state){
        if(err){
          throw err;
        }
        var temp = '';
        if(user.length !== 0){
          temp = post.room_num;
        }
        db.query("UPDATE chat SET room_number=? WHERE room_number=? AND code=?",[temp+"del" ,temp , post.code],function(erch,ch_st){
          if(erch){
            throw erch;
          }
        response.send({result:true});
      });
    });
  });
})



app.get('/insert_chat',function(request,response){
  var post = request.query;
  db.query(`INSERT INTO chat VALUE(?,?,?,?,?)`,[post.user,post.code,post.room_num,post.content,post.time],function(err,state){
    if(err){
      throw err;
    }
    response.send({result:true});
  })
})


app.get('/enter_room',function(request,response){
  var post = request.query;
  db.query(`SELECT * FROM user_chat WHERE user_id=? AND code=?`,[post.user,post.code],function(error,alrd){
    if(error){
      throw error;
    }
    console.log("1");
    if(alrd.length === 0 ){
        db.query(`SELECT * FROM user_chat WHERE code=? ORDER BY room_number`,[post.code],function(error2,list){
            if(error2){
              throw error2;
            }
            console.log("2");
            var temp = 1;
            for(var i = 0; i<list.length; i++){

              if(Number(list[i].room_number) >temp){
                temp = Number(list[i].room_number)+1;
              }
            }



          db.query(`INSERT INTO user_chat VALUE(?,?,?,?,?)`,[post.user,post.code, temp, "사용자", "익명의 사용자"+temp],function(err,state){
            if(err){
              throw err;
            }
            console.log("3");
            db.query(`SELECT * FROM admin_list WHERE code=?`,[post.code],function(er2,ad_list){
              if(er2){
                throw er2;
              }
              console.log("4");
              for(var i = 0; i<ad_list.length; i++){

                db.query(`INSERT INTO user_chat VALUE(?,?,?,?,?)`,[ad_list[i].user_id ,post.code, temp, "관리자", ad_list[i].nickname],function(er,state2){
                  if(er){
                    throw er;
                  }
                });
                //***********
                let transporter = nodemailer.createTransport({
                  service: 'gmail',
                  auth: {
                    user: 'dachan9524@gmail.com',  // gmail 계정 아이디를 입력
                    pass: 'bkmjptvcdfcvnpqy'          // gmail 계정의 비밀번호를 입력
                  }
                });
                let mailOptions = {
                  from: 'service',    // 발송 메일 주소 (위에서 작성한 gmail 계정 아이디)
                  to: `${ad_list[i].user_id}` ,                     // 수신 메일 주소
                  subject: "새로운 사서함 알림 메일",   // 제목
                  text: `${"익명의 사용자"+temp}님이 사서함에 들어왔어요`  // 내용
                };

                transporter.sendMail(mailOptions, function(error, info){
                  if (error) {
                    console.log(error);
                  }
                  else {
                    console.log('Email sent: ' + info.response);
                  }
                });
                //*************
              }
              response.send({room_num:temp});
            });
        });
      });
    }else{
      response.send({room_num:alrd[0].room_num});
    }
  })
})

app.get('/plz_adminlist', function(request, response){
  var post = request.query;
  db.query(`SELECT user_id FROM admin_list WHERE code=?`,[post.code],function(error, admin){
    if(error){
      throw error;
    }
    response.send({admin:admin});
  })
})


app.get('/plz_adminchat', function(request, response){
  var post = request.query;
  db.query(`SELECT * FROM user_chat WHERE code=? AND state=?`,[post.code,"사용자"],function(error, list){
    if(error){
      throw error;
    }
    response.send({list:list});
  })
})

app.get('/my_state', function(request, response){
  var post = request.query;
  db.query(`SELECT DISTINCT state FROM user_chat WHERE code=? AND user_id=?`,[post.room,post.user],function(error, state){
    if(error){
      throw error;
    }
    if(state.length ===0){
      db.query(`SELECT DISTINCT state FROM admin_list WHERE code=? AND user_id=?`,[post.room,post.user],function(error, state2){
        if(error){
          throw error;
        }
        response.send({state:state2[0].state});
      });
    }else{
      response.send({state:state[0].state});
    }
  })
})


app.get('/insert_report',function(request,response){
  var post = request.query;
  db.query(`INSERT INTO report VALUE(?,?,?,?,?)`,[post.user,post.state,post.code ,post.room_num ,post.time],function(err,state){
    if(err){
      throw err;
    }
    //***********
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'dachan9524@gmail.com',  // gmail 계정 아이디를 입력
        pass: 'bkmjptvcdfcvnpqy'          // gmail 계정의 비밀번호를 입력
      }
    });
    let mailOptions = {
      from: 'service',    // 발송 메일 주소 (위에서 작성한 gmail 계정 아이디)
      to: `chn7894@handong.ac.kr` ,                     // 수신 메일 주소
      subject: "새로운 신 알림 메일",   // 제목
      text: `${post.user}님이 ${post.code}를 신고했어요`  // 내용
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      }
      else {
        console.log('Email sent: ' + info.response);
      }
    });
    //*************
    response.send({result:true});
  })
})

app.get('/del_report',function(request,response){
  var post = request.query;
  db.query(`DELETE FROM report WHERE code=? AND room_number=? AND user_id=?`,
    [post.code, post.room_num, post.user] ,function(err,state){
    if(err){
      throw err;
    }
    response.send({report:state});
  })
})




app.get('/plz_report',function(request,response){
  var post = request.query;
  db.query(`SELECT * FROM report ORDER BY time DESC`,function(err,state){
    if(err){
      throw err;
    }
    response.send({report:state});
  })
})


app.get('/open_id',function(request,response){
  var post = request.query;
  db.query(`INSERT INTO permission_report VALUE(?,?)`,[post.code, post.room_num],function(err,state){
    if(err){
      throw err;
    }
    response.send({report:state});
  })
})

app.get('/permission_state',function(request,response){
  var post = request.query;
  db.query(`SELECT * FROM permission_report WHERE code=? AND room_number=?`,[post.code, post.room_num],function(err,state){
    if(err){
      throw err;
    }
    var temp = "No";
    if(state.length!==0){
      temp = "Yes";
    }
    response.send({state:temp});
  })
})


/*
app.get("/nodemailerTest", function(request, response){
  var post = request.query;
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'dachan9524@gmail.com',  // gmail 계정 아이디를 입력
      pass: 'bkmjptvcdfcvnpqy'          // gmail 계정의 비밀번호를 입력
    }
  });
  let mailOptions = {
    from: 'dachan9524@gmail.com',    // 발송 메일 주소 (위에서 작성한 gmail 계정 아이디)
    to: 'chn7894@handong.ac.kr' ,                     // 수신 메일 주소
    subject: "안녕",   // 제목
    text: "반가워"  // 내용
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    }
    else {
      console.log('Email sent: ' + info.response);
    }
  });
  response.send({result:true});
})

*/

//-----------------------------------------------------------------------------
app.get('/*', function(request, response){
  response.sendFile(path.resolve(__dirname ,'message/public/','index.html'));
});

app.use((req, res) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // 특정 도메인 허용
});

app.listen(PORT, function () {
  console.log(`Example app listening on port ${PORT}!`);
});
