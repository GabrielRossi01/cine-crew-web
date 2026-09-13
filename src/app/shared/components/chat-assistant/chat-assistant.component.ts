import { AfterViewChecked, Component, ElementRef, ViewChild, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, MessageCircle, Send, X } from 'lucide-angular';
import { ChatService } from '../../../core/services/chat.service';

@Component({
  selector: 'app-chat-assistant',
  standalone: true,
  imports: [FormsModule, LucideAngularModule],
  template: `
    @if (!isOpen()) {
      <button
        type="button"
        class="chat-launcher"
        (click)="toggle()"
        aria-label="Abrir chat com Cineco"
      >
        <span class="chat-launcher-ring" aria-hidden="true"></span>

        <img src="cineco-avatar.svg" alt="" class="chat-launcher-avatar" aria-hidden="true" />

        <span class="chat-launcher-status" aria-hidden="true"></span>
      </button>
    }
    @if (isOpen()) {
      <section class="chat-window" aria-label="Assistente virtual Cineco">
        <header class="chat-header">
          <div class="chat-identity">
            <div class="chat-avatar-wrapper">
              <img src="cineco-avatar.svg" alt="Cineco" class="chat-avatar" />

              <span class="chat-status" aria-label="Cineco online"></span>
            </div>

            <div class="chat-identity-copy">
              <div class="flex items-center gap-2">
                <h2>Cineco</h2>
                <span class="chat-online-label">online</span>
              </div>

              <p>Seu assistente de cinema</p>
            </div>
          </div>

          <button
            type="button"
            class="chat-icon-button"
            (click)="toggle()"
            aria-label="Fechar chat"
          >
            <lucide-icon [img]="X" [size]="18" strokeWidth="1.8"></lucide-icon>
          </button>
        </header>

        <div
          #scrollContainer
          class="chat-messages"
          role="log"
          aria-live="polite"
          aria-label="Mensagens do Cineco"
        >
          @if (chatService.messages().length === 0) {
            <div class="chat-welcome">
              <div class="chat-welcome-avatar">
                <img src="cineco-avatar.svg" alt="" aria-hidden="true" />
              </div>

              <h3>Oi! Eu sou o Cineco!</h3>

              <p>
                Posso ajudar você a encontrar filmes, organizar o próximo rolê ou tirar dúvidas
                sobre o CineCrew.
              </p>

              <div class="chat-suggestions">
                <button
                  type="button"
                  class="suggestion-chip"
                  (click)="useSuggestion('Como funciona o CineCrew?')"
                >
                  Como funciona?
                </button>

                <button
                  type="button"
                  class="suggestion-chip"
                  (click)="useSuggestion('Me recomende um filme')"
                >
                  Recomende um filme
                </button>
              </div>
            </div>
          }

          @for (msg of chatService.messages(); track $index) {
            <div
              class="message-row"
              [class.message-row-user]="msg.role === 'user'"
              [class.message-row-assistant]="msg.role === 'assistant'"
            >
              @if (msg.role === 'assistant') {
                <div class="message-mini-avatar">
                  <img src="cineco-avatar.svg" alt="" aria-hidden="true" />
                </div>
              }

              <div
                class="message-bubble"
                [class.message-bubble-user]="msg.role === 'user'"
                [class.message-bubble-assistant]="msg.role === 'assistant'"
              >
                {{ msg.content }}
              </div>
            </div>
          }

          @if (chatService.isLoading()) {
            <div class="message-row message-row-assistant">
              <div class="message-mini-avatar">
                <img src="cineco-avatar.svg" alt="" aria-hidden="true" />
              </div>

              <div class="typing-bubble" aria-label="Cineco está digitando">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          }
        </div>

        <footer class="chat-composer">
          <form class="chat-form" (submit)="sendMessage($event)">
            <input
              type="text"
              [(ngModel)]="inputText"
              name="message"
              placeholder="Pergunte ao Cineco..."
              [disabled]="chatService.isLoading()"
              autocomplete="off"
              aria-label="Mensagem para o Cineco"
            />

            <button
              type="submit"
              class="send-button"
              [disabled]="!inputText.trim() || chatService.isLoading()"
              aria-label="Enviar mensagem"
            >
              <lucide-icon [img]="Send" [size]="16" strokeWidth="2"></lucide-icon>
            </button>
          </form>

          <p class="chat-disclaimer">Cineco pode cometer erros. Confira informações importantes.</p>
        </footer>
      </section>
    }
  `,
  styles: `
    :host {
      display: block;
    }

    .chat-launcher {
      position: fixed;
      right: 1.5rem;
      bottom: 1.5rem;
      z-index: 800;
      display: flex;
      width: 4rem;
      height: 4rem;
      align-items: center;
      justify-content: center;
      border: 1px solid rgba(255, 194, 80, 0.55);
      border-radius: 9999px;
      background: var(--cc-bg-card, #15131f);
      box-shadow:
        0 10px 30px rgba(0, 0, 0, 0.28),
        0 0 24px rgba(255, 194, 80, 0.28);
      cursor: pointer;
      isolation: isolate;
      transition:
        transform 250ms ease,
        box-shadow 250ms ease,
        border-color 250ms ease;
    }

    .chat-launcher:hover {
      border-color: rgba(255, 194, 80, 0.85);
      box-shadow:
        0 14px 36px rgba(0, 0, 0, 0.34),
        0 0 32px rgba(255, 194, 80, 0.42);
      transform: translateY(-3px) scale(1.04);
    }

    .chat-launcher-avatar {
      width: 3.15rem;
      height: 3.15rem;
      object-fit: contain;
      border-radius: 9999px;
    }

    .chat-launcher-status {
      position: absolute;
      right: 0.15rem;
      bottom: 0.2rem;
      width: 0.75rem;
      height: 0.75rem;
      border: 2px solid var(--cc-bg-base, #0a0a0a);
      border-radius: 9999px;
      background: #4ade80;
      box-shadow: 0 0 9px rgba(74, 222, 128, 0.7);
    }

    .chat-window {
      position: fixed;
      right: 1.5rem;
      bottom: 1.5rem;
      z-index: 800;
      display: flex;
      width: min(92vw, 390px);
      height: min(620px, 78vh);
      min-height: 440px;
      flex-direction: column;
      overflow: hidden;
      border: 1px solid var(--cc-border-strong, rgba(255, 255, 255, 0.2));
      border-radius: 1.5rem;
      background: var(--cc-bg-card, #15131f);
      box-shadow:
        0 24px 80px rgba(0, 0, 0, 0.38),
        inset 0 1px 0 var(--cc-border-subtle, rgba(255, 255, 255, 0.08));
      animation: chat-slide-up 300ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
      backdrop-filter: blur(28px) saturate(140%);
      -webkit-backdrop-filter: blur(28px) saturate(140%);
    }

    .chat-window::before {
      position: absolute;
      inset: 0;
      z-index: -1;
      background:
        radial-gradient(circle at 90% 0%, rgba(43, 67, 147, 0.2), transparent 34%),
        radial-gradient(circle at 0% 100%, rgba(255, 194, 80, 0.08), transparent 30%);
      content: '';
      pointer-events: none;
    }

    .chat-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      min-height: 4.5rem;
      padding: 0.85rem 1rem;
      border-bottom: 1px solid var(--cc-border-subtle, rgba(255, 255, 255, 0.08));
      background: rgba(43, 67, 147, 0.28);
      backdrop-filter: blur(18px);
      -webkit-backdrop-filter: blur(18px);
    }

    .chat-identity {
      display: flex;
      align-items: center;
      gap: 0.7rem;
    }

    .chat-avatar-wrapper {
      position: relative;
      display: flex;
      width: 2.8rem;
      height: 2.8rem;
      align-items: center;
      justify-content: center;
      border: 1px solid rgba(255, 255, 255, 0.28);
      border-radius: 0.95rem;
      background: rgba(255, 255, 255, 0.14);
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2);
    }

    .chat-avatar {
      width: 2.45rem;
      height: 2.45rem;
      object-fit: contain;
      border-radius: 0.75rem;
    }

    .chat-status {
      position: absolute;
      right: -0.12rem;
      bottom: -0.12rem;
      width: 0.7rem;
      height: 0.7rem;
      border: 2px solid var(--cc-bg-card, #15131f);
      border-radius: 9999px;
      background: #4ade80;
    }

    .chat-identity-copy h2 {
      color: var(--cc-text-primary, #ffffff);
      font-size: 0.9rem;
      font-weight: 700;
    }

    .chat-identity-copy p {
      margin-top: 0.15rem;
      color: var(--cc-text-muted, #737373);
      font-size: 0.68rem;
    }

    .chat-online-label {
      border-radius: 9999px;
      padding: 0.15rem 0.4rem;
      color: #86efac;
      background: rgba(74, 222, 128, 0.1);
      font-size: 0.58rem;
      font-weight: 700;
    }

    .chat-icon-button {
      display: flex;
      width: 2rem;
      height: 2rem;
      align-items: center;
      justify-content: center;
      border: 1px solid var(--cc-border-subtle, rgba(255, 255, 255, 0.08));
      border-radius: 0.65rem;
      color: var(--cc-text-muted, #737373);
      background: var(--cc-bg-soft, rgba(255, 255, 255, 0.035));
      transition:
        color 200ms ease,
        background-color 200ms ease,
        border-color 200ms ease;
    }

    .chat-icon-button:hover {
      border-color: var(--cc-border-strong, rgba(255, 255, 255, 0.2));
      color: var(--cc-text-primary, #ffffff);
      background: var(--cc-bg-elevated, rgba(255, 255, 255, 0.045));
    }

    .chat-messages {
      display: flex;
      flex: 1;
      flex-direction: column;
      gap: 0.8rem;
      overflow-y: auto;
      padding: 1rem;
      scrollbar-color: rgba(255, 194, 80, 0.35) transparent;
      scrollbar-width: thin;
    }

    .chat-messages::-webkit-scrollbar {
      width: 5px;
    }

    .chat-messages::-webkit-scrollbar-thumb {
      border-radius: 9999px;
      background: rgba(255, 194, 80, 0.35);
    }

    .chat-welcome {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: auto 0;
      padding: 1rem;
      text-align: center;
    }

    .chat-welcome-avatar {
      display: flex;
      width: 4.75rem;
      height: 4.75rem;
      align-items: center;
      justify-content: center;
      border-radius: 1.4rem;
    }

    .chat-welcome-avatar img {
      width: 4.2rem;
      height: 4.2rem;
      object-fit: contain;
    }

    .chat-welcome h3 {
      margin-top: 1rem;
      color: var(--cc-text-primary, #ffffff);
      font-size: 0.95rem;
      font-weight: 700;
    }

    .chat-welcome p {
      max-width: 16rem;
      margin-top: 0.5rem;
      color: var(--cc-text-muted, #737373);
      font-size: 0.75rem;
      line-height: 1.35rem;
    }

    .chat-suggestions {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 0.45rem;
      margin-top: 1rem;
    }

    .suggestion-chip {
      border: 1px solid var(--cc-border-subtle, rgba(255, 255, 255, 0.08));
      border-radius: 9999px;
      padding: 0.4rem 0.65rem;
      color: var(--cc-text-secondary, #d4d4d8);
      background: var(--cc-bg-soft, rgba(255, 255, 255, 0.035));
      font-size: 0.65rem;
      transition:
        color 200ms ease,
        background-color 200ms ease,
        border-color 200ms ease;
    }

    .suggestion-chip:hover {
      border-color: rgba(255, 194, 80, 0.35);
      color: var(--cc-text-primary, #ffffff);
      background: rgba(255, 194, 80, 0.1);
    }

    .message-row {
      display: flex;
      align-items: flex-end;
      gap: 0.45rem;
    }

    .message-row-user {
      justify-content: flex-end;
    }

    .message-row-assistant {
      justify-content: flex-start;
    }

    .message-mini-avatar {
      display: flex;
      width: 1.65rem;
      height: 1.65rem;
      flex-shrink: 0;
      align-items: center;
      justify-content: center;
      border: 1px solid var(--cc-border-subtle, rgba(255, 255, 255, 0.08));
      border-radius: 0.55rem;
      background: var(--cc-bg-elevated, rgba(255, 255, 255, 0.045));
    }

    .message-mini-avatar img {
      width: 1.45rem;
      height: 1.45rem;
      object-fit: contain;
      border-radius: 0.4rem;
    }

    .message-bubble {
      max-width: 78%;
      padding: 0.65rem 0.85rem;
      border-radius: 1rem;
      font-size: 0.78rem;
      line-height: 1.35rem;
    }

    .message-bubble-user {
      border: 1px solid rgba(43, 67, 147, 0.35);
      border-bottom-right-radius: 0.3rem;
      color: #ffffff;
      background: rgba(43, 67, 147, 0.85);
    }

    .message-bubble-assistant {
      border: 1px solid var(--cc-border-subtle, rgba(255, 255, 255, 0.08));
      border-bottom-left-radius: 0.3rem;
      color: var(--cc-text-secondary, #d4d4d8);
      background: var(--cc-bg-elevated, rgba(255, 255, 255, 0.045));
    }

    .typing-bubble {
      display: flex;
      align-items: center;
      gap: 0.3rem;
      padding: 0.75rem 0.85rem;
      border: 1px solid var(--cc-border-subtle, rgba(255, 255, 255, 0.08));
      border-radius: 1rem;
      border-bottom-left-radius: 0.3rem;
      background: var(--cc-bg-elevated, rgba(255, 255, 255, 0.045));
    }

    .typing-bubble span {
      width: 0.35rem;
      height: 0.35rem;
      border-radius: 9999px;
      background: var(--cc-text-muted, #737373);
      animation: typing-bounce 1.1s infinite ease-in-out;
    }

    .typing-bubble span:nth-child(2) {
      animation-delay: 150ms;
    }

    .typing-bubble span:nth-child(3) {
      animation-delay: 300ms;
    }

    .chat-composer {
      padding: 0.75rem;
      border-top: 1px solid var(--cc-border-subtle, rgba(255, 255, 255, 0.08));
      background: var(--cc-bg-soft, rgba(255, 255, 255, 0.035));
    }

    .chat-form {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.3rem 0.3rem 0.3rem 0.85rem;
      border: 1px solid var(--cc-border-default, rgba(255, 255, 255, 0.14));
      border-radius: 9999px;
      background: var(--cc-bg-elevated, rgba(255, 255, 255, 0.045));
      transition:
        border-color 200ms ease,
        box-shadow 200ms ease;
    }

    .chat-form:focus-within {
      border-color: rgba(255, 194, 80, 0.55);
      box-shadow: 0 0 0 3px rgba(255, 194, 80, 0.1);
    }

    .chat-form input {
      min-width: 0;
      flex: 1;
      border: 0;
      outline: 0;
      color: var(--cc-text-primary, #ffffff);
      background: transparent;
      font-size: 0.75rem;
    }

    .chat-form input::placeholder {
      color: var(--cc-text-muted, #737373);
    }

    .send-button {
      display: flex;
      width: 2.15rem;
      height: 2.15rem;
      flex-shrink: 0;
      align-items: center;
      justify-content: center;
      border-radius: 9999px;
      color: #111827;
      background: #ffc250;
      transition:
        background-color 200ms ease,
        transform 200ms ease,
        opacity 200ms ease;
    }

    .send-button:hover:not(:disabled) {
      background: #ffd477;
      transform: translateY(-1px);
    }

    .send-button:disabled {
      cursor: not-allowed;
      opacity: 0.45;
    }

    .chat-disclaimer {
      margin-top: 0.45rem;
      color: var(--cc-text-subtle, #525252);
      font-size: 0.58rem;
      text-align: center;
    }

    @keyframes chat-slide-up {
      from {
        opacity: 0;
        transform: translateY(1.25rem) scale(0.97);
      }

      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    @keyframes launcher-pulse {
      0%,
      100% {
        opacity: 0.35;
        transform: scale(0.98);
      }

      50% {
        opacity: 0.85;
        transform: scale(1.08);
      }
    }

    @keyframes typing-bounce {
      0%,
      60%,
      100% {
        opacity: 0.35;
        transform: translateY(0);
      }

      30% {
        opacity: 1;
        transform: translateY(-3px);
      }
    }

    @media (max-width: 640px) {
      .chat-launcher {
        right: 1rem;
        bottom: 1rem;
        width: 3.6rem;
        height: 3.6rem;
      }

      .chat-launcher-avatar {
        width: 2.8rem;
        height: 2.8rem;
      }

      .chat-window {
        right: 0.75rem;
        bottom: 0.75rem;
        width: calc(100vw - 1.5rem);
        height: min(600px, calc(100vh - 1.5rem));
        max-height: calc(100vh - 1.5rem);
        border-radius: 1.25rem;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .chat-launcher-ring,
      .chat-window,
      .typing-bubble span {
        animation: none;
      }

      .chat-launcher,
      .chat-icon-button,
      .suggestion-chip,
      .send-button,
      .chat-form {
        transition: none;
      }
    }
  `,
})
export class ChatAssistantComponent implements AfterViewChecked {
  readonly chatService = inject(ChatService);
  readonly X = X;
  readonly Send = Send;
  readonly MessageCircle = MessageCircle;

  @ViewChild('scrollContainer')
  private scrollContainer?: ElementRef<HTMLElement>;

  readonly isOpen = signal(false);

  inputText = '';
  private shouldScrollToBottom = false;

  toggle(): void {
    this.isOpen.update((value) => !value);

    if (this.isOpen()) {
      this.shouldScrollToBottom = true;
    }
  }

  useSuggestion(message: string): void {
    this.inputText = message;
    this.sendMessage();
  }

  sendMessage(event?: Event): void {
    event?.preventDefault();

    const message = this.inputText.trim();

    if (!message || this.chatService.isLoading()) {
      return;
    }

    this.inputText = '';
    this.shouldScrollToBottom = true;

    this.chatService.sendMessage(message).subscribe({
      next: () => {
        this.shouldScrollToBottom = true;
      },
      error: () => {
        this.shouldScrollToBottom = true;
      },
    });
  }

  ngAfterViewChecked(): void {
    if (!this.shouldScrollToBottom || !this.scrollContainer) {
      return;
    }

    this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;

    this.shouldScrollToBottom = false;
  }
}
