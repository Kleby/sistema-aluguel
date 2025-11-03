import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ICliente } from '../../models/icliente.model';
import { IRoupa } from '../../models/iroupa.model';
import { AluguelService } from '../../services/aluguel.service';
import { RoupaService } from '../../services/roupa.service';
import { ClienteService } from '../../services/cliente.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RoupaOptionsService } from '../../services/roupa-options.service';
import { IRoupaOptions } from '../../models/iroupas-options.model';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-aluguel-form',
  imports: [ReactiveFormsModule, CurrencyPipe],
  templateUrl: './aluguel-form.component.html',
  styleUrl: './aluguel-form.component.css',
  providers: [DatePipe],
})
export class AluguelFormComponent implements OnInit {
  aluguelForm: FormGroup;
  isLoading = false;
  clientes: ICliente[] = [];
  roupasDisponiveis: IRoupa[] = [];
  roupaSelecionada: IRoupa | null = null;

  abrirModalReceber: boolean = false;

  categorias: IRoupaOptions[] = [];
  tamanhos: IRoupaOptions[] = [];

  constructor(
    private fb: FormBuilder,
    private aluguelService: AluguelService,
    private roupaService: RoupaService,
    private clienteService: ClienteService,
    private roupaOptionsService: RoupaOptionsService,
    private route: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe
  ) {
    this.aluguelForm = this.fb.group({
      cliente_id: ['', Validators.required],
      roupa_id: ['', Validators.required],
      data_aluguel: [
        new Date().toISOString().split('T')[0],
        Validators.required,
      ],
      data_devolucao_prevista: ['', Validators.required],
      valor_total: [0, [Validators.required, Validators.min(0)]],
      valor_taxa: ['', Validators.required],
      pago: [false],
      data_hora_faturamento: [''],
    });
  }

  ngOnInit(): void {
    // this.loadClientes();
    // this.loadRoupasDisponiveis();
    this.loadClientesMock();
    this.loadRoupasDisponivelMock();
    // Verificar se há uma roupa pré-selecionada via query params
    this.route.queryParams.subscribe((params) => {
      if (params['roupa_id']) {
        this.aluguelForm.patchValue({
          roupa_id: params['roupa_id'],
        });
        this.onRoupaSelecionada();
      }
    });
  }

  loadClientesMock() {
    this.clientes = this.clienteService.getClientesMock();
  }
  loadRoupasDisponivelMock() {
    this.roupasDisponiveis = this.roupaService.getRoupasMock();
  }

  loadClientes(): void {
    this.clienteService.getClientes().subscribe({
      next: (clientes) => {
        this.clientes = clientes;
      },
      error: (error) => {
        console.error('Erro ao carregar clientes:', error);
        alert('Erro ao carregar lista de clientes');
      },
    });
  }

  loadRoupasDisponiveis(): void {
    this.roupaService.getRoupas().subscribe({
      next: (roupas) => {
        this.roupasDisponiveis = roupas.filter(
          (r) => r.status === 'disponivel'
        );
      },
      error: (error) => {
        console.error('Erro ao carregar roupas:', error);
        alert('Erro ao carregar lista de roupas');
      },
    });
  }

  onRoupaSelecionada(): void {
    const roupaId = this.aluguelForm.get('roupa_id')?.value;
    const roupa = this.roupasDisponiveis.find((r) => r.id == roupaId);

    if (roupa) {
      this.roupaSelecionada = roupa;

      // Calcular data de devolução (7 dias a partir de hoje)
      const dataAluguel = new Date(this.aluguelForm.get('data_aluguel')?.value);
      const dataDevolucao = new Date(dataAluguel);
      dataDevolucao.setDate(dataDevolucao.getDate() + 7);

      this.aluguelForm.patchValue({
        data_devolucao_prevista: dataDevolucao.toISOString().split('T')[0],
        valor_total: roupa.preco_aluguel,
      });
    } else {
      this.roupaSelecionada = null;
    }
  }

  onDataAluguelChange(): void {
    if (this.roupaSelecionada) {
      const dataAluguel = new Date(this.aluguelForm.get('data_aluguel')?.value);
      const dataDevolucao = new Date(dataAluguel);
      dataDevolucao.setDate(dataDevolucao.getDate() + 7);

      this.aluguelForm.patchValue({
        data_devolucao_prevista: dataDevolucao.toISOString().split('T')[0],
      });
    }
  }

  onSubmitMock() {
    if (this.aluguelForm.valid) {
      this.abrirModalReceber = true;
      this.isLoading = true;
    } else {
      this.markFormGroupTouched();
    }
  }
  
  onPayLater() {
    this.aluguelForm.get('pago')?.setValue(false);
    this.aluguelForm.get("data_hora_faturamento")?.setValue(this.aluguelForm.get("data_devolucao_prevista"));
    this.aluguelService.addAlugueisMock(this.aluguelForm.value);
    
    setTimeout(() => {
      this.isLoading = false;
      alert('Aluguel realizado com sucesso!');
      this.router.navigate(['/dashboard']);
    }, 500);
  }
  
  onPayNow() {
    this.aluguelForm.get('pago')?.setValue(true);
    this.aluguelForm
    .get('data_hora_faturamento')
    ?.setValue(this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss'));
    this.aluguelService.addAlugueisMock(this.aluguelForm.value);
    setTimeout(() => {
      this.isLoading = false;
      alert('Aluguel realizado com sucesso!');
      this.router.navigate(['/dashboard']);
    }, 500);

  }

  onSubmit(): void {
    if (this.aluguelForm.valid) {
      this.isLoading = true;
      this.abrirModalReceber = true;
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.aluguelForm.controls).forEach((key) => {
      this.aluguelForm.get(key)?.markAsTouched();
    });
  }

  cancel(): void {
    this.router.navigate(['/roupas']);
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  }
}
