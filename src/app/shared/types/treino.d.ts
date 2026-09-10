interface ExercicioType {
  id: string;
  nome: string;
  series: number;
  repeticoes: number;
  carga: string;
  observacoes?: string;
}

interface TreinoType {
  id: string;
  nome: string;
  alunoId: string;
  professorId: string;
  academiaId: string;
  exercicios: ExercicioType[];
  atualizadoEm: string;
}
