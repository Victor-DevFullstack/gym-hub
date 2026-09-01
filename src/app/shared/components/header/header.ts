import { Component } from '@angular/core';
import { MatCardModule } from "@angular/material/card";

@Component({
  selector: 'app-header',
  imports: [MatCardModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {}
