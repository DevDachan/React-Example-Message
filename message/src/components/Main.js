import React, {useState} from 'react';
import axios from 'axios';
import { useLocation, Link ,useNavigate, Redirect} from 'react-router-dom';

import "./Main.css"


function makeTable(localStorage,room_admin_list,room_user_list,user,navigate,setListstate){
  let body = [];
  //-------------- admin --------------------------------
  for(let i =0; i < room_admin_list.length; i++){
    body.push(
    <>
    <tr>
      <td><p id="td_user_state" style={{ marginTop: "20px",textDecoration: "none",width:"400px"}}> {room_admin_list[i].title}</p></td>
      <td><p id="td_user_state" style={{ marginTop: "20px",width:"70px"}}> 관리자 </p></td>
      <td> <button id="tb_enter_button" onClick={event=>{
              event.preventDefault();
              localStorage.setItem("room",room_admin_list[i].code );
              navigate({pathname: "/room_admin"});
      }}> 입장 </button></td>
      <td> <button id="td_delte" style={{marginTop: "20px",background:"#FF6464"}} onClick={event=>{
        axios.get('http://localhost:4000/del_room',{params:{code:room_admin_list[i].code,user:user, state:"관리자"}})
          .then(function(response){
              setListstate("NotUpdate");
            })
            .catch(function(error){
              console.log("실패");
        });
      }}> 삭제 </button></td>
    </tr></>);
  }

  //------------------ user --------------------------------
  for(let i =0; i < room_user_list.length; i++){
    body.push(
    <>
    <tr>
      <td><p id="td_user_state" style={{ marginTop: "20px",textDecoration: "none",width:"400px"}}> {room_user_list[i].title}</p></td>
      <td><p id="td_user_state" style={{ marginTop: "20px",width:"70px"}}> {room_user_list[i].state} </p></td>
      <td> <button id="tb_enter_button" onClick={event=>{
              event.preventDefault();
              localStorage.setItem("room",room_user_list[i].code );
              navigate({ pathname : "/room"}, {state:{room_num:room_user_list[i].room_number}});

      }}> 입장 </button></td>
      <td> <button id="td_delte" style={{marginTop: "20px",background:"#FF6464"}} onClick={event=>{

        axios.get('http://localhost:4000/del_room',{params:{code:room_user_list[i].code,user:user, state:room_user_list[i].state}})
          .then(function(response){
              setListstate("NotUpdate");

            })
            .catch(function(error){
              console.log("실패");
        });
      }}> 삭제 </button></td>
    </tr></>);
  }
  body =<><thead></thead> <tbody>{body}</tbody></>;
  return body;
}


function admin_list_temp(list){
  let body = [];
  for(let i =0; i<list.length; i++){
    body.push(<>
      <p> {list[i]}</p>
      </>
    );
  }
  return body;
}


function Main(){
  let sessionStorage = window.sessionStorage;
  let localStorage = window.localStorage;
  let navigate = useNavigate();

  let [state, setState] = useState("Main");
  let user = {email:sessionStorage.getItem("email"), name:sessionStorage.getItem("name")};
  let [room_admin_list, setListadmin] = useState([]);
  let [room_user_list, setListuser] = useState([]);
  let [room_state, setListstate] = useState("NotUpdate");
  let [cr_admin_list,setCreate_admin] = useState([]);

  if(room_state === "NotUpdate"){
    axios.get('http://localhost:4000/plz_room',{params:{user:user.email}})
      .then(function(response){
          setListadmin(response.data.adminlist);
          setListuser(response.data.userlist);
          setListstate("Update");
        })
        .catch(function(error){
          console.log("실패");
    });
  }

  let body = "";
  if(state === "Main"){
    body =
    <>
    <div style={{float:"left", marginRight:"100%", marginBottom:"30px",marginTop:"80px"}}>
    <form style={{width:"400px"}} onSubmit={event => {
      event.preventDefault();

      axios.get('http://localhost:4000/enter_room',{params:{user:user.email,code:event.target.code_ip.value}})
        .then(function(response){

            localStorage.setItem("room",event.target.code_ip.value );
            navigate({ pathname : "/room"},{state:{ room_num:response.data.room_num } });
          })
          .catch(function(error){
            console.log("실패");
      });



    }}>
      <input type="text" required id="code_ip" defaultValue ="" style={{width:"300px",marginRight:"10px"}} name="code" placeholder="ex)HQ1EGGW"></input>
      <input type="submit" name="code" id="OK" style={{width:"60px" ,height:"60px"}} value="OK"></input>
    </form>
    </div>



    <table id="room_list">
    {makeTable(localStorage,room_admin_list,room_user_list,user.email,navigate,setListstate)}
    </table >
    <div style={{floats:"right"}}>
    <button id="create_code" onClick={event => {
      setState("Create");

    }}>+ Create Code</button>  </div>
    </>;


  }
  //-------------------- Create room --------------------------
  else{

    let randomStr = Math.random().toString(36).substring(2, 10);
    body =<>
    <form method="post" style={{marginTop:"50px"}} onSubmit={event =>{
      event.preventDefault();

      axios.get('http://localhost:4000/create_room',{
        params:{code:event.target.rand_code.value, title:event.target.title.value, nickname:event.target.name.value, user:user.email, admin:cr_admin_list}})
        .then(function(response){
          setState("Main");

          setListstate("NotUpdate");
          navigate({pathname: "/main"});
        }).catch(function(error){
          console.log("실패");
        });
    }}>

        <div id="cr_temp" style={{paddingRight:"33px"}}>Code </div>

        <input type="text" required id="rand_code" defaultValue = {randomStr} style={{marginRight:"10px"}} disabled></input>

        <button id="rand_create" style={{fontSize:"18px",width:"110px",height:"50px"}} onClick={event =>{
          event.preventDefault();
          let text = document.getElementById("rand_code");
          let randomStr = Math.random().toString(36).substring(2, 10);
          text.value = randomStr;
        }}>코드 발급</button>

        <p></p>

        <div id="cr_temp" style={{paddingRight:"40px"}}>Title </div>
        <input type="text" required id="cr_title" name="title" style={{marginRight:"105px"}}></input>

        <p></p>
        <div id="cr_temp" style={{paddingRight:"15px"}}>Nickname</div>
        <input type="text" required id="cr_name" name="name" style={{marginRight:"140px"}}></input>

        <p></p>
        <div id="cr_temp" style={{paddingRight:"15px"}}>Admin</div>
        <input type="text" id="cr_admin" name="cr_admin" defaultValue=""></input>
        <button id="plus_admin" style={{width:"50px",height:"50px",marginLeft:"10px",marginRight:"40px"}} onClick={event=>{
          event.preventDefault();
          let va = document.getElementById("cr_admin");
          if(va.value !==""){
            if(cr_admin_list.indexOf("va.value") === -1){
              let newcr_admin_list = cr_admin_list;
              newcr_admin_list.push(va.value);
              va.value = "";
              setCreate_admin([...newcr_admin_list]);

            }else{
              alert("exist!!");
            }
          }
        }}> + </button>

        {admin_list_temp(cr_admin_list)}

        <p></p>
        <input type="submit" id="cr_submit" value="Create" style={{marginRight:"60px", width:"150px",height:"50px", marginTop:"50px"}}>
        </input>
    </form>
    <p style={{margin:"auto",  textAlign: "center"}}>
      <button id="cr_back" style={{marginRight:"60px", width:"150px",height:"50px", marginTop:"10px"}} onClick={() =>{
        setState("Main");
      }}>Back </button>
    </p>
    </>
  }

  return <>
  {body}
  <p></p>
  </>;
}




export default Main;
