import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastService } from 'src/app/services/toast.service';
import { ElectronService } from 'src/app/services/electron.service';

@Component({
  selector: 'modal-bravasoft-configuration',
  templateUrl: './modal-bravasoft-configuration.component.html',
  styleUrls: ['./modal-bravasoft-configuration.component.scss']
})
export class ModalBravasoftConfigurationComponent implements OnInit {

  @ViewChild('modalBravaSoft', { static: false }) modalBravaSoft: any;

  configuration = {
    bsPrintPath: '',
    projectPath: ''
  }

  alert = {
    message: '',
    type: ''
  }

  isSubmit = false

  constructor(
    private toastService: ToastService,
    private electronService: ElectronService
  ) { }

  ngOnInit() {
    if (!this.electronService.ipcRenderer) {
      return;
    }

    this.electronService.ipcRenderer.on('get-configurations-replay', (event, args) => {
      this.configuration = args as any
    })

    this.electronService.sendIpc('get-configurations', {})
  }

  public show(): void {
    this.modalBravaSoft.show();
  }

  public hide(): void {
    this.modalBravaSoft.hide();
  }

  salvar(form, modal) {
    if (form.invalid) {
      this.isSubmit = true
      return;
    }

    if (!this.electronService.ipcRenderer) {
      return;
    }

    this.electronService.ipcRenderer.on('configurations-save-replay', (event, error) => {
      if (error) {
        this.alert = { message: 'Houve um erro ao tentar atualizar as configurações', type: 'danger' }
      } else {
        this.alert = { message: 'Configurações atualizadas com sucesso!', type: 'success' }
      }

      setInterval(() => {
        this.alert = undefined
      }, 5000)

      modal.hide();
    })

    this.electronService.sendIpc('configurations-save', this.configuration)
  }
}
