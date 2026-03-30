import { Component, inject, OnInit } from '@angular/core';
import { PostsService } from '../../../../core/services/posts.service';

@Component({
  selector: 'app-feed-content',
  imports: [],
  host: {
    class: 'col-span-1 md:col-span-2 lg:col-span-2 flex flex-col gap-4',
  },
  templateUrl: './feed-content.component.html',
  styleUrl: './feed-content.component.css',
})
export class FeedContentComponent implements OnInit {
  private readonly postsService = inject(PostsService);
  ngOnInit(): void {
    this.getPostsData();
  }

  getPostsData(): void {
    this.postsService.getPosts().subscribe({
      next: (res) => {
        console.log(res.data.posts);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
