using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models;

namespace Salon.Controllers
{

    [ApiController]
    [Route("[controller]")]

   
    public class UslugaController : ControllerBase
    {
        public BeautyContext Context { get; set; }

        public UslugaController(BeautyContext context)
        {
            Context = context;
        }
        
        [Route("PreuzmiTipoveUsluga")]
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult> PreuzmiTipoveUsluge() //ok
        {
            try
            {
                return Ok(await Context.TipoviUsluge.Select(p =>
                new
                {
                    p.ID,
                    p.Naziv,
                    p.Opis,
                    p.Trajanje
                    
                }).ToListAsync());
            }
            catch (Exception e)
            {
                return BadRequest("Doslo je do greske: " + e.Message);
            }
        }
        [Route("PreuzmiTipoveUslugeSaUslugama")]
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult> PreuzmiTipoveUslugeSaUslugama() //ok
        {
            try
            {
                return Ok(await Context.TipoviUsluge.Include(p=>p.Usluge)
                                            .Include(p=>p.Radnici)
                                            .Where(p=>p.Usluge.Count()>0 && p.Radnici.Count()>0)
                                            .Select(p =>
                                            new
                                            {
                                                p.ID,
                                                p.Naziv,
                                                p.Opis,
                                                p.Trajanje
                                                
                                            }).ToListAsync());
            }
            catch (Exception e)
            {
                return BadRequest("Doslo je do greske: " + e.Message);
            }
        }

        [Route("PreuzmiTipUsluge/{naziv}")]
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult> PreuzmiTipUsluge(string naziv) //ok
        {
           try
            {
                naziv=naziv.ToLower();
               return Ok(await Context.TipoviUsluge.Where(r =>r.Naziv==naziv).Select(p =>
                new
                {
                    p.ID,
                    p.Naziv,
                    p.Opis,
                    p.Trajanje

                }).FirstOrDefaultAsync());

            }
         catch (Exception e)
            {
                return BadRequest("Doslo je do greske: " + e.Message);
            }
        }
    
        [Route("PreuzmiUslugu/{id}")]
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult> PreuzmiUslugu(int id) //da li ce da postoji usluga koja ce da ima isto ime u razl tipovima?
        {
           try
            {
               return Ok(await Context.Usluge.Where(r =>r.ID==id).Select(p =>
                new
                {
                    p.ID,
                    p.Naziv,
                    p.Cena

                }).FirstOrDefaultAsync());

            }
         catch (Exception e)
            {
                return BadRequest("Doslo je do greske: " + e.Message);
            }
        }

        [Route("PreuzmiUsluge/{nazivTipa}")]
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult> PreuzmiUsluge(string nazivTipa) //ok
        {
            try
            {
                nazivTipa=nazivTipa.ToLower();
               var tipUsluge=await Context.TipoviUsluge.Include(p=>p.Usluge).Where(p=>p.Naziv==nazivTipa).FirstOrDefaultAsync();//usluga

               if(tipUsluge==null)
               {
                   return BadRequest("Ne postoji usluga sa ovim idjem ");
               }
            
               return Ok(tipUsluge.Usluge.Select(p=>
               new
               {
                   p.ID,
                   p.Naziv,
                   p.Cena

               }).ToList());
            }
            catch (Exception e)
            {
                return BadRequest("Doslo je do greske: " + e.Message);
            }
        }

        [Route("DodajTipUsluge/{naziv}/{opis}/{trajanje}")]
        [HttpPost]
        [Authorize(Roles ="Admin")]
        public async Task<ActionResult> DodajTipUsluge(string naziv, string opis, double trajanje)
        {//Da li sve da gurnem u jednu fju da se dodaju iradnici i usluge i sl, mada mislim da je logicnije i lakse
        //i ne ogranicava d to budu tri razlicite fje i da svaka vraca id onog sto je dodala da bi se slalo u sledecu
        
            try
            {
                //PROVERA DA OVI STRINGOVI ISU PRAZNI??
                //naziv je jedinstven?
                naziv=naziv.ToLower();
                opis=opis.ToLower();
                if(trajanje==0)
                {
                    return BadRequest("ne sme trajanje da bude nula!");
                }
                if(string.IsNullOrEmpty(opis))
                {
                    return BadRequest("Morate da unesete opis!");
                }
                var ima=Context.TipoviUsluge.Where(p=>p.Naziv==naziv).FirstOrDefault();
                if(ima!=null)
                {
                    return BadRequest("vec postoji tip usluge "+naziv);
                }

                var tipusluge=new TipUsluge();
                tipusluge.Naziv=naziv;
                tipusluge.Opis=opis;
                tipusluge.Trajanje=trajanje;

                Context.TipoviUsluge.Add(tipusluge);

                //pravljenje vremena

               // var vreme=new DateTime(2022,10,10,9,0,0); //vreme u 9
               var vremeStart=new TimeSpan(9,0,0);
               var vremeEnd=new TimeSpan(17,0,0);
               var vremeOd=vremeStart;
               var tr=new TimeSpan(0,(int)trajanje,0);
               while(vremeOd.Add(tr).CompareTo(vremeEnd)<=0)
               {
                    var novo=new Vreme();
                    novo.VremeOd=vremeOd.ToString(@"hh\:mm");
                    vremeOd=vremeOd.Add(tr);
                    novo.VremeDo=vremeOd.ToString(@"hh\:mm");
                    novo.TipUsluge=tipusluge;
                    Context.Vremena.Add(novo);
               }

                await Context.SaveChangesAsync();
                return Ok(tipusluge);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }


        [Route("DodajUslugu/{idTipa}/{naziv}/{cena}")]
        [HttpPost]
        [Authorize(Roles ="Admin")]
        public async Task<ActionResult> DodajUslugu(int idTipa, string naziv, int cena)
        {
            try
            {
                //PROVERA DA OVI STRINGOVI ISU PRAZNI??
                //naziv je jedinstven?
                naziv=naziv.ToLower();
                if(cena==0)//mozda neko ogranicenje za moin cenu
                {
                    return BadRequest("ne sme trajanje da bude nula!");
                }
                var tip=Context.TipoviUsluge.Include(p=>p.Usluge).Where(p=>p.ID==idTipa).FirstOrDefault();
                if(tip==null)
                {
                    return BadRequest("ne postoji ovaj tip usluge");
                }

                //JEL JEDINSTVEN NAZIV TIPA USLUGE?
                var ima=tip.Usluge.Where(p=>p.Naziv==naziv).FirstOrDefault();
                if(ima!=null)
                {
                    return BadRequest("vec postoji usluga u tipu");
                }

                var usluga=new Usluga();
                usluga.Naziv=naziv;
                usluga.Cena=cena;
                usluga.TipUsluge=tip;

                Context.Usluge.Add(usluga);
                await Context.SaveChangesAsync();
                return Ok(usluga);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [Route("AzurirajTipUsluge/{id}/{opis}")]
        [HttpPut]
        [Authorize(Roles ="Admin")]
        public async Task<ActionResult> AzurirajTipUsluge(int id,string opis)//ok
        {
            try
            {   
                var tipusluge=Context.TipoviUsluge.Where(p=>p.ID==id).FirstOrDefault();
                if(tipusluge==null)
                {
                    return BadRequest("Nevalidan id tipa usluge");
                }

                if(string.IsNullOrEmpty(opis))
                {
                    return BadRequest("niste uneli opis");
                }
                tipusluge.Opis=opis;

                await Context.SaveChangesAsync(); 

                return Ok(tipusluge);
            }
            catch (Exception e)
            {
                return BadRequest("Doslo je do greske: " + e.Message);
            }
        }

        [Route("AzurirajUslugu/{id}/{cena}")]
        [HttpPut]
        [Authorize(Roles ="Admin")]
        public async Task<ActionResult> AzurirajUslugu(int id, int cena)//ok
        {
            try
            {   
                var usluga=Context.Usluge.Where(p=>p.ID==id).FirstOrDefault();
                if(usluga==null)
                {
                    return BadRequest("Nevalidan id usluge");
                }

               if(cena==0)
               {
                   return BadRequest("nevalidna vrednost cene");
               }
               usluga.Cena=cena;

                await Context.SaveChangesAsync(); 

                return Ok(await Context.Usluge.Where(r =>r.ID==id).Select(p =>
                new
                {
                    p.ID,
                    p.Naziv,
                    p.Cena

                }).FirstOrDefaultAsync());
            }
            catch (Exception e)
            {
                return BadRequest("Doslo je do greske: " + e.Message);
            }
        }
        
        [Route("ObrisiUslugu/{idUsluge}")]
        [HttpDelete]
        [Authorize(Roles ="Admin")]
        public async Task<ActionResult> ObrisiUslugu(int idUsluge)
        {
            try
            {
               var usluga=Context.Usluge.Include(p=>p.TipUsluge)
                                        //.ThenInclude(p=>p.Radnici)
                                       // .ThenInclude(p=>p.Termini)
                                       // .ThenInclude(p=>p.Korisnik)
                                      /*  .ThenInclude(p=>p.Termini)*/.Where(p=>p.ID==idUsluge).FirstOrDefault();
               if(usluga==null)
               {
                   return BadRequest("nevalidan id usluge!");
               }
               var danas=DateTime.Now.ToString("HH:mm");
               //ZAKAZANI NEODRADJENI TERMINI, od sad pa na dalje?
               var termini=Context.Termini.Include(p=>p.Usluga)
                                        .Include(p=>p.Korisnik)
                                        .Where(p=>p.Usluga.ID==idUsluge
                                        && p.Korisnik!=null
                                        && p.StatusOdradjen==false
                                        && p.Datum >= DateTime.Today);
                if(termini.Count()>0)
                {
                    return BadRequest("Ne možete obrisati uslugu! Postoje zakazani termini za ovu uslugu!");
                }
                
                if(Context.Usluge.Contains(usluga))
                {
                    Context.Usluge.Remove(usluga);
                }
                //treba da se maknu svi termini sa tom uslugom
                
                
                
                await Context.SaveChangesAsync();

                
                return Ok();
                
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    //     [Route("ObrisiUslugu/{idUsluge}")]
    //     [HttpDelete]
    //    [Authorize(Roles ="Admin")]
    //     public async Task<ActionResult> ObrisiUslugu(int idUsluge)//brise iz liste termina sve termine sa tom uslugom
    //                                                             //brise se i kod radnika i kod korisnika
    //     {
    //         try
    //         {
    //            var usluga=Context.Usluge.Include(p=>p.TipUsluge)
    //                                     //.ThenInclude(p=>p.Radnici)
    //                                    // .ThenInclude(p=>p.Termini)
    //                                    // .ThenInclude(p=>p.Korisnik)
    //                                   /*  .ThenInclude(p=>p.Termini)*/.Where(p=>p.ID==idUsluge).FirstOrDefault();
    //            if(usluga==null)
    //            {
    //                return BadRequest("nevalidan id usluge!");
    //            }
    //            var termini=Context.Termini.Include(p=>p.Radnik)
    //                                     .ThenInclude(p=>p.Termini)
    //                                     .Include(p=>p.Korisnik)
    //                                     .ThenInclude(p=>p.Termini)
    //                                     .Include(p=>p.Korisnik)
    //                                     .ThenInclude(p=>p.PogodnijiTermini)
    //                                     .Include(p=>p.Usluga)
    //                                     .Where(p=>p.Usluga.ID==idUsluge).ToList();
    //             if(Context.Usluge.Contains(usluga))
    //             {
    //                 Context.Usluge.Remove(usluga);
    //             }
                
    //             if(termini.Count()!=0)
    //             {
    //                 foreach(var t in termini)
    //                 {
    //                     //ako je termin zakazan notif da je otkazan
    //                     if(t.Korisnik!=null)
    //                     {
    //                         //notifikacija korisniku
    //                         //obracunaj cvetice
    //                         //trebalo bi da se brise i iz pogodnijih termina
    //                        // t.Korisnik=null;
                            
    //                     }
    //                     if(Context.Termini.Contains(t))
    //                     {
    //                         Context.Termini.Remove(t);
    //                     }
                        
    //                     var pogter=Context.PogodnijiTermini.Where(p=>p.Termin==t).FirstOrDefault();
    //                     if(pogter!=null)
    //                     {
    //                         Context.PogodnijiTermini.Remove(pogter);//treba mi da se obrise i iz tabele veze
    //                     }
    //                 }
    //             }
    //             await Context.SaveChangesAsync();

                
    //             return Ok(Context.Termini.Select(p=>
    //             new
    //             {
    //                 p.Radnik,
    //                 p.Korisnik,
    //                 p.Usluga
    //             }));
                
    //         }
    //         catch(Exception e)
    //         {
    //             return BadRequest(e.Message);
    //         }
    //     }

        [Route("ObrisiTipUsluge/{idTipa}")]
        [HttpDelete]
        [Authorize(Roles ="Admin")]
        public async Task<ActionResult> ObrisiTipUsluge(int idTipa)//proveri
        //sa ovim include samo stavi svuda gde ima ref na tip null, ne obrise ga skroz                                             
        {
            try
            {
               var tip=Context.TipoviUsluge.Include(p=>p.Radnici)//u radniku nije psotavilo null
                                           // .ThenInclude(p=>p.TipUsluge)
                                            .Include(p=>p.Usluge)//postavilo  usluzi null
                                            .Where(p=>p.ID==idTipa)
                                            .FirstOrDefault();
               if(tip==null)
               {
                   return BadRequest("nevalidan id tipa usluge!");
               }
            //    var termini=Context.Termini.Include(p=>p.Radnik)
            //                             .ThenInclude(p=>p.Termini)
            //                             //.Include(p=>p.Radnik)
            //                            // .ThenInclude(p=>p.TipUsluge)
            //                             .Include(p=>p.Korisnik)
            //                             .ThenInclude(p=>p.Termini)
            //                             .Include(p=>p.Korisnik)
            //                             .ThenInclude(p=>p.PogodnijiTermini)
            //                            //.Include(p=>p.Usluga)
            //                            // .ThenInclude(p=>p.TipUsluge)
            //                             .Include(p=>p.Vreme)
            //                             .ThenInclude(p=>p.TipUsluge)
            //                             .Where(p=>p.Usluga.TipUsluge.ID==idTipa).ToList();
                // if(Context.TipoviUsluge.Contains(tip))
                // {
                //     Context.TipoviUsluge.Remove(tip);
                // }
            
                // if(termini.Count()!=0)
                // {
                //     foreach(var t in termini)
                //     {
                //         //ako je termin zakazan notif da je otkazan
                //         if(t.Korisnik!=null)
                //         {
                //             //notifikacija korisniku
                //             //obracunaj cvetice
                //             //trebalo bi da se brise i iz pogodnijih termina
                //         }
                //         if(Context.Termini.Contains(t))
                //         {
                //             Context.Termini.Remove(t);
                //         }
                //         var pogter=Context.PogodnijiTermini.Where(p=>p.Termin==t).FirstOrDefault();
                //         if(pogter!=null)
                //         {
                //             Context.PogodnijiTermini.Remove(pogter);//treba mi da se obrise i iz tabele veze
                //         }
                //     }
                // }
                await Context.SaveChangesAsync();
                return Ok(Context.Termini.Select(p=>
                new
                {
                    p.Radnik,
                    p.Korisnik,
                    p.Usluga
                }));
                
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }

    //----------------------------NE KORISTI SE-----------------------------------//
        /*

        [Route("DodajUsluguBody")]
        [HttpPost]
        public async Task<ActionResult> DodajUslugu([FromBody] Usluga usluga)
        {
            if (string.IsNullOrWhiteSpace(usluga.Naziv) || usluga.Naziv.Length > 50)
            {
                return BadRequest("Pogresan naziv!");
            }
            try
            {
                Context.Usluge.Add(usluga);
                await Context.SaveChangesAsync();
                return Ok($"Usluga je dodata! ID: {usluga.ID}");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        [Route("DodajTipUslugeBody")]
        [HttpPost]
        public async Task<ActionResult> DodajTipUsluge([FromBody] TipUsluge tip)
        {
            if (string.IsNullOrWhiteSpace(tip.Naziv) || tip.Naziv.Length > 50)
            {
                return BadRequest("Pogresan naziv!");
            }
            try
            {
                Context.TipoviUsluge.Add(tip);
                await Context.SaveChangesAsync();
                return Ok($"Tip usluge je dodat! ID: {tip.ID}");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
*/

    }
}