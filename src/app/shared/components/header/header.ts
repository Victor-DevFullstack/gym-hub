import { Component, inject } from '@angular/core';
import { MatCardModule } from "@angular/material/card";
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  imports: [MatCardModule],
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
