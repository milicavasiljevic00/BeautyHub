import { createContext, useContext, useState } from "react";
import axiosInstance from "../components/AxiosInstance";
import { useEffect } from "react";
import { useRef } from "react";
import { HubConnectionBuilder } from '@microsoft/signalr';
import {Link, Navigate} from 'react-router-dom';


export const userContext = createContext({
  //email:"",
  uloga:"",
 // jePosetilac: true,
 // logIn: () => {},
  //logOut: () => {},
  //connection: null,
  
});

export function UserContextProvider({ children }) {

  const [email, setEmail] = useState("");
  const [uloga,setUloga]=useState("");
  const [jePosetilac,setJePosetilac]=useState(true);
  const[loading, setLoading]=useState(true);

  const [ connection, setConnection ] = useState(null);
  
    useEffect(()=>{
      if(connection && localStorage.getItem("jwToken"))
            {
              connection.start().then(p=>
                {
                  fja();
                  
                });
              
            }    
    },[connection])

  function fja(){
    if(connection && localStorage.getItem("jwToken"))
    {
      axiosInstance.get(`https://localhost:5001/Termin/VratiPogodnijeTermineKorisnika`).then(res=>
      {
        res.data.map(pogter=>
          {

            connection.invoke('JoinGroup',pogter.id.toString());
            
          });
      })
      axiosInstance.get(`https://localhost:5001/Account/GetUser`).then(res=>
      {
          connection.invoke('JoinGroup',res.data[0].email);
          
      })
    }
  }


  useEffect(()=> {
      axiosInstance.get(`https://localhost:5001/Account/GetUser`)
      .then(res=>{
          setUloga(res.data[0].role);
          setEmail(res.data[0].email);
          setJePosetilac(false);
          setLoading(false);
          
      })
      .catch(err=>{
        setLoading(false);
      })
  

  },[])

    function logIn(email, uloga) {
        setEmail(email);
        setUloga(uloga);
        setJePosetilac(false);
        const newConnection = new HubConnectionBuilder()
              .withUrl('https://localhost:5001/hubs/notif')
              .withAutomaticReconnect()
              .build();

              setConnection(newConnection);
              
    }

  function logOut() {
    setEmail("");
    setUloga("");
    setJePosetilac(true);
    window.localStorage.removeItem("jwToken");
    return <Navigate to="/" replace />;
  }

  return (
    <userContext.Provider value={{ email, uloga, jePosetilac, logIn, logOut, connection,loading }}>
      {children}
    </userContext.Provider>
  );
}

export function useUserContext() {
  const { email, uloga, jePosetilac, logIn, logOut, connection } = useContext(userContext);

  return useContext(userContext);
}