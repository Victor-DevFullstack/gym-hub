import { effect, Injectable, signal } from '@angular/core';

export type Tema = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private chave = 'gh:theme';

  readonly tema = signal<Tema>(this.temaInicial());

  constructor() {
    effect(() => {
      const tema = this.tema();
      document.documentElement.setAttribute('data-theme', tema);
      try {
        localStorage.setItem(this.chave, tema);
      } catch {
        /* modo privado */
      }
    });
  }

  alternar(): void {
    this.tema.update((t) => (t === 'dark' ? 'light' : 'dark'));
  }

  private temaInicial(): Tema {
    try {
      const salvo = localStorage.getItem(this.chave);
      if (salvo === 'dark' || salvo === 'light') return salvo;
    } catch {
      /* ignore */
    }
    return typeof matchMedia === 'function' && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
}
