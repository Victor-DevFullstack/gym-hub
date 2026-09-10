import { effect, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TreinoService {
  private chave = 'treinos';

  private treinos = signal<TreinoType[]>(JSON.parse(localStorage.getItem(this.chave) ?? '[]'));

  constructor() {
    effect(() => {
      localStorage.setItem(this.chave, JSON.stringify(this.treinos()));
    });
  }

  listarPorAluno(alunoId: string): TreinoType[] {
    return this.treinos().filter((treino) => treino.alunoId === alunoId);
  }

  buscarPorId(id: string): TreinoType | undefined {
    return this.treinos().find((treino) => treino.id === id);
  }

  cadastrar(treino: TreinoType): void {
    this.treinos.update((lista) => [...lista, treino]);
  }

  atualizar(treino: TreinoType): void {
    this.treinos.update((lista) => lista.map((t) => (t.id === treino.id ? treino : t)));
  }

  deletar(treino: TreinoType): void {
    this.treinos.update((lista) => lista.filter((t) => t.id !== treino.id));
  }
}
