//using System.Collections.Generic;
//using System.ComponentModel.DataAnnotations;
//using System.ComponentModel.DataAnnotations.Schema;
using System;
using System.Linq;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Models
{
    public static class SeedData
    {
        public static void Seed(UserManager<AppUser> userManager, RoleManager<AppRole> roleManager, BeautyContext context)
        {
            SeedRoles(roleManager);
            SeedUsers(userManager);
            napraviTermine(context);
            //obrisiTermine(context); puklo je kad sam ovo otkom
        }

        private static void SeedUsers(UserManager<AppUser> userManager)
        {
            if(userManager.FindByNameAsync("admin").Result == null)
            {
                var user = new AppUser
                {
                    UserName="admin",
                    Email = "admin@gmail.com"
                };
                var result =  userManager.CreateAsync(user,"Admin123!").Result;
                if(result.Succeeded)
                {
                    userManager.AddToRoleAsync(user,"Admin").Wait();
                }
            }

            if(userManager.FindByNameAsync("menadzer").Result == null)
            {
                var user = new AppUser
                {
                    UserName="menadzer",
                    Email = "menadzer@gmail.com",
                    PhoneNumber="0616936405",
                    Ime="Menadzer",
                    Prezime=""
                };
                var result =  userManager.CreateAsync(user,"Menadzer123!").Result;
                if(result.Succeeded)
                {
                    userManager.AddToRoleAsync(user,"Menadzer").Wait();
                }
            }
        }

        private static void SeedRoles(RoleManager<AppRole> roleManager)
        {
            if(!roleManager.RoleExistsAsync("Admin").Result)
            {
                var role = new AppRole
                {
                    Name="Admin"
                };
                 var result = roleManager.CreateAsync(role).Result;
            }

            if(!roleManager.RoleExistsAsync("Korisnik").Result)
            {
                var role = new AppRole
                {
                    Name="Korisnik"
                };
                var result =roleManager.CreateAsync(role).Result;
            }

            if(!roleManager.RoleExistsAsync("Menadzer").Result)
            {
                var role = new AppRole
                {
                    Name="Menadzer"
                };
                var result =roleManager.CreateAsync(role).Result;
            }

            if(!roleManager.RoleExistsAsync("Radnik").Result)
            {
                var role = new AppRole
                {
                    Name="Radnik"
                };
                var result =roleManager.CreateAsync(role).Result;
            }
        }

        private static void napraviTermine(BeautyContext Context)
        {
            var radnici=Context.Radnici.Include(p=>p.Termini)
                                        .ThenInclude(p=>p.Korisnik)
                                        .Include(p=>p.Termini)
                                        .ThenInclude(p=>p.Vreme)
                                        .Include(p=>p.TipUsluge)
                                        .Where(p=>p.TipUsluge!=null).ToList();
            foreach(var radnik in radnici)
            {
                for(int i=0;i<14;i++)
                {
                    var vremena=Context.Vremena.Include(p=>p.TipUsluge).Where(p=>p.TipUsluge==radnik.TipUsluge).OrderBy(p=>p.ID).ToList();//sva vremena za taj tip
                    //valjda svaki radnik moze za taj dan da ima max onoliko termina koliko ima vremena za taj tip
                    foreach(var vreme in vremena)
                    {
                        //provera jel radnik u terminima za taj dan ima ovo vreme
                        //OVO MOZE DA ZEZA AKO RADNIKU LISTA TERMINA NULL KAO U DODAVANJU ALI NZM KAD JE TO
                        var terminDanas=radnik.Termini.Where(p=>p.Datum==DateTime.Today.AddDays(i) && p.Vreme==vreme).FirstOrDefault();
                        if(terminDanas==null)//nema, pravi se novi termin
                        {
                            var noviTermin=new Termin();
                            noviTermin.Datum=DateTime.Today.AddDays(i);
                            noviTermin.StatusOdradjen=false;
                            noviTermin.Cena=0;
                            noviTermin.Usluga=null;
                            noviTermin.Korisnik=null;
                            noviTermin.Radnik=radnik;
                            noviTermin.Vreme=vreme;
                            radnik.Termini.Add(noviTermin); //gde treba save changes? jel moze skroz na kraju?


                            //JEL TREBA???
                            Context.Termini.Add(noviTermin);
                        }
                        var terminJuce=radnik.Termini.Where(p=>p.Datum==DateTime.Today.AddDays(-1) && p.Vreme==vreme).FirstOrDefault();
                        if(radnik.Termini.Contains(terminJuce))
                        {
                            radnik.Termini.Remove(terminJuce);
                        }
                        //treba i iz liste korisnika da se obrise? ili je dosta sto se brise ceo termin?
                        if(Context.Termini.Contains(terminJuce))
                        {
                            Context.Termini.Remove(terminJuce);
                        }
                        var pogter=Context.PogodnijiTermini.Where(p=>p.Termin==terminJuce).FirstOrDefault();
                        if(pogter!=null)
                        {
                            Context.PogodnijiTermini.Remove(pogter);//treba mi da se obrise i iz tabele veze
                        }
                    }
                }
                var terminiProsli=radnik.Termini.Where(p=>p.Datum<DateTime.Today);
                foreach(var t in terminiProsli)
                {
                    var ter=Context.Termini.Find(t.ID);
                    if(Context.Termini.Contains(ter))
                    {
                        Context.Termini.Remove(ter);
                    }
                    var pogter=Context.PogodnijiTermini.Where(p=>p.Termin==ter).FirstOrDefault();
                    if(pogter!=null)
                    {
                        Context.PogodnijiTermini.Remove(pogter);//treba mi da se obrise i iz tabele veze
                    }
                }
                
            }

            Context.SaveChanges();
        
        }
        // private static void obrisiTermine(BeautyContext Context)
        // {
        //     foreach(Termin t in Context.Termini)
        //     {
        //         Termin ter=Context.Termini.Find(t.ID);
        //         Context.Termini.Remove(ter);
        //     }
        //     Context.SaveChanges();
        // }
        // private static void obrisiRadnike(BeautyContext Context)
        // {
        //     var radnici=Context.Radnici.Include(p=>p.Termini);
        //     foreach(var t in radnici)
        //     {
        //         Radnik ter=Context.Radnici.Find(t.Id);
        //         Context.Radnici.Remove(ter);
        //     }
        //     Context.SaveChanges();
        // }
    }
}