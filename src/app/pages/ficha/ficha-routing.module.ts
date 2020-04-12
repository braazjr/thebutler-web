import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FichaCadastroComponent } from './ficha-cadastro/ficha-cadastro.component';
import { FichaListaComponent } from './ficha-lista/ficha-lista.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Ficha',
      status: false
    },
    children: [
      {
        path: '',
        component: FichaListaComponent
      },
      {
        path: 'apartamento/:id',
        component: FichaCadastroComponent,
        data: { context: 'apartamento' }
      },
      {
        path: ':id',
        component: FichaCadastroComponent,
        data: { context: 'ficha' }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FichaRoutingModule { }
