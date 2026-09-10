import { FormControl } from '@angular/forms';

type Role = 'proprietario' | 'recepcionista' | 'professor' | 'aluno';

type Plano = 'mensal' | 'trimestral' | 'semestral' | 'anual' | null;

type UsuarioType = AlunoType | ProprietarioType | ProfessorType | RecepcionistaType;

interface BaseUsuarioType {
  id: string;
  nome: string;
  email: string;
  senha: string;
  role: Role;
  academiaId: string;
  nomeAcademia: string;
  criadoPor?: string;
}

interface AlunoType extends BaseUsuarioType {
  role: 'aluno';
  plano: Plano;
  dataDeContratacao: string | null;
  dataDeVencimento: string | null;
  personal: ProfessorType | null;
}

interface ProprietarioType extends BaseUsuarioType {
  role: 'proprietario';
}

interface ProfessorType extends BaseUsuarioType {
  role: 'professor';
  alunos?: AlunoType[]
}

interface RecepcionistaType extends BaseUsuarioType {
  role: 'recepcionista';
}

type UsuarioFormControls = {
  nome: FormControl<string>;
  email: FormControl<string>;
  senha: FormControl<string>;
};
