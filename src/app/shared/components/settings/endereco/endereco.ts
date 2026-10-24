import { Component, inject } from '@angular/core';

import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-endereco',
  templateUrl: './endereco.html',
  styleUrl: './endereco.css',
})
export class Endereco {
  protected usuario = inject(AuthService).usuarioLogado;
}
