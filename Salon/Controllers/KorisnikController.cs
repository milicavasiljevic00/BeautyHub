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
    public class KorisnikController : ControllerBase
    {
        public BeautyContext Context { get; set; }
        public KorisnikController( BeautyContext context)
        {
            Context = context;
        }

        [Route("AzurirajLicneInfoKorisnik/{ime}/{prezime}/{telefon}")]
        [HttpPut]
        [Authorize(Roles ="Korisnik")]
        public async Task<ActionResult> AzurirajLicneInfoKorisnik(string ime, string prezime,string telefon)//ok
        {
            try
            {
                var identity=HttpContext.User.Identity as ClaimsIdentity;
                var id= Int32.Parse(identity.FindFirst("Id").Value);
                
                ime=ime.ToLower();
                prezime=prezime.ToLower();

                var korisnik=Context.Korisnici.Where(p=>p.Id==id).FirstOrDefault();

                if(korisnik==null)
                {
                    return BadRequest("Ne postoji ovaj korisnik u bazi!");
                }

                korisnik.Ime=ime;
                korisnik.Prezime=prezime;
                korisnik.PhoneNumber=telefon;
                
                await Context.SaveChangesAsync(); 

                return Ok(await Context.Korisnici.Where(p=>p.Id==id).Select(p=>
                new
                {
                    p.Id,
                    p.Ime,
                    p.Prezime,
                    p.PhoneNumber
                }).ToListAsync());
            
            }
            catch (Exception e)
            {
                return BadRequest("Doslo je do greske: " + e.Message);
            }
        }

       
    }
}
