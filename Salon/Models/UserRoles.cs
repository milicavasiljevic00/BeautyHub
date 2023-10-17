using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace Models
{
    public class UserRoles
    {
     
        public static string Admin ="Admin";
        public static string Korisnik = "Korisnik";
        public static string Radnik = "Radnik";
        public static string Menadzer = "Menadzer";

       
    }
}