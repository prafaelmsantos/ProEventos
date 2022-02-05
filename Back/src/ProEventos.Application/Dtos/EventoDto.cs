using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using ProEventos.Application.Dtos;
using ProEventos.Domain;

namespace ProEventos.API.Dtos
{
    public class EventoDto
    {
        //Objecto de transferencia
        public int Id { get; set; }
        public string Local { get; set; }
        public string DataEvento { get; set; }

        [Required(ErrorMessage ="O campo {0} é obrigatório!"),
        //MinLength( 3, ErrorMessage ="O campo {0} deve ter no minimo 3 caracteres"),
        //MaxLength( 50, ErrorMessage ="O campo {0} deve ter no maximo 50 caracteres")
        StringLength(50, MinimumLength =3, ErrorMessage ="Intervalo permitodo de 3 a 50 caracteres")]
        public string Tema { get; set; }

        [Range(1, 120000, ErrorMessage = "{0} tem de ser maior que 1 e menor que 120000")]
        [Display(Name ="Quantidade de Pessoas")]
        public int QtdPessoas { get; set; }

        [RegularExpression(@".*\.(png|bmp|gif|jpe?g)$", ErrorMessage ="Não é uma imagem válida! (.png, .bmp, .gif, .jpeg, .jpg)")]
        public string ImagemURL { get; set; }

        [Required(ErrorMessage ="O campo {0} é obrigatório!")]
        [Phone(ErrorMessage = "O campo {0} está com numero invalido!")]
        public string Telefone { get; set; }

        [Required(ErrorMessage ="O campo {0} é obrigatório!")]
        [Display(Name ="e-mail")]
        [EmailAddress(ErrorMessage ="É necessario ser um {0} valido!")]
        public string Email { get; set; }

        public IEnumerable<LoteDto> Lotes { get; set; }
        public IEnumerable<RedeSocialDto> RedesSociais { get; set; }
        public IEnumerable<PalestranteDto> Palestrantes { get; set; }
        
    }
}