import { EmpresaRouteGuard } from './empresa.route.guard';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmpresaCadastroComponent } from './empresa-cadastro/empresa-cadastro.component';
import { EmpresaListaComponent } from './empresa-lista/empresa-lista.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [EmpresaRouteGuard],
    data: {
      title: 'Empresas',
      status: false,
      role: 'ADMIN'
    },
    children: [
      {
        path: 'cadastro',
        component: EmpresaCadastroComponent
      },
      {
        path: 'cadastro/:id',
        component: EmpresaCadastroComponent
      },
      {
        path: 'lista',
        component: EmpresaListaComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmpresaRoutingModule { }
