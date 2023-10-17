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

   
    public class SalonInfoController : ControllerBase
    {
        public BeautyContext Context { get; set; }

        public SalonInfoController(BeautyContext context)
        {
            Context = context;
        }
        
        [Route("PreuzmiSalonInfo")]
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult> PreuzmiSalonInfo() 
        {
            try
            {
                return Ok(await Context.SalonInfo.Select(p =>
                new
                {
                    p.ID,
                    p.Naziv,
                    p.VremeOd,
                    p.VremeDo,
                    p.Adresa,
                    p.Telefon

                }).ToListAsync());
            }
            catch (Exception e)
            {
                return BadRequest("Doslo je do greske: " + e.Message);
            }
        }

        [Route("DodajSalonInfo/{naziv}/{vremeOd}/{vremeDo}/{adresa}/{telefon}")]
        [HttpPost]
        [Authorize(Roles ="Admin")] 
        public async Task<ActionResult> DodajSalonInfo(string naziv, string vremeOd, string vremeDo, string adresa, string telefon)
        {
            if (!Context.SalonInfo.Any())
            {
                // SalonInfo podaci nisu već postavljeni
                var salon=new SalonInfo();

                salon.Naziv=naziv;
                salon.VremeOd=vremeOd;
                salon.VremeDo=vremeDo;
                salon.Adresa=adresa;
                salon.Telefon=telefon;
                
                if(!Context.SalonInfo.Contains(salon))
                    Context.SalonInfo.Add(salon);

                await Context.SaveChangesAsync();
                return Ok("dodate informacije o salonu");
            }

            return BadRequest("Podaci su već postavljeni.");
        }

        [Route("IzmeniSalonInfo/{naziv}/{vremeOd}/{vremeDo}/{adresa}/{telefon}")]
        [HttpPut]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> IzmeniSalonInfo(string naziv, string vremeOd, string vremeDo, string adresa, string telefon)
        {
            var salon = Context.SalonInfo.FirstOrDefault(); // Pretpostavljamo da postoji samo jedan SalonInfo u bazi

            if (salon != null)
            {
                salon.Naziv = naziv;
                salon.VremeOd = vremeOd;
                salon.VremeDo = vremeDo;
                salon.Adresa = adresa;
                salon.Telefon = telefon;

                await Context.SaveChangesAsync();
                
                return Ok(await Context.SalonInfo.Select(p =>
                new
                {
                    p.ID,
                    p.Naziv,
                    p.VremeOd,
                    p.VremeDo,
                    p.Adresa,
                    p.Telefon

                }).ToListAsync());
            }

            return NotFound("Podaci o salonu nisu pronađeni.");
        }

        [Route("PreuzmiPreporuke")]
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult> PreuzmiPreporuke() 
        {
            try
            {
                var preporuke = await Context.Preporuke
                    .OrderByDescending(p => p.Ocena)
                    .Take(3)
                    .Select(p => new
                    {
                        p.ID,
                        p.Ocena,
                        p.Komentar,
                        p.Korisnik.Ime
                    })
                    .ToListAsync();

                return Ok(preporuke);
            }
            catch (Exception e)
            {
                return BadRequest("Došlo je do greške: " + e.Message);
            }
        }

        [Route("DodajPreporuku/{ocena}/{kom}")]
        [HttpPost]
        [Authorize(Roles ="Korisnik")] 
        public async Task<ActionResult> DodajPreporuku(int ocena, string kom)
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
                
                var korisnik=Context.Korisnici.Include(p=>p.Radnici)
                                                .Where(p=>p.Id==id).FirstOrDefault();
        
                if(korisnik==null)
                {
                    return BadRequest("ne postoji ovaj korisnik");
                }

                var preporuka=new Preporuka();

                preporuka.Korisnik=korisnik;
                preporuka.Ocena=ocena;
                preporuka.Komentar=kom;
                
                if(!Context.Preporuke.Contains(preporuka))
                    Context.Preporuke.Add(preporuka);

                await Context.SaveChangesAsync();
                return Ok("dodata preporuka");
            }
            catch (Exception e)
            {
                return BadRequest("Doslo je do greske: " + e.Message);
            }
        }

    }
}