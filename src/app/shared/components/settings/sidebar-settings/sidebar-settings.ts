import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { SIDEBAR_SETTINGS_ITEMS } from './sidebar-settings-item.model';
import { Icon } from '../../icon/icon';

@Component({
  selector: 'app-sidebar-settings',
  imports: [RouterLink, RouterLinkActive, Icon],
  templateUrl: './sidebar-settings.html',
  styleUrl: './sidebar-settings.css',
})
export class SidebarSettings {
  protected readonly items = SIDEBAR_SETTINGS_ITEMS;
}
