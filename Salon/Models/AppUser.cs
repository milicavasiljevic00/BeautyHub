using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Security.Claims;
using Microsoft.AspNetCore.Identity;

namespace Models
{
    public class AppUser : IdentityUser<int>
    {
     
        [MaxLength(50)]
        public string Ime { get; set; }

        [MaxLength(50)]
        public string Prezime { get; set; }

    }
}