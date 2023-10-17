using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Models
{
    public class Notifikacija
    {
        [Key]
        public int ID { get; set; } 
        public string Opis {get; set;}
        public Termin Termin { get; set; }

        public int Tip{get; set;} //1-pogodniji, 2-otkazan
        public string Datum {get; set;}

        public List<Korisnik> Korisnici{get; set;}
        
    }
}