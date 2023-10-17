using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Models
{
    public class Recenzija
    {
        [Key]
        public int ID { get; set; } 

        public int Ocena { get; set; }

        public string Komentar {get; set;}

        public Korisnik Korisnik {get; set;}
        [JsonIgnore]
        public Radnik Radnik {get; set;}

        
    }
}