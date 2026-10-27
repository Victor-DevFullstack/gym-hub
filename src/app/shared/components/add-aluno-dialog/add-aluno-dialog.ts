import { Component, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Plano, ProfessorType, Role, UsuarioType } from '../../types/usuario';
import { UsuarioService } from '../../../core/services/usuario.service';
import { AuthService } from '../../../core/services/auth.service';
import { DIAS_POR_PLANO, formatarValorPlano, LABEL_POR_PLANO } from '../../constants/plano.constants';
import { Icon } from '../icon/icon';

const PLANOS: Exclude<Plano, null>[] = ['experimental', 'mensal', 'trimestral', 'semestral', 'anual'];

export type AddAlunoFormValue = {
  nome: string;
  email: string;
  senha: string;
  plano: Plano;
  personal: ProfessorType;
  cargo: Role;
};

@Component({
  selector: 'app-adicionar-funcionario-dialog',
  imports: [ReactiveFormsModule, Icon],
  templateUrl: './add-aluno-dialog.html',
  styleUrl: './add-aluno-dialog.css',
})
export class AddAlunoDialog {
  private dialogRef = inject(MatDialogRef<AddAlunoDialog>);
  private usuariosService = inject(UsuarioService);
  private authService = inject(AuthService);

  data = inject<{ cargo: Role; usuario?: UsuarioType }>(MAT_DIALOG_DATA);

  readonly planos = PLANOS;
  mostrarSenha = signal(false);

  titulo = computed(() => `${this.data.usuario ? 'Editar' : 'Adicionar'} ${this.data.cargo}`);
  subtitulo = computed(() =>
    this.data.usuario ? this.data.usuario.nome : 'Cadastre a conta e escolha o plano do aluno.',
  );

  usuario = this.data.usuario?.role === 'aluno' ? this.data.usuario : null;

  form = new FormGroup({
    nome: new FormControl(this.usuario?.nome ?? '', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    email: new FormControl(this.usuario?.email ?? '', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    plano: new FormControl(this.usuario?.plano ?? '', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    personal: new FormControl(this.personalInicial()),
    senha: new FormControl(this.usuario?.senha ?? '', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(6)],
    }),
    cargo: new FormControl<Role>(this.data.cargo, {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  // Primeiro vencimento previsto para o plano escolhido (hoje + duração do plano).
  vencimentoPrevisto = computed(() => {
    const plano = this.planoSelecionado() as Exclude<Plano, null> | '';
    if (!plano) return null;
    const data = new Date();
    data.setDate(data.getDate() + DIAS_POR_PLANO[plano]);
    return data.toLocaleDateString('pt-BR');
  });

  private planoSelecionado = signal<string>(this.usuario?.plano ?? '');

  private personalInicial(): string {
    const p = this.usuario?.personal as unknown;
    if (!p) return 'sem-personal';
    return typeof p === 'string' ? p : ((p as ProfessorType).id ?? 'sem-personal');
  }

  listarPersonais() {
    const academiaId = this.authService.getUsuarioLogado()?.academiaId;
    if (!academiaId) {
      return [];
    }
    return this.usuariosService.listarPorAcademia(academiaId, 'professor');
  }

  labelPlano(plano: Exclude<Plano, null>): string {
    return LABEL_POR_PLANO[plano];
  }

  nomeCurtoPlano(plano: Exclude<Plano, null>): string {
    return plano === 'experimental' ? 'Aula experimental' : plano[0].toUpperCase() + plano.slice(1);
  }

  valorPlano(plano: Exclude<Plano, null>): string {
    return formatarValorPlano(plano);
  }

  diasPlano(plano: Exclude<Plano, null>): string {
    const d = DIAS_POR_PLANO[plano];
    return `${d} ${d === 1 ? 'dia' : 'dias'}`;
  }

  escolherPlano(plano: Exclude<Plano, null>): void {
    this.form.controls.plano.setValue(plano);
    this.form.controls.plano.markAsTouched();
    this.planoSelecionado.set(plano);
  }

  invalido(campo: 'nome' | 'email' | 'plano' | 'senha'): boolean {
    const c = this.form.controls[campo];
    return c.invalid && (c.touched || c.dirty);
  }

  fechar(): void {
    this.dialogRef.close();
  }

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.dialogRef.close(this.form.getRawValue() as unknown as AddAlunoFormValue);
  }
}
