import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SIDEBAR_ITEMS, SidebarItem } from './sidebar-item.model';
import { UsuarioService } from '../../../core/services/usuarioLogado.service';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  visibleItems: SidebarItem[] = [];

  private userService = inject(UsuarioService);

  constructor() {
    const cargo = this.userService.usuarioLogado()?.cargo ?? Cargos.ALUNOS;
    this.visibleItems = SIDEBAR_ITEMS.filter((item) => item.roles.includes(cargo))
  }
}
