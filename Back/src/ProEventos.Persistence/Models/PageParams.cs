using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProEventos.Persistence.Models
{
    public class PageParams
    {
        //Max tamanho da pagina
        public const int MaxPageSize = 50;
        public int PageNumber { get; set; } = 1;
        public int pageSize = 10;
        public int PageSize
        {
            get { return pageSize; }
            //Ele retormna o maximo page Size. E seu chamar um valor maior que o max, retorno. Maior. Se não retorno o valor
            set { pageSize = (value > MaxPageSize) ? MaxPageSize : value; }
        }

        //Filtrar pelos termos de busca. Ex, pesquisar pelo tema e pelo e local
        public string Term { get; set; } = string.Empty;
    }
}