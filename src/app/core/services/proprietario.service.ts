import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ProprietarioFormControls, ProprietarioType } from '../../shared/types/proprietario';

@Injectable({
  providedIn: 'root',
})
export class ProprietarioService {
  cadastrar(proprietario: ProprietarioType) {
    console.log(proprietario);

    const dadosSalvos = localStorage.getItem('proprietarios');
    const listaProprietarios: ProprietarioType[] = dadosSalvos ? JSON.parse(dadosSalvos) : [];

    // const emailJaExiste = listaProprietarios.includes(proprietario.email)

    if (emailJaExiste) {
      alert('Já existe um usuário com esse email');
    } else {
      listaProprietarios.push(proprietario);

      localStorage.setItem('propriedade', JSON.stringify(listaProprietarios));
    }
  }
}
