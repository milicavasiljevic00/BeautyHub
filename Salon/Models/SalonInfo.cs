using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Models
{
    public class SalonInfo
    {
        [Key]
        public int ID { get; set; } 

        public string Naziv {get; set;}

        public string VremeOd {get; set;}

        public string VremeDo {get; set;}

        public string Adresa {get; set;}

        public string Telefon {get; set;}
        
    }
}