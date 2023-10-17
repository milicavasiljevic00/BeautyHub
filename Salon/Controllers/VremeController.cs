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
    public class VremeController : ControllerBase
    {
        public BeautyContext Context { get; set; }
        public VremeController( BeautyContext context)
        {
            Context = context;
        }

        
    //     [HttpGet]
    //    [Route("VratiVremenaZaTip/{id}/{dat}")]
    //    //[Authorize(Roles ="Korisnik")]
    //    [AllowAnonymous]
    //    public async Task<ActionResult> VratiVremenaZaTip(string naziv)
    //    {
    //        try
    //        {
    //         var vremena=Context.Vremena.Include(p=>p.TipUsluge).Where(p=>p.TipUsluge.Naziv==naziv);
            
    //             return Ok(await vremena.Select(p=>
    //                     new
    //                     {
    //                         p.VremeOd,
    //                         p.VremeDo

    //                     }).ToListAsync());
    //        }
    //        catch (Exception e)
    //         {
    //             return BadRequest("Doslo je do greske: " + e.Message);
    //         }
            
    //    }
    //    [HttpGet]
    //    [Route("VratiDatume")]
    //    //[Authorize(Roles ="Korisnik")]
    //    [AllowAnonymous]
    //    public async Task<ActionResult> VratiDatume()
    //    {
    //        try
    //        {   
               
    //            for(int i=0;i<14;i++)
    //             {
                    
    //             }
    //             return Ok();
    //        }
    //        catch (Exception e)
    //         {
    //             return BadRequest("Doslo je do greske: " + e.Message);
    //         }
            
    //    }
        [HttpGet]
        [Route("VratiVremenaZauzetihTerminaTip/{naziv}/{dat}")]
        [Authorize(Roles ="Korisnik")]
        public async Task<ActionResult> VratiVremenaZauzetihTerminaTip(string naziv,DateTime dat)//OK
        {
            try//zauzeta vremena za dan i tip, samo jednom da se javljaju
            {
                var identity=HttpContext.User.Identity as ClaimsIdentity;
                var idKorisnika=Int32.Parse(identity.FindFirst("Id").Value);
                var danas=DateTime.Now.ToString("HH:mm");
                var pogodniji=Context.Korisnici.Include(p=>p.PogodnijiTermini)
                                                .ThenInclude(p=>p.Termin)
                            .Where(p=>p.Id==idKorisnika).FirstOrDefault().PogodnijiTermini.Select(p=>p.Termin);
                            //return Ok(pogodniji);
                var vremena= Context.Termini.Include(p=>p.Vreme)
                                            .Include(p=>p.Usluga)
                                            .ThenInclude(p=>p.TipUsluge)
                                            .Include(p=>p.Korisnik)
                                            .Include(p=>p.Radnik)
                                            .ThenInclude(p=>p.TipUsluge)
                                            .Where(p => p.Radnik.TipUsluge!=null  && p.Usluga.TipUsluge.Naziv==naziv
                                            && p.Datum==dat && p.Korisnik!=null && p.Korisnik.Id!=idKorisnika && p.StatusOdradjen==false
                                            && !pogodniji.Contains(p)
                                            && (p.Datum==DateTime.Today ? (p.Vreme.VremeOd.CompareTo(danas)>=0 ) : true))//nece da vrati moje zakazane termine i moje pogodnije termine
                                            //&& (p.Datum==DateTime.Today ? (p.Vreme.VremeOd.CompareTo(danas)>=0 ) : true)
                                            .Select(p=>p.Vreme).Distinct();
                    return Ok(await vremena.Select(p=>
                            new
                            {
                                p.ID,
                                p.VremeOd,
                                p.VremeDo

                            }).ToListAsync());
            }
            catch (Exception e)
                {
                    return BadRequest("Doslo je do greske: " + e.Message);
                }
                
        }

        [Route("DodajVreme/{vremeOd}/{vremeDo}/{naziv}")]
        [HttpPost]
        [AllowAnonymous]
        public async Task<ActionResult> DodajVreme(string vremeOd, string vremeDo, string naziv)
        {
            try
            {
                naziv=naziv.ToLower();
                
                var tip=Context.TipoviUsluge.Include(p=>p.Usluge).Where(p=>p.Naziv==naziv).FirstOrDefault();
                if(tip==null)
                {
                    return BadRequest("ne postoji ovaj tip usluge");
                }
                var vreme=new Vreme();
                vreme.VremeDo=vremeDo;
                vreme.VremeOd=vremeOd;
                vreme.TipUsluge=tip;

                Context.Vremena.Add(vreme);
                await Context.SaveChangesAsync();
                return Ok(vreme);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
       
    }
}

