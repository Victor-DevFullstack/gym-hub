import { AlunoType, ProfessorType, ProprietarioType, RecepcionistaType, UsuarioType } from '../../shared/types/usuario';
import { CancelamentoAluno } from './usuario.service';

/**
 * Dados de demonstração usados apenas na primeira execução do app (localStorage vazio),
 * para já mostrar o sistema com informação de verdade numa apresentação.
 *
 * Login de apresentação (senha "123456" para todos):
 * - proprietario@academiademo.com
 * - recepcao@academiademo.com
 * - bruno@academiademo.com / marina@academiademo.com (professores)
 * - larissa@academiademo.com, pedro@academiademo.com, ... (alunos, um e-mail por aluno abaixo)
 */
export function gerarDadosSeed(): {
  usuarios: UsuarioType[];
  cancelamentos: CancelamentoAluno[];
  treinos: TreinoType[];
} {
  const academiaId = crypto.randomUUID();
  const nomeAcademia = 'DemoSmartFit';

  const diasAtras = (dias: number) => new Date(Date.now() - dias * 86400000).toString();
  const diasNoFuturo = (dias: number) => new Date(Date.now() + dias * 86400000).toString();

  const proprietario: ProprietarioType = {
    id: crypto.randomUUID(),
    nome: 'Ana Souza',
    email: 'proprietario@academiademo.com',
    senha: '123456',
    role: 'proprietario',
    academiaId,
    nomeAcademia,
  };

  const recepcionista: RecepcionistaType = {
    id: crypto.randomUUID(),
    nome: 'Carla Mendes',
    email: 'recepcao@academiademo.com',
    senha: '123456',
    role: 'recepcionista',
    academiaId,
    nomeAcademia,
  };

  const professorBruno: ProfessorType = {
    id: crypto.randomUUID(),
    nome: 'Bruno Lima',
    email: 'bruno@academiademo.com',
    senha: '123456',
    role: 'professor',
    academiaId,
    nomeAcademia,
  };

  const professorMarina: ProfessorType = {
    id: crypto.randomUUID(),
    nome: 'Marina Alves',
    email: 'marina@academiademo.com',
    senha: '123456',
    role: 'professor',
    academiaId,
    nomeAcademia,
  };

  // venceEm > 7 dias = Pago | 0-7 dias = Pendente | negativo = Atrasado (ver mensalidade.utils.ts)
  const alunosSeed = [
    { nome: 'Larissa Costa', email: 'larissa@academiademo.com', plano: 'mensal', contratadoHa: 0, venceEm: 30, personal: professorBruno.id },
    { nome: 'Pedro Henrique', email: 'pedro@academiademo.com', plano: 'trimestral', contratadoHa: 45, venceEm: 20, personal: 'sem-personal' },
    { nome: 'Juliana Ramos', email: 'juliana@academiademo.com', plano: 'mensal', contratadoHa: 0, venceEm: 5, personal: professorMarina.id },
    { nome: 'Felipe Rocha', email: 'felipe@academiademo.com', plano: 'anual', contratadoHa: 200, venceEm: 165, personal: professorBruno.id },
    { nome: 'Camila Duarte', email: 'camila@academiademo.com', plano: 'mensal', contratadoHa: 40, venceEm: -10, personal: 'sem-personal' },
    { nome: 'Rafael Nunes', email: 'rafael@academiademo.com', plano: 'semestral', contratadoHa: 10, venceEm: 170, personal: professorMarina.id },
    { nome: 'Bianca Ferreira', email: 'bianca@academiademo.com', plano: 'experimental', contratadoHa: 0, venceEm: 1, personal: 'sem-personal' },
    { nome: 'Diego Martins', email: 'diego@academiademo.com', plano: 'mensal', contratadoHa: 35, venceEm: -3, personal: professorBruno.id },
    { nome: 'Vitoria Alves', email: 'vitoria@academiademo.com', plano: 'trimestral', contratadoHa: 5, venceEm: 85, personal: professorMarina.id },
    { nome: 'Gustavo Pereira', email: 'gustavo@academiademo.com', plano: 'mensal', contratadoHa: 0, venceEm: 30, personal: 'sem-personal' },
    { nome: 'Sofia Martins', email: 'sofia@academiademo.com', plano: 'mensal', contratadoHa: 2, venceEm: 3, personal: professorBruno.id },
    { nome: 'Thiago Almeida', email: 'thiago@academiademo.com', plano: 'semestral', contratadoHa: 60, venceEm: -15, personal: 'sem-personal' },
    { nome: 'Renata Silva', email: 'renata@academiademo.com', plano: 'trimestral', contratadoHa: 0, venceEm: 90, personal: professorMarina.id },
    { nome: 'Otavio Souza', email: 'otavio@academiademo.com', plano: 'mensal', contratadoHa: 20, venceEm: 27, personal: professorBruno.id },
  ] as const;

  const alunos: AlunoType[] = alunosSeed.map((aluno) => ({
    id: crypto.randomUUID(),
    nome: aluno.nome,
    email: aluno.email,
    senha: '123456',
    role: 'aluno',
    academiaId,
    nomeAcademia,
    plano: aluno.plano,
    dataDeContratacao: diasAtras(aluno.contratadoHa),
    dataDeVencimento: diasNoFuturo(aluno.venceEm),
    personal: aluno.personal as unknown as AlunoType['personal'],
  }));

  const buscarAluno = (email: string) => alunos.find((aluno) => aluno.email === email)!;

  // Alunos removidos no passado — alimenta os cards "Matrículas canceladas" e "Taxa de cancelamento".
  const cancelamentos: CancelamentoAluno[] = [
    { academiaId, data: diasAtras(2) },
    { academiaId, data: diasAtras(6) },
    { academiaId, data: diasAtras(20) },
  ];

  // Fichas de treino já cadastradas, para o recurso de treino aparecer preenchido na demo.
  const treinos: TreinoType[] = [
    {
      id: crypto.randomUUID(),
      nome: 'Treino A - Superior',
      alunoId: buscarAluno('larissa@academiademo.com').id,
      professorId: professorBruno.id,
      academiaId,
      atualizadoEm: new Date().toISOString(),
      exercicios: [
        { id: crypto.randomUUID(), nome: 'Supino reto', series: 4, repeticoes: 10, carga: '40kg' },
        { id: crypto.randomUUID(), nome: 'Puxada frontal', series: 3, repeticoes: 12, carga: '35kg' },
        { id: crypto.randomUUID(), nome: 'Rosca direta', series: 3, repeticoes: 12, carga: '14kg', observacoes: 'Controlar a descida' },
      ],
    },
    {
      id: crypto.randomUUID(),
      nome: 'Treino B - Inferior',
      alunoId: buscarAluno('felipe@academiademo.com').id,
      professorId: professorBruno.id,
      academiaId,
      atualizadoEm: new Date().toISOString(),
      exercicios: [
        { id: crypto.randomUUID(), nome: 'Agachamento livre', series: 4, repeticoes: 8, carga: '60kg' },
        { id: crypto.randomUUID(), nome: 'Leg press', series: 3, repeticoes: 12, carga: '120kg' },
      ],
    },
    {
      id: crypto.randomUUID(),
      nome: 'Full body',
      alunoId: buscarAluno('juliana@academiademo.com').id,
      professorId: professorMarina.id,
      academiaId,
      atualizadoEm: new Date().toISOString(),
      exercicios: [
        { id: crypto.randomUUID(), nome: 'Remada baixa', series: 3, repeticoes: 12, carga: '30kg' },
        { id: crypto.randomUUID(), nome: 'Elevação lateral', series: 3, repeticoes: 15, carga: '8kg' },
        { id: crypto.randomUUID(), nome: 'Abdominal supra', series: 3, repeticoes: 20, carga: 'Peso corporal' },
      ],
    },
  ];

  return {
    usuarios: [proprietario, recepcionista, professorBruno, professorMarina, ...alunos],
    cancelamentos,
    treinos,
  };
}
