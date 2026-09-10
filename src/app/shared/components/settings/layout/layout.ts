import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarSettings } from '../sidebar-settings/sidebar-settings';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, SidebarSettings],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {}
