import { inject, Injectable, runInInjectionContext } from '@angular/core';
import { ProprietarioType } from '../../shared/types/proprietario';
import { Dialog } from '../../shared/components/dialog/dialog';

@Injectable({
  providedIn: 'root',
})
export class ProprietarioService {
  private dialog = inject(Dialog)
  cadastrar(proprietario: ProprietarioType): { cadastrou: boolean, message: string } {
    console.log(proprietario);

    const dadosSalvos = localStorage.getItem('proprietarios');
    const listaProprietarios: ProprietarioType[] = dadosSalvos ? JSON.parse(dadosSalvos) : [];

    const emailJaExiste = listaProprietarios.some((p) => p.email === proprietario.email);

    if (emailJaExiste) {
      return { cadastrou: false, message: 'Já existe um usuário com esse email' };

    } else {
      listaProprietarios.push(proprietario);

      localStorage.setItem('proprietarios', JSON.stringify(listaProprietarios));

      return {
        cadastrou: true,
        message: 'Cadastrado com sucesso\nDeseja ir para página de login?',
      };
    }
  }
}
