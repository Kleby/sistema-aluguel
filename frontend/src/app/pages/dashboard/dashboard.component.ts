import { Component } from '@angular/core';
import { IUser } from '../../models/iuser.model';
import { AuthService } from '../../services/auth.service';
import { RoupaService } from '../../services/roupa.service';
import { Router } from '@angular/router';
import { AluguelService } from '../../services/aluguel.service';
import { ClienteService } from '../../services/cliente.service';
import { DashboardLinkCardsComponent } from "../../components/dashboard-link-cards/dashboard-link-cards.component";
import { FormatDatePipe } from '../../pipes/format-date.pipe';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DashboardLinkCardsComponent, FormatDatePipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  user: IUser | null = null;
  isLoading = true;
  dashboardCards: string[] = ['ROUPAS', 'ALUGADAS', 'DISPONIVEIS', 'CLIENTES']

  stats = {
    totalRoupas: 0,
    roupasDisponiveis: 0,
    roupasAlugadas: 0,
    roupasManutencao: 0,
    totalAlugueis: 0,
    alugueisAtivos: 0,
    alugueisAtrasados: 0,
    totalClientes: 0,
  };  
  recentAlugueis: any[] = [];
  roupasPopulares: any[] = [];

  constructor(
    private authService: AuthService,
    private roupaService: RoupaService,
    private aluguelService: AluguelService,
    private clienteService: ClienteService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getCurrentUser();
    this.loadDashboardData();

  }
  getCurrentUser(): void {
    this.authService.currentUser$.subscribe(
      (currentUser) => (this.user = currentUser)
    );
  }

  loadDashboardData(): void {
    this.isLoading = true;

    // Carregar dados em paralelo
    Promise.all([
      this.loadRoupasStats(),
      this.loadAlugueisStats(),
      this.loadClientesStats(),
      this.loadRecentAlugueis(),
      this.loadRoupasPopulares(),
    ]).finally(() => {
      this.isLoading = false;
    });

  }
  loadRoupasStats(): Promise<void> {
    return new Promise((resolve) => {
      this.roupaService.getRoupas().subscribe({
        next: (roupas) => {
          this.stats.totalRoupas = roupas.length;
          this.stats.roupasDisponiveis = roupas.filter(
            (r) => r.status === 'disponivel'
          ).length;
          this.stats.roupasAlugadas = roupas.filter(
            (r) => r.status === 'alugado'
          ).length;
          this.stats.roupasManutencao = roupas.filter(
            (r) => r.status === 'manutencao'
          ).length;
          resolve();
        },
        error: (error) => {
          console.error('Erro ao carregar estatísticas de roupas:', error);
          resolve();
        },
      });
    });
  }
  loadAlugueisStats(): Promise<void> {
    return new Promise((resolve) => {
      this.aluguelService.getAlugueis().subscribe({
        next: (alugueis) => {
          this.stats.totalAlugueis = alugueis.length;
          this.stats.alugueisAtivos = alugueis.filter(
            (a) => a.situacao === 'em dias'
          ).length;

          // Calcular aluguéis atrasados
          const hoje = new Date();
          this.stats.alugueisAtrasados = alugueis.filter((a) => {
            if (a.situacao === 'em dias') {
              const dataDevolucao = new Date(a.data_devolucao_prevista);
              return dataDevolucao < hoje;
            }
            return false;
          }).length;

          resolve();
        },
        error: (error) => {
          console.error('Erro ao carregar estatísticas de aluguéis:', error);
          resolve();
        },
      });
    });
  }
  loadClientesStats(): Promise<void> {
    return new Promise((resolve) => {
      if (this.user?.tipo === 'admin') {
        this.clienteService.getClientes().subscribe({
          next: (clientes) => {
            this.stats.totalClientes = clientes.length;
            resolve();
          },
          error: (error) => {
            console.error('Erro ao carregar estatísticas de clientes:', error);
            resolve();
          },
        });
      } else {
        resolve();
      }
    });
  }
  loadRecentAlugueis(): Promise<void> {
    return new Promise((resolve) => {
      this.aluguelService.getAlugueis().subscribe({
        next: (alugueis) => {
          // Ordenar por data mais recente e pegar os 5 últimos
          this.recentAlugueis = alugueis
            .sort(
              (a, b) =>
                new Date(b.data_aluguel).getTime() -
                new Date(a.data_aluguel).getTime()
            )
            .slice(0, 5);
          resolve();
        },
        error: (error) => {
          console.error('Erro ao carregar aluguéis recentes:', error);
          resolve();
        },
      });
    });
  }
  loadRoupasPopulares(): Promise<void> {
    return new Promise((resolve) => {
      this.roupaService.getRoupas().subscribe({
        next: (roupas) => {
          // Ordenar por preço (mais caras primeiro) e pegar as 4 primeiras
          this.roupasPopulares = roupas
            .filter((r) => r.status === 'disponivel')
            .sort((a, b) => b.preco_aluguel - a.preco_aluguel)
            .slice(0, 4);
          resolve();
        },
        error: (error) => {
          console.error('Erro ao carregar roupas populares:', error);
          resolve();
        },
      });
    });
  }
  getDaysUntilExpiration(): number {
    if (!this.user?.data_expiracao) return 0;

    const expiration = new Date(this.user.data_expiracao);
    const today = new Date();
    const diffTime = expiration.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  isExpiringSoon(): boolean {
    const daysUntilExpiration = this.getDaysUntilExpiration();
    return daysUntilExpiration <= 7 && daysUntilExpiration > 0;
  }

  isExpired(): boolean {
    return this.getDaysUntilExpiration() <= 0;
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  }

  getStatusBadgeClass(situacao: string): string {
    switch (situacao) {
      case 'em dias':
        return 'bg-success';
      case 'devolvido':
        return 'bg-secondary';
      case 'atrasado':
        return 'bg-danger';
      default:
        return 'bg-warning';
    }
  }

  getStatusText(situacao: string): string {
    switch (situacao) {
      case 'ativo':
        return 'Ativo';
      case 'devolvido':
        return 'Devolvido';
      case 'atrasado':
        return 'Atrasado';
      default:
        return situacao;
    }
  }

  isDateOverdue(dateString: string): boolean {
    if (!dateString) return false;
    const date = new Date(dateString);
    const today = new Date();
    return date < today;
  }
}
