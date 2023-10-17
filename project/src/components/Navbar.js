import React, {Component, useEffect, useRef} from 'react';
import {MenuItems} from './MenuItems';
import './Navbar.css';
import './Korisnik.css';
import { Login } from './Login';
import { Register } from './Register';
import {Link, Navigate} from 'react-router-dom';
import { useState } from "react";
import { useUserContext } from '../context/UserContext';
import { useNavigate,useLocation } from 'react-router-dom';
import axiosInstance from './AxiosInstance';
import {MenuItemsKorisnik} from './MenuItemsKorisnik';
import { MenuItemsAdmin } from './MenuItemsAdmin';
import { MenuItemsMenadzer } from './MenuItemsMenadzer';
import { MenuItemsRadnik } from './MenuItemsRadnik';
import DropDownMenu from './DropDownMenu';
import NotifikacijaKartica from './NotifikacijaKartica';
import DropDownNotif from './DropDownNotif';
import "./DropDownNotif.css";

function Navbar() {

    const navigate = useNavigate();
    
    const [state, setState] = useState({clicked:false});
    const [ime, setIme] = useState("");
    const [meni, setMeni] = useState(false);
    const [pritisnuto,setPritisnuto]=useState(false);
    const [notifikacije,setNotifikacije]=useState([]);
    const [items,setItems]=useState(MenuItems);

    const {logOut}=useUserContext();
    const {uloga,jePosetilac,loading}=useUserContext();
    const {connection}=useUserContext();
    const {email}=useUserContext();
    
    const location=useLocation();
  
  /////notif
      const latestChat = useRef(null);
  
      latestChat.current = notifikacije;
      
          if (connection) {
                      connection.on("SendMessageToAll", (id,idter,opis,datumNot,tip) => {
                        const prop=
                        {
                          id,
                          idter,
                          opis,
                          datumNot,
                          tip
                        };
                       
                        const updatedChat = [...latestChat.current];
                        updatedChat.unshift(prop);
                        setNotifikacije(updatedChat);
                        
                      })
                      
                   
          }
  
  
    useEffect(()=> {
      axiosInstance.get(`https://localhost:5001/Notifikacija/VratiNotifikacije`)
      .then(res => {
        setNotifikacije(res.data);
      })
      .catch(err => {
        console.log(err);
      })
    })
  

    
    useEffect(()=> {
      uloga==="" && setItems(MenuItems);
      uloga==="Korisnik" && setItems(MenuItemsKorisnik);
      uloga==="Radnik" && setItems(MenuItemsRadnik);
      uloga==="Admin" && setItems(MenuItemsAdmin);
      uloga==="Menadzer" && setItems(MenuItemsMenadzer);

      axiosInstance.get(`https://localhost:5001/Account/GetUser`)
      .then(res=>{
        if(uloga==="Admin")
        {
          setIme("Admin");
          setMeni(false);
        }
        else{
          setIme(res.data[0].ime);
          setMeni(false);
        }
        
      })
      .catch(err=>{
        console.log(err)
        if(err.response.status==401 || err.response.status==403)
        {   
            logOut();
        }

      })
      
    },[uloga])

    const filterNotif =(id)=>
    {
      setNotifikacije(notifikacije.filter((not) => not.id !== id))
    }

    const deleteNot = async (id) => {
      axiosInstance.delete(`https://localhost:5001/Notifikacija/ObrisiNotifikaciju/${id}`)
      .then(res => {
        setNotifikacije(notifikacije.filter((not) => not.id !== id))
      })
      .catch(err => {
        if(err.response.status==401 || err.response.status==403)
        {   
            logOut();
        }
      })
    }

    function toggleMeni() {
      setMeni(!meni);
      setPritisnuto(false);
      console.log(uloga)
    }

    function togglePritisnuto()
    {
      setMeni(false);
      setPritisnuto(!pritisnuto);
    }

    function vratiUlogu(){
      axiosInstance.get(`https://localhost:5001/Account/GetUser`)
      .then(res=>{
        navigate(`/${res.data[0].role}`)
      })
      .catch(err=>{
        console.log(err)
        if(err.response.status==401 || err.response.status==403)
        {   
            logOut();
        }

      })
    }

    function ucit(url){ 
       navigate(url);
       if(`/${url}`===location.pathname){
        window.location.reload(false);
       }
       handleClick();
    }

    function odjava(){ 
      if(connection && localStorage.getItem("jwToken"))
      {
        axiosInstance.get(`https://localhost:5001/Termin/VratiPogodnijeTermineKorisnika`).then(res=>
        {
          res.data.map(pogter=>
            {
              if(connection)
              {
                    connection.invoke('RemoveFromGroup',pogter.id.toString());
              }
              else
              {
                  //console.log("nije");
              }
            })
            connection.invoke('RemoveFromGroup',email);
        }).catch(er=>
          {
            logOut();
            //window.localStorage.removeItem("jwToken");
            //navigate("/Pocetna");
          })
      }
      logOut();
      //window.localStorage.removeItem("jwToken");
      //navigate("/Pocetna");
   }

   const handleClick=()=>{
    setState({clicked:!state.clicked})
  }

   const handleProfileClick = () => {
     vratiUlogu();
  };

  const handleLogoutClick = () => {
    odjava();
  };

    const veliko=(string)=>{
      return string ? string.charAt(0).toUpperCase() + string.slice(1) : '';
    }

    if(loading)
    {
        return ;
    }
  return (
    <nav className='NavbarItems'>
            <div className='BaseNavbarItems'>
            <img className="navbar-logo" src="../BH.png"/>
            <div className='menu-icon' onClick={handleClick}>
                <i className={state.clicked ? 'fas fa-times':'fas fa-bars'}></i>
            </div>
            <ul className={state.clicked ? 'nav-menu active' : 'nav-menu'}>
                {items.map((item,index)=>{
                    return (
                        <li key={index}>
                            <Link to={item.url} onClick={()=>{ucit(item.url)}} className={item.cName}>{item.title}</Link>
                        </li>
                    )
                })}
            </ul>
            </div>

            { !jePosetilac ? (
                <>
                {uloga==="Korisnik" ? (
                <div className='NavbarItemsNotifIIme'>
                
                <div className='notifBtn'>
                  <button type="button" className="icon-button" onClick={()=>{togglePritisnuto()}}>
                    <i className="fa-solid fa-bell fa-2x"></i>
                    {
                      notifikacije.length>0 && !pritisnuto &&
                      <div className="icon-button__badge">{notifikacije.length}</div>
                    }
                  </button>
                  { pritisnuto &&
                    (<DropDownNotif propNotifikacije={notifikacije} onDelete={deleteNot} onFilter={filterNotif}></DropDownNotif>)
                  }
                </div>

                <button className="ulogovan"  onClick={()=> toggleMeni()} >
                  <div className="ulogovanIme">{veliko(ime)}</div>
                  {
                    meni ? ( <i className="fa fa-caret-up strelica" aria-hidden="true"></i> ):(  <i className="fa fa-caret-down strelica" aria-hidden="true"></i> )
                  }
                </button>
                {
                          meni && 
                            
                              (
                                <DropDownMenu propuloga={uloga} handleProfileClick={handleProfileClick}
                                handleLogoutClick={handleLogoutClick}
                                />
                              )
                }
                </div>
                ) : (<>

                <div className='NavbarItemsIme'>

                <button className="ulogovan"  onClick={()=> toggleMeni()} >
                  <div className="ulogovanIme">{veliko(ime)}</div>
                  {
                    meni ? ( <i className="fa fa-caret-up strelica" aria-hidden="true"></i> ):(  <i className="fa fa-caret-down strelica" aria-hidden="true"></i> )
                  }
                </button>
                {
                          meni && 
                            
                              (
                                <DropDownMenu propuloga={uloga} handleProfileClick={handleProfileClick}
                                handleLogoutClick={handleLogoutClick}
                                />
                              )
                }
                </div>
                
                </>)}
                </>
              ) : (
                <div className='NavbarPrijavaBtns'>
                <Login>PRIJAVA</Login>
                <Register>REGISTRACIJA</Register>
                </div>
              )}
        </nav>
  )
}
export default Navbar