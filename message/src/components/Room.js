import React, {useState} from 'react';
import axios from 'axios';
import { useLocation, Link ,useNavigate} from 'react-router-dom';
import "./Room.css"


function makeTable(list, user, setState, code, room_num,permission){
  let body = [];
  let temp = 10-list.length;
  let temp2 = 0;
  if(temp < 0){
    temp2 = list.length - 10;
  }
  for(let i =0; i < 10-list.length; i++){
    body.push(<tr>
      <td><p id="empty_chat"></p></td>
      <td><p id="empty_chat"></p></td>
      <td><p id="empty_chat"></p></td>
    </tr>);
  }
  if(permission === "No"){
    for(let i = temp2; i < list.length; i++){
      if(list[i].state ==="관리자"){
        body.push(
          <> <tr>
            <td>
            <p id="ch_nick">{list[i].nickname}</p>
            <p id="td_user_state" style={{fontSize:"15px"}}> {list[i].content}</p></td>
            <td><p id="empty_chat"></p></td>
          </tr> </>
        );
      }
      else{
        body.push(
          <><tr>
              <td><p id="empty_chat"></p></td>
              <td><p id="empty_chat"></p></td>
              <td>
              <p id="ch_nick">{list[i].nickname}</p>
              <p id="td_user_state" style={{fontSize:"15px"}}> {list[i].content}</p>
              </td>

          </tr></>
        );
      }
    }
  }else{
    for(let i = temp2; i < list.length; i++){
      if(list[i].state ==="관리자"){
        body.push(
          <> <tr>
            <td>
            <p id="ch_nick">{list[i].user_id}</p>
            <p id="td_user_state" style={{fontSize:"15px"}}> {list[i].content}</p></td>
            <td><p id="empty_chat"></p></td>
          </tr> </>
        );
      }
      else{
        body.push(
          <><tr>
              <td><p id="empty_chat"></p></td>
              <td><p id="empty_chat"></p></td>
              <td>
              <p id="ch_nick">{list[i].user_id}</p>
              <p id="td_user_state" style={{fontSize:"15px"}}> {list[i].content}</p>
              </td>

          </tr></>
        );
      }
    }
  }


  body.push(<>
    <tr>
      <td style={{padding:"0px",paddingLeft:"5px"}} colSpan="4">
        <form style={{marginBottom:"10px"}} onSubmit={event=> {
          event.preventDefault();
          let today = new Date();
          let time = today.toLocaleString();
          axios.get('http://localhost:4000/insert_chat',
          {params:{user:user ,code:code ,room_num:room_num ,content:event.target.ch_input.value, time:time }})
            .then(function(response){
              event.target.ch_input.value = "";
              setState("not");
              })
              .catch(function(error){
                console.log("실패");
          });
        }}>
        <input type="text" required style={{marginRight:"5px"}} name="ch_input" id="ch_input"></input>
        <input type="submit" id="ch_submit" value="보내기"></input>
        </form>
      </td>
    </tr>
    </>);

  return body;
}



function Room(props){
  let navigate = useNavigate();
  const location = useLocation();
  let localStorage = window.localStorage;
  let sessionStorage = window.sessionStorage;
  let [chat, setChat] = useState([{}]);

  let [state, setState] = useState("not");
  let [userState, setUserstate] = useState("??");
  let [openState, setOpen] = useState("No");

  let room_num = location.state.room_num;
  let user = {email:sessionStorage.getItem("email"), name:sessionStorage.getItem("name")};
  let room_name = localStorage.getItem("room_name");

  if(openState === "No"){
    axios.get('http://localhost:4000/permission_state',{params:{code:localStorage.getItem("room"), room_num:room_num}})
      .then(function(response){
        localStorage.setItem("permission",response.data.state);
        setOpen("yes");
        })
        .catch(function(error){
          console.log("실패");
    });
  }

  if(userState === "??"){
    axios.get('http://localhost:4000/my_state',{params:{room:localStorage.getItem("room"), user:user.email}})
      .then(function(response){
        setUserstate(response.data.state);
        })
        .catch(function(error){
          console.log("실패");
    });
  }
  console.log(localStorage.getItem("permission"),"per");
  //if(state === "not"){
      axios.get('http://localhost:4000/plz_chat',{params:{room:localStorage.getItem("room"),user:user.email,room_num:room_num}})
        .then(function(response){
            setChat(response.data.chat_list);
            localStorage.setItem("room_name",response.data.room_name);
            setState("ok");
          })
          .catch(function(error){
            console.log("실패");
      });
  //}
  let permission_body = "";
  if(localStorage.getItem("permission")=== "Yes"){
    permission_body = "신고가 접수되어 ID를 공개합니다";
  }

  let report_bt = "";
  if(localStorage.getItem("permission") === "No"){
    report_bt = <><button id="tb_enter_button" style={{width:"200px"}} onClick={event =>{
      event.preventDefault();
      let today = new Date();
      let time = today.toLocaleString();
      axios.get('http://localhost:4000/insert_report',{params:{code:localStorage.getItem("room"),state:userState,time:time,user:user.email,room_num:room_num}})
        .then(function(response){
            alert("신고 완료!! 빠른 시일내에 조치를 취하겠습니다.");
            navigate({pathname: "/main"});
          })
          .catch(function(error){
            console.log("실패");
      });
    }}>신고하기</button></>;
  }else{
    report_bt = <><button id="tb_enter_button" style={{width:"200px"}} onClick={event =>{
      event.preventDefault();
      alert("이미 신고가 완료 되었습니다!");
    }}>신고 완료</button></>;
  }
  return(<>
      <h1>{localStorage.getItem("room_name")} </h1>
      <h1>{permission_body}</h1>
      <p></p>
      <table id="chat_list">
        {makeTable(chat, user.email, setState, localStorage.getItem("room"), room_num, localStorage.getItem("permission"))}
      </table >
      {report_bt}
      <p></p>
      <button id="tb_enter_button" style={{width:"200px"}} onClick={event =>{
        navigate({pathname: "/main"});
      }}>back</button>
      </>
    );


}



export default Room;
