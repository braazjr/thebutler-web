import { Injectable } from '@angular/core';
import { ToastyService, ToastOptions, ToastData, ToastyConfig } from 'ng2-toasty';

@Injectable()
export class ToastService {

  constructor(private toastyService: ToastyService) { }

  addToast(type: string, title: string, msg: string, showClose?: boolean, timeout?: number) {
    // if (options.closeOther) {
    //   this.toastyService.clearAll();
    // }
    // this.position = options.position ? options.position : this.position;
    const toastOptions: ToastOptions = {
      title: title,
      msg: msg,
      showClose: showClose ? showClose : true,
      timeout: timeout ? timeout : 5000,
      theme: 'material',
      onAdd: (toast: ToastData) => {
        /* added */
      },
      onRemove: (toast: ToastData) => {
        /* removed */
      }
    };

    switch (type) {
      case 'default': this.toastyService.default(toastOptions); break;
      case 'info': this.toastyService.info(toastOptions); break;
      case 'success': this.toastyService.success(toastOptions); break;
      case 'wait': this.toastyService.wait(toastOptions); break;
      case 'error': this.toastyService.error(toastOptions); break;
      case 'warning': this.toastyService.warning(toastOptions); break;
    }
  }

}
