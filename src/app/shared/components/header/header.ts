import { Component, inject } from '@angular/core';
import { MatCardModule } from "@angular/material/card";
import { AuthService } from '../../../core/services/auth.service';
import { TitleCasePipe } from '@angular/common';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-header',
  imports: [MatCardModule, TitleCasePipe, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  private authService = inject(AuthService)

  user = this.authService.getUsuarioLogado()

  constructor() {
    console.log(

      this.user?.nome.slice(0,1)
    );
    

  }
}
