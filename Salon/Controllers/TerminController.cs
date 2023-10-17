using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Hubs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Models;

namespace Salon.Controllers
{
    [ApiController]
    [Route("[controller]")]
    
    public class TerminController : ControllerBase
    {
        public BeautyContext Context { get; set; }
        public IHubContext<Notif,INotifHub> NotifHub { get; set; }
      
        public TerminController( BeautyContext context, IHubContext<Notif,INotifHub> hub)
        {
            Context = context;
            NotifHub=hub;
         
        }

       [HttpGet]
       [Route("VratiTermin/{idTer}")]
       [Authorize(Roles ="Korisnik")]
       public async Task<ActionResult> VratiTermin(int idTer)
       {
           // var identity=HttpContext.User.Identity as ClaimsIdentity;
           // var id=Int32.Parse(identity.FindFirst("Id").Value);
            
            var termin=await Context.Termini.Include(p=>p.Vreme)
                                        .Include(p=>p.Usluga)
                                        .Include(p=>p.Radnik)
                                        .ThenInclude(p=>p.TipUsluge)
                                        .Include(p=>p.Korisnik)
                                        .Where(p=> p.ID==idTer).FirstOrDefaultAsync();
            if(termin==null)
            {
                return Ok("nema");
            }
          var usluge=Context.Usluge.Include(p=>p.TipUsluge).Where(p=>p.TipUsluge.ID==termin.Radnik.TipUsluge.ID);
          return Ok(new
          {
            termin.ID, //id termina
            termin.Datum,
            termin.Vreme.VremeOd,
            termin.Vreme.VremeDo,
            termin.Radnik.Ime,
            termin.Radnik.Prezime,
            termin.Cena,
            usluge
          });
       }
    
       [HttpGet]
       [Route("VratiZakazaneTermineKorisnika")]
       [Authorize(Roles ="Korisnik")]
       public async Task<ActionResult> VratiZakazaneTermineKorisnika(DateTime? dat)
       {
            var identity=HttpContext.User.Identity as ClaimsIdentity;
            var id=Int32.Parse(identity.FindFirst("Id").Value);
            var danas=DateTime.Now.ToString("HH:mm");
            var termini=Context.Termini.Include(p=>p.Vreme)
                                        .Include(p=>p.Usluga)
                                        .Include(p=>p.Radnik)
                                        .Include(p=>p.Korisnik)
                                        .Where(p=> p.Korisnik.Id==id
                                        && p.Datum >= DateTime.Today
                                        && (p.Datum==DateTime.Today ? (p.Vreme.VremeOd.CompareTo(danas)>=0 ) : true)
                                        && p.StatusOdradjen==false
                                        && (dat!=null ? (p.Datum==dat) : true));
          
          return Ok(await termini.OrderBy(p=>p.Datum).ThenBy(p=>p.Vreme.VremeOd).Select(p=>
          new
          {
              p.ID, //id termina
              p.Datum,
              p.Vreme.VremeOd,
              p.Vreme.VremeDo,
              p.Usluga.Naziv,
              p.Radnik.Ime,
              p.Radnik.Prezime,
              p.Cena

          }).ToListAsync());
       }
       
       [HttpGet]
       [Route("VratiPogodnijeTermineKorisnika")]
       [Authorize(Roles ="Korisnik")]
       public async Task<ActionResult> VratiPogodnijeTermineKorisnika()
       {
            var identity=HttpContext.User.Identity as ClaimsIdentity;
            var id=Int32.Parse(identity.FindFirst("Id").Value);
            var korisnik=await Context.Korisnici.Include(p=>p.PogodnijiTermini).ThenInclude(p=>p.Termin).Where(p=>p.Id==id).FirstOrDefaultAsync();
          return Ok( korisnik.PogodnijiTermini.Select(p=>
          new
          {
            id=p.Termin.ID
          }));
       }
       [HttpGet]
       [Route("VratiKorisnikePogTer/{idter}")]
      
       public async Task<ActionResult> VratiKorisnikePogTer(int idter)
       {
        var termin=await Context.Termini
                                        .Include(p=>p.Korisnik)
                                        .Include(p=>p.Radnik)
                                        .Include(p=>p.Vreme)
                                        .Include(p=>p.Usluga).Where(p=>p.ID==idter).FirstOrDefaultAsync();
        if(termin==null)
            {
                return BadRequest("nema ga ter");
            }
            var pogter=Context.PogodnijiTermini.Include(p=>p.Termin)
                                            .ThenInclude(p=>p.Vreme)
                                            .Include(p=>p.Termin)
                                            .ThenInclude(p=>p.Usluga)
                                            .ThenInclude(p=>p.TipUsluge)
                                            .Include(p=>p.Korisnici)
                                            .ThenInclude(p=>p.PogodnijiTermini)
                                            .Where(p=>p.Termin==termin).FirstOrDefault();
            if(pogter==null)
            {
                return BadRequest("nema ga pog");
            }
          return Ok(pogter.Korisnici);
       }

       [HttpGet]
       [Route("VratiSveTermineRadnikaDan/{dat}")]
       [Authorize(Roles ="Radnik")]
       public async Task<ActionResult> VratiSveTermineRadnikaDan(DateTime dat)
       {
            var identity=HttpContext.User.Identity as ClaimsIdentity;
            var id=Int32.Parse(identity.FindFirst("Id").Value);

            var radnik=await Context.Radnici.Include(p=>p.Termini)
                                            .ThenInclude(p=>p.Korisnik)
                                            .Where(p=>p.Id==id).FirstOrDefaultAsync();
            
            if(radnik==null)
            {
                return BadRequest("nevalidan id radnika");
            }

            
            //svi zakazani termini
            var termini=Context.Termini.Include(p=>p.Usluga)
                                        .ThenInclude(p=>p.TipUsluge)
                                        .Include(p=>p.Vreme)
                                        .Include(p=>p.Korisnik)
                                        .Include(p=>p.Radnik)
                                        .Where(p=> p.Radnik.Id==radnik.Id
                                        && p.Datum==dat
                                        && p.Korisnik!=null
                                        && p.StatusOdradjen==false);

          return Ok(await termini.OrderBy(p=>p.Vreme.VremeOd).Select(p=>
                new
                {
                    p.ID,
                    p.Korisnik.Ime,
                    p.Korisnik.Prezime,
                    p.Vreme.VremeOd,
                    p.Vreme.VremeDo,
                    p.Usluga.Naziv,
                    p.Korisnik.PhoneNumber

                }).ToListAsync());
       }
    
       
        [HttpGet]
        [Route("VratiSveTermineRadnikDan/{id}/{dat}")]
        [Authorize(Roles ="Korisnik")]
        public async Task<ActionResult> VratiSveTermineRadnikDan(int id, DateTime dat)
        {
            try
            {
                //vraca slobodne termine radnika za taj dan
                var danas=DateTime.Now.ToString("HH:mm");
                var termini=Context.Termini.Include(p=>p.Korisnik)
                                        .Include(p=>p.Vreme)
                                        .Include(p=>p.Radnik)
                                        .Where(p=>p.Datum==dat && p.Radnik.Id==id
                                        && p.Korisnik==null && p.StatusOdradjen==false
                                        && (dat==DateTime.Today ? (p.Vreme.VremeOd.CompareTo(danas)>=0 ) : true)
                                        ); //i one koje zapravo moze da zakaze danas!!!
                
                    return Ok(await termini.OrderBy(p=>p.Vreme.VremeOd).Select(p=>
                            new
                            {
                                p.ID,
                                p.Vreme

                            }).ToListAsync());
            }
            catch (Exception e)
                {
                    return BadRequest("Doslo je do greske: " + e.Message);
                }
            
                
        }

       [HttpGet]
       [Route("VratiVremenaZaTip/{naziv}")]
       [Authorize(Roles ="Korisnik")]
       public async Task<ActionResult> VratiVremenaZaTip(string naziv)
       {
           try
           {
            
            naziv=naziv.ToLower();
            var vremena=Context.Vremena.Include(p=>p.TipUsluge).Where(p=>p.TipUsluge.Naziv==naziv);
            
                return Ok(await vremena.Select(p=>
                        new
                        {
                            p.VremeOd,
                            p.VremeDo

                        }).ToListAsync());
           }
           catch (Exception e)
            {
                return BadRequest("Doslo je do greske: " + e.Message);
            }
            
       }
       
        [Route("ZakaziTermin/{idTermina}/{idUsluge}/{popust}")] 
        [HttpPut]
        [Authorize(Roles ="Korisnik")]
        public async Task<ActionResult> ZakaziTermin(int idTermina, int idUsluge, double popust)
        {
            try
            {
                var identity=HttpContext.User.Identity as ClaimsIdentity;
                var idKorisnika=Int32.Parse(identity.FindFirst("Id").Value);
                var termin=await Context.Termini.Include(p=>p.Korisnik)
                                                .Include(p=>p.Usluga)
                                                .Include(p=>p.Radnik)
                                                .ThenInclude(p=>p.TipUsluge)
                                            //.Include(p=>p.Radnik)
                                            //.ThenInclude(p=>p.Termini)
                                            .Where(p=>p.ID==idTermina).FirstOrDefaultAsync();
               var korisnik=await Context.Korisnici.Include(p=>p.Termini)
                                            .Include(p=>p.PogodnijiTermini)
                                            .ThenInclude(p=>p.Termin)
                                            .Where(p=>p.Id==idKorisnika).FirstOrDefaultAsync();
                                       
               if(termin==null)
               {
                   return BadRequest("Ne postoji termin!");
               }
               if(korisnik==null)
               {
                   return BadRequest("Ne postoji korisnik!");
               }
               if(termin.Korisnik!=null)
               {
                   return BadRequest("Termin je vec zakazan");
               }
               if(korisnik.Termini.Contains(termin))
               {
                   return BadRequest("korisnik vec ima ovaj termin u svojoj listi zakazanih termina");
               }
               var usluga= Context.Usluge.Include(p=>p.TipUsluge).Where(p=>p.TipUsluge.Naziv==termin.Radnik.TipUsluge.Naziv
                                                                    && p.ID==idUsluge).FirstOrDefault();
               if(usluga==null)
               {
                   return BadRequest("nema ove usluge");
               }
               //provera za popust
               if(popust!=0)
               {
                   if(popust>usluga.Cena)//ne moze vise od onog sto kosta
                   {
                       return BadRequest("Popust ne sme biti veci od cene usluge!");
                   }
                   if(popust>korisnik.Popust)
                   {
                       return BadRequest("Vrednost koju ste uneli je veca od onog sto imate!");
                   }
                   korisnik.Popust-=popust;
               }
            //makni sve pogodnije termine vezane za ovaj termin
            int id=0;
            var pogter=Context.PogodnijiTermini.Include(p=>p.Termin).Where(p=>p.Termin==termin).FirstOrDefault();
            if(pogter!=null)
            {
                    if(korisnik.PogodnijiTermini.Contains(pogter))
                    {
                        korisnik.PogodnijiTermini.Remove(pogter);
                        id=pogter.Termin.ID;
                    }
            }
            
               korisnik.Termini.Add(termin);
               termin.Korisnik=korisnik;
               termin.Usluga=usluga;
               termin.Cena=usluga.Cena-popust;
              
               await Context.SaveChangesAsync();   
               return Ok(new
                {
                    cena=termin.Cena,
                    id
                });
            }
            catch (Exception e)
            {
                return BadRequest("Doslo je do greske: " + e.Message);
            }
        }

        [Route("PotvrdiOdradjenTermin/{idTermin}")] 
        [HttpPut]
        [Authorize(Roles ="Radnik")]
        public async Task<ActionResult> PotvrdiOdradjenTermin(int idTermin)
        {
            try
            {
                var termin=await Context.Termini.Include(P=>P.Vreme)
                                                .Include(p=>p.Usluga)
                                                .ThenInclude(p=>p.TipUsluge)
                                                .Include(p=>p.Korisnik)
                                                .ThenInclude(p=>p.Radnici)
                                                .Include(p=>p.Korisnik)
                                                .ThenInclude(p=>p.PogodnijiTermini)
                                                .Include(p=>p.Korisnik)
                                                .ThenInclude(p=>p.Termini)
                                                .Include(p=>p.Radnik)
                                                .ThenInclude(p=>p.Termini).Where(p=>p.ID==idTermin).FirstOrDefaultAsync();
                                                
                if(termin==null)
                {
                    return BadRequest("Ne postoji ovaj termin!");
                }
                var korisnik=termin.Korisnik;
                var radnik=Context.Radnici.Include(p=>p.Placanja).Where(p=>p.Id==termin.Radnik.Id).FirstOrDefault();
                
                if(korisnik==null)
                {
                    return BadRequest("Ovaj termin nije zakazan! KORISNIK==NULL");
                }
                if(radnik==null)
                {
                    return BadRequest("RADNIK==NULL");
                }
                
                if((termin.Datum.Date > DateTime.Now.Date) || (termin.Datum.Date == DateTime.Now.Date && termin.Vreme.VremeDo.CompareTo(DateTime.Now.ToString("HH:mm"))>0) )//OK
                {
                     return BadRequest("ne mozete potvrditi termin koji se nije zavrsio!");
                }
                //obrisi iz zakazanih jer je odradjen
                if(korisnik.Termini.Contains(termin))
                {
                    korisnik.Termini.Remove(termin); //ok
                }
                
                if(termin.StatusOdradjen==false)
                {
                    termin.StatusOdradjen=true;
                    var placanje= new Placanje();
                    placanje.Cena=termin.Cena;
                    placanje.Radnik=termin.Radnik;
                    placanje.TipUsluge=termin.Usluga.TipUsluge;
                    placanje.Datum=termin.Datum;
                    if(!radnik.Placanja.Contains(placanje))
                    {
                        radnik.Placanja.Add(placanje);
                    }
                    if(!Context.Placanja.Contains(placanje))
                    {
                        Context.Placanja.Add(placanje);
                    }
                    
                }
                
                //DODAJ RADNIKA KORISNIKU
                if(!korisnik.Radnici.Contains(radnik))
                {
                    korisnik.Radnici.Add(radnik);
                }
                //OBRISI POGODNIJE
                var pogter=Context.PogodnijiTermini.Include(p=>p.Korisnici)
                                                    .Include(p=>p.Termin)
                                                    .Where(p=>p.Termin==termin).FirstOrDefault();
                if(pogter!=null)
                {
                    if(Context.PogodnijiTermini.Contains(pogter))
                    {
                        Context.PogodnijiTermini.Remove(pogter);
                    }
                }
                //CVETICI NA OSNOVU VREDNOSTI CENE USLUGE ODRADJENE
                korisnik.Popust+=termin.Cena*0.05; 

                await Context.SaveChangesAsync(); 

                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest("Doslo je do greske: " + e.Message);
            }
        }

        [Route("DodajPogodnijiTermin/{idRadnika}/{idVreme}/{dat}/{idUsluge}")] 
        [HttpPost]
        [Authorize(Roles ="Korisnik")]
        public async Task<ActionResult> DodajPogodnijiTermin(int idRadnika, int idVreme, DateTime dat, int idUsluge)
        {
            //nadji korisnika
                var identity=HttpContext.User.Identity as ClaimsIdentity;
                var idKorisnika=Int32.Parse(identity.FindFirst("Id").Value);
                var korisnik=await Context.Korisnici.Include(p=>p.Termini)
                                            .Include(p=>p.PogodnijiTermini)
                                            .Where(p=>p.Id==idKorisnika).FirstOrDefaultAsync();
            if(korisnik==null)
               {
                   return BadRequest("Ne postoji korisnik!");
               }
            //nadji termin
            var tip=Context.Usluge.Include(p=>p.TipUsluge).Where(p=>p.ID==idUsluge).Select(p=>p.TipUsluge).FirstOrDefault();
            if(tip==null)
            {
                return BadRequest("nema tipa usluge");
            }
            var termin=Context.Termini.Include(p=>p.Vreme)
                                    .Include(p=>p.Usluga)
                                    .ThenInclude(p=>p.TipUsluge)
                                    .Include(p=>p.Radnik)
                                    .Include(p=>p.Korisnik)
                                    .Where(p=>p.Vreme.ID==idVreme
                                    && p.Radnik.Id==idRadnika
                                    && p.Usluga.TipUsluge==tip
                                    && p.Datum==dat).FirstOrDefault();
            if(termin==null)
            {
                return BadRequest("Ne postoji termin!");
            }
            //dodaj ga u listu pogodnijih termina korisnika
            var pogTer=Context.PogodnijiTermini.Include(p=>p.Termin).Where(p=>p.Termin==termin).FirstOrDefault();
       
            if(pogTer==null)
            {
                pogTer=new PogodnijiTermin();
                pogTer.Termin=termin;
            }
            
            if(!korisnik.PogodnijiTermini.Contains(pogTer))
            {
                korisnik.PogodnijiTermini.Add(pogTer);
            }
            await Context.SaveChangesAsync();
            return Ok(pogTer.Termin.ID);
        }


        [Route("OtkaziZakazanTerminKorisnik/{idTermina}")] 
        [HttpPut]
        [Authorize(Roles ="Korisnik")]
        public async Task<ActionResult> OtkaziZakazanTerminKorisnik(int idTermina)
        {
            try
            {
                var identity=HttpContext.User.Identity as ClaimsIdentity;
                var idKorisnika=Int32.Parse(identity.FindFirst("Id").Value);

                var termin=await Context.Termini
                                        .Include(p=>p.Korisnik)
                                        .Include(p=>p.Radnik)
                                        .Include(p=>p.Vreme)
                                        .Include(p=>p.Usluga).Where(p=>p.ID==idTermina).FirstOrDefaultAsync();
                if(termin==null)
                {
                    return BadRequest("nevalidan id termin!");
                }
                var korisnik=Context.Korisnici.Include(p=>p.Termini)
                                                .Where(p=>p.Id==idKorisnika).FirstOrDefault();

                if(termin.Korisnik!=korisnik || korisnik==null)
                {
                    return BadRequest("Termin je vec otkazan!");
                }
                     
                //NE MOZE DA SE otkaze TRMIN KOJI JE prosao
                if((termin.Datum.Date < DateTime.Now.Date) ||
                    ((termin.Datum.Date == DateTime.Now.Date) && termin.Vreme.VremeOd.CompareTo(DateTime.Now.ToString("HH:mm"))<=0))
                {
                    return BadRequest("ne mozete otkazati termin koji je vec prosao!");
                }


                //SLANJE NOTIFIKACIJE SVIMA ZA POGTER
               
                var pogter=Context.PogodnijiTermini.Include(p=>p.Termin)
                                            .ThenInclude(p=>p.Vreme)
                                            .Include(p=>p.Termin)
                                            .ThenInclude(p=>p.Usluga)
                                            .ThenInclude(p=>p.TipUsluge)
                                            .Include(p=>p.Korisnici)
                                            .ThenInclude(p=>p.PogodnijiTermini)
                                            .Where(p=>p.Termin==termin).FirstOrDefault();
                if(pogter!=null && pogter.Korisnici.Count()>0)
                {
                    var notifikacija=new Notifikacija();
                    notifikacija.Opis="Oslobodio se termin "+pogter.Termin.Datum.Day+"."+pogter.Termin.Datum.Month+". u "
                              +pogter.Termin.Vreme.VremeOd+", "+pogter.Termin.Usluga.TipUsluge.Naziv;

                    notifikacija.Termin=pogter.Termin;
                    var datumNotif=DateTime.Now.ToShortTimeString()+" "+DateTime.Now.Day+"/"+DateTime.Now.Month;
                    notifikacija.Datum=datumNotif;
                    notifikacija.Tip=1;
                    if(!Context.Notifikacije.Contains(notifikacija))
                    {
                        Context.Notifikacije.Add(notifikacija);
                    }
                    await Context.SaveChangesAsync();
                    foreach(var k in pogter.Korisnici)
                    {
                        
                        var kor=Context.Korisnici.Include(p=>p.PogodnijiTermini).Include(p=>p.Notifikacije).Where(p=>p.Id==k.Id).FirstOrDefault();
                        if(kor.PogodnijiTermini.Contains(pogter))
                        {
                            if(!kor.Notifikacije.Contains(notifikacija))
                            {
                                kor.Notifikacije.Add(notifikacija);
                            }
                        }
                        var notUnutra=Context.Notifikacije.Include(p=>p.Korisnici).Where(p=>p.ID==notifikacija.ID).FirstOrDefault();
                        if(!notUnutra.Korisnici.Contains(kor))
                        {
                            notUnutra.Korisnici.Add(kor);
                        }   
                                
                    }
                    await Context.SaveChangesAsync();
                    await NotifHub.Clients.Group(pogter.Termin.ID.ToString()).SendMessageToAll(notifikacija.ID,pogter.Termin.ID.ToString(), notifikacija.Opis, datumNotif,notifikacija.Tip);
                }
                termin.Korisnik=null;
                termin.Cena=0;
                termin.Usluga=null;
                await Context.SaveChangesAsync();
                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest("Doslo je do greske: " + e.Message);
            }
        }

        [Route("OtkaziZakazanTerminRadnik/{idTermina}")] 
        [HttpPut]
        [Authorize(Roles ="Radnik")]
        public async Task<ActionResult> OtkaziZakazanTerminRadnik(int idTermina)
        {
            try
            {
                var termin=await Context.Termini
                                        .Include(p=>p.Korisnik)
                                        .Include(p=>p.Radnik)
                                        .Include(p=>p.Vreme)
                                        .Include(p=>p.Usluga).Where(p=>p.ID==idTermina).FirstOrDefaultAsync();
                if(termin==null)
                {
                    return BadRequest("ne postoji taj termin!");
                }
                var korisnik=termin.Korisnik;
                if(korisnik==null)
                {
                    return BadRequest("Termin je vec otkazan!");
                }
                
                if(termin.Datum==DateTime.Today.AddDays(+1))//danas za sutra
                {
                    return BadRequest("Ne mozete ovako kasno otkazati termin!");
                }
                if(termin.Datum==DateTime.Today)//danas za danas
                {
                    return BadRequest("Ne mozete ovako kasno otkazati termin!");
                }      


                //SLANJE NOTIFIKACIJE KORISNIKU

                korisnik.Popust+=termin.Usluga.Cena*0.2;

                //obavestenje korisniku da je termin otkazan
                var notif=new Notifikacija();
                notif.Opis="Žao nam je, Vaš termin  "+termin.Datum.Day+"."+termin.Datum.Month+". u "
                              +termin.Vreme.VremeOd+", "+termin.Usluga.Naziv+ ", je nažalost otkazan.";
                var datumNotifOtkaz=DateTime.Now.ToShortTimeString()+" "+DateTime.Now.Day+"/"+DateTime.Now.Month;
                notif.Datum=datumNotifOtkaz;
                notif.Tip=2;
                //notif.Termin=null;
                if(!Context.Notifikacije.Contains(notif))
                {
                    Context.Notifikacije.Add(notif);

                }
                await Context.SaveChangesAsync();
                var korrr=Context.Korisnici.Include(p=>p.PogodnijiTermini).Include(p=>p.Notifikacije).Where(p=>p.Id==korisnik.Id).FirstOrDefault();
                if(!korrr.Notifikacije.Contains(notif))
                {
                    korrr.Notifikacije.Add(notif);
                }
                var notifSpolja=Context.Notifikacije.Include(p=>p.Korisnici).Where(p=>p==notif).FirstOrDefault();
                if(!notifSpolja.Korisnici.Contains(korrr))
                {
                    
                    notifSpolja.Korisnici.Add(korrr);
                }
                await Context.SaveChangesAsync();
                await NotifHub.Clients.Group(korrr.Email).SendMessageToAll(notif.ID,korrr.Email,notif.Opis,datumNotifOtkaz,notif.Tip);
                

                var pogter=Context.PogodnijiTermini.Include(p=>p.Termin)
                                            .ThenInclude(p=>p.Vreme)
                                            .Include(p=>p.Termin)
                                            .ThenInclude(p=>p.Usluga)
                                            .ThenInclude(p=>p.TipUsluge)
                                            .Include(p=>p.Korisnici)
                                            .ThenInclude(p=>p.PogodnijiTermini)
                                            .Where(p=>p.Termin==termin).FirstOrDefault();
                if(pogter!=null && pogter.Korisnici.Count()>0)
                {
                    var notifikacija=new Notifikacija();
                    notifikacija.Opis="Oslobodio se termin "+pogter.Termin.Datum.Day+"."+pogter.Termin.Datum.Month+". u "
                              +pogter.Termin.Vreme.VremeOd+", "+pogter.Termin.Usluga.TipUsluge.Naziv;

                    notifikacija.Termin=pogter.Termin;
                    var datumNotif=DateTime.Now.ToShortTimeString()+" "+DateTime.Now.Day+"/"+DateTime.Now.Month;
                    notifikacija.Datum=datumNotif;
                    notifikacija.Tip=1;
                    if(!Context.Notifikacije.Contains(notifikacija))
                    {
                        Context.Notifikacije.Add(notifikacija);
                    }
                    await Context.SaveChangesAsync();
                    foreach(var k in pogter.Korisnici)
                    {
                        
                        var kor=Context.Korisnici.Include(p=>p.PogodnijiTermini).Include(p=>p.Notifikacije).Where(p=>p.Id==k.Id).FirstOrDefault();
                        if(kor.PogodnijiTermini.Contains(pogter))
                        {
                            if(!kor.Notifikacije.Contains(notifikacija))
                            {
                                kor.Notifikacije.Add(notifikacija);
                            }
                        }
                        var notUnutra=Context.Notifikacije.Include(p=>p.Korisnici).Where(p=>p.ID==notifikacija.ID).FirstOrDefault();
                        if(!notUnutra.Korisnici.Contains(kor))
                        {
                            notUnutra.Korisnici.Add(kor);
                        }   
                                
                    }
                    
                    await Context.SaveChangesAsync();
                    await NotifHub.Clients.Group(pogter.Termin.ID.ToString()).SendMessageToAll(notifikacija.ID,pogter.Termin.ID.ToString(), notifikacija.Opis, datumNotif,notifikacija.Tip);
                }
                
                termin.Korisnik=null;
                termin.Cena=0;
                termin.Usluga=null;

                await Context.SaveChangesAsync();
                return Ok(korisnik.Termini.ToList());
            }
            catch (Exception e)
            {
                return BadRequest("Doslo je do greske: " + e.Message);
            }
        }
       
       


    }
}
