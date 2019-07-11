import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AdminComponent} from './layout/admin/admin.component';
import { RouteGuard } from './pages/auth/auth.route.guard';
import { AuthComponent } from './layout/auth/auth.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    canActivate: [RouteGuard],
    children: [
      {
        path: '',
        redirectTo: 'empresa/lista',
        pathMatch: 'full'
      },
      // {
      //   path: 'dashboards',
      //   loadChildren: './pages/dashboards/dashboards.module#DashboardsModule'
      // },
      {
        path: 'empresa',
        loadChildren: './pages/empresa/empresa.module#EmpresaModule'
      },
      {
        path: 'construtora',
        loadChildren: './pages/construtora/construtora.module#ConstrutoraModule'
      },
      {
        path: 'condominio',
        loadChildren: './pages/condominio/condominio.module#CondominioModule'
      },
      {
        path: 'bloco',
        loadChildren: './pages/bloco/bloco.module#BlocoModule'
      },
      {
        path: 'apartamento',
        loadChildren: './pages/apartamento/apartamento.module#ApartamentoModule'
      },
      {
        path: 'ficha',
        loadChildren: './pages/ficha/ficha.module#FichaModule'
      },
      {
        path: 'morador',
        loadChildren: './pages/morador/morador.module#MoradorModule'
      },
      {
        path: 'usuario',
        loadChildren: './pages/usuario/usuario.module#UsuarioModule'
      },
      {
        path: 'rota',
        loadChildren: './pages/rota/rota.module#RotaModule'
      },
      {
        path: 'viagem',
        loadChildren: './pages/viagem/viagem.module#ViagemModule'
      }
    ]
  },
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: 'auth',
        loadChildren: './pages/auth/auth.module#AuthModule'
      }
    ]
  },
  {
    path: 'theme',
    component: AdminComponent,
    children: [
      {
        path: '',
        redirectTo: 'simple-page',
        pathMatch: 'full'
      },
      {
        path: 'simple-page',
        loadChildren: './theme/simple-page/simple-page.module#SimplePageModule'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
