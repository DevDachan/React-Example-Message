import React, {useState} from 'react';
import "./Login.css";
import {GoogleLogin} from 'react-google-login'
import { useNavigate } from 'react-router-dom';

import axios from 'axios';

function Login(){
  const clientId = "337975360045-15ib1u3k0v2degke7prdn6g6busq0276.apps.googleusercontent.com";
  let sessionStorage = window.sessionStorage;
  let localStorage = window.localStorage;
  localStorage.clear();
  sessionStorage.clear();
  localStorage.setItem("state", "logout");
  let navigate = useNavigate();

  let [mode, setMode] = useState("Google");
  let [super_state, setData] = useState();
  let super_check_HTML = "";


  //----------------- Google login ----------------------------------
  async function onSussess(res){
    const profile = res.getBasicProfile();

    const userdata = {
      email: profile.getEmail(),
      name: profile.getName(),
    };
      sessionStorage.setItem("email", userdata.email);
      sessionStorage.setItem("name", userdata.name);
      localStorage.setItem("state", "login");
      navigate({ pathname : "/main"} );
  }
  const onFailure = (res) => {
   alert("구글 로그인에 실패하였습니다");
  };
  //---------------------------------------------------------------
  let login_mode_HTML = "";
  if(mode ==="Google"){
    login_mode_HTML = <><GoogleLogin
    className="google-button"
    clientId={clientId}
    buttonText="Login with Google" // 버튼에 뜨는 텍스트
    onSuccess={onSussess}
    onFailure={onFailure}
    cookiePolicy={"single_host_origin"}
    />
    <p>
    <button id="super_login" onClick={()=>{
      setMode("Super");
    }
    }> Super login</button></p></>
    ;
  }
  else{
    login_mode_HTML = <>
      <form onSubmit={event=>{
        let newSuper = {id:event.target.id.value, pwd:event.target.pwd.value};
        axios.get('http://localhost:4000/login',{params:{id:event.target.id.value, pwd:event.target.pwd.value,temp:"temp"}})
          .then(function(response){
            if(response.data.result){
              sessionStorage.setItem("super_id",newSuper.id);

              sessionStorage.setItem("email", newSuper.id);
              sessionStorage.setItem("name", newSuper.pwd);
              localStorage.setItem("state", "login");
              if(newSuper.id === "super"){
                navigate({ pathname : "/super_user"} );
              }else{
                navigate({ pathname : "/main"} );
              }

            }
            setData(response.data.result);
          }).catch(function(error){
            console.log("실패");
          });
        setMode("Google");
    }
    }>
      <p> ID <input type="text" name="id" placeholder="ID"></input> </p>
      <p> Password <input type="password" name="pwd" placeholder="*****" style={{ marginRight:"50px"}}></input> </p>
      <p> <input type="submit" id="login_bt" value="Login"></input></p>
    </form>
    <button id="back_bt" style={{background:"#FF6464"}} onClick={()=>{
      setMode("Google");
    }}> Back </button>
    </>
    ;
  }
  if(localStorage.getItem("super_id") !== "" && localStorage.getItem("super_id") !== null){
    super_check_HTML = <>
    <div id="super_HTML">
    <p>Hello super user</p>
    <p>*** {localStorage.getItem("super_id")} ***</p>
    </div>
    </>;
  }

  return <>
        <p id="Title">
          Login page</p>

        {super_check_HTML}
          <div id="google_login">
            {login_mode_HTML}
          </div>
        </>;
/*        <div id="home">
        <p>
        <button id="gotohome" onClick={() =>
          navigate({ pathname : "/main"} )}>  Home </button>
          </p>
        </div>*/
}

export default Login;
