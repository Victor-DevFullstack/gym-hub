import { Component, inject, signal } from '@angular/core';
import { MatCardModule } from "@angular/material/card";
<<<<<<< HEAD
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: 'app-proprietario',
  imports: [Header, RouterOutlet, Sidebar, MatCardModule, MatIconModule],
=======
import { AuthService } from '../../../core/services/auth.service';
import { DashboardCard } from "../../cards/dashboard-card/dashboard-card";

@Component({
  selector: 'app-proprietario',
  imports: [MatCardModule, DashboardCard],
>>>>>>> 7b065491ba38bd40b9d5be7157e5515a0a9c2399
  templateUrl: './proprietario.html',
  styleUrl: './proprietario.css',
})
export class Proprietario {
  private authService = inject(AuthService)

  readonly usuarioLogado = signal(this.authService.getUsuarioLogado())
}
