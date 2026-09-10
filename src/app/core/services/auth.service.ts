import { effect, inject, Injectable, signal } from '@angular/core';
import { UsuarioService } from './usuario.service';
import { UsuarioType } from '../../shared/types/usuario';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private usuarioService = inject(UsuarioService);
  private router = inject(Router);
  private chave = 'usuarioLogado';

  usuarioLogado = signal<UsuarioType | null>(
    JSON.parse(localStorage.getItem(this.chave) || 'null'),
  );

  constructor() {
    effect(() => {
      const usuario = this.usuarioLogado();
      localStorage.setItem(this.chave, JSON.stringify(usuario));
    });
  }

  login(email: string, senha: string): { user?: UsuarioType } {
    const { user } = this.usuarioService.login(email, senha);

    if (user) {
      this.usuarioLogado.set(user);
      return { user };
    }

    return {};
  }

  logout(): void {
    this.usuarioLogado.set(null);
    this.router.navigate(['/']);
  }

  getUsuarioLogado(): UsuarioType | null {
    return this.usuarioLogado();
  }

  isLogado(): boolean {
    return this.getUsuarioLogado() !== null;
  }
}
