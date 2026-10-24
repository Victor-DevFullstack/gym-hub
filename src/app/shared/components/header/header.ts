import { Component, ElementRef, HostListener, computed, inject, signal } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { Router } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';
import { LayoutService } from '../../../core/services/layout.service';
import { ThemeService } from '../../../core/services/theme.service';
import { iniciais } from '../../utils/data.utils';
import { Icon } from '../icon/icon';
import { IconName } from '../icon/icons';
import { EmptyState } from '../empty-state/empty-state';

export interface Notificacao {
  tom: 'red' | 'blue' | 'green' | 'amber';
  icone: IconName;
  texto: string;
  tempo: string;
}

type MenuAberto = 'notif' | 'user' | null;

@Component({
  selector: 'app-header',
  imports: [TitleCasePipe, Icon, EmptyState],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  private authService = inject(AuthService);
  private router = inject(Router);
  private el = inject<ElementRef<HTMLElement>>(ElementRef);
  protected layout = inject(LayoutService);
  protected theme = inject(ThemeService);

  protected user = this.authService.usuarioLogado;
  protected menuAberto = signal<MenuAberto>(null);

  // TODO: ligar à fonte real de notificações (lista vazia mostra o estado "Tudo em dia").
  protected notificacoes = signal<Notificacao[]>([]);

  protected primeiroNome = computed(() => (this.user()?.nome ?? '').trim().split(/\s+/)[0] ?? '');
  protected iniciaisUsuario = computed(() => iniciais(this.user()?.nome ?? '?'));
  protected saudacao = computed(() => {
    const h = new Date().getHours();
    const periodo = h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite';
    return this.primeiroNome() ? `${periodo}, ${this.primeiroNome()} ` : `${periodo} `;
  });
  //O header está sem a saudação com o emoji de mão acenando, pois o emoji não está aparecendo corretamente no layout.
  //Para colocar o emoji, use a linha abaixo no código acima.
  //👋 return this.primeiroNome() ? `${periodo}, ${this.primeiroNome()} 👋` : `${periodo} 👋`;
  protected atalhoBusca = /Mac|iPhone|iPad/.test(navigator.platform) ? '⌘ K' : 'Ctrl K';

  alternarMenu(menu: Exclude<MenuAberto, null>, event: Event): void {
    event.stopPropagation();
    const abrir = this.menuAberto() !== menu;
    this.menuAberto.set(abrir ? menu : null);
    if (abrir) {
      const wrap = (event.currentTarget as HTMLElement).closest('[data-menu]');
      setTimeout(() => wrap?.querySelector<HTMLElement>('[role="menuitem"]')?.focus());
    }
  }

  navegar(rota: string): void {
    this.menuAberto.set(null);
    this.router.navigateByUrl(rota);
  }

  sair(): void {
    this.menuAberto.set(null);
    this.authService.logout();
  }

  buscar(event: Event): void {
    event.preventDefault();
    // TODO: conectar a uma busca real (o campo do header original também era só visual).
  }

  navegarPorTeclado(event: KeyboardEvent): void {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    const itens = [...(event.currentTarget as HTMLElement).querySelectorAll<HTMLElement>('[role="menuitem"]')];
    if (!itens.length) return;
    event.preventDefault();
    const i = itens.indexOf(document.activeElement as HTMLElement);
    const prox = event.key === 'ArrowDown' ? (i + 1) % itens.length : (i - 1 + itens.length) % itens.length;
    itens[prox].focus();
  }

  @HostListener('document:click', ['$event'])
  protected aoClicarFora(event: Event): void {
    if (!(event.target as HTMLElement).closest('[data-menu]')) this.menuAberto.set(null);
  }

  @HostListener('document:keydown', ['$event'])
  protected aoTeclar(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.menuAberto.set(null);
      this.layout.fecharDrawer();
    }
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      const input = this.el.nativeElement.querySelector<HTMLInputElement>('#searchInput');
      input?.focus();
      input?.select();
    }
  }
}
