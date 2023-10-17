using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Models
{
    public class Vreme
    {
        [Key]
        public int ID { get; set; } 

        public string VremeOd {get; set;}

        public string VremeDo {get; set;}

        public TipUsluge TipUsluge {get; set;}

    }
}