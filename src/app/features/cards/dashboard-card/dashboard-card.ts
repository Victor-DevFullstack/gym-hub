import { I } from '@angular/cdk/keycodes';
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
  @Input({ required: true }) classtitulo = '';
  @Input({ required: true }) conteudo = '';
  @Input({ required: true }) classsubtitle = '';
  @Input({ required: false }) subConteudo = '';
  @Input({ required: false }) classSubtitle2 = '';
  @Input({ required: false }) descricao = '';
  @Input({ required: false }) src = '';
  @Input({ required: false }) classImg = '';
  @Input({ required: false }) subTexto = '';
}