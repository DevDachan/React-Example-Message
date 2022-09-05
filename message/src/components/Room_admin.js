import React, {useState} from 'react';
import axios from 'axios';
import { useLocation, Link ,useNavigate} from 'react-router-dom';
import "./Room_admin.css"


function makeTable(list,code,user,navigate){
  let body = [];
  if(list.length === 0){
    body.push(<>
      <thead>
        <tr>
        <th colSpan="2" style={{fontSize:"20px", fontWeight: "bold",width:"400px",height:"100px"}}>사서함이 비어 있습니다</th>
        </tr>
      </thead>
      </>);
  }
  let temp = [];
  for(let i =0; i < list.length; i++){
    temp.push(
    <>
    <tr>
      <td><p id="td_user_state" style={{marginTop: "20px",width:"150px"}}> {list[i].nickname} </p></td>
      <td> <button id="tb_enter_button" onClick={event=>{
            navigate({pathname: "/room"}, {state:{room_num:list[i].room_number} });
      }}> 입장 </button></td>

      <td> <button id="td_delte" style={{marginTop: "20px",background:"#FF6464"}} onClick={event=>{
        axios.get('http://localhost:4000/del_chat',{params:{code:list[i].code ,user:user, room_num:list[i].room_number}})
          .then(function(response){
              navigate({pathname: "/room_admin"}, {params:{code:list[i].code}});
            })
            .catch(function(error){
              console.log("실패");
        });
      }}> 삭제 </button></td>

    </tr></>);
  }

  body = <>{body} <tbody> {temp}</tbody></>;
  return body;
}

function admin_print(admin_list){
  let body =[];
  for(let i =0; i < admin_list.length; i++){
    body.push(
      <tr>
        <td><p id="td_user_state" style={{ width:"300px",marginTop: "20px"}}> {admin_list[i].user_id} </p></td>
      </tr>
    );
  }
  body = <><tbody> {body} </tbody></>
  return body;
}


function Room_admin(){
  let navigate = useNavigate();
  let sessionStorage = window.sessionStorage;
  let localStorage = window.localStorage;

  let [state, setState] = useState("Not");
  let [list, setList] = useState([{}]);
  let user = {email:sessionStorage.getItem("email"), name:sessionStorage.getItem("name")};
  let [admin, setAdmin] = useState([{}]);
  let [adminst, setAdminst] = useState("not");
  let [setadmin, setAdminset] = useState("not");
  if(state === "Not"){
    axios.get('http://localhost:4000/plz_adminchat',
    {params:{code:localStorage.getItem("room")}})
      .then(function(response){
        setList(response.data.list);
        setState("yes");
        })
        .catch(function(error){
          console.log("실패");
    });
  }
  if(adminst === 'not'){
    axios.get('http://localhost:4000/plz_adminlist',
    {params:{code:localStorage.getItem("room")}})
      .then(function(response){
        setAdmin(response.data.admin);
        setAdminst("yes");
        })
        .catch(function(error){
          console.log("실패");
    });
  }
  let body ='';
  console.log(setadmin,"hehr");
  if(setadmin ==="not"){
    body = <>
    <div id="grid">
    <div>
    <p id="td_user_state" style={{width:"100px",paddingBottom:"20px", borderBottom:"0px",borderRadius:"30px 30px 0px 0px ",background:"#ECF1FF",marginTop: "20px",marginBottom:"0px"}}> 사서함 list </p>
    <table id="chat_list" style={{marginTop:"0px"}} >
    {makeTable(list,localStorage.getItem("room"),user.email,navigate)}
    </table>
    </div>
    <div>
    <p id="td_user_state" style={{width:"100px",paddingBottom:"20px", borderBottom:"0px",borderRadius:"30px 30px 0px 0px ",background:"#ECF1FF",marginTop: "20px",marginBottom:"0px",marginRight:"100px"}}> 관리자 list </p>

    <table id="chat_list" style={{marginLeft:"50px",marginTop:"0px"}}>
    {admin_print(admin)}
    </table>
    </div>

    <div id="bt_list">
    <p style={{margin:"auto"}}>
    <button id="tb_enter_button" style={{marginTop:"30px",width:"200px"}} onClick={event =>{
      setAdminset("ok");
    }}>관리자 추가하기</button>
      </p>
      <p style={{margin:"auto"}}>
      <button id="tb_enter_button" style={{marginTop:"30px",width:"200px"}} onClick={event =>{
        navigate({pathname: "/main"});
      }}>back</button>
        </p>
    </div>
    </div>
    </>
  }else{
    body = <>
      <form id="insert_admin" onSubmit={event=>{
        event.preventDefault();
        axios.get('http://localhost:4000/insert_admin',
        {params:{code:localStorage.getItem("room"), admin_id:event.target.admin_id.value}})
          .then(function(response){
            if(response.data.result === true){
              setAdminset("not");
              setAdminst("not");
            }
            else{
              alert("이미 존재하는 사용자 입니다!");
              setAdminset("not");
              setAdminst("not");
            }
            })
            .catch(function(error){
              console.log("실패");
        });
      }}>
        <input type="text" id="admin_id"></input>
        <input type="submit" id="tb_enter_button" style={{marginTop:"30px",width:"200px"}} value="추가하기"></input>
      </form>
    </>
  }

  return(
  <>
  <h1>관리자 사서함 목록</h1>
  <h3 id="room_code"> Room code : [ {localStorage.getItem("room")} ]</h3>
  {body}

  </>
  );


}



export default Room_admin;
