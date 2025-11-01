import { Component, OnInit } from '@angular/core';
import { AluguelService } from '../../services/aluguel.service';
import { FormsModule } from '@angular/forms';
import { AluguelCardComponent } from "../../components/aluguel-card/aluguel-card.component";
import { RouterLink } from "@angular/router";
import { IAluguel } from '../../models/ialuguel.model';

@Component({
  selector: 'app-alugueis',
  imports: [FormsModule, AluguelCardComponent, RouterLink],
  templateUrl: './alugueis.component.html',
  styleUrl: './alugueis.component.css',
})
export class AlugueisComponent implements OnInit {
  alugueis: IAluguel[] = [];
  alugueisFiltrados: IAluguel[] = [];
  isLoading: boolean = false;
  procurarTermo = '';
  categoriaSelecionada = '';

  constructor(private aluguelSevice: AluguelService) {}

  ngOnInit(): void {
    // this.loadAlugueis();
    this.loadAlugueisMock();
  }

  loadAlugueisMock(){
    this.isLoading = true;
    this.alugueis = this.aluguelSevice.getAlugueisMock();
    this.alugueisFiltrados = this.aluguelSevice.getAlugueisMock();
    setTimeout(()=>{
      this.isLoading = false;
    }, 500)
  }

  loadAlugueis(): void {
    this.isLoading = true;
    this.aluguelSevice.getAlugueis().subscribe({
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
      const matchesSearch = aluguel.roupa!.toLowerCase().includes(this.procurarTermo.toLowerCase()) 
                          ||aluguel.cliente!.toLowerCase().includes(this.procurarTermo.toLowerCase());
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
