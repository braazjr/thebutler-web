import { ToastService } from '../services/toast.service';
import { Injectable } from '@angular/core';

@Injectable()
export class HttpUtil {

    constructor(private toastService: ToastService) { }

    showErrors(error, titulo) {
        console.error(error);
        if (error.error) {
            if (Array.isArray(error.error)) {
                error.error.forEach(element => {
                    console.info(titulo, element.mensagemUsuario)
                    this.toastService.addToast('error', titulo, element.mensagemUsuario);
                });
            } else {
                this.toastService.addToast('error', titulo, error.error.message);
            }
        } else if (error.message) {
            this.toastService.addToast('error', titulo, error.message);
        }
    }
}