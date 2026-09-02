import { Component } from '@angular/core';
import { Proprietario } from "../proprietario/proprietario";
import { Sidebar } from '../../../shared/components/sidebar/sidebar';
import { Header } from '../../../shared/components/header/header';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-index',
  imports: [Proprietario,Sidebar,Header,RouterOutlet],
  templateUrl: './index.html',
  styleUrl: './index.css',
})
export class Index {}
