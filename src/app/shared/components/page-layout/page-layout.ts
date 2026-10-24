import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Sidebar } from '../sidebar/sidebar';
import { Header } from '../header/header';
import { LayoutService } from '../../../core/services/layout.service';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-page-layout',
  imports: [Sidebar, Header, RouterOutlet],
  templateUrl: './page-layout.html',
  styleUrl: './page-layout.css',
})
export class PageLayout {
  protected layout = inject(LayoutService);
  // Instancia o tema logo ao entrar no dashboard (aplica data-theme no <html>).
  private theme = inject(ThemeService);
}
