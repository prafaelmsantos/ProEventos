using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using ProEventos.Domain;
using ProEventos.Domain.Identity;

namespace ProEventos.Persistence.Contextos
{
    public class ProEventosContext : IdentityDbContext<User, Role, int,
                                                    IdentityUserClaim<int>, 
                                                    UserRole, 
                                                    IdentityUserLogin<int>, 
                                                    IdentityRoleClaim<int>, 
                                                    IdentityUserToken<int>>
    {
        public ProEventosContext(DbContextOptions<ProEventosContext> options) 
            : base(options) { }
        public DbSet<Evento> Eventos { get; set; }
        public DbSet<Lote> Lotes { get; set; }
        public DbSet<Palestrante> Palestrantes { get; set; }
        public DbSet<PalestranteEvento> PalestrantesEventos { get; set; }
        public DbSet<RedeSocial> RedesSociais { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder); // Necessario para o User se não, não funciona
            modelBuilder.Entity<UserRole>(userRole => 
                { //Outra maneira de fazer muitos para muitos
                    userRole.HasKey(user => new {user.UserId, user.RoleId});
                    //Um User tem uma Role. Uma Role tem muitos UserRoles. O RoleId é requerido, ou seja, sempre que criar um User, é criado tambem uma Role.
                    userRole.HasOne(userRole => userRole.Role)
                            .WithMany(role => role.UserRoles)
                            .HasForeignKey( userRole => userRole.RoleId).IsRequired();
                    
                    userRole.HasOne(userRole => userRole.User)
                            .WithMany(role => role.UserRoles)
                            .HasForeignKey( userRole => userRole.UserId).IsRequired();
                }
            );
            modelBuilder.Entity<PalestranteEvento>()
                .HasKey(PE => new {PE.EventoId, PE.PalestranteId});

            modelBuilder.Entity<Evento>()
                .HasMany(e => e.RedesSociais)
                .WithOne(rs => rs.Evento)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Palestrante>()
                .HasMany(e => e.RedesSociais)
                .WithOne(rs => rs.Palestrante)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}