import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { SIDEBAR_ITEMS } from './sidebar-item.model';
import { AuthService } from '../../../core/services/auth.service';
import { LayoutService } from '../../../core/services/layout.service';
import { Icon } from '../icon/icon';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, Icon],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  private authService = inject(AuthService);
  protected layout = inject(LayoutService);

  protected visibleItems = computed(() => {
    const cargo = this.authService.usuarioLogado()?.role ?? 'proprietario';
    return SIDEBAR_ITEMS.filter((item) => item.roles.includes(cargo));
  });
}
