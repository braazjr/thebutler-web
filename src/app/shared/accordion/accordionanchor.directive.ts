import { Directive, HostListener, Inject } from '@angular/core';

import { AccordionLinkDirective } from './accordionlink.directive';

@Directive({
  selector: '[appAccordionToggle]'
})
export class AccordionAnchorDirective {

  protected navlink: AccordionLinkDirective;

  constructor( @Inject(AccordionLinkDirective) navlink: AccordionLinkDirective) {
    this.navlink = navlink;
  }

  @HostListener('click', ['$event'])
  onClick(e: any) {
    this.navlink.toggle();
  }

  /*
  @HostListener('mouseenter', ['$event'])
  onMouseEnter(e: any) {
    this.navlink.toggle();
  }

  @HostListener('mouseleave')
  onMouseLeave(e: any) {
    // this.navlink.toggle();
  }
  */

}
