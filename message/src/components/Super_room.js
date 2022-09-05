import React, {useState} from 'react';
import axios from 'axios';
import { useLocation, Link ,useNavigate} from 'react-router-dom';
import "./Room.css"


function makeTable(list,code,room_num,permission){
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


  return body;
}



function Super_room(props){
  let navigate = useNavigate();
  const location = useLocation();
  let localStorage = window.localStorage;
  let sessionStorage = window.sessionStorage;
  let [chat, setChat] = useState([{}]);
  let [permissionState, setPermission] = useState("No");
  let room_num = location.state.room_num;
  let user = {email:sessionStorage.getItem("email"), name:sessionStorage.getItem("name")};
  let room_name = localStorage.getItem("room_name");

  //if(state === "not"){
      axios.get('http://localhost:4000/plz_chat',{params:{room:localStorage.getItem("room"),room_num:room_num}})
        .then(function(response){
            setChat(response.data.chat_list);
            localStorage.setItem("room_name",response.data.room_name);
          })
          .catch(function(error){
            console.log("실패");
      });
  //}
  if(permissionState === "No"){
    axios.get('http://localhost:4000/permission_state',{params:{code:localStorage.getItem("room"),room_num:room_num}})
      .then(function(response){
          setPermission("yes");
          localStorage.setItem("permission",response.data.state);
        })
        .catch(function(error){
          console.log("실패");
    });
  }

  let permission_body = "";
  if(localStorage.getItem("permission")=== "Yes"){
    permission_body = "공개 완료된 사서함";
  }

  let permission_bt = "";
  if(localStorage.getItem("permission") === "Yes"){
    permission_bt =  <><button id="tb_enter_button" style={{width:"200px"}} >공개 완료</button></>;
  }else{
    permission_bt = <><button id="tb_enter_button" style={{width:"200px"}} onClick={event =>{
      axios.get('http://localhost:4000/open_id',{params:{code:localStorage.getItem("room"),room_num:room_num}})
        .then(function(response){
            setPermission("No")
            alert("ID 공개 완료!");
          })
          .catch(function(error){
            console.log("실패");
      });
    }}>ID 공개</button></>;
  }



  return(<>
      <h1>{localStorage.getItem("room_name")} </h1>
      <h1>{permission_body}</h1>
      <p></p>
      <table id="chat_list">
        {makeTable(chat,localStorage.getItem("room"),room_num,localStorage.getItem("permission"))}
      </table >

      {permission_bt}

      <p></p>
      <button id="tb_enter_button" style={{width:"200px"}} onClick={event =>{
        navigate({pathname: "/super_user"});
      }}>back</button>
      </>
    );


}



export default Super_room;
