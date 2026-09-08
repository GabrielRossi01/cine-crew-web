import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ChatMessage, ChatRequest, ChatResponse } from '../models/chat.model';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  private readonly _messages = signal<ChatMessage[]>([]);
  private readonly _isLoading = signal(false);

  readonly messages = this._messages.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();

  sendMessage(message: string): Observable<ChatResponse> {
    const userMessage: ChatMessage = {
      role: 'user',
      content: message,
      timestamp: new Date(),
    };
    this._messages.update((msgs) => [...msgs, userMessage]);
    this._isLoading.set(true);

    return this.http.post<ChatResponse>(`${this.apiUrl}/chat`, { message } as ChatRequest).pipe(
      tap({
        next: (response) => {
          const assistantMessage: ChatMessage = {
            role: 'assistant',
            content: response.reply,
            timestamp: new Date(),
          };
          this._messages.update((msgs) => [...msgs, assistantMessage]);
          this._isLoading.set(false);
        },
        error: () => this._isLoading.set(false),
      }),
    );
  }

  clearHistory(): void {
    this._messages.set([]);
    this.http.delete(`${this.apiUrl}/chat/history`).subscribe();
  }
}
