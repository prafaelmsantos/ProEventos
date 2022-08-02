import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@environments/environment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Evento } from 'src/app/models/Evento';
import { EventoService } from 'src/app/services/evento.service';

@Component({
  selector: 'app-evento-lista',
  templateUrl: './evento-lista.component.html',
  styleUrls: ['./evento-lista.component.css']
})
export class EventoListaComponent implements OnInit {

   //Modal
   modalRef?: BsModalRef;

   public eventos: Evento[] = [];
   public eventosFiltrados: Evento[]=[];
   public eventoId = 0;

   public larguraImg = 120;
   public margemImg = 2;
   public exibirImg = true;
   public _filtroLista='';

   public get filtroLista(): string{
     return this._filtroLista;
   }
   public set filtroLista(value: string){
     this._filtroLista= value;
     this.eventosFiltrados=this.filtroLista ? this.filtrarEventos(this.filtroLista):this.eventos;
   }

   public filtrarEventos(filtrarPor: string):Evento[]{
     filtrarPor = filtrarPor.toLocaleLowerCase();
     return this.eventos.filter(
       (evento : {tema: string; local: string})=> evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1 ||
       evento.local.toLocaleLowerCase().indexOf(filtrarPor) !== -1
     )
   }


   constructor(
     private eventoService: EventoService,
     private modalService: BsModalService,
     private toastr: ToastrService,
     private spinner: NgxSpinnerService,
     private router: Router) {

   }

   //ngOnInit é um metodo que vai ser
   //chamado antes de ser inicializado a aplicação. Antes do HTML ser interpretado
   public ngOnInit(): void {
     this.spinner.show();
     this.carregarEventos();
   }

   public alterarEstadoImg(): void{
     this.exibirImg = !this.exibirImg;
   }

   public mostraImagem(imagemURL: string) : string {
    return imagemURL !== ''
    ? `${environment.apiURL}resources/images/${imagemURL}`
    : 'assets/img/imageNotAvailable.jpg';
   }


   public carregarEventos(): void {

     //Vou fazer um get do protocolo http neste URL
     this.eventoService.getEventos().subscribe({
       next: (_eventos: Evento[]) => {
         this.eventos = _eventos;
         this.eventosFiltrados = this.eventos;
       },
       error: (error: any) => {
         this.spinner.hide();
         this.toastr.error('Erro ao carregar os Eventos.', 'Erro!')

       },
       complete: () =>this.spinner.hide()

     });
   }

     //Modal
     openModal(event:any, template: TemplateRef<any>, eventoId: number):void {
       event.stopPropagation();
       this.eventoId = eventoId;
       this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
     }

     confirm(): void {
       this.modalRef?.hide();
       this.spinner.show();

       this.eventoService.deleteEvento(this.eventoId).subscribe(
        (result: any) => {
          if (result.message === 'Apagado'){
          console.log(result); // Retorna o "Apagado do controler da API". Nesta caso aparece na consola: mesagem: "Apagado". Não é necessario este if. Para tal passar o any do result para string

          this.toastr.success('O Evento foi apagado com sucesso.', 'Apagado!');
          this.spinner.hide();
          this.carregarEventos();
          }


        },
        (error: any) => {
          console.error(error);
          this.toastr.error(`Erro ao tentar apagar o evento ${this.eventoId}`, 'Erro!');
          this.spinner.hide();
        },
        () => this.spinner.hide(),


      );

    }

     decline(): void {
       this.modalRef?.hide();
     }
     detalheEvento(id: number): void{
      this.router.navigate([`eventos/detalhe/${id}`]);
    }



 /*
     this.eventos= [
       {
         Tema: 'Angular',
         Local: 'Praia de Mira (Db Angular estatica)'
       },
       {
         Tema: '.Net 5',
         Local: 'Coimbra (Db Angular estatica)'
       },
       {
         Tema: 'Curso Completo',
         Local: 'Mira (Db Angular estatica)'
       }
     ]*/

}
