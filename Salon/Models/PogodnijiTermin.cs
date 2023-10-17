using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Security.Claims;
using Microsoft.AspNetCore.Identity;

namespace Models
{
    public class PogodnijiTermin
    {
        [Key]
        public int ID{get; set;}
        public Termin Termin {get; set;}
        //lista korisnika ne znam jel treba/mora
        public List<Korisnik> Korisnici {get; set;}
    }
}