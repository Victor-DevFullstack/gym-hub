import { Injectable } from '@angular/core';
import { Role, UsuarioType } from '../../shared/types/usuario';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private chave = 'usuarios';

  private listarTodos(): UsuarioType[] {
    const dadosSalvos = localStorage.getItem(this.chave);
    return dadosSalvos ? JSON.parse(dadosSalvos) : [];
  }

  listarPorCargo(cargo: Role) {
    const dados: UsuarioType[] = JSON.parse(localStorage.getItem(this.chave) ?? '[]');

    const dadosFiltrados = dados.filter((user) => user.role === cargo);

    console.log(dadosFiltrados);

    return dadosFiltrados;
  }

  private salvarTodos(usuarios: UsuarioType[]): void {
    localStorage.setItem(this.chave, JSON.stringify(usuarios));
  }

  cadastrar(usuario: UsuarioType): { cadastrou: boolean; message: string } {
    const usuarios = this.listarTodos();

    const emailJaExiste = usuarios.some((u) => u.email === usuario.email);

    if (emailJaExiste) {
      return { cadastrou: false, message: 'Já existe um usuário com esse email' };
    }

    usuarios.push(usuario);
    this.salvarTodos(usuarios);

    return {
      cadastrou: true,
      message: 'Cadastrado com sucesso\nDeseja ir para página de login?',
    };
  }

  atualizar(usuario: UsuarioType) {
    const usuarios = this.listarTodos();
    const index = usuarios.findIndex((u) => u.email === usuario.email);
    const emailJaUsado = usuarios.some((u) => u.email === usuario.email && u.id !== usuario.id);

    if (emailJaUsado) {
      return {
        cadastrou: false,
        message: 'Esse email já está em uso.',
      };
    }

    if (index !== -1) {
      const usuarioAntigo = usuarios[index];
      const usuarioAtualizado = {
        ...usuarioAntigo,
        ...usuario,
      };

      usuarios[index] = usuarioAtualizado;
      this.salvarTodos(usuarios);
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

  login(email: string, senha: string): { user?: UsuarioType } {
    const usuarios = this.listarTodos();
    const user = usuarios.find((u) => u.email === email && u.senha === senha);

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
