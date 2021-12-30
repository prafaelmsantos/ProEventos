using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ProEventos.API.Models;

namespace ProEventos.API.Data
{
    //Para fazer a atabela de contexto de Eventos
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options){}
        public DbSet<Evento> Eventos { get; set; }
        
    }
}