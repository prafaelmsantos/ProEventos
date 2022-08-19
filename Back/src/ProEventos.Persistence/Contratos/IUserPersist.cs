using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ProEventos.Domain.Identity;

namespace ProEventos.Persistence.Contratos
{
    //As outras interfaces tambem podem ser feitas assim
    // INumerable == List (lista)
    public interface IUserPersist : IGeralPersist
    {
        //Retorna uma lista de utilizadores
        Task<IEnumerable<User>> GetUsersAsync();
        //Retorna um utilizador
        Task<User> GetUserByIdAsync(int id);
        Task<User> GetUserByUserNameAsync( string userName);
        
    }
}