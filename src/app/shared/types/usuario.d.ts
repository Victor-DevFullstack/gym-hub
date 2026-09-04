import { FormControl } from '@angular/forms';

type Role = 'proprietario' | 'recepcionista' | 'professor' | 'cliente';

type UsuarioType = {
  id: string;
  nome: string;
  email: string;
  senha: string;
  role: Role;
  academiaId: string;
  nomeAcademia: string;
  criadoPor?: string;
};

type UsuarioFormControls = {
  nome: FormControl<string>;
  email: FormControl<string>;
  senha: FormControl<string>;
};
