using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Models
{
    public class BeautyContext: IdentityDbContext<AppUser, AppRole, int>
    {
        public DbSet<Korisnik> Korisnici {get; set;}
        public DbSet<Radnik> Radnici {get; set;}
        public DbSet<Recenzija> Recenzije {get; set;}
        public DbSet<Termin> Termini {get; set;}
        public DbSet<PogodnijiTermin> PogodnijiTermini {get; set;}
        public DbSet<TipUsluge> TipoviUsluge {get; set;}
        public DbSet<Usluga> Usluge {get; set;}
        public DbSet<Vreme> Vremena {get; set;}
        public DbSet<Placanje> Placanja {get; set;}
        public DbSet<Notifikacija> Notifikacije {get; set;}
        public DbSet<SalonInfo> SalonInfo {get; set;}
        public DbSet<Preporuka> Preporuke {get; set;}
        public BeautyContext(DbContextOptions<BeautyContext> options): base(options)
        {
            
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            //   builder.Entity<Korisnik>()
            //       .HasMany<Termin>()
            //       .WithOne(p=>p.Korisnik);
            //  builder.Entity<Korisnik>()
            //       .HasMany<Termin>()
            //       .WithOne(p=>p.KorisnikPogodniji);

            //   builder.Entity<Termin>()
            //      .HasOne<Korisnik>()
            //      .WithMany(p=>p.Termini);

            //      builder.Entity<Termin>()
            //      .HasOne<Korisnik>()
            //       .WithMany(p=>p.PogodnijiTermini);
        }
      
     

    }
}