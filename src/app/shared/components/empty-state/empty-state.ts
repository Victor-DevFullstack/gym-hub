import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Icon } from '../icon/icon';
import { IconName } from '../icon/icons';

/** Estado vazio com ícone, mensagem e botão opcional (navega para `route`). */
@Component({
  selector: 'app-empty-state',
  imports: [RouterLink, Icon],
  template: `
    <div class="empty tone-{{ tone() }}" [class.empty--chart]="chart()">
      <div class="empty__art"><app-icon [name]="icon()" [size]="34" /></div>
      <h4 class="empty__title">{{ title() }}</h4>
      <p class="empty__text">{{ text() }}</p>
      @if (actionLabel() && route()) {
        <a class="btn btn--primary" [routerLink]="route()">
          {{ actionLabel() }}<app-icon name="arrowRight" [size]="16" />
        </a>
      }
    </div>
  `,
})
export class EmptyState {
  icon = input<IconName>('inbox');
  tone = input('blue');
  title = input.required<string>();
  text = input.required<string>();
  actionLabel = input('');
  route = input('');
  chart = input(false);
}
