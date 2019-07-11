import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FichaCadastroComponent } from './ficha-cadastro/ficha-cadastro.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Ficha',
      status: false
    },
    children: [
      {
        path: ':id',
        component: FichaCadastroComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FichaRoutingModule { }
