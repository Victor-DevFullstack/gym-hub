import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { SidebarSettings } from '../sidebar-settings/sidebar-settings';
import { AuthService } from '../../../../core/services/auth.service';
import { Icon } from '../../icon/icon';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, SidebarSettings, Icon],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {
  private authService = inject(AuthService);

  logout() {
    this.authService.logout();
  }
}
