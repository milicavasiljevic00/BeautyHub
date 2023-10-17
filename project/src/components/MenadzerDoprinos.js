import React, {useState, useEffect } from "react";
import Chart from "react-apexcharts";
import axiosInstance from "./AxiosInstance";
import "./MenadzerDoprinos.css";
import { useUserContext } from '../context/UserContext';

const MenadzerDoprinos = () => {
  const [tipovi,setTipovi]=useState([]);
  const [tip,setTip]=useState(0);
  const [radio,setRadio]=useState(0);
  const [radnici1,setRadnici1]=useState([]);
  const [brojevi1,setBrojevi1]=useState([]);
  const {logOut}=useUserContext();

  useEffect(()=> {
    axiosInstance.get('https://localhost:5001/Usluga/PreuzmiTipoveUsluga')
    .then(res=>{
      setTipovi(res.data)
    })
    .catch(err=>{
      console.log(err)
    })

  },[])

  function veliko(string){
    return string.charAt(0).toUpperCase()+string.slice(1);
  }

  function pokupiPodatke(){
    const radnici=[];
    const brojevi=[];
  
    tip&&radio? (
      axiosInstance.get(`https://localhost:5001/Statistika/PregledDoprinosaZaposlenih/${tip}/${radio}`)
      .then(res=>{
        res.data.map((el)=>{
          radnici.push(el.ime);
          brojevi.push(el.broj);
        })
        setRadnici1(radnici);
        setBrojevi1(brojevi);

      })
      .catch(err=>{
        console.log(err)
        if(err.response.status==401 || err.response.status==403)
        {   
            logOut();
        }
      })
    ):
    alert('Niste popunili sva polja!')
}

  return (
    <React.Fragment>
      <>
      <div className='zaposleni_zaglavlje'>
        <h1 className='zaposleniNaslov'>Pregled pojedinačnih doprinosa zaposlenih</h1>
     </div>
    <div className='glavni-zaposleni'>
          <div className='pretragaDoprinosi'>
              <div className='deo-pretrageDoprinosi'>
                <div className="tipUslDiv">
                  <h4 className='divTekst'>Tip usluge</h4>
                  <select className='menadzer_doprinos_select' name='radnik' type="text" onChange={e => setTip(e.target.value)}>
                  <option value='0' selected disabled hidden></option>
                    {
                      tipovi.map((tip) => 
                        <option key={tip.id} value={tip.naziv}>{veliko(tip.naziv)}</option>
                      )
                    }
                  </select>
              </div>
              <div className="radioDugmici" onChange={e => setRadio(e.target.value)}>
                <h4 className='odaberitePeriod'>Odaberite period</h4>
                <div className="dan_mesec_godina">
                    <input type="radio" value="1" name="period" className="periodRadio"/>
                    <label className="lbl">Nedelja</label>
                </div>
                <div className="dan_mesec_godina">
                  <input type="radio" value="2" name="period" className="periodRadio"/>
                  <label className="lbl">Mesec</label>
                </div>
                <div className="dan_mesec_godina">
                  <input type="radio" value="3" name="period" className="periodRadio"/>
                  <label className="lbl">Godina</label>
                </div>
              </div>
              <button className="btnPokupiPodatke"onClick={()=>{pokupiPodatke()}}>OK</button>
            </div>
          </div>
      </div>
      
      <div className="divStatistika">
        <Chart
          type="bar"
          width="1200"
          height="700"
          series={[
            {
              name: "Procenat odradjenih termina",
              data: brojevi1,
              
            },
          ]}
         
          options={{
            title: {
              text: "Prikaz odnosa brojeva odrađenih termina radnika",
              style: { fontSize: 30, fontFamily: "Times New Roman", color: "#9d5e5e"},
            },
            
            responsive : [{
              breakpoint : undefined,
              options: {
                 
              }
            }],
            colors: ["#ac6767"],
            theme: { mode: "light" },

            xaxis: {
              tickPlacement: "off",
              categories: radnici1,
              title: {
                text: "Radnici",
                style: { fontSize: 30, fontFamily: "Times New Roman", color: "#9d5e5e"},
              },
            },
            chart:{
              toolbar: {
                show:false
              },
              
            },

            /*yaxis: {
                labels: {
                  formatter: (val) => {
                  return `${val}`;
                  },
                style: { fontSize: "15", colors: ["#A95C68"] },
              },
                 title: {
                 text: "User In (K)",
                 style: { color: "##A95C68", fontSize: 15 },
              },
            },*/

            legend: {
              show: true,
              position: "right",
            },

            /*dataLabels: {
              formatter: (val) => {
                return `${val}`;
              },
              style: {
                colors: ["#f4f4f4"],
                fontSize: 15,
              },
            },*/
          }}
        ></Chart>
      </div>
      </>
    </React.Fragment>
  )
}

export default MenadzerDoprinos
