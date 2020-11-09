import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PassageiroCadastroComponent } from './passageiro-cadastro/passageiro-cadastro.component';
import { PassageiroListaComponent } from './passageiro-lista/passageiro-lista.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Passageiroes',
      status: false
    },
    children: [
      {
        path: 'lista',
        component: PassageiroListaComponent
      },
      {
        path: 'cadastro',
        component: PassageiroCadastroComponent
      },
      {
        path: 'cadastro/:id',
        component: PassageiroCadastroComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PassageiroRoutingModule { }
