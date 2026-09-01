import { Injectable } from '@angular/core';
import { ProprietarioType } from '../../shared/types/proprietario';

@Injectable({
  providedIn: 'root',
})
export class ProprietarioService {
  cadastrar(proprietario: ProprietarioType) {
    console.log(proprietario);

    const dadosSalvos = localStorage.getItem('proprietarios');
    const listaProprietarios: ProprietarioType[] = dadosSalvos ? JSON.parse(dadosSalvos) : [];

    const emailJaExiste = listaProprietarios.some(p => p.email === proprietario.email);

    if (emailJaExiste) {
      alert('Já existe um usuário com esse email');
    } else {
      listaProprietarios.push(proprietario);

      localStorage.setItem('proprietarios', JSON.stringify(listaProprietarios));

      confirm("Cadastrado com sucesso\nDeseja ir para página de login?")
    }
  }
}
