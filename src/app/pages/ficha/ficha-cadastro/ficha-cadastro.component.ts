import { DocumentoService } from './../../../services/documento.service';
import { Component, OnInit, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Apartamento } from '../../../models/apartamento-model';
import { DefaultService } from '../../../services/default.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IOption } from 'ng-select';
import { Morador } from '../../../models/morador-model';
import swal from 'sweetalert2';
import { TipoDocumentoService } from '../../../services/tipo-documento.service';
import { TipoMoradorService } from '../../../services/tipo-morador.service';
import { WebCamComponent } from 'ack-angular-webcam';
import { SharedService } from '../../../services/shared.service';
import { ToastService } from '../../../services/toast.service';
import { FileUploader } from 'ng2-file-upload';
import { environment } from '../../../../environments/environment';
import { ApartamentoService } from '../../../services/apartamento.service';
import * as fileSaver from 'file-saver';

@Component({
  selector: 'app-ficha-cadastro',
  templateUrl: './ficha-cadastro.component.html',
  styleUrls: ['./ficha-cadastro.component.scss',
    '../../../../assets/icon/icofont/css/icofont.scss']
})
export class FichaCadastroComponent implements OnInit, AfterViewChecked {

  apartamento: Apartamento = new Apartamento();
  documentos: any[] = [];

  // valores dos selects
  tipoMorador: string;
  tipoDocumento: string;
  tipoDocumentoResidente: string;

  responsavel: Morador = new Morador();
  residente: Morador = new Morador();
  listaResidentes: Morador[] = [];

  // lista de selects
  listaTipoMoradores: Array<IOption> = [];
  listaTipoDocumentos: Array<IOption> = [];

  formulario: FormGroup;
  formularioResidentes: FormGroup;

  telefoneMask = ['(', /[1-9]/, /\d/, ')', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  celularMask = ['(', /[1-9]/, /\d/, ')', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  telefoneRegex = /^\(\d{2}\)\d{4}-\d{4}$/;
  celularRegex = /^\(\d{2}\)\d{5}-\d{4}$/;

  observable: any;

  // webcam: WebCamComponent;
  image64Temp: any;
  imageChangedEvent: any;
  croppedImage: any;
  moradorFotoTemp: Morador;
  options = {};

  uploader: FileUploader;
  hasBaseDropZoneOver = false;
  hasAnotherDropZoneOver = false;

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
    private apartamentoService: ApartamentoService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id'] !== undefined) {
        this.apartamento.id = params['id'];
        this.getById();

        this.uploader = new FileUploader({
          url: `${environment.urlSpring}/public/documento/upload-documento/${this.apartamento.id}/${this.sharedService.getUsuarioLogged().id}`,
          headers: [{ name: 'Authorization', value: `Bearer ${localStorage.getItem('token')}` }],
          // authTokenHeader: `Bearer ${localStorage.getItem('token')}`,
          isHTML5: true,
          // removeAfterUpload: true
        });
        this.uploader.onCompleteAll = () => {
          this.getDocumentosPorApartamento();
        };
      }
    });

    this.formulario = this.formBuilder.group({
      nome: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(30)]],
      ativo: ['', [Validators.required]],
      celular: ['', [Validators.pattern(this.celularRegex)]],
      telefone: ['', [Validators.pattern(this.telefoneRegex)]],
      placaCarro: ['', []],
      numeroQuartos: ['', [Validators.required, Validators.minLength(2)]],
      tipoMorador: ['', [Validators.required, Validators.min(1)]]
    });

    this.formularioResidentes = this.formBuilder.group({
      nome: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(30)]],
      ativo: ['', [Validators.required]],
      celular: ['', [Validators.pattern(this.celularRegex)]],
      parentesco: ['', [Validators.required]]
    });

    this.getTipoMorador();
    this.getTipoDocumento();
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  getById() {
    this.defaultService.getById('apartamentos', this.apartamento.id).subscribe(response => {
      this.apartamento = response as Apartamento;
      this.carregaFicha();
    }, (error) => console.error(error));
  }

  carregaFicha() {
    const responsavel = this.apartamento.moradores.filter((morador) => morador.tipoMorador === 'PROPRIETARIO')[0];
    if (responsavel) {
      this.responsavel = responsavel;
      this.tipoMorador = this.responsavel.tipoMorador;
      this.listaResidentes = this.apartamento.moradores.filter((morador) => !morador.tipoMorador || morador.tipoMorador === null);
    }
  }

  isValid(field) {
    return this.formulario.get(field).status === 'VALID' ? true : false;
  }

  isResidentValid(field) {
    return this.formularioResidentes.get(field).status === 'VALID' ? true : false;
  }

  getTipoMorador() {
    this.observable = this.tipoMoradorService.getTiposMorador().subscribe(response => {
      this.listaTipoMoradores = (response as any[]).map(tipo => {
        if (this.apartamento.id && tipo === this.responsavel.tipoMorador) {
          return ({ value: tipo.toString(), label: tipo.toString(), selected: true });
        }

        return ({ value: tipo.toString(), label: tipo.toString() });
      });
    }, (error) => console.error(error));
  }

  getTipoDocumento() {
    this.observable = this.tipoDocumentoService.getTiposDocumento().subscribe(response => {
      this.listaTipoDocumentos = (response as any[]).map(tipo => {
        if (this.apartamento.id && tipo === this.responsavel.tipoMorador) {
          return ({ value: tipo.toString(), label: tipo.toString(), selected: true });
        }

        return ({ value: tipo.toString(), label: tipo.toString() });
      });
    }, (error) => console.error(error));
  }

  carregaEditarResidente(residente) {
    this.residente = residente;
  }

  removerResidente(residente: Morador) {
    if (residente.id) {
      swal({
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
    } else {
      const residenteParaRemover = this.listaResidentes.findIndex(resid => resid.documento === residente.documento);
      this.listaResidentes.splice(residenteParaRemover, 1);
    }
  }

  isEdit(residente) {
    return this.residente === residente;
  }

  incluiResidente() {
    if (!this.residente.id) {
      this.listaResidentes.push(this.residente);
      this.residente = new Morador();
    } else {
      const index = this.listaResidentes.indexOf(this.residente, 0);
      if (index > -1) {
        this.listaResidentes.splice(index, 1);
        this.listaResidentes.push(this.residente);
        this.residente = new Morador();
      }
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

  onCamSuccess(event) { }

  onCamError(event) { }

  imageCropped(image: string) {
    this.croppedImage = image;
  }

  confirmarModalFoto() {
    this.moradorFotoTemp.foto64 = this.croppedImage.base64;
  }

  limparModalFoto(morador) {
    morador.foto64 = undefined;
    this.moradorFotoTemp = undefined;
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
      swal(`Ficha do apartamento ${this.apartamento.numero}`, 'Não é possível salvar a ficha!<br>Existem campos inválidos', 'error');
    } else {
      let apartamento: Apartamento;
      apartamento = this.apartamento;
      apartamento.usuario = this.sharedService.getUsuarioLogged();
      apartamento.moradores = [];
      apartamento.moradores = this.listaResidentes;
      apartamento.moradores.push(this.responsavel);
      apartamento.moradores.forEach(morador => {
        morador.usuario = this.sharedService.getUsuarioLogged();
      });

      this.observable = this.defaultService.atualizar('apartamentos', apartamento).subscribe(() => {
        this.getById();
        this.toastService.addToast('success', `Atualização da ficha do apartamento ${this.apartamento.numero}`,
          `Ficha atualizada com sucesso!`);
      }, error => {
        console.error(error);
        error.error.forEach(element => {
          this.toastService.addToast('error', `Atualização da ficha do apartamento ${this.apartamento.numero}`,
            element.mensagemUsuario);
        });
      });
    }
  }

  cancelaEdicao() {
    this.residente = new Morador();
  }

  getDocumentosPorApartamento() {
    this.observable = this.documentoService.getDocumentosPorApartamento(this.apartamento.id).subscribe(response => {
      this.documentos = response as any[];
    }, error => {
      console.error(error);
      error.error.forEach(element => {
        this.toastService.addToast('error', `Captura dos documentos do apartamento ${this.apartamento.numero}`,
          element.mensagemUsuario);
      });
    });
  }

  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  fileOverAnother(e: any): void {
    this.hasAnotherDropZoneOver = e;
  }

  excluirDocumento(documento) {
    swal({
      title: 'Exclusão de documento',
      html: `Deseja excluir o documento:<br> ${documento.nome}?`,
      type: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Não',
      confirmButtonText: 'Sim'
    }).then((result) => {
      if (result.value) {
        this.observable = this.documentoService.excluirDocumento(documento.id).subscribe(() => {
          this.getDocumentosPorApartamento();
        });
      }
    });
  }

  getFicha() {
    this.observable = this.apartamentoService.getFicha(this.apartamento.id).subscribe((response) => {
      this.saveFile(response['body'], `Ficha-Apartamento-${this.apartamento.numero}-${this.apartamento.bloco.nome}-${this.apartamento.bloco.condominio.nome}`);
    })
  }

  saveFile(data: any, filename?: string) {
    const blob = new Blob([data], { type: 'application/pdf; charset=utf-8' });
    fileSaver.saveAs(blob, filename);
  }
}
