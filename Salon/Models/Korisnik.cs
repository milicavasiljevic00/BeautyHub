using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Identity;

namespace Models
{
    public class Korisnik : AppUser
    {
        public double Popust { get; set; }//dinari koji se koriste za popust

        [JsonIgnore]
        public List<Radnik> Radnici {get; set;}

        [JsonIgnore]
        public List<Termin> Termini {get; set;}
        
        [JsonIgnore]
        public List<PogodnijiTermin> PogodnijiTermini {get; set;}

        public List<Notifikacija> Notifikacije { get; set; }
        
    }
}