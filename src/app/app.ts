import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from './shared/components/toast/toast.component';
import { ChatAssistantComponent } from './shared/components/chat-assistant/chat-assistant.component';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastComponent, ChatAssistantComponent],
  template: `
    <router-outlet />
    <app-toast />
    <app-chat-assistant />
  `,
  styles: [
    `
      :host {
        display: block;
        min-height: 100vh;
      }
    `,
  ],
})
export class AppComponent {
  private readonly themeService = inject(ThemeService);
}
