import { Injectable } from '@angular/core';
import { User } from '../models/post.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly storageKey = 'userId';

  getCurrentUser(): User | null {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) {
      return null;
    }
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  }

  getCurrentUserId(): string {
    return this.getCurrentUser()?._id ?? '';
  }

  setCurrentUser(user: User): void {
    localStorage.setItem(this.storageKey, JSON.stringify(user));
  }

  clearSession(): void {
    localStorage.removeItem('token');
    localStorage.removeItem(this.storageKey);
  }
}
