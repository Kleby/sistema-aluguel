import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UnauthorizedComponent } from './pages/unauthorized/unauthorized.component';
import { authGuard } from './guards/auth.guard';
import { RoupaFormComponent } from './components/roupa-form/roupa-form.component';
import { ClienteFormComponent } from './components/cliente-form/cliente-form.component';
import { ClientesListComponent } from './components/clientes-list/clientes-list.component';
import { AluguelFormComponent } from './components/aluguel-form/aluguel-form.component';
import { RoupaListComponent } from './components/roupa-list/roupa-list.component';
import { AlugueisComponent } from './pages/alugueis/alugueis.component';
import { ClienteRoupaModalComponent } from './components/cliente-roupa.modal/cliente-roupa.modal.component';
import { MensagensComponent } from './pages/mensagens/mensagens.component';
import { AtualizaRoupaComponent } from './pages/atualiza-roupa/atualiza-roupa.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login',
  },
  {
    path: 'unauthorized',
    component: UnauthorizedComponent,
    title: 'Sem autorização',
  },

  // rotas com guards
  {
    path: 'dashboard',
    component: DashboardComponent,
    title: 'DashBoard',
    canActivate: [authGuard],
  },
  {
    path: 'roupas',
    component: RoupaListComponent,
    title: 'Roupas',
    canActivate: [authGuard],
  },
  {
    path: 'roupas/nova',
    component: RoupaFormComponent,
    title: 'Roupas',
    canActivate: [authGuard],
  },
  {
    path: 'roupas/editar/:id',
    component: AtualizaRoupaComponent,
    canActivate: [authGuard],
  },

  // Rotas protegidas - apenas admin
  {
    path: 'clientes',
    component: ClientesListComponent,
    canActivate: [authGuard],
    data: { admin: true },
  },
  {
    path: 'clientes/novo',
    component: ClienteFormComponent,
    canActivate: [authGuard],
    data: { admin: true },
  },

  {
    path: 'clientes/editar/:id',
    component: ClienteFormComponent,
    canActivate: [authGuard],
    data: { admin: true },
  },

  {
    path:"alugueis", component: AlugueisComponent, title: "Alugueis Ativos",  canActivate: [authGuard]
  },
  {
    path:"alugueis/id/:id", component: ClienteRoupaModalComponent, title: "Alugueis Ativos",  canActivate: [authGuard]
  },

  {
    path:"alugueis/novo", component: AluguelFormComponent, canActivate: [authGuard]
  },

  {
    path:"bot-mensagens", component: MensagensComponent, canActivate: [authGuard]
  },

  { path: '**', redirectTo: '/dashboard' },
];
