import { DocumentoService } from './../../../services/documento.service';
import { Component, OnInit, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Apartamento } from '../../../models/apartamento-model';
import { DefaultService } from '../../../services/default.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { IOption } from 'ng-select';
import { Morador } from '../../../models/morador-model';
import { TipoDocumentoService } from '../../../services/tipo-documento.service';
import { TipoMoradorService } from '../../../services/tipo-morador.service';
import { WebCamComponent } from 'ack-angular-webcam';
import { ToastService } from '../../../services/toast.service';
import { ApartamentoService } from '../../../services/apartamento.service';
import { SharedService } from 'src/app/shared/shared.service';
import { Ficha } from 'src/app/models/ficha-model';
import { FichaService } from 'src/app/services/ficha.service';

import * as fileSaver from 'file-saver';
import Swal from 'sweetalert2';
import * as lodash from 'lodash';

@Component({
  selector: 'app-ficha-cadastro',
  templateUrl: './ficha-cadastro.component.html',
  styleUrls: ['./ficha-cadastro.component.scss']
})
export class FichaCadastroComponent implements OnInit, AfterViewChecked {

  ficha: Ficha = new Ficha();
  documentos: any[] = [];
  listaMoradores: Morador[] = [];

  listaTipoMoradores: Array<IOption> = [];
  listaTipoDocumentos: Array<IOption> = [];
  isCollapsed: boolean = false;

  formulario: FormGroup;
  formularioMorador: FormGroup;
  isSubmit: boolean = false;
  isSubmitMorador: boolean = false;

  telefoneMask = ['(', /[1-9]/, /\d/, ')', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  celularMask = ['(', /[1-9]/, /\d/, ')', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  telefoneRegex = /^\(\d{2}\)\d{4}-\d{4}$/;
  celularRegex = /^\(\d{2}\)\d{5}-\d{4}$/;

  image64Temp: any;
  imageChangedEvent: any;
  croppedImage: any;
  formFotoTemp: any;
  options = {};

  public documentosForm = new FormGroup({
    files: new FormControl(null)
  });

  constructor(
    private route: ActivatedRoute,
    private defaultService: DefaultService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private tipoDocumentoService: TipoDocumentoService,
    private tipoMoradorService: TipoMoradorService,
    private sharedService: SharedService,
    private toastService: ToastService,
    private documentoService: DocumentoService,
    private apartamentoService: ApartamentoService,
    private fichaService: FichaService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const context = this.route.snapshot.data['context']

      if (context == 'ficha') {
        this.getFicha(params['id'])
      } else if (context && params['id']) {
        this.ficha
        this.ficha.apartamento.id = params['id']
        this.getById();
      }
    });

    this.formulario = this.formBuilder.group({
      numeroQuartos: ['', [Validators.required, Validators.minLength(2)]],
      responsavel: this.formBuilder.group({
        id: [{ value: '', disabled: true }],
        nome: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(30)]],
        ativo: [true, [Validators.required]],
        celular: ['', [Validators.pattern(this.celularRegex)]],
        telefone: ['', [Validators.pattern(this.telefoneRegex)]],
        placaCarro: [''],
        tipoMorador: ['0', [Validators.required, Validators.min(1)]],
        tipoDocumento: ['0'],
        documento: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        foto64: [],
        fotoUrl: [],
        observacao: ['', [Validators.maxLength(255)]]
      }),
      observacao: ['', [Validators.maxLength(255)]]
    });

    this.formularioMorador = this.formBuilder.group({
      id: [{ value: '', disabled: true }],
      nome: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(30)]],
      ativo: [true, [Validators.required]],
      celular: ['', [Validators.pattern(this.celularRegex)]],
      parentesco: ['', [Validators.required]],
      tipoDocumento: ['0'],
      documento: ['', [Validators.required]],
      email: [''],
      foto64: [],
      fotoUrl: [],
      observacao: ['', [Validators.maxLength(255)]]
    });

    this.getTipoMorador();
    this.getTipoDocumento();
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  getById() {
    this.defaultService.getById('apartamentos', this.ficha.apartamento.id)
      .subscribe(response => {
        this.ficha.apartamento = response as Apartamento;
        this.formulario.patchValue(response);
        this.carregaFicha();
      });
  }

  getFicha(id) {
    this.fichaService.getFullFicha(id)
      .subscribe(ficha => {
        this.ficha = ficha as Ficha; 
        this.carregaFicha();
      })
  }

  carregaFicha() {
    const responsavel = this.ficha.moradores.filter((morador) => morador.tipoMorador)[0];
    if (responsavel) {
      this.formulario.get('responsavel').patchValue(responsavel);
      this.listaMoradores = this.ficha.moradores.filter((morador) => morador.id != responsavel.id);
    }
  }

  getTipoMorador() {
    this.tipoMoradorService.getTiposMorador()
      .subscribe(response => {
        this.listaTipoMoradores = (response as any[]).map(tipo => ({ value: tipo.toString(), label: tipo.toString() }));
        this.listaTipoMoradores.unshift({ value: '0', label: 'Selecione uma opção' })
      });
  }

  getTipoDocumento() {
    this.tipoDocumentoService.getTiposDocumento()
      .subscribe(response => {
        this.listaTipoDocumentos = (response as any[]).map(tipo => ({ value: tipo.toString(), label: tipo.toString() }));
        this.listaTipoDocumentos.unshift({ value: '0', label: 'Selecione uma opção' })
      });
  }

  carregaEditarMorador(morador) {
    this.formularioMorador.patchValue(morador);
  }

  removerMorador(morador: Morador) {
    Swal.fire({
      title: 'Remoção de morador',
      text: `Morador já está cadastrado, deseja remove-lo?`,
      type: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Não',
      confirmButtonText: 'Sim'
    }).then((result) => {
      if (result.value) {
        const moradorParaRemover = this.listaMoradores.findIndex(mora => mora.documento === morador.documento);
        this.listaMoradores.splice(moradorParaRemover, 1);
      }
    });
  }

  incluiMorador() {
    if (this.formularioMorador.invalid) {
      this.isSubmitMorador = true;
      return;
    } else {
      const morador = this.formularioMorador.getRawValue();
      if (this.formularioMorador.get('tipoDocumento').value != '0')
        morador.tipoDocumento = this.formularioMorador.get('tipoDocumento').value;

      if (!this.formularioMorador.get('id').value) {
        this.listaMoradores.push(morador);
      } else {
        this.listaMoradores = this.listaMoradores.filter(mora => mora.id != morador.id);
        this.listaMoradores.push(morador);
      }

      this.resetMoradorForm();
    }
  }

  generateBase64(webcam: WebCamComponent) {
    webcam.getBase64().then(base => {
      this.image64Temp = base;
      this.imageChangedEvent = this.image64Temp;
    }).catch(error => console.error(error));
  }

  onCamError(error) {
    console.error(error);
    this.toastService.addToast(
      'error',
      `Carregamento da webcam`,
      'Ocorreu um erro ao carregar a webcam. Verifique a conexão!'
    );
  }

  confirmarModalFoto(modalCamera) {
    this.formFotoTemp.get('foto64').setValue(this.croppedImage.base64);
    this.image64Temp = undefined;
    modalCamera.hide();
  }

  limparModalFoto(morador) {
    morador.foto64 = undefined;
    this.formFotoTemp = undefined;
    this.image64Temp = undefined;
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }

  limparModalUploadFoto() {
    this.croppedImage = undefined;
    this.imageChangedEvent = undefined;
  }

  salvar() {
    if (this.formulario.invalid) {
      this.isSubmit = true;
      return;
    } else {
      let apartamento: Apartamento;
      apartamento = lodash.clone(this.ficha.apartamento);
      apartamento.numeroQuartos = this.formulario.get('numeroQuartos').value;
      apartamento.observacao = this.formulario.get('observacao').value;
      apartamento.usuario = this.sharedService.getUsuarioLogged();
      apartamento.moradores = [];
      apartamento.moradores = this.listaMoradores;
      apartamento.moradores.push(this.formulario.getRawValue().responsavel);
      apartamento.moradores.forEach(morador => {
        morador.usuario = this.sharedService.getUsuarioLogged();
      });

      this.defaultService.atualizar('apartamentos', apartamento)
        .subscribe(() => {
          this.getById();
          this.toastService.addToast(
            'success',
            `Atualização da ficha do apartamento ${this.ficha.apartamento.numero}`,
            `Ficha atualizada com sucesso!`
          );
        });
    }
  }

  resetMoradorForm() {
    this.formularioMorador.reset();
    this.formularioMorador.get('tipoDocumento').setValue('0');
    this.formularioMorador.get('ativo').setValue(true);
  }

  excluirDocumento(documento) {
    Swal.fire({
      title: 'Exclusão de documento',
      html: `Deseja excluir o documento:<br> ${documento.nome}?`,
      type: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Não',
      confirmButtonText: 'Sim'
    }).then((result) => {
      if (result.value) {
        this.documentoService.excluirDocumento(this.ficha.id, documento.id)
          .subscribe(() => {
            this.toastService.addToast(
              'success',
              `Exclusão de documento`,
              `Documento excluído com sucesso!`
            );
            this.getFicha(this.ficha.id)
          });
      }
    });
  }

  getFichaFile() {
    this.apartamentoService.getFicha(this.ficha.apartamento.id)
      .subscribe((response) => {
        this.saveFile(response['body'], `Ficha-Apartamento-${this.ficha.apartamento.numero}-${this.ficha.apartamento.bloco.nome}-${this.ficha.apartamento.bloco.condominio.nome}`);
      });
  }

  saveFile(data: any, filename?: string) {
    const blob = new Blob([data], { type: 'application/pdf; charset=utf-8' });
    fileSaver.saveAs(blob, filename);
  }

  getFieldResponsavelForm(field) {
    return this.formulario.get('responsavel').get(field);
  }

  getValueResponsavelForm(field) {
    return this.formulario.get('responsavel').get(field).value;
  }

  getFieldMoradorForm(field) {
    return this.formularioMorador.get(field);
  }

  getValueMoradorForm(field) {
    return this.formularioMorador.get(field).value;
  }

  removeFoto(form) {
    form.get('foto64').setValue(undefined);
    form.get('fotoUrl').setValue(undefined);
  }

  importarFotos() {
    this.documentoService.uploadDocumentos(this.ficha.id, this.documentosForm.value.files[0])
      .subscribe(() => {
        this.toastService.addToast(
          'success',
          `Importação de documento`,
          `Documento importado com sucesso!`
        );
        this.getFicha(this.ficha.id)
      });
  }
}
