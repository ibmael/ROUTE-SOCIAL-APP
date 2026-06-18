import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UsersService } from '../../../../core/services/users.service';

interface SuggestedUser {
  _id: string;
  name: string;
  username: string;
  photo: string;
  followersCount?: number;
  isFollowing?: boolean;
}

@Component({
  selector: 'app-right-side',
  imports: [FormsModule, RouterLink],
  host: {
    class: 'hidden lg:block col-span-1',
  },
  templateUrl: './right-side.component.html',
  styleUrl: './right-side.component.css',
})
export class RightSideComponent implements OnInit {
  private readonly usersService = inject(UsersService);

  suggestions: SuggestedUser[] = [];
  searchTerm = '';
  followingIds = new Set<string>();

  ngOnInit(): void {
    this.usersService.getSuggestions(10).subscribe({
      next: (res) => {
        this.suggestions = res.data?.suggestions ?? res.data ?? [];
      },
    });
  }

  get filteredSuggestions(): SuggestedUser[] {
    if (!this.searchTerm.trim()) {
      return this.suggestions;
    }
    const term = this.searchTerm.toLowerCase();
    return this.suggestions.filter(
      (u) => u.name.toLowerCase().includes(term) || u.username.toLowerCase().includes(term),
    );
  }

  followUser(user: SuggestedUser): void {
    this.usersService.followUser(user._id).subscribe({
      next: () => {
        this.followingIds.add(user._id);
        user.isFollowing = true;
      },
    });
  }

  isFollowing(user: SuggestedUser): boolean {
    return user.isFollowing || this.followingIds.has(user._id);
  }
}
