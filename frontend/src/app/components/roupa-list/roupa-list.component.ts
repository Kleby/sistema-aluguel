import { Component, OnInit } from '@angular/core';
import { IRoupa } from '../../models/iroupa.model';
import { RoupaService } from '../../services/roupa.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RoupaCardComponent } from '../roupa-card/roupa-card.component';
import { RoupaOptionsService } from '../../services/roupa-options.service';
import { IRoupaOptions } from '../../models/iroupas-options.model';

@Component({
  selector: 'app-roupa-list',
  imports: [FormsModule, RouterLink, RoupaCardComponent],
  templateUrl: './roupa-list.component.html',
  styleUrl: './roupa-list.component.css',
})
export class RoupaListComponent implements OnInit {
  roupas: IRoupa[] = [];
  roupasFiltradas: IRoupa[] = [];
  isLoading = true;
  procurarTermo = '';
  categoriaSelecionada = '';

  constructor(
    private roupaService: RoupaService,
    private router: Router,
    private roupaOptionsService: RoupaOptionsService
  ) {}

  ngOnInit(): void {
    // this.loadRoupas();
    this.loadRoupasMock();
  }


  categorias: IRoupaOptions[] = [];
  // tamanhos: IRoupaOptions[] = [];

  loadRoupasMock(){
    this.isLoading = true;
    const roupas =this.roupaService.getRoupasMock(); 
    this.roupas = roupas;
    this.roupasFiltradas = roupas;
    this.categorias = this.roupaOptionsService.getRoupasCategoriasMock();
    setTimeout(()=>{
      this.isLoading = false;
    }, 500)
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
      complete: () => {
        this.loadOptions();
      }
    });
  }

  loadOptions() {
    this.roupaOptionsService.obterRoupaCategorias().subscribe({
      next: (categorias: IRoupaOptions[]) => (this.categorias = categorias),
      error: (error) => {
        console.error('error ao carregar as categorias: ', error);
      },
    });
  }

  filterRoupas(): void {
    this.roupasFiltradas = this.roupas.filter((roupa) => {
      const matchesSearch =
        roupa.nome.toLowerCase().includes(this.procurarTermo.toLowerCase()) ||
        roupa.descricao
          .toLowerCase()
          .includes(this.procurarTermo.toLowerCase());
      const matchesCategory = !this.categoriaSelecionada;
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
