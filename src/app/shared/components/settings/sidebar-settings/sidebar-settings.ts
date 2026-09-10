import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SIDEBAR_SETTINGS_ITEMS, SidebarItem } from './sidebar-settings-item.model';

import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-sidebar-settings',
  imports: [RouterLink],
  templateUrl: './sidebar-settings.html',
  styleUrl: './sidebar-settings.css',
})
export class SidebarSettings {
  private authService = inject(AuthService);
    usuarioLogado = this.authService.getUsuarioLogado;
  
    visibleItems: SidebarItem[] = [];
  
    private userService = inject(AuthService);
  
    constructor() {
      const cargo = this.userService.getUsuarioLogado()?.role ?? "proprietario";
      this.visibleItems = SIDEBAR_SETTINGS_ITEMS
    }
}
