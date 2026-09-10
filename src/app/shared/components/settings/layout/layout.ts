import { Component, inject} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarSettings } from '../sidebar-settings/sidebar-settings';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, SidebarSettings],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {
  private authService = inject(AuthService);

  user = this.authService.getUsuarioLogado();
   logout() {
    this.authService.logout();
  }
}
