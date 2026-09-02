import { Component } from '@angular/core';
import { Header } from '../../../shared/components/header/header';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../../../shared/components/sidebar/sidebar';

@Component({
  selector: 'app-proprietario',
  imports: [Header, RouterOutlet,Sidebar],
  templateUrl: './proprietario.html',
  styleUrl: './proprietario.css',
})
export class Proprietario {}
