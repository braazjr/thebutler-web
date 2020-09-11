import { AfterContentInit, Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ElectronService } from './services/electron.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterContentInit {

  constructor(
    private router: Router,
    private electronService: ElectronService
  ) { }

  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }

  ngAfterContentInit() {
    this.electronService.sendIpc('ready', {})
  }
}
