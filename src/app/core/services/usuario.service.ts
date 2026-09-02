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