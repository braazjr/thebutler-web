import { DocumentoService } from './../../../services/documento.service';
import { Component, OnInit, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Apartamento } from '../../../models/apartamento-model';
import { DefaultService } from '../../../services/default.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Morador } from '../../../models/morador-model';
import { TipoDocumentoService } from '../../../services/tipo-documento.service';
import { TipoMoradorService } from '../../../services/tipo-morador.service';
import { WebCamComponent } from 'ack-angular-webcam';
import { ToastService } from '../../../services/toast.service';
import { SharedService } from 'src/app/shared/shared.service';
import { ElectronService } from 'src/app/services/electron.service';
import { Empresa } from 'src/app/models/empresa-model';
import { tap } from 'rxjs/operators';
import { Condominio } from 'src/app/models/condominio-model';
import { Bloco } from 'src/app/models/bloco-model';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-morador-cadastro',
  templateUrl: './morador-cadastro.component.html',
  styleUrls: ['./morador-cadastro.component.scss']
})
export class MoradorCadastroComponent implements OnInit, AfterViewChecked {

  documentos: any[] = [];
  morador: Morador = new Morador();
  apartamento: Apartamento = new Apartamento();
  empresa: Empresa = new Empresa();
  condominioId: string = '0';
  blocoId: string = '0';
  apartamentoId: string = '0';

  listaTipoMoradores = [];
  listaTipoDocumentos = [];
  listaCondominios = [];
  listaBlocos = [];
  listaBlocosFiltrados = [];
  listaApartamentos = [];
  listaApartamentosFiltrados = [];

  formulario: FormGroup;
  isSubmit: boolean = false;

  dateMask = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];
  telefoneMask = ['(', /[1-9]/, /\d/, ')', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  celularMask = ['(', /[1-9]/, /\d/, ')', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  dateRegex = /^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d$/;
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
    public electronService: ElectronService,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.morador.id = params['id'];
        this.getById();
      }
    });

    this.formulario = this.formBuilder.group({
      id: [{ value: '', disabled: true }],
      nome: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      ativo: [true, [Validators.required]],
      celular: ['', [Validators.required, Validators.pattern(this.celularRegex)]],
      telefone: ['', [Validators.pattern(this.telefoneRegex)]],
      placaCarro: [''],
      tipoMorador: ['0', [Validators.required, Validators.min(1)]],
      tipoDocumento: ['0'],
      documento: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      foto64: [],
      fotoUrl: [],
      observacao: ['', [Validators.maxLength(255)]],
      dataInicio: [],
      dataFim: [],
      condominio: ['0', [Validators.required]],
      bloco: [{ value: '0', disabled: true }, [Validators.required]],
      apartamentoId: [{ value: '0', disabled: true }, [Validators.required]]
    });

    this.formulario.get('tipoDocumento').valueChanges
      .pipe(
        tap(tipoDocumento => {
          if (tipoDocumento == 'MENOR_IDADE') {
            this.formulario.get('documento').clearValidators();
          } else {
            this.formulario.get('documento').setValidators(Validators.required);
          }

          this.formulario.get('documento').updateValueAndValidity();
        })
      ).subscribe();

    this.formulario.get('condominio').valueChanges
      .pipe(
        tap(condominioId => {
          if (condominioId && condominioId != '0') {
            this.getBlocosByCondominio(condominioId)
            this.formulario.get('bloco').enable()
            this.formulario.get('bloco').setValue('0')
            this.formulario.get('apartamentoId').disable()
            this.formulario.get('apartamentoId').setValue('0')
          }
        })
      ).subscribe();

    this.formulario.get('bloco').valueChanges
      .pipe(
        tap(blocoId => {
          if (blocoId && blocoId != '0') {
            this.getApartamentosByBloco(blocoId)
            this.formulario.get('apartamentoId').enable()
            this.formulario.get('apartamentoId').setValue('0')
          }
        })
      ).subscribe();

    this.getTipoMorador();
    this.getTipoDocumento();
    this.getEmpresa();
    this.carregarCondominios();
    this.carregarBlocos();
    this.carregarApartamentos();
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  getById(id?) {
    this.defaultService.getById('moradores', id || this.morador.id)
      .subscribe(response => {
        this.morador = response as Morador;
        this.formulario.patchValue(response);
        this.getApartamentoById(this.morador.apartamento.id);
      });
  }

  getApartamentoById(apartamentoId) {
    this.defaultService.getById('apartamentos', apartamentoId)
      .subscribe(response => {
        this.apartamento = response as Apartamento;
        this.formulario.get('condominio').setValue(this.apartamento.bloco.condominio.id)
        this.formulario.get('bloco').setValue(this.apartamento.bloco.id)
        this.formulario.get('apartamentoId').setValue(this.apartamento.id)
      });
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

  getEmpresa() {
    this.defaultService.getById('empresas', this.sharedService.getUsuarioLogged().empresa.id)
      .subscribe(empresa => {
        this.empresa = (empresa as Empresa)
      });
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
    this.formulario.get('foto64').setValue(this.croppedImage.base64);
    this.formulario.get('fotoUrl').setValue(undefined);
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
      if (!this.morador.id) {
        this.defaultService.salvar('moradores', this.formulario.getRawValue())
          .subscribe(response => {
            this.morador = response as Morador;
            this.router.navigate(['/morador/lista']);
          })
      } else {
        this.defaultService.atualizar('moradores', this.formulario.getRawValue())
          .subscribe(response => {
            this.morador = response as Morador;
            this.router.navigate(['/morador/lista']);;
          })
      }
    }
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
        this.documentoService.excluirDocumentoOnMorador(this.morador.id, documento.id)
          .subscribe(() => {
            this.toastService.addToast(
              'success',
              `Exclusão de documento`,
              `Documento excluído com sucesso!`
            );
            this.getById(this.morador.id)
          });
      }
    });
  }

  saveFile(data: any) {
    const blob = new Blob([data], { type: 'application/pdf; charset=utf-8' });
    const fileURL = URL.createObjectURL(blob);
    window.open(fileURL);
  }

  getFieldForm(field) {
    return this.formulario.get(field);
  }

  removeFoto() {
    this.formulario.get('foto64').setValue(undefined);
    this.formulario.get('fotoUrl').setValue(undefined);
  }

  importarDocumentos() {
    this.documentoService.uploadDocumentosOnMorador(this.morador.id, this.documentosForm.value.files[0])
      .subscribe(() => {
        this.toastService.addToast(
          'success',
          `Importação de documento`,
          `Documento importado com sucesso!`
        );
      }, () => {
        Swal.fire({
          type: 'error',
          title: 'Importação de documento',
          text: 'Ocorreu um erro ao importar o(s) documento(s)'
        })
      }, () => {
        this.documentoService.getDocumentosPorMorador(this.morador.id)
          .subscribe(documentos => {
            this.morador.documentos = documentos as any[]
          })
      });
  }

  temCracha() {
    const usuario = this.sharedService.getUsuarioLogged()
    return (usuario.empresa && usuario.empresa.empresaConfig && usuario.empresa.empresaConfig.bravaSoftIntegration)
      || (this.empresa.empresaConfig && this.empresa.empresaConfig.bravaSoftIntegration)
  }

  carregarCondominios() {
    this.defaultService.get('condominios')
      .subscribe(response => {
        this.listaCondominios = (response as Condominio[])
          .map(cond => ({
            value: cond.id.toString(),
            label: this.sharedService.isAdmin() ? `${cond.empresa.nomeFantasia} - ${cond.nome}` : cond.nome
          }));
        this.listaCondominios.unshift({ value: '0', label: 'Selecione uma opção', disabled: true });
      });
  }

  carregarBlocos() {
    this.defaultService.get('blocos')
      .subscribe(response => {
        this.listaBlocos = response as Bloco[]
        this.listaBlocosFiltrados = (response as Bloco[])
          .map(bloco => ({
            value: bloco.id.toString(),
            label: bloco.nome || bloco.numero
          }));
        this.listaBlocosFiltrados.unshift({ value: '0', label: 'Selecione uma opção', disabled: true });
      });
  }

  carregarApartamentos() {
    this.defaultService.get('apartamentos')
      .subscribe(response => {
        this.listaApartamentos = response['content'] as Apartamento[]
        this.listaApartamentosFiltrados = (response['content'] as Apartamento[])
          .map(apartamento => ({
            value: apartamento.id.toString(),
            label: apartamento.numero.toString()
          }));
        this.listaApartamentosFiltrados.unshift({ value: '0', label: 'Selecione uma opção', disabled: true });
      });
  }

  getBlocosByCondominio(condominioId: string) {
    const filtrados = this.listaBlocos
      .filter(bloco => bloco.condominio.id == condominioId)
      .map(bloco => ({
        value: bloco.id.toString(),
        label: bloco.condominio.nome + ' - ' + (bloco.nome || bloco.numero),
        disabled: false
      }))

    filtrados
      .unshift({ value: '0', label: 'Selecione uma opção', disabled: true });

    this.listaBlocosFiltrados = filtrados
  }

  getApartamentosByBloco(blocoId: string) {
    const filtrados = this.listaApartamentos
      .filter(apartamento => apartamento.bloco.id == blocoId)
      .map(apartamento => ({
        value: apartamento.id.toString(),
        label: apartamento.numero.toString(),
        disabled: false
      }))

    filtrados
      .unshift({ value: '0', label: 'Selecione uma opção', disabled: true });

    this.listaApartamentosFiltrados = filtrados
  }
}
