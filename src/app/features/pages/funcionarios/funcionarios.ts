import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Role } from '../../../shared/types/usuario';
import { TitleCasePipe } from '@angular/common';

export interface Test {
  name: string;
  cargo: Role;
  email: string;
  status: "Ativo" | "Inativo";
}

const ELEMENT_DATA: Test[] = [
  { name: 'Marcia', cargo: 'recepcionista', email: 'hydrogen@example.com', status: 'Ativo'},
  { name: 'Wellington', cargo: 'recepcionista', email: 'helium@example.com', status: 'Ativo' },
  { name: 'Lívia', cargo: 'recepcionista', email: 'Li' , status: 'Ativo'},
  { name: 'Ana', cargo: 'recepcionista', email: 'Be' , status: 'Ativo'},
  { name: 'Carlos', cargo: 'recepcionista', email: 'B' , status: 'Ativo'},
  { name: 'Maria', cargo: 'recepcionista', email: 'C' , status: 'Ativo'},
  { name: 'Olivia', cargo: 'recepcionista', email: 'N' , status: 'Ativo'},
];

@Component({
  selector: 'app-funcionarios',
  imports: [MatButtonModule, MatFormFieldModule, MatInputModule, MatTableModule, TitleCasePipe],
  templateUrl: './funcionarios.html',
  styleUrl: './funcionarios.css',
})
export class Funcionarios {
  displayedColumns: string[] = ['name', 'cargo', 'email', 'status'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
