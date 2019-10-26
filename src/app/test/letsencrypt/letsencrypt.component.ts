import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-letsencrypt',
  templateUrl: './letsencrypt.component.html'
})
export class LetsencryptComponent implements OnInit {

  content = '';

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    const rou = this.route.snapshot['_routerState'].url;
    if (rou == '/.well-known/acme-challenge/o418moXNb-Qptv0uHXmP__iluXB5lJRRurYMWJwfMmI') {
      this.content = 'o418moXNb-Qptv0uHXmP__iluXB5lJRRurYMWJwfMmI.KYlczo0ERsPfWgdM3zFpzu8z0MXrdDylNWuXL1jFXHw';
    } else if (rou == '/.well-known/acme-challenge/N4bRahduEcUDuLei26H7B7DG4BxTbRkvZ1iWR7zIaH4') {
      this.content = 'N4bRahduEcUDuLei26H7B7DG4BxTbRkvZ1iWR7zIaH4.KYlczo0ERsPfWgdM3zFpzu8z0MXrdDylNWuXL1jFXHw';
    }
  }

}
