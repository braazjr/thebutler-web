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
// import { FileUploader } from 'ng2-file-upload';
import { environment } from '../../../../environments/environment';
import { ApartamentoService } from '../../../services/apartamento.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { SharedService } from 'src/app/shared/shared.service';
import { FileUploadValidators } from '@iplab/ngx-file-upload';

import * as fileSaver from 'file-saver';
import Swal from 'sweetalert2';
import * as lodash from 'lodash';

@Component({
  selector: 'app-ficha-cadastro',
  templateUrl: './ficha-cadastro.component.html',
  styleUrls: ['./ficha-cadastro.component.scss']
})
export class FichaCadastroComponent implements OnInit, AfterViewChecked {

  apartamento: Apartamento = new Apartamento();
  documentos: any[] = [];

  listaResidentes: Morador[] = [];

  // lista de selects
  listaTipoMoradores: Array<IOption> = [];
  listaTipoDocumentos: Array<IOption> = [];

  formulario: FormGroup;
  formularioResidente: FormGroup;
  isSubmit: boolean = false;
  isSubmitResidente: boolean = false;

  telefoneMask = ['(', /[1-9]/, /\d/, ')', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  celularMask = ['(', /[1-9]/, /\d/, ')', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  telefoneRegex = /^\(\d{2}\)\d{4}-\d{4}$/;
  celularRegex = /^\(\d{2}\)\d{5}-\d{4}$/;

  // webcam: WebCamComponent;
  image64Temp: any;
  imageChangedEvent: any;
  croppedImage: any;
  formFotoTemp: any;
  options = {};

  // uploader: FileUploader;
  hasBaseDropZoneOver = false;
  hasAnotherDropZoneOver = false;

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
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id'] !== undefined) {
        this.apartamento.id = params['id'];
        this.getById();

        // this.uploader = new FileUploader({
        //   url: `${environment.urlSpring}/public/documento/upload-documento/${this.apartamento.id}/${this.sharedService.getUsuarioLogged().id}`,
        //   headers: [{ name: 'Authorization', value: `Bearer ${localStorage.getItem('token')}` }],
        //   // authTokenHeader: `Bearer ${localStorage.getItem('token')}`,
        //   isHTML5: true,
        //   // removeAfterUpload: true
        // });
        // this.uploader.onCompleteAll = () => {
        //   this.getDocumentosPorApartamento();
        // };
      }
    });

    this.formulario = this.formBuilder.group({
      numeroQuartos: ['', [Validators.required, Validators.minLength(2)]],
      responsavel: this.formBuilder.group({
        id: [{ value: '', disabled: true }],
        nome: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(30)]],
        ativo: ['', [Validators.required]],
        celular: ['', [Validators.pattern(this.celularRegex)]],
        telefone: ['', [Validators.pattern(this.telefoneRegex)]],
        placaCarro: [''],
        tipoMorador: ['0', [Validators.required, Validators.min(1)]],
        tipoDocumento: ['0'],
        documento: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        foto64: [],
        fotoUrl: []
      })
    });

    this.formularioResidente = this.formBuilder.group({
      id: [{ value: '', disabled: true }],
      nome: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(30)]],
      ativo: ['', [Validators.required]],
      celular: ['', [Validators.pattern(this.celularRegex)]],
      parentesco: ['', [Validators.required]],
      tipoDocumento: ['0'],
      documento: ['', [Validators.required]],
      email: [''],
      foto64: [],
      fotoUrl: []
    });

    this.getTipoMorador();
    this.getTipoDocumento();
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  getById() {
    this.spinner.show();
    this.defaultService.getById('apartamentos', this.apartamento.id).subscribe(response => {
      this.apartamento = response as Apartamento;
      this.formulario.patchValue(response);
      this.carregaFicha();
    }, (error) => {
      console.error(error);
      this.spinner.hide();
    });
  }

  carregaFicha() {
    const responsavel = this.apartamento.moradores.filter((morador) => morador.tipoMorador)[0];
    if (responsavel) {
      this.formulario.get('responsavel').patchValue(responsavel);
      this.listaResidentes = this.apartamento.moradores.filter((morador) => morador.id != responsavel.id);
    }
    this.spinner.hide();
  }

  isResidentValid(field) {
    return this.formularioResidente.get(field).status === 'VALID' ? true : false;
  }

  getTipoMorador() {
    this.tipoMoradorService.getTiposMorador().subscribe(response => {
      this.listaTipoMoradores = (response as any[]).map(tipo => ({ value: tipo.toString(), label: tipo.toString() }));
      this.listaTipoMoradores.unshift({ value: '0', label: 'Selecione uma opção' })
    }, (error) => console.error(error));
  }

  getTipoDocumento() {
    this.tipoDocumentoService.getTiposDocumento().subscribe(response => {
      this.listaTipoDocumentos = (response as any[]).map(tipo => ({ value: tipo.toString(), label: tipo.toString() }));
      this.listaTipoDocumentos.unshift({ value: '0', label: 'Selecione uma opção' })
    }, (error) => console.error(error));
  }

  carregaEditarResidente(residente) {
    this.formularioResidente.patchValue(residente);
  }

  removerResidente(residente: Morador) {
    Swal.fire({
      title: 'Remoção de residente',
      text: `Residente já está cadastrado, deseja remove-lo?`,
      type: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Não',
      confirmButtonText: 'Sim'
    }).then((result) => {
      if (result.value) {
        const residenteParaRemover = this.listaResidentes.findIndex(resid => resid.documento === residente.documento);
        this.listaResidentes.splice(residenteParaRemover, 1);
      }
    });
  }

  incluiResidente() {
    if (this.formularioResidente.invalid) {
      this.isSubmitResidente = true;
      return;
    } else {
      const residente = this.formularioResidente.getRawValue();
      if (this.formularioResidente.get('tipoDocumento').value != '0')
        residente.tipoDocumento = this.formularioResidente.get('tipoDocumento').value;

      if (!this.formularioResidente.get('id').value) {
        this.listaResidentes.push(residente);
      } else {
        this.listaResidentes = this.listaResidentes.filter(resid => resid.id != residente.id);
        this.listaResidentes.push(residente);
      }

      this.resetResidenteForm();
    }
  }

  generateBase64(webcam: WebCamComponent) {
    webcam.getBase64().then(base => {
      this.image64Temp = base;
      this.imageChangedEvent = this.image64Temp;
    }).catch(error => console.error(error));
  }

  genBase64(webcam: WebCamComponent) {
    webcam.getBase64()
      .then(base => console.log(base))
      .catch(e => console.error(e))
  }

  onCamSuccess() { }

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
      apartamento = lodash.clone(this.apartamento);
      apartamento.numeroQuartos = this.formulario.get('numeroQuartos').value;
      apartamento.usuario = this.sharedService.getUsuarioLogged();
      apartamento.moradores = [];
      apartamento.moradores = this.listaResidentes;
      apartamento.moradores.push(this.formulario.getRawValue().responsavel);
      apartamento.moradores.forEach(morador => {
        morador.usuario = this.sharedService.getUsuarioLogged();
      });

      this.spinner.show();
      this.defaultService.atualizar('apartamentos', apartamento).subscribe(() => {
        this.getById();
        this.toastService.addToast(
          'success',
          `Atualização da ficha do apartamento ${this.apartamento.numero}`,
          `Ficha atualizada com sucesso!`
        );
      }, error => {
        this.spinner.hide();
        console.error(error);
        error.error.forEach(element => {
          this.toastService.addToast(
            'error',
            `Atualização da ficha do apartamento ${this.apartamento.numero}`,
            element.mensagemUsuario
          );
        });
      }, () => this.spinner.hide());
    }
  }

  resetResidenteForm() {
    this.formularioResidente.reset();
    this.formularioResidente.get('tipoDocumento').setValue('0');
  }

  getDocumentosPorApartamento() {
    this.spinner.show();
    this.documentoService.getDocumentosPorApartamento(this.apartamento.id).subscribe(response => {
      this.documentos = response as any[];
    }, error => {
      this.spinner.hide();
      console.error(error);
      error.error.forEach(element => {
        this.toastService.addToast(
          'error',
          `Captura dos documentos do apartamento ${this.apartamento.numero}`,
          element.mensagemUsuario
        );
      });
    }, () => this.spinner.hide());
  }

  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  fileOverAnother(e: any): void {
    this.hasAnotherDropZoneOver = e;
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
        this.spinner.show();
        this.documentoService.excluirDocumento(documento.id).subscribe(() => {
          this.getDocumentosPorApartamento();
        }, error => {
          this.spinner.hide();
          console.error(error);
        });
      }
    });
  }

  getFicha() {
    this.spinner.show();
    this.apartamentoService.getFicha(this.apartamento.id).subscribe((response) => {
      this.saveFile(response['body'], `Ficha-Apartamento-${this.apartamento.numero}-${this.apartamento.bloco.nome}-${this.apartamento.bloco.condominio.nome}`);
    })
  }

  saveFile(data: any, filename?: string) {
    const blob = new Blob([data], { type: 'application/pdf; charset=utf-8' });
    fileSaver.saveAs(blob, filename);
    this.spinner.hide();
  }

  getFieldResponsavelForm(field) {
    return this.formulario.get('responsavel').get(field);
  }

  getValueResponsavelForm(field) {
    return this.formulario.get('responsavel').get(field).value;
  }

  getFieldResidenteForm(field) {
    return this.formularioResidente.get(field);
  }

  getValueResidenteForm(field) {
    return this.formularioResidente.get(field).value;
  }

  removeFoto(form) {
    form.get('foto64').setValue(undefined);
    form.get('fotoUrl').setValue(undefined);
  }
}
