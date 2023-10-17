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
//kkkk
namespace Salon.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class NotifikacijaController : ControllerBase
    {
        public BeautyContext Context { get; set; }
        public NotifikacijaController( BeautyContext context)
        {
            Context = context;
        }

        [Route("VratiNotifikacije")]
        [HttpGet]
        [Authorize(Roles ="Korisnik")]      
        public async Task<ActionResult> VratiNotifikacije()
        {
            try
            {
                var identity=HttpContext.User.Identity as ClaimsIdentity;
                var idKorisnika=Int32.Parse(identity.FindFirst("Id").Value);
                var korisnik=await Context.Korisnici.Include(p=>p.Notifikacije).ThenInclude(p=>p.Termin)
                                            .Where(p=>p.Id==idKorisnika).FirstOrDefaultAsync();
                if(korisnik==null)
                {
                    return BadRequest("nevalidan korisnik");
                }

                return Ok(korisnik.Notifikacije.OrderByDescending(p=>p.ID).Select(p=>
                new
                {
                    id=p.ID,
                    opis=p.Opis,
                    idter=(p.Termin!=null ? p.Termin.ID : 0),
                    datumNot=p.Datum,
                    tip=p.Tip
                }).ToList());
            
            }
            catch (Exception e)
            {
                return BadRequest("Doslo je do greske: " + e.Message);
            }
        }

        [Route("ObrisiNotifikaciju/{idNotif}")]
        [HttpDelete]
        [Authorize(Roles ="Korisnik")]
        public async Task<ActionResult> ObrisiNotifikaciju(int idNotif)
        {
            try
            {
                var notif=Context.Notifikacije.Where(p=>p.ID==idNotif).FirstOrDefault();
                if(notif==null)
                {
                    return BadRequest("nevalidna notif");
                }

                var identity=HttpContext.User.Identity as ClaimsIdentity;
                var idKorisnika=Int32.Parse(identity.FindFirst("Id").Value);
                var korisnik=await Context.Korisnici.Include(p=>p.Notifikacije)
                                            .Where(p=>p.Id==idKorisnika).FirstOrDefaultAsync();

                if(korisnik==null)
                {
                    return BadRequest("nevalidan korisnik");
                }
                if(korisnik.Notifikacije.Contains(notif))
                {
                    korisnik.Notifikacije.Remove(notif);
                }
                await Context.SaveChangesAsync();

                
                return Ok("obrisana notifikacija");
                
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        

       
    }
}

