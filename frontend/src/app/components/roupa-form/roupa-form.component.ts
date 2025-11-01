import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RoupaService } from '../../services/roupa.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IRoupaOptions } from '../../models/iroupas-options.model';
import { RoupaOptionsService } from '../../services/roupa-options.service';

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

  @ViewChild('valorCompraInput') valorCompraInput!: ElementRef;

  private readonly PERCENTAGEM = 0.01;

  status = ['disponivel', 'alugado', 'manutencao'];


  roupasTamanhos: IRoupaOptions[] = [];
  roupasCategorias: IRoupaOptions[] = [];

  constructor(
    private fb: FormBuilder,
    private roupaService: RoupaService,
    private roupaOptionsService: RoupaOptionsService,
    // private route: ActivatedRoute,
    private router: Router
  ) {
    this.roupaForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      descricao: ['', [Validators.required, Validators.minLength(10)]],
      tamanho_id: [-1, Validators.required],
      categoria_id: [-1, Validators.required],
      preco_compra: ['', [Validators.required, Validators.min(0)]],
      preco_aluguel: ['', [Validators.required, Validators.min(0)]],
      rentabilidade: ['', [Validators.min(0)]],
      status: ['disponivel', Validators.required],
      quantidade: [1, [Validators.required, Validators.min(1)]],
      imagem_url: [],
    });
  }

  ngOnInit(): void {
    // this.loadRoupaOptions();
    this.roupasTamanhos = this.roupaService.getTamanhosMock();
    this.roupasCategorias = this.roupaService.getCategoriasMock();
  }

  focusPrecoCompra() {
    if (!this.roupaForm.get('preco_compra')?.value) {
      this.valorCompraInput.nativeElement.focus();
    }
  }

  onChangeValorAluguel() {
    const rentabilidade = this.roupaForm.get('rentabilidade')?.value;
    const precoCompra = this.roupaForm.get('preco_compra')?.value;
    this.roupaForm
      .get('preco_aluguel')
      ?.setValue(rentabilidade * precoCompra * this.PERCENTAGEM);
  }

  getRetabilidadeValue(): number {
    return parseFloat(
      (
        (this.roupaForm.get('preco_aluguel')?.value ?? 1) /
        (this.roupaForm.get('preco_compra')?.value * this.PERCENTAGEM || 1)
      ).toFixed(2)
    );
  }

  loadRoupaOptions(): Promise<void> {
    return new Promise((resolve) => {
      this.roupaOptionsService.obterRoupaCategorias().subscribe({
        next: (categorias: IRoupaOptions[]) => {
          this.roupasCategorias = categorias;
          return resolve();
        },
        error: (error) => {
          console.error('Erro ao carregar roupas populares:', error);
          return resolve();
        },
        complete: () => {
          // Busca os tamanhos
          this.roupaOptionsService.obterRoupaTamanhos().subscribe({
            next: (tamanhos: IRoupaOptions[]) => {
              this.roupasTamanhos = tamanhos;
              return resolve();
            },
            error: (err) => {
              console.error('Erro ao carregar tamanhos', err);
              return resolve();
            },
            complete: () => {
              this.isLoading = false;
              return resolve();
            },
          });
        },
      });
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

  onSubmitMock(){
    if(this.roupaForm.valid){
      this.isLoading = true; 
      this.roupaService.addRoupaMock(this.roupaForm.value);
          this.isLoading = false;
          alert('Roupa cadastrada com sucesso!');
          this.router.navigate(['/roupas']);
    } else {
      this.markFormGroupTouched();
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
      this.roupaService.addRoupa(formData).subscribe({
        next: (res) => {
          this.isLoading = false;
          alert('Roupa cadastrada com sucesso!');
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
