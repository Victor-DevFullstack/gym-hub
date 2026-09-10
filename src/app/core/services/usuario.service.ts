import { effect, Injectable, signal } from '@angular/core';
import { Role, UsuarioType } from '../../shared/types/usuario';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private chave = 'usuarios';

  private usuarios = signal<UsuarioType[]>(JSON.parse(localStorage.getItem(this.chave) ?? '[]'));

  private listarTodos(): UsuarioType[] {
    return this.usuarios();
  }

  constructor() {
    effect(() => {
      localStorage.setItem(this.chave, JSON.stringify(this.usuarios()));
    });
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

    return true;
  }
  login(email: string, senha: string): { user?: UsuarioType } {
    const user = this.usuarios().find((u) => u.email === email && u.senha === senha);

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
