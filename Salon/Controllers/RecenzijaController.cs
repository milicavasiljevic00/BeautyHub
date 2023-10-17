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

    public class RecenzijaController : ControllerBase
    {
        public BeautyContext Context { get; set; }
        public RecenzijaController( BeautyContext context)
        {
            Context = context;
        }

       [HttpGet]
       [Route("VratiSveRecenzije/{idRadnika}")]
       [Authorize(Roles ="Admin")]
       public async Task<ActionResult> VratiSveRecenzije(int idRadnika)
       {
            try
            {
                var recenzije=Context.Recenzije.Include(p=>p.Radnik)
                .ThenInclude(p=>p.TipUsluge)
                .Where(p=> (idRadnika>0 ? p.Radnik.Id==idRadnika : true)
                            && p.Radnik.TipUsluge!=null);//
               
                return Ok(await recenzije.Select(p=>
                new
                {
                    p.ID,
                    p.Radnik.Ime,
                    p.Radnik.Prezime,
                    p.Komentar,
                    p.Ocena 
                }).ToListAsync());
            }
            catch (Exception e)
            {
                return BadRequest("Doslo je do greske: " + e.Message);
            }
       }


        [Route("OceniRadnika/{idRadnika}/{ocena}/{kom}")]
        [HttpPost]
        [Authorize(Roles ="Korisnik")] 
        public async Task<ActionResult> OceniRadnika(int idRadnika, int ocena, string kom)
        {
            //NEVALIDNE VREDNSOTI: OCENA=0
            try
            {
                var identity=HttpContext.User.Identity as ClaimsIdentity;
                var id=Int32.Parse(identity.FindFirst("Id").Value);
                
                if(ocena==0)//ovo svakko na frontu provera
                {
                    return BadRequest("Morate uneti ocenu pri pisanju recenzije");
                }
                if(ocena>5 || ocena<1)
                {
                    return BadRequest("Ocena mora da bude izmedju 1 i 5");
                }
                var radnik=Context.Radnici.Include(p=>p.Recenzije)
                                                .Where(p=>p.Id==idRadnika).FirstOrDefault();
                var korisnik=Context.Korisnici.Include(p=>p.Radnici)
                                                .Where(p=>p.Id==id).FirstOrDefault();
                if(radnik==null)
                {
                    return BadRequest("ne postoji ovaj radnik");
                }
                if(korisnik==null)
                {
                    return BadRequest("ne postoji ovaj korisnik");
                }
                if(!korisnik.Radnici.Contains(radnik))//ovo nikad ne bi smelo da se desi, vrsice se prikaz samo onih randika kod kojih je bio
                {
                    return BadRequest("Korisnik nikad nije bio kod ovog radnika!");
                }
                var recenzija=new Recenzija();
                recenzija.Korisnik=korisnik;
                recenzija.Radnik=radnik;
                recenzija.Ocena=ocena;

                recenzija.Komentar=kom;
                

                if(!radnik.Recenzije.Contains(recenzija))
                    radnik.Recenzije.Add(recenzija);
                if(!Context.Recenzije.Contains(recenzija))
                    Context.Recenzije.Add(recenzija);

                await Context.SaveChangesAsync();
                return Ok("dodat kom");
            }
            catch (Exception e)
            {
                return BadRequest("Doslo je do greske: " + e.Message);
            }
        }

        [Route("ObrisiRecenziju/{idRecenzije}")]
        [HttpDelete]
        [Authorize(Roles ="Admin")]
        public async Task<ActionResult> ObrisiRecenziju(int idRecenzije) //proveri                                    
        {
            try
            {
                var recenzija=Context.Recenzije.Include(p=>p.Radnik)
                                                .ThenInclude(p=>p.Recenzije)
                                                .Include(p=>p.Korisnik)
                                                .Where(p=>p.ID==idRecenzije)
                                                .FirstOrDefault();
                if(recenzija==null)
                {
                    return BadRequest("Nevalian id recenzije!");
                }
                if(Context.Recenzije.Contains(recenzija))
                {
                    Context.Recenzije.Remove(recenzija);
                }
                await Context.SaveChangesAsync();
                return Ok();
                
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }
       
    }
}
