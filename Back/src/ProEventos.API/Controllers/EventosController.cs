using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using ProEventos.API.Data;
using ProEventos.API.Models;

namespace ProEventos.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EventosController : ControllerBase
    {
        /* Data Base Estatica .NET
        public IEnumerable<Evento> _evento = new Evento[]{

                new Evento(){

                    EventoId=21,
                    Tema="Angular e .Net5",
                    Local="Coimbra (Data Base Estatica .NET)",
                    Lote="1º Lote",
                    QtdPessoas=250,
                    DataEvento=DateTime.Now.AddDays(2).ToString("dd/MM/yyyy"),
                    ImagemURL="Foto.png"
                },
                new Evento(){

                    EventoId=22,
                    Tema="Angular e .Net5",
                    Local="Praia de Mira (Data Base Estatica .NET)",
                    Lote="1º Lote",
                    QtdPessoas=250,
                    DataEvento=DateTime.Now.ToString("dd/MM/yyyy"),
                    ImagemURL="Foto.png"
                }
            
        };*/
        private readonly DataContext _context; 

        public EventosController(DataContext context)
        {
            _context=context;
            
        }

        //Metodos HTTP

        [HttpGet]
        public IEnumerable<Evento> Get()
        {
            return _context.Eventos;
            
        }

        [HttpGet("{id}")]
        public IEnumerable<Evento> Get(int id)
        {
            return _context.Eventos.Where(evento =>evento.EventoId ==id);
            
        }

        [HttpPost]
        public string Post()
        {
            return "Exemplo de Post";
            
        }

        [HttpPut("{id}")]
        public string Put(int id)
        {
            return $"Exemplo de Put com id = {id}";
            
        }

        [HttpDelete("{id}")]
        public string Delete(int id)
        {
            return $"Exemplo de Delete com id = {id}";
            
        }
    }
}
