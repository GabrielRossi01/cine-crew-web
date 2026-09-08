import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-oauth2-redirect',
  standalone: true,
  template: `
    <div
      class="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a1a2e] to-[#0f0f1a]"
    >
      <div class="text-center">
        <div
          class="animate-spin w-12 h-12 border-4 border-[#FFC250] border-t-transparent rounded-full mx-auto mb-4"
        ></div>
        <p class="text-neutral-400 text-lg">Autenticando...</p>
      </div>
    </div>
  `,
})
export class OAuth2RedirectComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    const expiresIn = this.route.snapshot.queryParamMap.get('expiresIn');
    if (token && expiresIn) {
      this.authService.handleOAuth2Redirect(token, parseInt(expiresIn, 10));
      this.router.navigate(['/clubs']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
