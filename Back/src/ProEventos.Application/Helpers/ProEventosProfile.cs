using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using ProEventos.API.Dtos;
using ProEventos.Application.Dtos;
using ProEventos.Domain;
using ProEventos.Domain.Identity;

namespace ProEventos.API.Helpers
{
    //Objecto que recebe dos os mapeamentos
    public class ProEventosProfile : Profile
    {
        public ProEventosProfile(){

            //Ele cria do evento para o DTO e do DTO para o Evento
            CreateMap<Evento, EventoDto>().ReverseMap();

            CreateMap<Palestrante, PalestranteDto>().ReverseMap();

            CreateMap<Lote, LoteDto>().ReverseMap();

            CreateMap<RedeSocial, RedeSocialDto>().ReverseMap();

            CreateMap<User, UserDto>().ReverseMap();
            CreateMap<User, UserLoginDto>().ReverseMap();
            CreateMap<User, UserUpdateDto>().ReverseMap();

        }
        
    }
}