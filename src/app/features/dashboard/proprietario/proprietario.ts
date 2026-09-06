import { Component, inject, signal } from '@angular/core';
import { Header } from '../../../shared/components/header/header';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../../../shared/components/sidebar/sidebar';
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { AuthService } from '../../../core/services/auth.service';
import { DashboardCard } from '../../cards/dashboard-card/dashboard-card';

@Component({
  selector: 'app-proprietario',
  imports: [Header, RouterOutlet, Sidebar, MatCardModule, MatIconModule, DashboardCard],
  templateUrl: './proprietario.html',
  styleUrl: './proprietario.css',
})
export class Proprietario {
  private authService = inject(AuthService)

  readonly usuarioLogado = signal(this.authService.getUsuarioLogado())
}