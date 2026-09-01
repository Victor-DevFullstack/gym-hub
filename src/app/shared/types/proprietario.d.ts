import { FormControl } from "@angular/forms"

type ProprietarioType = {
  nome: string,
  nomeAcademia: string,
  email: string,
  senha: string
}

type ProprietarioFormControls = {
  nome: FormControl<string>
  nomeAcademia: FormControl<string>
  email: FormControl<string>
  senha: FormControl<string>
}