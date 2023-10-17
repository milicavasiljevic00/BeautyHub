import emailjs from "emailjs-com";
import React from 'react';
import './Kontakt.css';
import Footer from './Footer';

export default function Kontakt() {

    function sendEmail(e) {
        e.preventDefault();

    emailjs.sendForm('service_vfkt33g', 'template_xwcar0r',e.target,'_7xM5Zi5Q8hl6bLmK')
        .then((result) => {
            alert("Uspešno ste poslali mejl!");
        }, (error) => {
            console.log(error.text);
        });
        e.target.reset()
    }

    return(
  
        <div className='Kontakt'>
            <div className="Informacije">
              <h1 className="hKon">Kontaktirajte nas!</h1>
              <p className="inf">E-mail: <span className="mail">beautyhub@gmail.com</span></p>
              <p className="inf">Telefon: <span className="mail">+381 18 522 622</span></p>  
              <p className="inf">Adresa: <span className="mail">Tome Rosandića 6, Niš</span></p> 
              <div className='mapa'>
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2902.9711066711616!2d21.897642676078117!3d43.31486427112015!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4755b0bab6f8a325%3A0xa0f3115e3306a1cc!2z0KLQvtC80LUg0KDQvtGB0LDQvdC00LjRm9CwIDYsINCd0LjRiA!5e0!3m2!1ssr!2srs!4v1695850222019!5m2!1ssr!2srs" width="100%" height="450" style={{ border: 0 }} allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>      
              </div> 
              
            </div>
            
            <div className="Mail">
                <form onSubmit={sendEmail}>
                    <div>
                        <div className='MailLbl'>
                          <p className="pOdg">Odgovaramo na sva Vaša pitanja</p>
                        </div>
                        <div>
                            <input type="text" className="form-control" placeholder="Vaš e-mail" name="name"/>
                        </div>
                        <div>
                            <input type="text" className="form-control" placeholder="Naslov" name="subject"/>
                        </div>
                        <div>
                            <textarea className="form-control" id="" cols="30" rows="16" placeholder="Poruka..." name="message"></textarea>
                        </div>
                        <div className='submitDiv'>
                            <input type="submit" className="submitButton" value="Pošalji"></input>
                        </div>
                    </div>
                </form>
            </div>
        </div>
            
  
    )
}