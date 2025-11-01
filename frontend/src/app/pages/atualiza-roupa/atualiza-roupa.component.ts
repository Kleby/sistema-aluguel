import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IRoupaOptions } from '../../models/iroupas-options.model';
import { RoupaOptionsService } from '../../services/roupa-options.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RoupaService } from '../../services/roupa.service';
import { IRoupa } from '../../models/iroupa.model';

@Component({
  selector: 'app-atualiza-roupa',
  imports: [ReactiveFormsModule],
  templateUrl: './atualiza-roupa.component.html',
  styleUrl: './atualiza-roupa.component.css',
})
export class AtualizaRoupaComponent implements OnInit {
  updateForm: FormGroup = new FormGroup({});
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  isLoading = false;

  private readonly PERCENTAGEM = 0.01;

  roupasTamanhos: IRoupaOptions[] = [];
  roupasCategorias: IRoupaOptions[] = [];

  @ViewChild('valorCompraInput') valorCompraInput!: ElementRef;

  constructor(
    private roupaOptionsService: RoupaOptionsService,
    private activatedRouter: ActivatedRoute,
    private router: Router,
    private roupaService: RoupaService,
    private fb: FormBuilder
  ) {
    this.updateForm = this.fb.group({
      id: ['', []],
      nome: ['', [Validators.required, Validators.minLength(3)]],
      descricao: ['', [Validators.required, Validators.minLength(10)]],
      tamanho_id: [-1, Validators.required],
      categoria_id: [, Validators.required],
      preco_compra: ['', [Validators.required, Validators.min(0)]],
      preco_aluguel: ['', [Validators.required, Validators.min(0)]],
      rentabilidade: ['', [Validators.min(0)]],
      status: ['', Validators.required],
      quantidade: [1, [Validators.required, Validators.min(1)]],
      imagem_url: ['',[]],
    });
  }

  ngOnInit(): void {
    this.activatedRouter.params.subscribe({
      next: (params: any) => {
        this.loadRoupa(params['id']);
      },
      error: (error: any) => {
        console.error('não foi possivel obter o parâmentro: ', error);
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
  focusPrecoCompra() {
    if (!this.updateForm.get('preco_compra')?.value) {
      this.valorCompraInput.nativeElement.focus();
    }
  }

  onChangeValorAluguel() {
    const rentabilidade = this.updateForm.get('rentabilidade')?.value;
    const precoCompra = this.updateForm.get('preco_compra')?.value;
    this.updateForm
      .get('preco_aluguel')
      ?.setValue(rentabilidade * precoCompra * this.PERCENTAGEM);
  }

  getRetabilidadeValue(): number {
    return parseFloat(
      (
        (this.updateForm.get('preco_aluguel')?.value ?? 1) /
        (this.updateForm.get('preco_compra')?.value * this.PERCENTAGEM || 1)
      ).toFixed(2)
    );
  }

  getExistsImagem(): string {
    return this.previewUrl || this.updateForm.get('imagem_url')?.value;
  }

  loadRoupa(id: number) {
    this.roupaService.getRoupa(id).subscribe({
      next: (data: IRoupa) => {
        this.updateForm.patchValue(data);
        this.updateForm.get('rentabilidade')?.setValue(this.getRetabilidadeValue());
        this.previewUrl = data.imagem_url;
      },
      error: (error: any) => {},
      complete: () => this.loadRoupaOptions(),
    });
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

  onSubmit(): void {
    if (this.updateForm.valid) {
      console.log(this.updateForm.value);

      const id = this.updateForm.get('id')?.value;
      if (!id) {
        alert('Roupa não encontrada');
        return;
      }
      this.isLoading = true;
      // Criar FormData com dados + imagem
      const formData = this.roupaService.createRoupaFormData(
        this.updateForm.value,
        this.selectedFile || undefined
      );
      this.roupaService.updateRoupa(id, formData).subscribe({
        next: (res) => {
          if (this.isLoading) {
            alert('Roupa cadastrada com sucesso!');
          }
          this.isLoading = false;
          this.router.navigate(['/roupas']);
          console.log(res);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Erro ao atualizar a roupa:', error);
          // alert(error.error?.error || 'Erro ao atualizar a roupa');
        },
      });
    } else {
      this.markFormGroupTouched();
    }
  }
  private markFormGroupTouched(): void {
    Object.keys(this.updateForm.controls).forEach((key) => {
      this.updateForm.get(key)?.markAsTouched();
    });
  }

  cancel(): void {
    this.router.navigate(['/roupas']);
  }
}
