import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-dashboard-card',
  imports: [MatCardModule],
  templateUrl: './dashboard-card.html',
  styleUrl: './dashboard-card.css',
})
export class DashboardCard {
  @Input({ required: true }) titulo = '';
  @Input({ required: true }) conteudo = '';
  @Input({ required: false }) subConteudo = '';
}
