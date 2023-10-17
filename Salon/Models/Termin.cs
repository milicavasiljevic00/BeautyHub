using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Models
{
    public class Termin
    {
        [Key]
        public int ID { get; set; } 

        public DateTime Datum {get; set;}

        public Boolean StatusOdradjen {get; set;}

        public double Cena {get; set;}

        public Vreme Vreme {get; set;}
        
        public Usluga Usluga{ get; set; }

        [JsonIgnore]

        public Radnik Radnik {get; set;}
        public Korisnik Korisnik {get; set;}
        
    }
}