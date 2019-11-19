import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { CoreChartModule } from './demo/pages/core-chart/core-chart.module';
import { AuthComponent } from './theme/layout/auth/auth.component';
import { SecurityGuard } from './pages/security/security.guard';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    canActivate: [SecurityGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard/home',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./demo/dashboard/dashboard.module').then(module => module.DashboardModule)
      },
      {
        path: 'layout',
        loadChildren: () => import('./demo/pages/layout/layout.module').then(module => module.LayoutModule)
      },
      {
        path: 'widget',
        loadChildren: () => import('./demo/widget/widget.module').then(module => module.WidgetModule)
      },
      {
        path: 'users',
        loadChildren: () => import('./demo/users/users.module').then(module => module.UsersModule)
      },
      {
        path: 'basic',
        loadChildren: () => import('./demo/ui-elements/ui-basic/ui-basic.module').then(module => module.UiBasicModule)
      },
      {
        path: 'advance',
        loadChildren: () => import('./demo/ui-elements/ui-adv/ui-adv.module').then(module => module.UiAdvModule)
      },
      {
        path: 'forms',
        loadChildren: () => import('./demo/pages/form-elements/form-elements.module').then(module => module.FormElementsModule)
      },
      {
        path: 'tbl-bootstrap',
        loadChildren: () => import('./demo/pages/tables/tbl-bootstrap/tbl-bootstrap.module').then(module => module.TblBootstrapModule)
      },
      {
        path: 'tbl-datatable',
        loadChildren: () => import('./demo/pages/tables/tbl-datatable/tbl-datatable.module').then(module => module.TblDatatableModule)
      },
      {
        path: 'charts',
        loadChildren: () => import('./demo/pages/core-chart/core-chart.module').then(module => module.CoreChartModule)
      },
      {
        path: 'maps',
        loadChildren: () => import('./demo/pages/core-maps/core-maps.module').then(module => module.CoreMapsModule)
      },
      {
        path: 'email',
        loadChildren: () => import('./demo/application/email/email.module').then(module => module.EmailModule)
      },
      {
        path: 'task',
        loadChildren: () => import('./demo/application/task/task.module').then(module => module.TaskModule)
      },
      {
        path: 'todo',
        loadChildren: () => import('./demo/application/todo/todo.module').then(module => module.TodoModule)
      },
      {
        path: 'gallery',
        loadChildren: () => import('./demo/application/gallery/gallery.module').then(module => module.GalleryModule)
      },
      {
        path: 'helpdesk',
        loadChildren: () => import('./demo/application/helpdesk/helpdesk.module').then(module => module.HelpdeskModule)
      },
      {
        path: 'editor',
        loadChildren: () => import('./demo/extension/editor/editor.module').then(module => module.EditorModule)
      },
      {
        path: 'invoice',
        loadChildren: () => import('./demo/extension/invoice/invoice.module').then(module => module.InvoiceModule)
      },
      {
        path: 'full-calendar',
        loadChildren: () => import('./demo/extension/full-event-calendar/full-event-calendar.module')
          .then(module => module.FullEventCalendarModule)
      },
      {
        path: 'file-upload',
        loadChildren: () => import('./demo/extension/files-upload/files-upload.module').then(module => module.FilesUploadModule)
      },
      {
        path: 'sample-page',
        loadChildren: () => import('./demo/pages/sample-page/sample-page.module').then(module => module.SamplePageModule)
      },

      {
        path: 'dashboard',
        loadChildren: () => import('./pages/dashboard/dashboard.module').then(module => module.DashboardModule)
      },
      {
        path: 'empresa',
        loadChildren: () => import('./pages/empresa/empresa.module').then(module => module.EmpresaModule)
      },
      {
        path: 'condominio',
        loadChildren: () => import('./pages/condominio/condominio.module').then(module => module.CondominioModule)
      },
      {
        path: 'bloco',
        loadChildren: () => import('./pages/bloco/bloco.module').then(module => module.BlocoModule)
      },
      {
        path: 'apartamento',
        loadChildren: () => import('./pages/apartamento/apartamento.module').then(module => module.ApartamentoModule)
      },
      {
        path: 'ficha',
        loadChildren: () => import('./pages/ficha/ficha.module').then(module => module.FichaModule)
      },
      {
        path: 'morador',
        loadChildren: () => import('./pages/morador/morador.module').then(module => module.MoradorModule)
      },
      {
        path: 'usuario',
        loadChildren: () => import('./pages/usuario/usuario.module').then(module => module.UsuarioModule)
      },
      {
        path: 'rota',
        loadChildren: () => import('./pages/rota/rota.module').then(module => module.RotaModule)
      },
      {
        path: 'viagem',
        loadChildren: () => import('./pages/viagem/viagem.module').then(module => module.ViagemModule)
      }
    ]
  },
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: 'auth/login',
        loadChildren: () => import('./pages/security/login/login.module').then(module => module.LoginModule)
      },
      {
        path: 'maintenance',
        loadChildren: () => import('./demo/pages/maintenance/maintenance.module').then(module => module.MaintenanceModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
