using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Models
{
    public class Usluga
    {
        [Key]
        public int ID { get; set; } 

        [Required]
        [MaxLength(50)]
        public string Naziv { get; set; }

        public double Cena {get; set;}
        
        [JsonIgnore]
        public TipUsluge TipUsluge{ get; set; }


    }
}