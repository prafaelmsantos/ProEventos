using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using ProEventos.API.Dtos;
using ProEventos.Domain;

namespace ProEventos.API.Helpers
{
    //Objecto que recebe dos os mapeamentos
    public class ProEventosProfile : Profile
    {
        public ProEventosProfile(){

            //Ele cria do evento para o DTO e do DTO para o Evento
            CreateMap<Evento, EventoDto>().ReverseMap();

        }
        
    }
}