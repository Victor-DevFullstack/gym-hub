import { Component } from '@angular/core';
import { Sidebar } from '../sidebar/sidebar';
import { Header } from '../header/header';
import { RouterOutlet } from '@angular/router';

import { Proprietario } from '../../../features/dashboard/proprietario/proprietario';



@Component({
  selector: 'app-page-layout',
  imports: [Sidebar,Header,RouterOutlet,Proprietario],
  templateUrl: './page-layout.html',
  styleUrl: './page-layout.css',
})
export class PageLayout {}
