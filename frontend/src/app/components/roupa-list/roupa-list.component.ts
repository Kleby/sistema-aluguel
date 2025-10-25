import { Component, OnInit } from '@angular/core';
import { IRoupa } from '../../models/iroupa.model';
import { RoupaService } from '../../services/roupa.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RoupaCardComponent } from '../roupa-card/roupa-card.component';

@Component({
  selector: 'app-roupa-list',
  imports: [FormsModule, RouterLink, RoupaCardComponent],
  templateUrl: './roupa-list.component.html',
  styleUrl: './roupa-list.component.css',
})
export class RoupaListComponent  implements OnInit {
  roupas: IRoupa[] = [];
  roupasFiltradas: IRoupa[] = [];
  isLoading = true;
  procurarTermo = '';
  categoriaSelecionada = '';

  categorias = [
    'Vestido',
    'Blusa',
    'Calça',
    'Saia',
    'Casaco',
    'Roupa Íntima',
    'Acessório',
  ];

  constructor(private roupaService: RoupaService, private router: Router) { }

  ngOnInit(): void {
    this.loadRoupas();    
  }

  loadRoupas(): void {
    this.isLoading = true;
    this.roupaService.getRoupas().subscribe({
      next: (data) => {
        this.roupas = data;
        this.roupasFiltradas = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar roupas:', error);
        this.isLoading = false;
      },
    });
  }

  filterRoupas(): void {
    this.roupasFiltradas = this.roupas.filter((roupa) => {
      const matchesSearch =
        roupa.nome.toLowerCase().includes(this.procurarTermo.toLowerCase()) ||
        roupa.descricao.toLowerCase().includes(this.procurarTermo.toLowerCase());
      const matchesCategory =
        !this.categoriaSelecionada || roupa.categoria === this.categoriaSelecionada;
      return matchesSearch && matchesCategory;
    });
  }

  onSearchChange(): void {
    this.filterRoupas();
  }

  onCategoryChange(): void {
    this.filterRoupas();
  }

  clearFilters(): void {
    this.procurarTermo = '';
    this.categoriaSelecionada = '';
    this.filterRoupas();
  }
}
