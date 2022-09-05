import React , {useEffect , useState} from 'react';
import axios from 'axios';
import { useNavigate} from 'react-router-dom';

function Main(){

  let sessionStorage = window.sessionStorage;
  let user = {email:sessionStorage.getItem("email"), name:sessionStorage.getItem("name")};
  let navigate = useNavigate();
  let body = "";
  if(localStorage.getItem("state") === "login"){
    body = <><form style={{marginTop:"10px",marginBottom:"50px"}} onSubmit={event =>{
      event.preventDefault();
      sessionStorage.setItem("email","");
      sessionStorage.setItem("name","");

      localStorage.setItem("super_id",""); 
      localStorage.setItem("super_pwd","");
      localStorage.setItem("state", "logout");
      navigate({pathname:"/"});
    }}>
      <input style={{float:"right", marginLeft:"5px"}} type="submit" value="logout"></input>
      <div style={{float:"right",display:"inline"}}>{user.name} | {user.email}</div>
    </form></>;
  }else{
    body = "";
  }
  return <>
  <h1 style={{fontSize: "50px",width:"500px",borderRadius: "15px", color:"#D2E1FF",
  border:"5px solid #D2E1FF",margin:"auto"}}> 사서함 서비스</h1>
  {body}
  </>;
}

export default Main;
