import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ClienteService } from '../../services/cliente.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-cliente-form',
  imports: [ReactiveFormsModule],
  templateUrl: './cliente-form.component.html',
  styleUrl: './cliente-form.component.css',
})
export class ClienteFormComponent implements OnInit {
  clienteForm: FormGroup;
  isEdit = false;
  clienteId: number | null = null;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.clienteForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      telefone: [''],
      cpf: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/),
        ],
      ],
      endereco: [''],
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.isEdit = true;
        this.clienteId = +params['id'];
        // this.loadCliente(this.clienteId);
        console.log(this.clienteId);
        
        this.loadClienteMock(this.clienteId);
      }
    });
  }

  loadClienteMock(id: number): void {
    this.clienteForm.patchValue(this.clienteService.getClienteMock(id));
    console.log("id: ", id);
    
    console.log(this.clienteService.getClienteMock(id));
    
  }  

  loadCliente(id: number): void {
    this.clienteService.getCliente(id).subscribe({
      next: (cliente) => {
        this.clienteForm.patchValue(cliente);
      },
      error: (error) => {
        console.error('Erro ao carregar cliente:', error);
        alert('Erro ao carregar dados do cliente');
      },
    });
  }

  formatCPF(event: any): void {
    let cpf = event.target.value.replace(/\D/g, '');

    if (cpf.length > 11) {
      cpf = cpf.substring(0, 11);
    }

    if (cpf.length <= 11) {
      cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
      cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
      cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }

    this.clienteForm.patchValue({ cpf });
  }

  onSUbmitMock() {
    if (this.clienteForm.valid) {
      this.isLoading = true;
      this.clienteService.addClienteMock(this.clienteForm.value);
      this.isLoading = false;
      alert('Cliente cadastrado com sucesso!');
      this.router.navigate(['/alugueis/novo']);
    } else {
      this.markFormGroupTouched();
    }
  }

  onSubmit(): void {
    if (this.clienteForm.valid) {
      this.isLoading = true;
      const clienteData = this.clienteForm.value;

      const operation =
        this.isEdit && this.clienteId
          ? this.clienteService.updateCliente(this.clienteId, clienteData)
          : this.clienteService.createCliente(clienteData);

      operation.subscribe({
        next: () => {
          this.isLoading = false;
          const message = this.isEdit
            ? 'Cliente atualizado com sucesso!'
            : 'Cliente cadastrado com sucesso!';
          alert(message);
          this.router.navigate(['/clientes']);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Erro ao salvar cliente:', error);
          alert(error.error?.error || 'Erro ao salvar cliente');
        },
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.clienteForm.controls).forEach((key) => {
      this.clienteForm.get(key)?.markAsTouched();
    });
  }

  cancel(): void {
    this.router.navigate(['/clientes']);
  }
}
