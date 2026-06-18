import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UsersService } from '../../core/services/users.service';
import { Post } from '../../core/models/post.interface';

@Component({
  selector: 'app-bookmarks',
  imports: [RouterLink],
  templateUrl: './bookmarks.component.html',
  styleUrl: './bookmarks.component.css',
})
export class BookmarksComponent implements OnInit {
  private readonly usersService = inject(UsersService);

  posts: Post[] = [];
  isLoading = true;

  ngOnInit(): void {
    this.usersService.getBookmarks().subscribe({
      next: (res) => {
        const potentialPosts = res.data?.bookmarks ?? res.data?.posts ?? res.data ?? res.bookmarks ?? [];
        this.posts = Array.isArray(potentialPosts) ? potentialPosts : [];
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }
}
