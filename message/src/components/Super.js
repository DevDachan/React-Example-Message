import React, {useState} from 'react';
import axios from 'axios';
import { useLocation, Link ,useNavigate, Redirect} from 'react-router-dom';

import "./Main.css"


function makeTable(localStorage,room_admin_list,user,navigate,setListstate){
  let body = [];
  //-------------- admin --------------------------------
  for(let i =0; i < room_admin_list.length; i++){
    body.push(
    <>
    <tr>
      <td><p id="td_user_state" style={{ marginTop: "20px",textDecoration: "none",width:"400px"}}> {room_admin_list[i].title}</p></td>
      <td> <button id="tb_enter_button" onClick={event=>{
              event.preventDefault();
              localStorage.setItem("room",room_admin_list[i].code );
              navigate({pathname: "/super_admin"});
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

  body =<><thead></thead> <tbody>{body}</tbody></>;
  return body;
}


function report_table(report_list,user,navigate,setReport){
  let body = [];

  //-------------- admin --------------------------------
  for(let i =0; i < report_list.length; i++){
    body.push(
    <>
    <tr>
      <td><p id="td_user_state" style={{ marginTop: "20px",textDecoration: "none",width:"200px"}}> {report_list[i].user_id}</p></td>
      <td><p id="td_user_state" style={{ marginTop: "20px",textDecoration: "none",width:"70px"}}> {report_list[i].code}</p></td>
      <td><p id="td_user_state" style={{ marginTop: "20px",textDecoration: "none",width:"50px"}}> {report_list[i].room_number}</p></td>
      <td><p id="td_user_state" style={{ marginTop: "20px",textDecoration: "none",width:"300px"}}> {report_list[i].time}</p></td>
      <td> <button id="tb_enter_button" onClick={event=>{
              event.preventDefault();
              localStorage.setItem("room",report_list[i].code );
              navigate({pathname: "/super_room"},{state:{room_num:report_list[i].room_number}});
      }}> 입장 </button></td>
      <td> <button id="td_delte" style={{marginTop: "20px",background:"#FF6464"}} onClick={event=>{
        axios.get('http://localhost:4000/del_report',{params:{code:report_list[i].code,room_num:report_list[i].room_number,user:report_list[i].user_id}})
          .then(function(response){
              setReport("Not");

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





function Super(){
  let sessionStorage = window.sessionStorage;
  let localStorage = window.localStorage;
  let navigate = useNavigate();

  let [state, setState] = useState("Main");
  let user = {email:sessionStorage.getItem("email"), name:sessionStorage.getItem("name")};
  let [room_admin_list, setListadmin] = useState([]);
  let [room_state, setListstate] = useState("NotUpdate");
  let [report_state, setReport] = useState("Not");
  let [report_list, setListreport] = useState([]);

  if(room_state === "NotUpdate"){
    axios.get('http://localhost:4000/plz_room',{params:{user:user.email}})
      .then(function(response){
          setListadmin(response.data.adminlist);
          setListstate("Update");
        })
        .catch(function(error){
          console.log("실패");
    });
  }

  if(report_state === "Not"){
    axios.get('http://localhost:4000/plz_report')
      .then(function(response){
          setListreport(response.data.report);
          setReport("Update");
        })
        .catch(function(error){
          console.log("실패");
    });
  }

  let body =
    <>
    <table id="room_list">
    {makeTable(localStorage,room_admin_list,user.email,navigate,setListstate)}
    </table >
    <h2 style={{margin:"auto", textAlign:"center"}}> 신고 목록 </h2>
    <table id="room_list">
    {report_table(report_list,user.email,navigate,setReport)}
    </table >
    </>;

  //-------------------- Create room --------------------------

  return <>
  {body}
  <p></p>
  </>;
}




export default Super;
