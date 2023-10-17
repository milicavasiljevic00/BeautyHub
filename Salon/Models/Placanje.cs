using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Models
{
    public class Placanje
    {
        [Key]
        public int ID { get; set; } 
        public DateTime Datum { get; set; }
        public Radnik Radnik {get; set;}
        public double Cena {get; set;}
        public TipUsluge TipUsluge {get; set;}
        

    }
}