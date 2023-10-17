using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace Models
{
    public class Radnik : AppUser
    {
        public TipUsluge TipUsluge {get; set;}
        public List<Recenzija> Recenzije {get; set;}
        public List<Termin> Termini {get; set;}
        public List<Placanje> Placanja {get;}

    }
}