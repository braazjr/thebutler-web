import { Directive, Input, ElementRef, Renderer2, HostBinding } from '@angular/core';

@Directive({
  selector: '[validForm]'
})
export class ValidFormDirectiveDirective {

  @Input('validForm')
  validForm: any;

  constructor(private renderer: Renderer2, private el: ElementRef) { }

  @HostBinding('class.is-invalid')
  public get isInvalid(): boolean {
    return this.checkField();
  }

  @HostBinding('class.ng-invalid')
  public get ngInvalid(): boolean {
    const ret = this.checkField();

    if (ret) {
      this.renderer.addClass(this.el.nativeElement, 'is-invalid')
    }

    return ret;
  }

  checkField() {
    // console.log(this.el.nativeElement)
    return !this.validForm.valid && (this.validForm.dirty || this.validForm.touched) ? true : false;
  }
}
