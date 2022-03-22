using System.Threading.Tasks;
using ProEventos.Domain;

namespace ProEventos.Persistence.Contratos
{
    public interface ILotePersist
    {

       /// <summary>
       /// Metodo get que retormna uma lista de lotes por eventoId
       /// </summary>
       /// <param name="eventoId"></param>
       /// <returns>Array de Lotes</returns>

        Task<Lote[]> GetLotesByEventoIdAsync(int eventoId);

        /// <summary>
        /// Metodo que retorna apenas um lote
        /// </summary>
        /// <param name="eventoId"></param>
        /// <param name="id">id da tabela lote</param>
        /// <returns>Apenas 1 lote</returns>
    
        Task<Lote> GetLoteByIdsAsync(int eventoId, int id);
    }
}