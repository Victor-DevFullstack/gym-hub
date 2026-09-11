import { effect, Injectable, signal } from '@angular/core';
import { Role, UsuarioType } from '../../shared/types/usuario';
import { gerarDadosSeed } from './usuario-seed';
import { CHAVE_TREINOS } from './treino.service';

export interface CancelamentoAluno {
  academiaId: string;
  data: string;
}

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private chave = 'usuarios';
  private chaveCancelamentos = 'cancelamentosAluno';

  private usuarios = signal<UsuarioType[]>(JSON.parse(localStorage.getItem(this.chave) ?? '[]'));

  private cancelamentos = signal<CancelamentoAluno[]>(
    JSON.parse(localStorage.getItem(this.chaveCancelamentos) ?? '[]'),
  );

  private listarTodos(): UsuarioType[] {
    return this.usuarios();
  }

  constructor() {
    this.seedDadosDemo();

    effect(() => {
      localStorage.setItem(this.chave, JSON.stringify(this.usuarios()));
    });

    effect(() => {
      localStorage.setItem(this.chaveCancelamentos, JSON.stringify(this.cancelamentos()));
    });
  }

  private seedDadosDemo(): void {
    if (localStorage.getItem(this.chave) !== null) {
      return;
    }

    const { usuarios, cancelamentos, treinos } = gerarDadosSeed();
    this.usuarios.set(usuarios);
    this.cancelamentos.set(cancelamentos);
    localStorage.setItem(CHAVE_TREINOS, JSON.stringify(treinos));
  }

  listarPorCargo(cargo: Role): UsuarioType[] {
    return this.usuarios().filter((user) => user.role === cargo);
  }

  cadastrar(usuario: UsuarioType): { cadastrou: boolean; message: string } {
    const emailJaExiste = this.usuarios().some(
      (u) => u.email.toLowerCase() === usuario.email.toLowerCase(),
    );

    if (emailJaExiste) {
      return { cadastrou: false, message: 'Já existe um usuário com esse email' };
    }

    usuario.email = usuario.email.toLowerCase();

    this.usuarios.update((listaAntiga) => [...listaAntiga, usuario]);

    return {
      cadastrou: true,
      message: 'Cadastrado com sucesso\nDeseja ir para página de login?',
    };
  }

  atualizar(usuario: UsuarioType) {
    const index = this.usuarios().findIndex((u) => u.id === usuario.id);

    console.log('ID recebido:', usuario.id);
    console.log('Index encontrado:', index);

    const emailJaUsado = this.usuarios().some(
      (u) => u.email.toLowerCase() === usuario.email.toLowerCase() && u.id !== usuario.id,
    );

    if (emailJaUsado) {
      return {
        cadastrou: false,
        message: 'Esse email já está em uso.',
      };
    }

    if (index !== -1) {
      const usuarioAntigo = this.usuarios()[index];

      this.usuarios.update((lista) =>
        lista.map((u) => (u.id === usuario.id ? { ...u, ...usuario } : u)),
      );

      return {
        cadastrou: true,
        message: 'Atualizado com Sucesso.',
      };
    }

    return {
      cadastrou: false,
      message: 'Ocorreu algum erro ao atualizar.',
    };
  }

  deletar(usuario: UsuarioType) {
    const index = this.usuarios().findIndex((u) => u.id === usuario.id);

    if (index === -1) {
      return false;
    }

    this.usuarios.update((lista) => lista.filter((u) => u.id !== usuario.id));

    if (usuario.role === 'aluno') {
      this.cancelamentos.update((lista) => [
        ...lista,
        { academiaId: usuario.academiaId, data: new Date().toString() },
      ]);
    }

    return true;
  }

  listarCancelamentosPorAcademia(academiaId: string): CancelamentoAluno[] {
    return this.cancelamentos().filter((c) => c.academiaId === academiaId);
  }
  login(email: string, senha: string): { user?: UsuarioType } {
    const user = this.usuarios().find((u) => u.email.toLowerCase() === email.toLowerCase() && u.senha === senha);

    return user ? { user } : {};
  }

  listarPorAcademia(academiaId: string, role?: Role): UsuarioType[] {
    return this.listarTodos().filter(
      (u) => u.academiaId === academiaId && (!role || u.role === role),
    );
  }

  buscarPorId(id: string): UsuarioType | undefined {
    return this.listarTodos().find((u) => u.id === id);
  }
}
