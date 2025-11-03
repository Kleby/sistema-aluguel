import { Component, OnInit } from '@angular/core';
import { ICliente } from '../../models/icliente.model';
import { ClienteService } from '../../services/cliente.service';
import { Router, RouterLink } from '@angular/router';
import { DatePipe, SlicePipe } from '@angular/common';

@Component({
  selector: 'app-clientes-list',
  imports: [RouterLink, DatePipe, SlicePipe],
  templateUrl: './clientes-list.component.html',
  styleUrl: './clientes-list.component.css',
})
export class ClientesListComponent implements OnInit {
  clientes: ICliente[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(private clienteService: ClienteService, private router: Router) {}

  ngOnInit(): void {
    // this.loadClientes();
    this.loadClientesMock();
    console.log(this.clientes);
    
  }

  loadClientesMock() {
    this.isLoading = true;
    this.clientes = this.clienteService.getClientesMock();
    setTimeout(() => {
      this.isLoading = false;
    }, 400)

  }

  loadClientes(): void {
    this.isLoading = true;
    this.clienteService.getClientes().subscribe({
      next: (data) => {
        console.log(data);

        this.clientes = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar clientes:', error);
        this.errorMessage = 'Erro ao carregar lista de clientes';
        this.isLoading = false;
      },
    });
  }
  deleteCliente(id: number): void {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
      this.clienteService.deleteCliente(id).subscribe({
        next: (res) => {
          this.clientes = this.clientes.filter((c) => c.id !== id);
          alert('Cliente excluído com sucesso!');
        },
        error: (error) => {
          console.error('Erro ao excluir cliente:', error);
          alert(error.error?.error || 'Erro ao excluir cliente');
        },
      });
    }
  }
}
