import { inject, Injectable, signal } from '@angular/core';
import { UsuarioService } from './usuario.service';
import { UsuarioType } from '../../shared/types/usuario';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private usuarioService = inject(UsuarioService);
  private chave = 'usuarioLogado';

  usuarioLogado = signal<UsuarioType | null>(null)

  login(email: string, senha: string): { user?: UsuarioType } {
    const { user } = this.usuarioService.login(email, senha);

    if (user) {
      localStorage.setItem(this.chave, JSON.stringify(user));
      this.usuarioLogado.set(user)
      return { user };
    }

    return {};
  }

  logout(): void {
    localStorage.removeItem(this.chave);
  }

  getUsuarioLogado(): UsuarioType | null {
    const dados = localStorage.getItem(this.chave);
    return dados ? JSON.parse(dados) : null;
  }

  isLogado(): boolean {
    return this.getUsuarioLogado() !== null;
  }
}