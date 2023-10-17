using System;
using System.Collections.Generic;
using System.Linq;
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
    public class StatistikaController : ControllerBase
    {
        public BeautyContext Context { get; set; }
        public StatistikaController( BeautyContext context)
        {
            Context = context;
        }

        [Route("PrihodiGrafik/{idTipa}")]
        [HttpGet]
        [Authorize(Roles ="Menadzer")]
        //menadzer
        public async Task<ActionResult> PrihodiGrafik(int idTipa)
        {
            try
            {
                var prihodi=await Context.Placanja.Include(p=>p.TipUsluge)
                .Where(p => ( idTipa>0 ? ( p.TipUsluge!=null && p.TipUsluge.ID==idTipa ) : true)).ToListAsync();

                var jan=prihodi.Where(p=>p.Datum.Month==1).Sum(p=>p.Cena);
                var feb=prihodi.Where(p=>p.Datum.Month==2).Sum(p=>p.Cena);
                var mar=prihodi.Where(p=>p.Datum.Month==3).Sum(p=>p.Cena);
                var apr=prihodi.Where(p=>p.Datum.Month==4).Sum(p=>p.Cena);
                var maj=prihodi.Where(p=>p.Datum.Month==5).Sum(p=>p.Cena);
                var jun=prihodi.Where(p=>p.Datum.Month==6).Sum(p=>p.Cena);
                var jul=prihodi.Where(p=>p.Datum.Month==7).Sum(p=>p.Cena);
                var avg=prihodi.Where(p=>p.Datum.Month==8).Sum(p=>p.Cena);
                var sept=prihodi.Where(p=>p.Datum.Month==9).Sum(p=>p.Cena);
                var okt=prihodi.Where(p=>p.Datum.Month==10).Sum(p=>p.Cena);
                var nov=prihodi.Where(p=>p.Datum.Month==11).Sum(p=>p.Cena);
                var dec=prihodi.Where(p=>p.Datum.Month==12).Sum(p=>p.Cena);

                return Ok(
                new
                {
                    jan,
                    feb,
                    mar,
                    apr,
                    maj,
                    jun,
                    jul,
                    avg,
                    sept,
                    okt,
                    nov,
                    dec
                });
            
            }
            catch (Exception e)
            {
                return BadRequest("Doslo je do greske: " + e.Message);
            }
        }

        [Route("PrihodiVrednost/{godina}/{mesec}/{idTipa}")]
        [HttpGet]
        [Authorize(Roles ="Menadzer")]
        public async Task<ActionResult> PrihodiVrednost(int godina, int mesec,int idTipa)
        {
            try
            {
                var god= godina== 1 ? 2022 : 2023;
                var prihodi=await Context.Placanja.Include(p=>p.TipUsluge)
                                        .Where(p=>p.TipUsluge!=null 
                                        && (idTipa>0 ? ( p.TipUsluge!=null && p.TipUsluge.ID==idTipa ) : true)
                                        && (mesec>0 ? p.Datum.Month==mesec : true)
                                        && (godina>0 ? p.Datum.Year==god : true)).ToListAsync();

                
                return Ok( prihodi.Sum(p=>p.Cena) );
            
            }
            catch (Exception e)
            {
                return BadRequest("Doslo je do greske: " + e.Message);
            }
        }

        [HttpGet]
        [Route("PregledDoprinosaZaposlenih/{nazivTipa}/{vreme}")]
        [Authorize(Roles ="Menadzer")]
        public async Task<ActionResult> PregledDoprinosaZaposlenih(string nazivTipa, int vreme)
        {//1-nedelja, 2-mesec, 3-godina
            try
            {
                nazivTipa=nazivTipa.ToLower();

                var placanja=Context.Placanja.Include(p=>p.TipUsluge).Include(p=>p.Radnik)
                .Where(p=> p.TipUsluge != null && p.TipUsluge.Naziv==nazivTipa && p.Radnik!=null//
                 && (
                    vreme==1 ? ( p.Datum > DateTime.Today.AddDays(-6) ) 
                            :  ( vreme==2 ? (p.Datum > DateTime.Today.AddDays(-30)) : (p.Datum > DateTime.Today.AddDays(-364)) )
                    ));

                 var lista = Context.Radnici.Include(p=>p.TipUsluge)
                                            .Include(p=>p.Placanja)
                                            .Where(p=>p.TipUsluge!=null && p.TipUsluge.Naziv==nazivTipa);

                
                return Ok(await lista.Select(p=>
                new
                {
                    ime=p.Ime+" "+p.Prezime,
                    broj=Math.Round(
                    (double)( placanja.Count() > 0 ?
                    ( 
                        (double)( p.Placanja.Where( p => ( ( vreme==1 ? ( p.Datum > DateTime.Today.AddDays(-6) )
                                                                      : ( vreme==2 ? (p.Datum > DateTime.Today.AddDays(-30) ) : ( p.Datum > DateTime.Today.AddDays(-364) ) )))).Count()) / (double)placanja.Count() 
                    ) : 0)*100,2)
                }).ToListAsync());
            }
            catch (Exception e)
            {
                return BadRequest("Doslo je do greske: " + e.Message);
            }
        }
    }
}

