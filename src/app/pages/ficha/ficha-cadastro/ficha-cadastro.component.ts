import { DocumentoService } from './../../../services/documento.service';
import { Component, OnInit, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Apartamento } from '../../../models/apartamento-model';
import { DefaultService } from '../../../services/default.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { IOption } from 'ng-select';
import { Morador } from '../../../models/morador-model';
import { TipoDocumentoService } from '../../../services/tipo-documento.service';
import { TipoMoradorService } from '../../../services/tipo-morador.service';
import { WebCamComponent } from 'ack-angular-webcam';
import { ToastService } from '../../../services/toast.service';
import { SharedService } from 'src/app/shared/shared.service';
import { Ficha } from 'src/app/models/ficha-model';
import { FichaService } from 'src/app/services/ficha.service';
import { ElectronService } from 'src/app/services/electron.service';
import { Empresa } from 'src/app/models/empresa-model';
import { tap } from 'rxjs/operators';

import * as fileSaver from 'file-saver';
import Swal from 'sweetalert2';
import * as moment from 'moment'

@Component({
  selector: 'app-ficha-cadastro',
  templateUrl: './ficha-cadastro.component.html',
  styleUrls: ['./ficha-cadastro.component.scss']
})
export class FichaCadastroComponent implements OnInit, AfterViewChecked {

  ficha: Ficha = new Ficha();
  documentos: any[] = [];
  listaMoradores: Morador[] = [];
  empresaFicha: Empresa = new Empresa();

  listaTipoMoradores: Array<IOption> = [];
  listaTipoDocumentos: Array<IOption> = [];
  isCollapsed: boolean = false;

  formulario: FormGroup;
  formularioMorador: FormGroup;
  isSubmit: boolean = false;
  isSubmitMorador: boolean = false;

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
    private fichaService: FichaService,
    public electronService: ElectronService,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const context = this.route.snapshot.data['context']

      if (context == 'ficha') {
        this.getFicha(params['id'])
      } else if (context && params['id']) {
        this.ficha.apartamento.id = params['id']
        this.getById();
      }
    });

    this.formulario = this.formBuilder.group({
      responsavel: this.formBuilder.group({
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
        observacao: ['', [Validators.maxLength(255)]]
      }),
      observacao: ['', [Validators.maxLength(255)]],
      dataInicio: [''],
      dataFim: ['']
    });

    this.formularioMorador = this.formBuilder.group({
      id: [{ value: null, disabled: true }],
      nome: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      ativo: [true, [Validators.required]],
      celular: ['', [Validators.required, Validators.pattern(this.celularRegex)]],
      parentesco: ['', [Validators.required]],
      tipoDocumento: ['0'],
      documento: ['', [Validators.required]],
      email: [''],
      foto64: [],
      fotoUrl: [],
      observacao: ['', [Validators.maxLength(255)]]
    });

    this.formularioMorador.get('tipoDocumento').valueChanges
      .pipe(
        tap(tipoDocumento => {
          if (tipoDocumento == 'MENOR_IDADE') {
            this.formularioMorador.get('documento').clearValidators();
          } else {
            this.formularioMorador.get('documento').setValidators(Validators.required);
          }

          this.formularioMorador.get('documento').updateValueAndValidity();
        })
      ).subscribe();

    this.getTipoMorador();
    this.getTipoDocumento();
    this.getEmpresaFicha();
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
    this.formulario.get('dataInicio').setValue(moment(this.ficha.dataInicio).format('DD/MM/YYYY'));
    this.formulario.get('dataFim').setValue(moment(this.ficha.dataFim).format('DD/MM/YYYY'));
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

  getEmpresaFicha() {
    this.defaultService.getById('empresas', this.sharedService.getUsuarioLogged().empresa.id)
      .subscribe(empresa => {
        this.empresaFicha = (empresa as Empresa)
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
        this.fichaService.removeMorador(this.ficha.id, morador.id)
          .subscribe(() => {
            this.toastService.addToast(
              'success',
              'Removendo morador',
              'Morador removido com sucesso!'
            )
            this.getFicha(this.ficha.id)
          })
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

      this.fichaService.addMorador(this.ficha.id, morador)
        .subscribe(() => {
          this.toastService.addToast(
            'success',
            'Salvando morador',
            'Morador salvo com sucesso!'
          )
          this.isCollapsed = false
          this.getFicha(this.ficha.id)
        })

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
      let fichaDto = {}
      fichaDto['id'] = this.ficha.id
      fichaDto['idApartamento'] = this.ficha.apartamento.id
      fichaDto['moradores'] = [this.formulario.getRawValue().responsavel]
      if (this.listaMoradores.length > 0)
        this.listaMoradores.forEach(morador => fichaDto['moradores'].push(morador))

      fichaDto['dataInicio'] = moment(this.getDate(this.formulario.get('dataInicio').value)).format('YYYY-MM-DD');
      fichaDto['dataFim'] = moment(this.getDate(this.formulario.get('dataFim').value)).format('YYYY-MM-DD');

      fichaDto['moradores'].forEach(morador => {
        if (morador.usuario)
          delete morador.usuario
      })

      console.log(fichaDto)
      this.defaultService.salvar('fichas', fichaDto)
        .subscribe((ficha) => {
          if (!this.ficha.id) {
            this.router.navigate([`/ficha/${ficha['id']}`], { replaceUrl: true });
          } else {
            this.getFicha(ficha['id'])
          }
          this.toastService.addToast(
            'success',
            `Atualização da ficha do apartamento ${this.ficha.apartamento.numero}`,
            `Ficha atualizada com sucesso!`
          );
        });
    }
  }

  private getDate(d: { year: number, month: number, day: number }) {
    let data = new Date()
    data.setFullYear(d.year, (d.month - 1), d.day);
    data.setHours(0);
    data.setMinutes(0);
    data.setSeconds(0);
    data.setMilliseconds(0);
    return data;
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
    this.fichaService.getFichaPdf(this.ficha.id)
      .subscribe((response) => {
        this.saveFile(response['body'], `Ficha-Apartamento-${this.ficha.apartamento.numero}-${this.ficha.apartamento.bloco.nome}-${this.ficha.apartamento.bloco.condominio.nome}`);
      });
  }

  saveFile(data: any, filename?: string) {
    const blob = new Blob([data], { type: 'application/pdf; charset=utf-8' });
s    const fileURL = URL.createObjectURL(blob);
    window.open(fileURL);
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

  importarDocumentos() {
    this.documentoService.uploadDocumentos(this.ficha.id, this.documentosForm.value.files[0])
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
        this.documentoService.getDocumentosPorFicha(this.ficha.id)
          .subscribe(documentos => {
            this.ficha.documentos = documentos as any[]
          })
      });
  }

  temCracha() {
    const usuario = this.sharedService.getUsuarioLogged()
    return (usuario.empresa && usuario.empresa.empresaConfig && usuario.empresa.empresaConfig.bravaSoftIntegration)
      || (this.empresaFicha.empresaConfig && this.empresaFicha.empresaConfig.bravaSoftIntegration)
  }

  exibirListaParaCracha(modal) {
    if (!this.ficha.id) {
      Swal.fire({
        type: 'error',
        title: 'Impressão de crachás',
        text: 'É necessário salvar a ficha para impressão dos crachás'
      })
      return;
    }

    modal.show()
  }

  imprimirCrachas(modal) {
    let result = this.ficha.moradores
      .map(morador =>
        `${morador.id};${morador.documento ? morador.documento : ''};${morador.email};${morador.foto64 ? morador.foto64.substring(23) : ''};${morador.nome};${morador.telefone ? morador.telefone : ''};${this.ficha.apartamento.bloco.condominio.nome}`
      )

    result.unshift('Id;Documento;Email;Foto64;Nome;Telefone;Condominio')

    this.electronService.sendIpc('imprimir-crachas', result)

    this.electronService.ipcRenderer.on('imprimir-crachas-replay', (event, args) => {
      modal.hide();
      this.toastService.addToast('success', 'Impressão de crachás', 'Crachás impressos com sucesso!');
    })
  }
}
