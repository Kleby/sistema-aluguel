import { Component, OnInit } from '@angular/core';
import { IAluguelCardDTO } from '../../models/ialuguel-card-dto';
import { AluguelService } from '../../services/aluguel.service';
import { FormsModule } from '@angular/forms';
import { AluguelCardComponent } from "../../components/aluguel-card/aluguel-card.component";

@Component({
  selector: 'app-alugueis',
  imports: [FormsModule, AluguelCardComponent],
  templateUrl: './alugueis.component.html',
  styleUrl: './alugueis.component.css',
})
export class AlugueisComponent implements OnInit {
  alugueis: IAluguelCardDTO[] = [];
  alugueisFiltrados: IAluguelCardDTO[] = [];
  isLoading: boolean = false;
  procurarTermo = '';
  categoriaSelecionada = '';

  constructor(private aluguelSevice: AluguelService) {}

  ngOnInit(): void {
    this.loadAlugueis();
  }

  loadAlugueis(): void {
    this.isLoading = true;
    this.aluguelSevice.getAlugueisDTOCard().subscribe({
      next: (data) => {        
        this.alugueis = data;
        this.alugueisFiltrados = data;
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Erro ao carregar alugueis:', error);
        this.isLoading = false;
      },
    });
  }

  filterAluguel(): void {
    this.alugueisFiltrados = this.alugueis.filter((aluguel) => {
      const matchesSearch =
        aluguel.roupa_nome
          .toLowerCase()
          .includes(this.procurarTermo.toLowerCase()) ||
        aluguel.cliente_nome
          .toLowerCase()
          .includes(this.procurarTermo.toLowerCase());
      return matchesSearch;
    });
  }

  onSearchChange(): void {
    this.filterAluguel();
  }

  clearFilters(): void {
    this.procurarTermo = '';
    this.categoriaSelecionada = '';
    this.filterAluguel();
  }
}
