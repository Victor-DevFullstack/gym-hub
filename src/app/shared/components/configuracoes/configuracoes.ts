import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-configuracoes',
  imports: [RouterLink, RouterOutlet],
  templateUrl: './configuracoes.html',
  styleUrl: './configuracoes.css',
})
export class Configuracoes {}
