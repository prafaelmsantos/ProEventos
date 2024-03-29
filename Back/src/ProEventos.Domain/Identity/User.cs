using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using ProEventos.Domain.Enum;

namespace ProEventos.Domain.Identity
{
    public class User: IdentityUser<int>
    {
        public string PrimeiroNome { get; set; }
        public string UltimoNome { get; set; }
        public Titulo Titulo { get; set; }
        public string Descricao{ get; set; }
        public Funcao Funcao { get; set; }
        public string ImagemUrl{ get; set; }
        //Um User pode ter muitas Roles
        public IEnumerable<UserRole> UserRoles { get; set; }
        
    }
}