import './App.css';
import React from 'react'
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Usluge from './components/Usluge';
import Pocetna from './components/Pocetna';
import Zaposleni from './components/Zaposleni';
import Kontakt from './components/Kontakt';
import TipUsluge from "./components/TipUsluge";
import Footer from './components/Footer';
import Korisnik from './components/Korisnik';
import Radnik from './components/Radnik';
import Admin from './components/Admin';
import Menadzer from './components/Menadzer';
import KorisnikZakazivanje from './components/KorisnikZakazivanje';
import KorisnikTermini from './components/KorisnikTermini';
import KorisnikRecenzije from './components/KorisnikRecenzije';
import RadnikTermini from './components/RadnikTermini';
import AdminRecenzije from './components/AdminRecenzije';
import AdminUsluge from './components/AdminUsluge';
import MenadzerDoprinos from './components/MenadzerDoprinos';
import MenadzerRadnici from './components/MenadzerRadnici';
import MenadzerStatistika from './components/MenadzerStatistika';
import IzmeniUsluga from './components/IzmeniUsluga';
import Protected from './context/Protected';
import axiosInstance from './components/AxiosInstance';
import { UserContextProvider } from './context/UserContext';
import { useUserContext } from './context/UserContext';
import { useEffect } from 'react';




function App() {

  const {logIn} =useUserContext();
  const {logOut}=useUserContext();
 
  
  useEffect(()=> {
    localStorage.getItem("jwToken") && (
      axiosInstance.get(`https://localhost:5001/Account/GetUser`)
      .then(res=>{
        console.log("app1")
        logIn(res.data[0].email, res.data[0].role);
      })
      .catch(err=>{
        if(err.response.status==401)
        {   
            logOut();
            //window.localStorage.removeItem("jwToken");
            //return <Navigate to="/" replace />;
        }
        
      })
  )
  },[])

  return (
    <Router>
    <div className="App">
     <Navbar />
     <Routes>
       <Route exact path='/Usluge' element={ <Usluge />}></Route>
       <Route exact path='/Pocetna' element={ <Pocetna />}></Route>
       <Route path="/" element={<Navigate replace to="/Pocetna" />}></Route>
       <Route exact path='/Zaposleni' element={ <Zaposleni />}></Route>
       <Route exact path='/Kontakt' element={ <Kontakt />}></Route>
       <Route exact path='/Admin' element={ <Protected role="Admin"> <Admin /> </Protected>}></Route>
       <Route exact path='/Korisnik' element={ <Protected role="Korisnik"> <Korisnik /></Protected> }></Route>
       <Route exact path='/Menadzer' element={ <Protected role="Menadzer"><Menadzer /></Protected>}></Route>
       <Route exact path='/Radnik' element={ <Protected role="Radnik"><Radnik /></Protected>}></Route>
       <Route exact path='/korisnikZakazivanje' element={<Protected role="Korisnik"> <KorisnikZakazivanje /></Protected>}></Route>
       <Route exact path='/KorisnikTermini' element={<Protected role="Korisnik"> <KorisnikTermini /></Protected>}></Route>
       <Route exact path='/KorisnikRecenzije' element={<Protected role="Korisnik"> <KorisnikRecenzije /></Protected>}></Route>
       <Route exact path='/RadnikTermini' element={<Protected role="Radnik"><RadnikTermini/></Protected>}></Route>
       <Route exact path='/AdminRecenzije' element={<Protected role="Admin"><AdminRecenzije/></Protected>}></Route>
       <Route exact path='/AdminUsluge' element={<Protected role="Admin"><AdminUsluge/></Protected>}></Route>
       <Route exact path='/MenadzerDoprinos' element={<Protected role="Menadzer"><MenadzerDoprinos/></Protected>}></Route>
       <Route exact path='/MenadzerRadnici' element={<Protected role="Menadzer"><MenadzerRadnici/></Protected>}></Route>
       <Route exact path='/MenadzerStatistika' element={<Protected role="Menadzer"><MenadzerStatistika/></Protected>}></Route>
       <Route exact path='/:naziv' element={<TipUsluge />} />   
       <Route exact path='/Izmeni/:naziv' element={<Protected role="Admin"><IzmeniUsluga /></Protected>} />  
     </Routes>
     <Footer />
    </div>
    </Router>

  );
}

export default App;


