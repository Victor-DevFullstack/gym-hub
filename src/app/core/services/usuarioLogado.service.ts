import { Injectable, signal } from '@angular/core';
import { ProprietarioType } from '../../shared/types/proprietario';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  usuarioLogado = signal<UsuarioType | null>(null);
}
