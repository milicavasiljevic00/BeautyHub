import React, { useEffect } from 'react';
import { useState } from 'react';
import './Button.css';
import './LoginForm.css';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import { useUserContext } from '../context/UserContext';
import axiosInstance from './AxiosInstance';

const STYLES = [
  'btnn--primary',
  'btnn--outline'
]
const SIZES = [
  'btnn--medium',
  'btnn--large'
]
export const Login = ({
  children,
  type,
  onClick,
  buttonStyle,
  buttonSize
}) => {
    const [forma, setForma] = useState(false);
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const navigate=useNavigate();

    const {user, logIn}=useUserContext();

  const toggleForma = () => {
    setForma(!forma);
  };

  const logovanje = () => {
    email!=="" && password!=="" ? (
    axios.post(`https://localhost:5001/Account/Login/${email}/${password}`)
    .then((response)=>{
      localStorage.setItem("jwToken",response.data.token);
      logIn(email, response.data.data);    
      setForma(!forma);
      navigate(`/Pocetna`);
    })
    .catch(err=>{
      alert(err.response.data)
    })
    ) : alert("Niste popunili sva polja!")
  }

  if(forma) {
    document.body.classList.add('active-modal')
  } else {
    document.body.classList.remove('active-modal')
  }
  

  const checkButtonStyle = STYLES.includes(buttonStyle) ? buttonStyle : STYLES[0]
  const checkButtonSize = SIZES.includes(buttonSize) ? buttonSize : SIZES[0]

  return(
      <>
    <button className='PrijavaRegistracijaBtn' onClick={toggleForma}
    type={type}>
      {children}
    </button>
     {forma && (
        <div className="modal">
          <div className="overlay"></div>
          <div className="login_modal-content">
            
            <i className="fa-solid fa-x close-modal " onClick={toggleForma}></i>

            <i className="fa-solid fa-circle-user fa-6x"></i>
            <br/>
            <div className='login_red'>
              <label className='login_labelaForma'>E-mail:</label>
              <input className='login_inputTekst' type='text' placeholder=' E-mail' onChange={(e)=>setEmail(e.target.value)}></input>
            </div>

            <div className='login_red'>
              <label className='login_labelaForma'>Lozinka:</label>
              <input className='login_inputTekst' type='password' placeholder=' Lozinka' onChange={(e)=>setPassword(e.target.value)}></input>
            </div>
            <button className="btnRegistracija" onClick={logovanje}>
              Prijavi se
            </button>

          </div>
        </div>
      )}
      </>
  )

}