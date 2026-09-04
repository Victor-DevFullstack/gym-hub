import { Component } from '@angular/core';
import { Sidebar } from '../../../shared/components/sidebar/sidebar';
import { Header } from '../../../shared/components/header/header';
import { MatCardModule } from "@angular/material/card";

@Component({
  selector: 'app-usuario',
  imports: [Sidebar, Header, MatCardModule],
  templateUrl: './usuario.html',
  styleUrl: './usuario.css',
})
export class Usuario {}
