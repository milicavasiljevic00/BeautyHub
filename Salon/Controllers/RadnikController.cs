using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Models;

namespace Salon.Controllers
{
    [ApiController]
    [Route("[controller]")]
 
    public class RadnikController : ControllerBase
    {
        public BeautyContext Context { get; set; }
        public RadnikController( BeautyContext context)
        {
            Context = context;
        }

        [HttpGet]
        [Route("VratiSveRadnike")]
        [AllowAnonymous]
        public async Task<ActionResult> VratiSveRadnike()
        {
            try
            {
                var radnici=Context.Radnici.Include(p=>p.Recenzije).Include(p=>p.TipUsluge).Where(p=>p.TipUsluge!=null);
                return Ok(await Context.Radnici.Include(p=>p.TipUsluge)
                                        .ThenInclude(p=>p.Usluge)
                                        .Include(p=>p.Recenzije)
                                        .Where(p=>p.TipUsluge!=null)
                                        .Select(p=>
                                        new
                                        {
                                            p.Id,
                                            p.Ime,
                                            p.Prezime,
                                            Usluge=p.TipUsluge.Usluge.Select(q=>
                                            new
                                            {   q.ID,
                                                q.Naziv
                                            }),
                                            p.TipUsluge,
                                            p.Email,
                                            p.PhoneNumber,
                                        Ocena=Math.Round(( ( (double)( p.Recenzije.Sum(item=>item.Ocena) ) ) 
                                                         / ( (double)( p.Recenzije.Count()==0 ? 25 : p.Recenzije.Count() ) )),2),
                                        Recenzije=p.Recenzije.OrderByDescending(s=>s.Ocena).Select(d=>
                                        new
                                        {   d.ID,
                                            d.Ocena,
                                            d.Komentar
                                        })
                                        }).ToListAsync());
            }
                catch (Exception e)
                {
                    return BadRequest("Doslo je do greske: " + e.Message);
                }
                
        }
       
        [HttpGet]
        [Route("VratiRadnikeTipUsluge/{naziv}")]
        [Authorize(Roles ="Korisnik")]
        public async Task<ActionResult> VratiRadnikeTipUsluge(string naziv)
        {
            try
            {
                //vraca sve radnike koji se bave ovim tipom usluge
                naziv=naziv.ToLower();
                var radnici= Context.Termini.Include(p=>p.Radnik)
                                                .ThenInclude(p=>p.TipUsluge)
                                                .Include(p=>p.Korisnik)
                                                .Where(p=>p.Radnik.TipUsluge!=null && p.Radnik.TipUsluge.Naziv==naziv
                                                 && p.Korisnik==null && p.StatusOdradjen==false).Select(p=>p.Radnik).Distinct();
       
                return Ok(await radnici.Select(p=>
                new
                {
                    p.Id,
                    p.Ime,
                    p.Prezime
                }).ToListAsync());
            }
            catch (Exception e)
            {
                return BadRequest("Doslo je do greske: " + e.Message);
            }
                
        }
       
        [Route("VratiSveRadnikeKorisnika")]
        [HttpGet]
        [Authorize(Roles ="Korisnik")]
        public async Task<ActionResult> VratiSveRadnikeKorisnika()
        {
            try
            {
                var identity=HttpContext.User.Identity as ClaimsIdentity;
                var id=Int32.Parse(identity.FindFirst("Id").Value);

                var korisnik=await Context.Korisnici.Include(p=>p.Radnici)
                                            .ThenInclude(p=>p.Recenzije)
                                            .Include(p=>p.Radnici)
                                            .ThenInclude(p=>p.TipUsluge)
                                            .Where(p=>p.Id==id).FirstOrDefaultAsync();
                if(korisnik==null)
                {
                    return BadRequest("nevalidan korisnik");
                }
                
                return Ok(korisnik.Radnici.Select(q=>
                    new
                    {
                        q.Id,
                        q.Ime,
                        q.Prezime,
                        q.PhoneNumber,
                        q.TipUsluge,
                        Ocena=Math.Round(( ( (double)( q.Recenzije.Sum(item=>item.Ocena) ) ) 
                                                         / ( (double)( q.Recenzije.Count()==0 ? 25 : q.Recenzije.Count() ) )),2)
                    }));
            }
            catch (Exception e)
            {
                return BadRequest("Doslo je do greske: " + e.Message);
            }
        }
       
        [HttpGet]
        [Route("VratiRadnikeSaZakazanimTerminomVreme/{naziv}/{dat}/{idVreme}")]
        [Authorize(Roles ="Korisnik")]
        public async Task<ActionResult> VratiRadnikeSaZakazanimTerminomVreme(string naziv,DateTime dat,int idVreme)
        {
            try
            {
                var identity=HttpContext.User.Identity as ClaimsIdentity;
                var idKorisnika=Int32.Parse(identity.FindFirst("Id").Value);
                var pogodniji=Context.Korisnici.Include(p=>p.PogodnijiTermini)
                                                .ThenInclude(p=>p.Termin)
                                                .ThenInclude(p=>p.Radnik)
                                                .Include(p=>p.PogodnijiTermini)
                                                .ThenInclude(p=>p.Termin)
                                                .ThenInclude(p=>p.Vreme)
                            .Where(p=>p.Id==idKorisnika).FirstOrDefault().PogodnijiTermini.Select(p=>p.Termin);
              //  pogodniji=pogodniji.Where(p=>p.Termin.Vreme.ID!=idVreme && p.Termin.Datum!=).ToList();
                naziv=naziv.ToLower();

                var radnici=Context.Termini.Include(p=>p.Vreme)
                                            .Include(p=>p.Usluga)
                                            .ThenInclude(p=>p.TipUsluge)
                                            .Include(p=>p.Korisnik)
                                            .Include(p=>p.Radnik)
                                            .ThenInclude(p=>p.TipUsluge)
                                            .Where(p=>p.Radnik.TipUsluge!=null 
                                            && p.Radnik.TipUsluge.Naziv==naziv
                                            && p.Usluga!=null//
                                            && p.Usluga.TipUsluge.Naziv==naziv//
                                            && p.Datum==dat && p.Korisnik!=null
                                            && p.Vreme.ID==idVreme
                                            && p.StatusOdradjen==false
                                            && p.Korisnik.Id!=idKorisnika
                                            && !pogodniji.Contains(p))
                                            .Select(p=>p.Radnik);
                    return Ok(await radnici.Select(p=>
                            new
                            {
                                p.Id,
                                p.Ime,
                                p.Prezime

                            }).ToListAsync());
            }
            catch (Exception e)
                {
                    return BadRequest("Doslo je do greske: " + e.Message);
                }
                
        }
        
        [HttpGet]
        [Route("PretraziRadnike/{kriterijum}/{x}/{y}/{idTipaUsluge}")]
        [AllowAnonymous]
        public async Task<ActionResult> PretraziRadnike(string kriterijum, string x, string y, int idTipaUsluge)
        {
            //kriterijum=nema,ime,ocena
            //nema,nema,nema,0
            try
            {
                var radnici=Context.Radnici.Include(p=>p.TipUsluge)
                                        .ThenInclude(p=>p.Usluge)
                                        .Include(p=>p.Recenzije)
                                        .Where(p=>p.TipUsluge!=null)
                                        .Select(p=>
                                        new
                                        {
                                            p.Id,
                                            p.Ime,
                                            p.Prezime,
                                            Usluge= p.TipUsluge.Usluge.Select(q=>
                                            new
                                            {   q.ID,
                                                q.Naziv
                                            }),
                                            p.TipUsluge,
                                            p.Email,
                                            p.PhoneNumber,
                                         Ocena=Math.Round(( ( (double)( p.Recenzije.Sum(item=>item.Ocena) ) ) 
                                                         / ( (double)( p.Recenzije.Count()==0 ? 25 : p.Recenzije.Count() ) )),2),
                                        Recenzije=p.Recenzije.OrderByDescending(s=>s.Ocena).Select(d=>
                                        new
                                        {   d.ID,
                                            d.Ocena,
                                            d.Komentar
                                        })
                                        });
            
                if(kriterijum!="nema") //ok
                {
                    if(kriterijum=="ime")
                    {
                        radnici=radnici.OrderBy(p=>p.Ime);
                    }
                    else if(kriterijum=="ocena")
                    {
                        radnici=radnici.OrderByDescending(p=> Math.Round(( ( (double)( p.Recenzije.Sum(item=>item.Ocena) ) ) 
                                                         / ( (double)( p.Recenzije.Count()==0 ? 25 : p.Recenzije.Count() ) )),2));
                    }
                }
                if(idTipaUsluge!=0)
                {
                    radnici=radnici.Where(p=>p.TipUsluge.ID==idTipaUsluge);
                    // if(radnici.Count()==0)
                    // {
                    //     return BadRequest("Ne postoje radnici koji obavljaju "+Context.TipoviUsluge.Where(p=>p.ID==idTipaUsluge).FirstOrDefault().Naziv);
                    // }
                }
            
                if(x!="nema" && y!="nema")//uneta oba
                {
                    if(x!="nema")
                    {x=x.ToLower();}
                    if(y!="nema") 
                    { y=y.ToLower();}   

                    radnici=radnici.Where(p=>( p.Ime==x && p.Prezime==y) || (p.Ime==y && p.Prezime==x));
                    // if(radnici.Count()==0)
                    //         return BadRequest("Ne postoji radnik "+x+" "+y);
                        //else
                        //{
                            return Ok(await radnici.ToListAsync());
                        //}
                }
                else if(x!="nema" || y!="nema")//poslato ime ili prezime
                {
                    string z;
                    if(x!="nema")
                    {z=x.ToLower();}
                    else 
                    { z=y.ToLower();}    

                        radnici=radnici.Where(p=> (p.Ime==z || p.Prezime==z));
                   // if(radnici.Count()!=0)
                            return Ok( await radnici.ToListAsync());
                        // else
                        // {
                        //     return BadRequest("Ne postoji radnik "+z);
                        // }
                }
                
                return Ok(await radnici.ToListAsync());
            }
            catch (Exception e)
            {
                return BadRequest("Doslo je do greske: " + e.Message);
            }
        }

        [HttpGet]
        [Route("PretraziRadnikeKorisnika/{x}/{y}")]
        [Authorize(Roles ="Korisnik")]
        public async Task<ActionResult> PretraziRadnikeKorisnika(string x, string y)
        {
            try
            {
                // if(x=="nema" && y=="nema")//mora po necemu da se trazi
                // {
                //     return BadRequest("Ne postoji ni jedan kriterijum pretrage!");
                // }
                var identity=HttpContext.User.Identity as ClaimsIdentity;
                var id=Int32.Parse(identity.FindFirst("Id").Value);

            
                var korisnik=await Context.Korisnici.Include(p=>p.Radnici)
                                        .ThenInclude(p=>p.TipUsluge)
                                        .Include(p=>p.Radnici)
                                        .ThenInclude(p=>p.Recenzije)
                                        .Where(p=>p.Id==id).FirstOrDefaultAsync();
                
                if(korisnik==null)
                {
                    return BadRequest("nemvalidan id korisnika");
                }                      
                var radnici=korisnik.Radnici.Select(q=>
                new
                {
                        q.Id,
                        q.Ime,
                        q.Prezime,
                        q.PhoneNumber,
                        q.TipUsluge,
                        Ocena=Math.Round(( ( (double)( q.Recenzije.Sum(item=>item.Ocena) ) ) 
                                                         / ( (double)( q.Recenzije.Count()==0 ? 25 : q.Recenzije.Count() ) )),2)
                }) ;                       
                
                if(x!="nema" && y!="nema")//uneta oba
                {
                    if(x!="nema")
                    {x=x.ToLower();}
                    if(y!="nema") 
                    { y=y.ToLower();}   

                    radnici=radnici.Where(p=>( p.Ime==x && p.Prezime==y) || (p.Ime==y && p.Prezime==x));
                    // if(radnici.Count()==0)
                    //         return BadRequest("Ne postoji radnik "+x+" "+y);
                }
                else if(x!="nema" || y!="nema")//poslato ime ili prezime
                {
                    string z;
                    if(x!="nema")
                    {z=x.ToLower();}
                    else 
                    { z=y.ToLower();}    

                        radnici=radnici.Where(p=> (p.Ime==z || p.Prezime==z));
                    // if(radnici.Count()==0)
                    //     {
                    //         return BadRequest("Ne postoji radnik "+z);
                    //     }
                }
               
                return Ok(radnici.ToList());
            }
            catch (Exception e)
            {
                return BadRequest("Doslo je do greske: " + e.Message);
            }
        }

        [Route("AzurirajLicneInfoRadnik/{ime}/{prezime}/{telefon}")]
        [HttpPut]
        [Authorize(Roles ="Radnik")]
        public async Task<ActionResult> AzurirajLicneInfoRadnik(string ime, string prezime,string telefon)//ok
        {
            try
            {
                var identity=HttpContext.User.Identity as ClaimsIdentity;
                var id=Int32.Parse(identity.FindFirst("Id").Value);
               
                ime=ime.ToLower();//proveri ovo
                prezime=prezime.ToLower();

                var radnik=Context.Radnici.Where(p=>p.Id==id).FirstOrDefault();

                if(radnik==null)
                {
                    return BadRequest("Ne postoji ovaj radnik u bazi!");
                }

                radnik.Ime=ime;
                radnik.Prezime=prezime;
                radnik.PhoneNumber=telefon;

                await Context.SaveChangesAsync(); 

                return Ok(await Context.Radnici.Where(p=>p.Id==id).ToListAsync());
            }
            catch (Exception e)
            {
                return BadRequest("Doslo je do greske: " + e.Message);
            }
        }

        [HttpDelete]
        [Route("ObrisiRadnika/{idRadnika}")]
        [Authorize(Roles ="Menadzer")]
        public async Task<ActionResult> ObrisiRadnika(int idRadnika)
        {
            try
            {
                 //ZAKAZANI NEODRADJENI TERMINI, od danas, pa na dalje
                
                var termini=Context.Termini.Include(p=>p.Usluga)
                                        .Include(p=>p.Korisnik)
                                        .Include(p=>p.Radnik)
                                        .Where(p=>p.Radnik.Id==idRadnika
                                        && p.Korisnik!=null
                                        && p.StatusOdradjen==false
                                        && p.Datum >= DateTime.Today);
                if(termini.Count()>0)
                {
                    return BadRequest("Ne možete obrisati radnika! Ima zakazane termine!");
                }
                var radnik=Context.Radnici.Include(p=>p.TipUsluge)
                                        .Include(p=>p.Recenzije)
                                        .Include(p=>p.Termini)
                                        .Include(p=>p.Placanja)
                                        .Where(p=>p.Id==idRadnika).FirstOrDefault();

                var korisnici=Context.Korisnici.Include(p=>p.Radnici)
                                            .Where(p=>p.Radnici.Contains(radnik)).ToList();
                foreach(var kor in korisnici)
                {
                    if(kor.Radnici.Contains(radnik))
                    {
                        kor.Radnici.Remove(radnik);
                    }
                }
                var notifikacije=Context.Notifikacije.Include(p=>p.Termin)
                                                        .ThenInclude(p=>p.Radnik)
                                                        .Where(p=>p.Termin!=null && p.Termin.Radnik==radnik).ToList();
                foreach(var not in notifikacije)
                {
                    var kor=Context.Korisnici.Include(p=>p.Notifikacije)
                                            .Where(p=>p.Notifikacije.Contains(not)).ToList();//korisnici koji imaju ovu notif
                    foreach(var k in kor)
                    {
                        if(k.Notifikacije.Contains(not))
                        {
                            k.Notifikacije.Remove(not);
                        }
                    }
                    if(Context.Notifikacije.Contains(not))
                    {
                        Context.Notifikacije.Remove(not);
                    }
                }
                var pogtermini=Context.PogodnijiTermini.Include(p=>p.Termin)
                                                        .ThenInclude(p=>p.Radnik)
                                                        .Include(p=>p.Korisnici)//trebalo bi da se maknu kod njih, proveri
                                                        .Where(p=>p.Termin.Radnik==radnik).ToList();
                foreach(var pogter in pogtermini)
                {
                    if(Context.PogodnijiTermini.Contains(pogter))
                    {
                        Context.PogodnijiTermini.Remove(pogter);
                    }
                }

                var terminiSvi=Context.Termini.Include(p=>p.Radnik)
                                            .Where(p=>p.Radnik==radnik).ToList();
                foreach(var t in terminiSvi)
                {
                    if(Context.Termini.Contains(t))
                    {
                        Context.Termini.Remove(t);
                    }
                }
                var recenzije=Context.Recenzije.Include(p=>p.Radnik).Where(p=>p.Radnik==radnik).ToList();
                foreach(var r in recenzije)
                {
                    if(Context.Recenzije.Contains(r))
                    {
                        Context.Recenzije.Remove(r);
                    }
                }
                if(Context.Radnici.Contains(radnik))
                {
                    Context.Radnici.Remove(radnik);
                }
                await Context.SaveChangesAsync();
                return Ok();
                
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }
//=============================================================================//
        [Route("AzurirajPrivilegovaneInfoRadnik/{idRadnika}/{idTipa}")]
        [HttpPut]
        [Authorize(Roles ="Menadzer")]
        public async Task<ActionResult> AzurirajPrivilegovaneInfoRadnik(int idRadnika, int idTipa)
        {
            try
            {
                var radnik=Context.Radnici.Include(p=>p.TipUsluge).Where(p=>p.Id==idRadnika).FirstOrDefault();

                if(radnik==null)
                {
                    return BadRequest("nevalidan id radnika!");
                }

               //provera dal su prazni stringovi itd te gluposti
               var tipUsluge=Context.TipoviUsluge.Where(p=>p.ID==idTipa).FirstOrDefault();
               if(tipUsluge==null)
               {
                   return BadRequest("nevalidan id tipa usluge!");
               }
               radnik.TipUsluge=tipUsluge;
               //sertifikati
                await Context.SaveChangesAsync(); 

                return Ok(await Context.Radnici.Where(p=>p.Id==idRadnika).Select(p=>
                new
                {
                    //sta vec ide
                }).ToListAsync());
            }
            catch (Exception e)
            {
                return BadRequest("Doslo je do greske: " + e.Message);
            }
        }

        // [HttpDelete]
        // [Route("ObrisiRadnika/{idRadnika}")]
        // [Authorize(Roles ="Menadzer")]
        // public async Task<ActionResult> ObrisiRadnika(int idRadnika)
        // {
        //     try
        //     {
        //         var radnik=Context.Radnici.Include(p=>p.TipUsluge)
        //                                     .Include(p=>p.Recenzije)
        //                                     .Include(p=>p.TipUsluge)
        //                                     .Include(p=>p.Termini)
        //                                     .Where(p=>p.Id==idRadnika).FirstOrDefault();

        //         if(radnik==null)
        //         {
        //             return BadRequest("nevalidan id radnika!");
        //         }
        //         // var termini=Context.Termini.Include(p=>p.Korisnik)
        //         //                             .ThenInclude(p=>p.PogodnijiTermini)
        //         //                             .Include(p=>p.Korisnik)
        //         //                             .ThenInclude(p=>p.Termini)
        //         //                             .Include(p=>p.Radnik)
        //         //                             .ThenInclude(p=>p.Termini);
                                            
        //         if(Context.Radnici.Contains(radnik))
        //         {
        //             Context.Radnici.Remove(radnik);
        //         }//vidi sta se sve automatski obrise

        //         await Context.SaveChangesAsync(); 

        //         return Ok();
        //     }
        //     catch (Exception e)
        //     {
        //         return BadRequest("Doslo je do greske: " + e.Message);
        //     }
        // }



    }
}

