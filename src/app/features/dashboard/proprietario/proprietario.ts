import { Component } from '@angular/core';
import { Header } from '../../../shared/components/header/header';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-proprietario',
  imports: [Header, RouterOutlet],
  templateUrl: './proprietario.html',
  styleUrl: './proprietario.css',
})
export class Proprietario {}
