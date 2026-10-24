import { effect, Injectable, signal } from '@angular/core';

/** Estado do shell: sidebar recolhida (desktop) e drawer aberto (mobile). */
@Injectable({ providedIn: 'root' })
export class LayoutService {
  private chave = 'gh:collapsed';

  readonly recolhida = signal(this.lerRecolhida());
  readonly drawerAberto = signal(false);

  constructor() {
    effect(() => {
      try {
        localStorage.setItem(this.chave, this.recolhida() ? '1' : '0');
      } catch {
        /* modo privado */
      }
    });

    // Ao voltar para desktop, fecha o drawer.
    if (typeof matchMedia === 'function') {
      matchMedia('(min-width:1024px)').addEventListener('change', (m) => {
        if (m.matches) this.drawerAberto.set(false);
      });
    }
  }

  alternarRecolhida(): void {
    this.recolhida.update((v) => !v);
  }

  abrirDrawer(): void {
    this.drawerAberto.set(true);
  }

  fecharDrawer(): void {
    this.drawerAberto.set(false);
  }

  private lerRecolhida(): boolean {
    try {
      return localStorage.getItem(this.chave) === '1';
    } catch {
      return false;
    }
  }
}
