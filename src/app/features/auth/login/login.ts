import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [MatCardModule, MatButtonModule, MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule,MatCheckboxModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})  
export class Login {
  emailFormControl = new FormControl('', [Validators.required, Validators.email, Validators.pattern("^[^\s@]+@[^\s@]+\.[^\s@]+$")]);
  passwordFormControl = new FormControl('', [Validators.required, Validators.minLength(6)]);

  constructor() {
    console.log(this.emailFormControl);
    console.log(this.passwordFormControl);
  }
  // matcher = new
}
