import { Component, OnInit } from '@angular/core';
import { IRoupa } from '../../models/iroupa.model';
import { RoupaService } from '../../services/roupa.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-roupa-form',
  imports: [ReactiveFormsModule],
  templateUrl: './roupa-form.component.html',
  styleUrl: './roupa-form.component.css',
})
export class RoupaFormComponent implements OnInit {
  roupaForm: FormGroup;
  isEdit = false;
  roupaId: number | null = null;
  isLoading = false;
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;

  tamanhos = ['PP', 'P', 'M', 'G', 'GG'];
  categorias = [
    'Vestido',
    'Blusa',
    'Calça',
    'Saia',
    'Casaco',
    'Roupa Íntima',
    'Acessório',
  ];

  constructor(
    private fb: FormBuilder,
    private roupaService: RoupaService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.roupaForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      descricao: ['', [Validators.required, Validators.minLength(10)]],
      tamanho: ['M', Validators.required],
      categoria: ['', Validators.required],
      preco_aluguel: [0, [Validators.required, Validators.min(0)]],
      status: ['disponivel', Validators.required],
      imagem_url: [''],
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.isEdit = true;
        this.roupaId = +params['id'];
        this.loadRoupa(this.roupaId);
      }
    });
  }

  loadRoupa(id: number): void {
    this.roupaService.getRoupa(id).subscribe({
      next: (roupa) => {
        this.roupaForm.patchValue(roupa);
        this.previewUrl = roupa.imagem_url ?? '';
      },
      error: (error) => {
        console.error('Erro ao carregar roupa:', error);
        alert('Erro ao carregar dados da roupa');
      },
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Verificar tipo do arquivo
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione apenas imagens!');
        return;
      }

      // Verificar tamanho do arquivo (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('A imagem deve ter no máximo 5MB!');
        return;
      }

      this.selectedFile = file;

      // Criar preview da imagem
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.roupaForm.valid) {
      this.isLoading = true;
      // Criar FormData com dados + imagem
      const formData = this.roupaService.createRoupaFormData(
        this.roupaForm.value,
        this.selectedFile || undefined
      );

      const operation =
        this.isEdit && this.roupaId
          ? this.roupaService.updateRoupa(this.roupaId, formData)
          : this.roupaService.addRoupa(formData);

      operation.subscribe({
        next: (res) => {
          this.isLoading = false;
          const message = this.isEdit
            ? 'Roupa atualizada com sucesso!'
            : 'Roupa cadastrada com sucesso!';
          alert(message);
          this.router.navigate(['/roupas']);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Erro ao salvar roupa:', error);
          alert(error.error?.error || 'Erro ao salvar roupa');
        },
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.roupaForm.controls).forEach((key) => {
      this.roupaForm.get(key)?.markAsTouched();
    });
  }

  cancel(): void {
    this.router.navigate(['/roupas']);
  }
}
