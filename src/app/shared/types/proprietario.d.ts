import { FormControl } from "@angular/forms"

type ProprietarioType = UsuarioType & {
  nomeAcademia?: string,
}

type ProprietarioFormControls = {
  nome?: FormControl<string>
  nomeAcademia?: FormControl<string>
  email: FormControl<string>
  senha: FormControl<string>
}