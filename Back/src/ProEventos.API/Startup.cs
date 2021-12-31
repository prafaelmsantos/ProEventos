using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using ProEventos.API.Data;
using Microsoft.EntityFrameworkCore;

namespace ProEventos.API
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            //O configuration permite acessar appsettings.json
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            //instalar o Data Context
            //Fazer a referencia da base de dados
            services.AddDbContext<DataContext>(
                //context => context.UseMySQL(Configuration.GetConnectionString("Default"))
                context => context.UseSqlite(Configuration.GetConnectionString("Default"))

            );

            services.AddControllers(); //Indica que estou a trabalhar com a arquitetura MVC com Views Controllers. Permite chamar o meu controller
            //Rafael
            services.AddCors();
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "ProEventos.API", Version = "v1" });
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "ProEventos.API v1"));
            }

            //Rafael - HTTPS
            app.UseHttpsRedirection();

            app.UseRouting(); //Indica que vou trabalhar por rotas

            app.UseAuthorization();

            //Rafael - Dado qualquer header da requisição por http vinda de qualquer metodo (get, post, delete..) e vindos de qualquer origem
            app.UseCors(x =>x.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin());

            //E vou retornar determinados endpoints de acordo com a conbfiguração destas rotas dentro do meu controller

            app.UseEndpoints(endpoints => 
            {
                endpoints.MapControllers();
            });
        }
    }
}
