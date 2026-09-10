import { Component } from '@angular/core';
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-account',
  imports: [MatCardModule, MatFormFieldModule],
  templateUrl: './account.html',
  styleUrl: './account.css',
})
export class Account {}
