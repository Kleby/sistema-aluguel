import { Component } from '@angular/core';
import { IUser } from '../../models/iuser.model';
import { AuthService } from '../../services/auth.service';
import { RoupaService } from '../../services/roupa.service';
import { Router } from '@angular/router';
import { AluguelService } from '../../services/aluguel.service';
import { ClienteService } from '../../services/cliente.service';
import { DashboardLinkCardsComponent } from '../../components/dashboard-link-cards/dashboard-link-cards.component';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { CardsDestaqueComponent } from '../../components/cards-destaque/cards-destaque.component';
import { IRoupa } from '../../models/iroupa.model';
import { SITUACAO_STYLES_BADGE } from '../../utils/design.constants';
import { IAluguel } from '../../models/ialuguel.model';
import { RecebimentoService } from '../../services/recebimento.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    DashboardLinkCardsComponent,
    DatePipe,
    CardsDestaqueComponent,
    CurrencyPipe,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  user: IUser | null = {
      id: 1,
      nome: 'Admin',
      email: 'admin@loja.com',
      tipo: 'admin',
      status: 'ativo',
      data_expiracao: '2032-09-09 20:00:00',
    };
  isLoading = true;
  situacaoStyles = SITUACAO_STYLES_BADGE;

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
  statsMock = {
    totalRoupas: 0,
    roupasDisponiveis: 0,
    roupasAlugadas: 0,
    roupasManutencao: 0,
    totalAlugueis: 0,
    alugueisAtivos: 0,
    alugueisAtrasados: 0,
    totalClientes: 0,
    // faturamentoProcessada:0,
    faturamentoReceber:0,
    totalFaturamentoAtual: 0
  };

  recentAlugueis: IAluguel[] = [];
  roupasPopulares: IRoupa[] = [];

  constructor(
    private authService: AuthService,
    private roupaService: RoupaService,
    private aluguelService: AluguelService,
    private clienteService: ClienteService,
    private recebimentoService: RecebimentoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // this.getCurrentUser();
    // this.loadDashboardData();
    this.loadDashboardDataMock();    
  }
  getCurrentUser(): void {
    this.authService.currentUser$.subscribe(
      (currentUser) => (this.user = currentUser)
    );
  }

  onPrint(){
    
  }

  loadDashboardDataMock(): void {
    this.isLoading = true;
    this.loadRoupasStatsMock(),
      this.loadAlugueisStatsMock(),
      this.loadClientesStatsMock(),
      this.loadRecentAlugueisMock(),
      this.loadRoupasPopularesMock(),
      this.loadRecebimentosMock(),
      setTimeout(() => {
        this.isLoading = false;
      }, 500);
  }

  // Carregar dados mockado
  loadRoupasStatsMock(): void {
    const roupas = this.roupaService.getRoupasMock();
    this.statsMock.totalRoupas = roupas.length;
    this.statsMock.roupasDisponiveis = roupas.filter(
      (r) => r.status === 'disponivel'
    ).length;
    this.statsMock.roupasAlugadas = roupas.filter(
      (r) => r.status === 'alugado'
    ).length;
    this.statsMock.roupasManutencao = roupas.filter(
      (r) => r.status === 'manutencao'
    ).length;
  }
  loadAlugueisStatsMock(): void {
    const alugueis = this.aluguelService.getAlugueisMock();
    this.statsMock.totalAlugueis = alugueis.length;
    this.statsMock.alugueisAtivos = alugueis.filter(
      (al) => al.situacao === 'ativo'
    ).length;
    const hoje = new Date();
    this.statsMock.alugueisAtrasados = alugueis.filter((al) => {
      if (al.situacao === 'atrasado') {
        const dataDevolucao = new Date(al.data_devolucao_prevista);
        return dataDevolucao < hoje;
      }
      return false;
    }).length;
  }
  loadClientesStatsMock() {
    const clientes = this.clienteService.getClientesMock();
    this.statsMock.totalClientes = clientes.length;
  }
  loadRecentAlugueisMock(): void {
    this.recentAlugueis = this.aluguelService
      .getAlugueisMock()
      .sort(
        (a, b) =>
          new Date(b.data_aluguel).getTime() -
          new Date(a.data_aluguel).getTime()
      )
      .slice(0, 5);
  }
  loadRoupasPopularesMock(): void {
    this.roupasPopulares = this.roupaService
      .getRoupasMock()
      .filter((r) => r.status === 'disponivel')
      .sort((a, b) => b.preco_aluguel - a.preco_aluguel)
      .slice(0, 4);
  }
  loadRecebimentosMock(): void{
    const faturamentos = this.recebimentoService.getRecebimentos();
    const hoje = new Date();
    this.statsMock.totalFaturamentoAtual = faturamentos
          .filter( f => f.data_hora_faturamento === hoje && f.pago)
          .reduce((acc, curr) => acc+curr.valor_total, 0);
    this.statsMock.faturamentoReceber = faturamentos
          .filter(f => f.data_hora_faturamento >= hoje)
          .reduce((acc, curr) => acc+curr.valor_total, 0)  
  }

  // Fim dos mockes
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

  // Carregar dados dinamicos
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

          return resolve();
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
            (a) => a.situacao === 'ativo'
          ).length;

          // Calcular aluguéis atrasados
          const hoje = new Date();
          this.stats.alugueisAtrasados = alugueis.filter((a) => {
            if (a.situacao === 'atrasado') {
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
        next: (roupas: IRoupa[]) => {
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

  isDateOverdue(dateString: string): boolean {
    if (!dateString) return false;
    const date = new Date(dateString);
    const today = new Date();
    return date < today;
  }
}
