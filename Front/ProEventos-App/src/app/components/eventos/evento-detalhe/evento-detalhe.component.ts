import { Component, OnInit, TemplateRef } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router} from '@angular/router';
import { Lote } from '@app/models/Lote';
import { LoteService } from '@app/services/lote.service';
import { environment } from '@environments/environment';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Evento } from 'src/app/models/Evento';
import { EventoService } from 'src/app/services/evento.service';

@Component({
  selector: 'app-evento-detalhe',
  templateUrl: './evento-detalhe.component.html',
  styleUrls: ['./evento-detalhe.component.css']
})
export class EventoDetalheComponent implements OnInit {

  eventoId: number;
  modalRef: BsModalRef;
  loteAtual = { id: 0, nome: '', indice: 0 };
  imagemURL = 'assets/img/upload.png';
  file: File;

  form: FormGroup = this.formBuilder.group({});

  //Atribuo um objeto vazio mas que é do tipo Evento
  evento = {} as Evento;

  estado = 'post';

  get lotes(): FormArray {
    return this.form.get('lotes') as FormArray;

  }

  //Ele so cria um lote se ja existir um evento
  get modoEditar(): boolean {
    return this.estado === 'put';
  }

  get f(): any {
    return this.form.controls;
  }

  get bsConfig(): any{
    return {
      isAnimated: true,
      adaptivePosition: true,
      dateInputFormat: 'DD/MM/YYYY HH:mm',
      containerClass: 'theme-default',
      showWeekNumbers: false
    };
  }

  constructor(
    private formBuilder: FormBuilder,
    private localeService: BsLocaleService,
    private ActivatedRouter: ActivatedRoute,
    private eventoService: EventoService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private router: Router,
    private loteService: LoteService,
    private modalService: BsModalService)
    {
      this.localeService.use('pt-br');
    }

   public carregarEvento(): void {
     this.eventoId = +this.ActivatedRouter.snapshot.paramMap.get('id');

     if (this.eventoId !== null || this.eventoId === 0){
      this.spinner.show();

      this.estado = 'put'; // Carregamos os eventos quando estamos a editar
      this.eventoService.getEventoById(this.eventoId).subscribe({
         next: (evento: Evento) =>{

          //Eu pego cada uma das propriedades dentro do meu objecto evento que eu recebi do meu getEventobyId
           this.evento =  {...evento};
           this.form.patchValue(this.evento);
           if (this.evento.imagemURL !== '') {
          //this.imagemURL = environment.apiURL + 'resources/images/' + this.evento.imagemURL;
          }
           this.carregarLotes();
         },
         error: (error: any) =>{
          this.spinner.hide();
          this.toastr.error('Erro ao tentar carregar o Evento.', 'Erro!');
          console.error(error);
         },
         complete: () =>{
          this.spinner.hide();
         },
       });


     }
   }

   public carregarLotes(): void {
    this.loteService
      .getLotesByEventoId(this.eventoId)
      .subscribe(
        (lotesRetorno: Lote[]) => {
          lotesRetorno.forEach((lote) => {
            this.lotes.push(this.criarLote(lote));
          });
        },
        (error: any) => {
          this.toastr.error('Erro ao tentar carregar lotes', 'Erro');
          console.error(error);
        }
      )
      .add(() => this.spinner.hide());
  }



  ngOnInit() {
    this.carregarEvento();
    this.validation();
  }

  public validation(): void {

    this.form = this.formBuilder.group(
      {
        tema: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
        local: ['', Validators.required],
        dataEvento: ['', Validators.required],
        qtdPessoas: ['', [Validators.required, Validators.max(120000)]],
        telefone: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        imagemURL: ['', Validators.required],

        lotes: this.formBuilder.array([])

      }
    );
  }

  adicionarLote(): void {
    this.lotes.push(this.criarLote({id: 0} as Lote));
  }

  criarLote(lote: Lote): FormGroup {
    return this.formBuilder.group({
      id: [lote.id],
      nome: [ lote.nome, Validators.required],
      preco: [lote.preco , Validators.required],
      quantidade: [ lote.quantidade, Validators.required],
      dataInicio: [lote.dataInicio],
      dataFim: [lote.dataFim]
    });
  }

  public resetForm(): void{
    this.form.reset();
  }

  public cssValidator(campoForm: FormControl | AbstractControl): any {
    return {'is-invalid': campoForm.errors && campoForm.touched };
  }


  public guardarEvento(): void {
    this.spinner.show();
    if (this.form.valid) {

      if(this.estado === 'post'){
        this.evento =  {...this.form.value}; //Todos os campos do formulario

        this.eventoService.postEvento(this.evento).subscribe({
          next: (eventoRetorno: Evento) =>{
            this.toastr.success('Evento guardado com Sucesso!', 'Sucesso');
            //Aparece o criar lote quando criado o evento
            this.router.navigate([`eventos/detalhe/${eventoRetorno.id}`]);
          },
          error: (error: any) => {
            console.error(error);
            this.spinner.hide();
            this.toastr.error('Erro ao guardar o evento', 'Erro');
          },
          complete: () => this.spinner.hide()
        });

      }else{
        this.evento =  {id: this.evento.id , ...this.form.value}; //Todos os campos do formulario

        this.eventoService.putEvento(this.evento.id, this.evento).subscribe({
          next: () => {
            this.toastr.success('Evento guardado com Sucesso!', 'Sucesso');
          },
          error: (error: any) => {
            console.error(error);
            this.spinner.hide();
            this.toastr.error('Erro ao tentar guardar o evento', 'Erro');
          },
          complete: () => this.spinner.hide()
        }).add(() => this.spinner.hide());
      }
    }
  }

  public guardarLotes(): void {
    if (this.form.controls.lotes.valid) {
      this.spinner.show();
      this.loteService
        .postLote(this.eventoId, this.form.value.lotes)
        .subscribe(
          () => {
            this.toastr.success('Lotes salvos com Sucesso!', 'Sucesso!');
          },
          (error: any) => {
            this.toastr.error('Erro ao tentar salvar lotes.', 'Erro');
            console.error(error);
          }
        )
        .add(() => this.spinner.hide());
    }
  }

  public removerLote(template: TemplateRef<any>, indice: number): void {
    this.loteAtual.id = this.lotes.get(indice + '.id').value;
    this.loteAtual.nome = this.lotes.get(indice + '.nome').value;
    this.loteAtual.indice = indice;

    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  confirmDeleteLote(): void {
    this.modalRef.hide();
    this.spinner.show();

    this.loteService
      .deleteLote(this.eventoId, this.loteAtual.id)
      .subscribe(
        () => {
          this.toastr.success('Lote deletado com sucesso', 'Sucesso');
          this.lotes.removeAt(this.loteAtual.indice);
        },
        (error: any) => {
          this.toastr.error(
            `Erro ao tentar deletar o Lote ${this.loteAtual.id}`,
            'Erro'
          );
          console.error(error);
        }
      )
      .add(() => this.spinner.hide());
  }

  declineDeleteLote(): void {
    this.modalRef.hide();
  }

  onFileChange(ev: any): void {
    const reader = new FileReader();

    reader.onload = (event: any) => this.imagemURL = event.target.result;

    this.file = ev.target.files;
    reader.readAsDataURL(this.file[0]);

    this.uploadImagem();
  }

  uploadImagem(): void {
    this.spinner.show();
    this.eventoService.postUpload(this.eventoId, this.file).subscribe(
      () => {
        this.carregarEvento();
        this.toastr.success('Imagem atualizada com Sucesso', 'Sucesso!');
      },
      (error: any) => {
        this.toastr.error('Erro ao fazer upload de imagem', 'Erro!');
        console.log(error);
      }
    ).add(() => this.spinner.hide());
  }
}

  /*
  public guardarAlteracao(): void {
    this.spinner.show();
    if (this.form.valid) {

      this.evento = (this.estado === 'post')
                ? {...this.form.value}
                : {id: this.evento.id, ...this.form.value};

      this.eventoService[this.estado+'Evento'](this.evento).subscribe(
        () => this.toastr.success('Evento salvo com Sucesso!', 'Sucesso'),
        (error: any) => {
          console.error(error);
          this.spinner.hide();
          this.toastr.error('Error ao salvar evento', 'Erro');
        },
        () => this.spinner.hide()
      );
    }
  }
  */

