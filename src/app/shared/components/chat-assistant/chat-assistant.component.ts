import { Component, ElementRef, ViewChild, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ChatService } from '../../../core/services/chat.service';
import { ChatMessage } from '../../../core/models/chat.model';

@Component({
  selector: 'app-chat-assistant',
  standalone: true,
  imports: [FormsModule],
  template: `
    @if (authService.isAuthenticated()) {
      <!-- Floating Button -->
      @if (!isOpen()) {
        <button
          (click)="toggle()"
          class="fixed bottom-6 right-6 z-[800] w-14 h-14 rounded-full bg-[#FFC250] shadow-[0_0_15px_rgba(255,194,80,0.5)] flex items-center justify-center hover:scale-110 transition-transform duration-300 focus:outline-none"
          aria-label="Abrir chat com Cineco">
          <span class="text-2xl">🤖</span>
        </button>
      }

      <!-- Chat Panel -->
      @if (isOpen()) {
        <div class="fixed bottom-6 right-6 z-[800] w-[90vw] max-w-sm sm:w-96 bg-[#1a1a2e]/95 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl flex flex-col overflow-hidden animate-slide-up h-[500px] max-h-[80vh]">

          <!-- Header -->
          <div class="bg-[#2B4393]/90 px-4 py-3 border-b border-white/10 flex justify-between items-center">
            <div class="flex items-center gap-2">
              <span class="text-xl">🤖</span>
              <span class="font-bold text-white">Cineco</span>
              <span class="text-xs text-white/50">Assistente</span>
            </div>
            <button (click)="toggle()" class="text-white/70 hover:text-white transition-colors p-1" aria-label="Fechar chat">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>

          <!-- Messages Area -->
          <div class="flex-1 overflow-y-auto p-4 space-y-3" #scrollContainer>
            @if (chatService.messages().length === 0) {
              <div class="text-center text-neutral-400 mt-8 text-sm px-4">
                <span class="text-4xl block mb-3">🎬</span>
                Olá! Sou o Cineco, seu assistente de cinema. Pergunte sobre filmes, horários, ou peça recomendações!
              </div>
            }

            @for (msg of chatService.messages(); track $index) {
              <div class="flex" [class.justify-end]="msg.role === 'user'" [class.justify-start]="msg.role === 'assistant'">
                <div class="max-w-[80%] rounded-2xl px-4 py-2 text-sm"
                     [class.bg-[#2B4393]/80]="msg.role === 'user'"
                     [class.text-white]="msg.role === 'user'"
                     [class.rounded-br-sm]="msg.role === 'user'"
                     [class.bg-white/10]="msg.role === 'assistant'"
                     [class.text-neutral-100]="msg.role === 'assistant'"
                     [class.rounded-bl-sm]="msg.role === 'assistant'">
                  {{ msg.content }}
                </div>
              </div>
            }

            @if (chatService.isLoading()) {
              <div class="flex justify-start">
                <div class="bg-white/10 text-neutral-300 rounded-2xl rounded-bl-sm px-4 py-3 text-sm flex items-center gap-1">
                  Cineco está digitando
                  <span class="flex gap-1 ml-1">
                    <span class="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style="animation-delay: 0s"></span>
                    <span class="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></span>
                    <span class="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style="animation-delay: 0.4s"></span>
                  </span>
                </div>
              </div>
            }
          </div>

          <!-- Input Area -->
          <div class="p-3 bg-white/5 border-t border-white/10">
            <form (submit)="sendMessage($event)" class="flex gap-2">
              <input
                type="text"
                [(ngModel)]="inputText"
                name="message"
                placeholder="Pergunte sobre um filme..."
                class="flex-1 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-sm text-white placeholder-neutral-400 focus:outline-none focus:border-[#FFC250] focus:ring-1 focus:ring-[#FFC250] transition-colors"
                [disabled]="chatService.isLoading()"
                autocomplete="off">
              <button
                type="submit"
                [disabled]="!inputText.trim() || chatService.isLoading()"
                class="w-9 h-9 rounded-full bg-[#FFC250] text-[#0f0f1a] flex items-center justify-center hover:bg-[#FFC250]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0"
                aria-label="Enviar mensagem">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4 translate-x-px">
                  <path d="M3.478 2.404a.75.75 0 00-.926.941l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.404z" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      }
    }
  `,
  styles: [`
    @keyframes slide-up {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    .animate-slide-up {
      animation: slide-up 0.3s ease-out forwards;
    }
  `]
})
export class ChatAssistantComponent {
  readonly authService = inject(AuthService);
  readonly chatService = inject(ChatService);

  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  isOpen = signal(false);
  inputText = '';

  toggle(): void {
    this.isOpen.update(v => !v);
    if (this.isOpen()) {
      setTimeout(() => this.scrollToBottom(), 100);
    }
  }

  sendMessage(event: Event): void {
    event.preventDefault();
    if (!this.inputText.trim() || this.chatService.isLoading()) return;

    this.chatService.sendMessage(this.inputText).subscribe({
      next: () => setTimeout(() => this.scrollToBottom(), 100)
    });
    this.inputText = '';
    setTimeout(() => this.scrollToBottom(), 100);
  }

  private scrollToBottom(): void {
    try {
      if (this.scrollContainer) {
        this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
      }
    } catch { /* ignore */ }
  }
}
