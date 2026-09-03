import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SIDEBAR_ITEMS, SidebarItem } from './sidebar-item.model';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  visibleItems: SidebarItem[] = [];

  private userService = inject(AuthService);

  constructor() {
    const cargo = this.userService.getUsuarioLogado()?.role ?? "proprietario";
    this.visibleItems = SIDEBAR_ITEMS.filter((item) => item.roles.includes(cargo))
  }
}
