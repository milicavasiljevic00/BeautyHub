using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Models
{
    public class TipUsluge
    {
        [Key]
        public int ID { get; set; } 

        [Required]
        [MaxLength(50)]
        public string Naziv { get; set; }

        public string Opis {get; set;}

        public double Trajanje {get; set;} //trajanje u minutima
        
        public List<Usluga> Usluge{ get; set; }
        
        [JsonIgnore]
        public List<Radnik> Radnici {get; set;}
        
    }
}