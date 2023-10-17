using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Models;

namespace Salon.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly RoleManager<AppRole> _roleManager;
        private readonly IConfiguration _configuration;
        public BeautyContext Context { get; set; }

        public AccountController(BeautyContext context,UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, RoleManager<AppRole> roleManager, IConfiguration configuration)
        {
            _userManager = userManager;
            _signInManager=signInManager;
            _roleManager = roleManager;
            _configuration = configuration;
            Context = context;
        }

        [HttpPost]
        [Route("Register/{email}/{password}/{ime}/{prezime}/{tel}")]
        //[AllowAnonymous]
        public async Task<ActionResult> Register(string email, string password, string ime, string prezime, string tel)//ok
        {
            try
            {
                var userExists = await _userManager.FindByEmailAsync(email);
                if(userExists!=null)
                    return BadRequest("Vec postoji nalog sa ovim email-om!");
                var user = new Korisnik();
                user.Email=email;
                user.UserName=email;
                user.Ime=ime.ToLower();
                user.Prezime=prezime.ToLower();
                user.PhoneNumber=tel;
                
                user.SecurityStamp = Guid.NewGuid().ToString();

                IdentityResult result = await _userManager.CreateAsync(user, password);
                if(!result.Succeeded)
                {
                    return BadRequest("Nije uspesno kreiran nalog!");
                }

                IdentityResult roleResult= await _userManager.AddToRoleAsync(user, UserRoles.Korisnik);
        
                var userRoles= await _userManager.GetRolesAsync(user);

                var authClaims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name,user.UserName),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                    new Claim("Email", user.Email),
                    new Claim("Id", user.Id.ToString())
                    
                };

                foreach(var userRole in userRoles)
                {
                    authClaims.Add(new Claim(ClaimTypes.Role, userRole));
                }

                var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:SecretKey"]));

                var token = new JwtSecurityToken(
                    issuer: _configuration["JWT:ValidIssuer"],
                    audience:_configuration["JWT:ValidAudience"],
                    expires: DateTime.Now.AddHours(1),
                    claims: authClaims,
                    signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
                );
                string data=userRoles[0];
                return Ok(
                    new 
                    { 
                        token = new JwtSecurityTokenHandler().WriteToken(token), 
                        expiration=token.ValidTo,
                        data
                    });
          
            }
            catch(Exception ex)
            {
               return BadRequest(ex.Message);
            } 
        }

        [HttpPost]
        [Route("DodajRadnika/{ime}/{prezime}/{tel}/{tipNaziv}/{email}/{password}")]
        [Authorize(Roles="Menadzer")]

        public async Task<ActionResult> DodajRadnika(string ime, string prezime,string tel, string tipNaziv,string email,string password)//ok
        {
             try
            {
                
                var br=0;
                if(Context.Radnici.OrderBy(e=>e.Id).LastOrDefault()!=null)
                {
                    br=Context.Radnici.OrderBy(e=>e.Id).LastOrDefault().Id;
                }

                //var email="radnik"+br+"@gmail.com";
                //var password="Radnik"+br+"!";
                var userExists = await _userManager.FindByEmailAsync(email);
                if(userExists!=null)
                    return BadRequest("Vec postoji radnik sa ovim email-om!");
                var user = new Radnik();
                user.Email=email;
                user.UserName=email;
                user.Ime=ime.ToLower();
                user.Prezime=prezime.ToLower();
                user.PhoneNumber=tel;
                tipNaziv=tipNaziv.ToLower();
                var tip=Context.TipoviUsluge.Where(p=>p.Naziv==tipNaziv).FirstOrDefault();
                if(tip==null)
                {
                    return BadRequest("Ne postoji tip usluge");
                }
                user.TipUsluge=tip;
                user.SecurityStamp = Guid.NewGuid().ToString();//!!!!!!!!!!!!!!!!!!!!!!!!!

                IdentityResult result = await _userManager.CreateAsync(user, password);
                if(!result.Succeeded)
                {
                    return BadRequest("Nije uspesno kreiran radnik! Pokusajte ponovo");//vrv pogresna sifra?
                }

                IdentityResult roleResult= await _userManager.AddToRoleAsync(user, UserRoles.Radnik);

                //generisanje termina
            
                for(int i=0;i<14;i++)
                {
                    var vremena=Context.Vremena.Include(p=>p.TipUsluge).Where(p=>p.TipUsluge==user.TipUsluge).OrderBy(p=>p.ID).ToList();
                    foreach(var vreme in vremena)
                    {
                        //provera jel radnik u terminima za taj dan ima ovo vreme
                        var terminDanas=Context.Termini.Include(p=>p.Radnik)
                                                        .Include(p=>p.Vreme)
                                                        .Where(p=>p.Datum==DateTime.Today.AddDays(i)
                                                         && p.Vreme==vreme
                                                         && p.Radnik==user).FirstOrDefault();
                                                         
                        if(terminDanas==null)//nema, pravi se novi termin
                        {
                            var noviTermin=new Termin();
                            noviTermin.Datum=DateTime.Today.AddDays(i);
                            noviTermin.StatusOdradjen=false;
                            noviTermin.Cena=0;
                            noviTermin.Usluga=null;
                            noviTermin.Korisnik=null;
                            noviTermin.Radnik=user;
                            noviTermin.Vreme=vreme;
                            Context.Termini.Add(noviTermin);

                            var radnik=Context.Radnici.Include(p=>p.Termini).Where(p=>p==user).FirstOrDefault();
                            radnik.Termini.Add(noviTermin); 
                        }
                        
                    }
                }
                
            await Context.SaveChangesAsync();
          
                return Ok(
                    new
                    {  
                        email,
                        password
                    }
                );
            }
            catch(Exception ex)
            {
               return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("Login/{email}/{password}")]
        //[AllowAnonymous]
        public async Task<ActionResult> Login(string email, string password)//ok
        {
            var user = await _userManager.FindByEmailAsync(email);
          
            if(user!=null && await _userManager.CheckPasswordAsync(user, password))
            {
                var userRoles= await _userManager.GetRolesAsync(user);

                var authClaims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name,user.UserName),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                    new Claim("Email", user.Email),
                    new Claim("Id", user.Id.ToString())
                    
                };

                foreach(var userRole in userRoles)
                {
                    authClaims.Add(new Claim(ClaimTypes.Role, userRole));
                }

                var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:SecretKey"]));

                var token = new JwtSecurityToken(
                    issuer: _configuration["JWT:ValidIssuer"],
                    audience:_configuration["JWT:ValidAudience"],
                    expires: DateTime.Now.AddHours(5),
                    claims: authClaims,
                    signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
                );
                string data=userRoles[0];
                return Ok(
                    new 
                    { 
                        token = new JwtSecurityTokenHandler().WriteToken(token), 
                        expiration=token.ValidTo,
                        data
                    });
            }
            else
            {
                return BadRequest("Nevalidan email ili lozinka!");
            }
            
               
        }
        

        [HttpPut]
        [Route("ChangePassword/{oldpass}/{newpass}")]
        [Authorize(Roles ="Korisnik,Radnik")]
        public async Task<ActionResult> ChangePassword(string oldpass,string newpass)//ok
        {
            try
            {
                var identity=HttpContext.User.Identity as ClaimsIdentity;
                var id=Int32.Parse(identity.FindFirst("Id").Value);
                var user =  Context.Users.Where(p=>p.Id==id).FirstOrDefault();
                var checkpass=await _userManager.CheckPasswordAsync(user,oldpass);
               
                if(!checkpass)
                {
                    return BadRequest("Pogresno ste uneli staru sifru! Pokusajte ponovo");
                }
                var token = await _userManager.GeneratePasswordResetTokenAsync(user);
                var result = await _userManager.ResetPasswordAsync(user, token, newpass);
                if(!result.Succeeded)
                {
                    return BadRequest("Sifra mora da ima bar jedno veliko slovo, broj i specijalni karakter!");//javlja kad se unese sifra koja ne zadovoljava kriterijume sve
                }

                return Ok("Sifra je promenjena");
            }
            catch(Exception ex)
            {
               return BadRequest(ex.Message);
            }

        }

        [HttpGet]
        [Route("GetUser")]
        [Authorize(Roles="Admin,Radnik,Korisnik,Menadzer")]
        public async Task<ActionResult> GetUser()//ok
        {
            var identity=HttpContext.User.Identity as ClaimsIdentity;
            var id=Int32.Parse(identity.FindFirst("Id").Value);
            
            var roleId=Context.UserRoles.Where(p=>p.UserId==id).FirstOrDefault().RoleId;
            var roleFind=Context.Roles.Where(p=>p.Id==roleId).FirstOrDefault();
            
            if(roleFind==null)
            {
                return BadRequest("Ne postoji uloga");
            }
            var role=roleFind.Name;

            if(role=="Korisnik")
            {
                var user=Context.Korisnici.Include(p=>p.Radnici)
                                            .ThenInclude(p=>p.TipUsluge)
                                            .Include(p=>p.Termini)
                                            .Include(p=>p.Radnici)
                                            .ThenInclude(p=>p.Recenzije)
                                            .Include(p=>p.PogodnijiTermini)
                                            .Where(p=>p.Id==id);
                if(user.Count()!=1)
                {
                    return BadRequest("Nevalidan korisnik!");
                }
                return Ok(await user.Select(p=>
                new
                {
                    role,
                    p.Ime,
                    p.Prezime,
                    p.Email,
                    p.PhoneNumber,
                    p.Popust,
                    p.PogodnijiTermini
                }).ToListAsync());
            }
            if(role=="Radnik")
            {
                var user=Context.Radnici.Include(p=>p.Termini)
                                            .Include(p=>p.Recenzije)
                                            .Where(p=>p.Id==id);
                if(user.Count()!=1)
                {
                    return BadRequest("Nevalidan radnik!");
                }
                return Ok(await user.Select(p=>
                new
                {
                    role,
                    p.Ime,
                    p.Prezime,
                    p.Email,
                    p.PhoneNumber
                    
                }).ToListAsync());
            }
            if(role=="Admin")
            {
                var user=Context.Users.Where(p=>p.Id==id);

                if(user.Count()!=1)
                {
                    return BadRequest("Nevalidan admin!");
                }
                return Ok(await user.Select(p=>
                new
                {
                    role,
                    p.Email
                }).ToListAsync());
            }
            if(role=="Menadzer")
            {
                var user=Context.Users.Where(p=>p.Id==id);

                if(user.Count()!=1)
                {
                    return BadRequest("Nevalidan menadzer!");
                }
                return Ok(await user.Select(p=>
                new
                {
                    role,
                    p.Ime,
                    p.Prezime,
                    p.Email,
                    p.PhoneNumber
                }).ToListAsync());
            }

            return BadRequest("Nevalidna uloga!");
                
        }
        
        
    }
}
