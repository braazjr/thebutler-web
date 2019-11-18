import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CondominioCadastroComponent } from './condominio-cadastro/condominio-cadastro.component';
import { CondominioListaComponent } from './condominio-lista/condominio-lista.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Condominios',
      status: false
    },
    children: [
      {
        path: 'cadastro',
        component: CondominioCadastroComponent
      },
      {
        path: 'cadastro/:id',
        component: CondominioCadastroComponent
      },
      {
        path: 'lista',
        component: CondominioListaComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CondominioRoutingModule { }
