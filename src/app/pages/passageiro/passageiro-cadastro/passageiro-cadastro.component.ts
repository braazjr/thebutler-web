import { DocumentoService } from './../../../services/documento.service';
import { Component, OnInit, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DefaultService } from '../../../services/default.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Passageiro } from '../../../models/passageiro-model';
import { TipoDocumentoService } from '../../../services/tipo-documento.service';
import { WebCamComponent } from 'ack-angular-webcam';
import { ToastService } from '../../../services/toast.service';
import { SharedService } from 'src/app/shared/shared.service';
import { ElectronService } from 'src/app/services/electron.service';
import { Empresa } from 'src/app/models/empresa-model';
import { tap } from 'rxjs/operators';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-passageiro-cadastro',
  templateUrl: './passageiro-cadastro.component.html',
  styleUrls: ['./passageiro-cadastro.component.scss']
})
export class PassageiroCadastroComponent implements OnInit, AfterViewChecked {

  documentos: any[] = [];
  passageiro: Passageiro = new Passageiro();
  empresa: Empresa = new Empresa();
  listaDependentes: any[] = [];

  listaTipoDocumentos = [];

  formulario: FormGroup;
  formularioDependente: FormGroup;
  isSubmit: boolean = false;
  isSubmitDependente: boolean = false;
  isCollapsed: boolean = false;

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
    private sharedService: SharedService,
    private toastService: ToastService,
    private documentoService: DocumentoService,
    public electronService: ElectronService,
    private router: Router  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.passageiro.id = params['id'];
        this.getById();
      }
    });

    this.formulario = this.formBuilder.group({
      id: [{ value: '', disabled: true }],
      nome: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      ativo: [true, [Validators.required]],
      celular: ['', [Validators.required, Validators.pattern(this.celularRegex)]],
      telefone: ['', [Validators.pattern(this.telefoneRegex)]],
      tipoDocumento: ['0'],
      documento: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      foto64: [],
      observacao: ['', [Validators.maxLength(255)]],
      dataInicio: [],
      dataFim: [],
      empresaId: [{ value: '0', disabled: true }]
    });

    this.formularioDependente = this.formBuilder.group({
      id: [{ value: '', disabled: true }],
      nome: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      ativo: [true, [Validators.required]],
      celular: ['', [Validators.required, Validators.pattern(this.celularRegex)]],
      telefone: ['', [Validators.pattern(this.telefoneRegex)]],
      tipoDocumento: ['0'],
      documento: ['', [Validators.required]],
      email: ['', [Validators.email]],
      foto64: [],
      observacao: ['', [Validators.maxLength(255)]],
      dataInicio: [],
      dataFim: [],
      empresaId: [{ value: '0', disabled: true }, [Validators.required]]
    });

    this.formulario.get('empresaId').setValue(this.sharedService.getUsuarioLogged().empresa.id)

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

    this.getTipoDocumento();
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  getById(id?) {
    this.defaultService.getById('passageiros', id || this.passageiro.id)
      .subscribe(response => {
        this.passageiro = response as Passageiro;
        this.formulario.patchValue(response);
        this.listaDependentes = response['dependentes'];
      });
  }

  getTipoDocumento() {
    this.tipoDocumentoService.getTiposDocumento()
      .subscribe(response => {
        this.listaTipoDocumentos = (response as any[]).map(tipo => ({ value: tipo.toString(), label: tipo.toString() }));
        this.listaTipoDocumentos.unshift({ value: '0', label: 'Selecione uma opção' })
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

  limparModalFoto(passageiro) {
    passageiro.foto64 = undefined;
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
      if (!this.passageiro.id) {
        this.defaultService.salvar('passageiros', this.formulario.getRawValue())
          .subscribe(response => {
            this.passageiro = response as Passageiro;
            this.router.navigate(['/passageiro/lista']);
          })
      } else {
        this.defaultService.atualizar('passageiros', this.formulario.getRawValue())
          .subscribe(response => {
            this.passageiro = response as Passageiro;
            this.router.navigate(['/passageiro/lista']);;
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
        this.documentoService.excluirDocumentoOnPassageiro(this.passageiro.id, documento.id)
          .subscribe(() => {
            this.toastService.addToast(
              'success',
              `Exclusão de documento`,
              `Documento excluído com sucesso!`
            );
            this.getById(this.passageiro.id)
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
    this.documentoService.uploadDocumentosOnPassageiro(this.passageiro.id, this.documentosForm.value.files[0])
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
        this.documentoService.getDocumentosPorPassageiro(this.passageiro.id)
          .subscribe(documentos => {
            this.passageiro.documentos = documentos as any[]
          })
      });
  }

  temCracha() {
    const usuario = this.sharedService.getUsuarioLogged()
    return (usuario.empresa && usuario.empresa.empresaConfig && usuario.empresa.empresaConfig.bravaSoftIntegration)
      || (this.empresa.empresaConfig && this.empresa.empresaConfig.bravaSoftIntegration)
  }

  getValueDependenteForm(field) {
    return this.formularioDependente.get(field).value;
  }

  incluiDependente() {
    if (this.formularioDependente.invalid) {
      this.isSubmitDependente = true;
      return;
    } else {
      const morador = this.formularioDependente.getRawValue();
      if (this.formularioDependente.get('tipoDocumento').value != '0')
        morador.tipoDocumento = this.formularioDependente.get('tipoDocumento').value;

      const dependente = this.formularioDependente.getRawValue()
      dependente.responsavelId = this.formulario.get('id').value

      if (!dependente.id) {
        this.defaultService.salvar('passageiros', dependente)
          .subscribe(response => {
            this.formularioDependente.patchValue(response);
            this.toastService.addToast(
              'success',
              'Salvando morador',
              'Morador salvo com sucesso!'
            )
            this.isCollapsed = false
            this.resetDependenteForm();
          })
      } else {
        this.defaultService.atualizar('passageiros', dependente)
          .subscribe(response => {
            this.formularioDependente.patchValue(response);
            this.toastService.addToast(
              'success',
              'Atualizando morador',
              'Morador atualizado com sucesso!'
            )
            this.isCollapsed = false
            this.resetDependenteForm();
          })
      }

    }
  }

  resetDependenteForm() {
    this.formularioDependente.reset();
    this.formularioDependente.get('tipoDocumento').setValue('0');
    this.formularioDependente.get('ativo').setValue(true);
  }

  carregaEditarDepentende(dependente) {
    this.formularioDependente.patchValue(dependente);
  }
}
