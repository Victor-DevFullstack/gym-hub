import { Component } from '@angular/core';
import { Proprietario } from "../proprietario/proprietario";

@Component({
  selector: 'app-index',
  imports: [Proprietario],
  templateUrl: './index.html',
  styleUrl: './index.css',
})
export class Index {}
