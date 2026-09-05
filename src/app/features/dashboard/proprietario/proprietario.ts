import { Component, inject, signal } from '@angular/core';
import { MatCardModule } from "@angular/material/card";
import { AuthService } from '../../../core/services/auth.service';
import { DashboardCard } from "../../cards/dashboard-card/dashboard-card";

@Component({
  selector: 'app-proprietario',
  imports: [MatCardModule, DashboardCard],
  templateUrl: './proprietario.html',
  styleUrl: './proprietario.css',
})
export class Proprietario {
  private authService = inject(AuthService)

  readonly usuarioLogado = signal(this.authService.getUsuarioLogado())
}
