import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { User } from '../../core/models/post.interface';
import { PostsService } from '../../core/services/posts.service';
import { Post } from '../../core/models/post.interface';
import { CommentPostComponent } from '../feed/components/feed-content/comment-post/comment-post.component';
import { UserService } from '../../core/services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-detailes',
  imports: [RouterLink, CommentPostComponent],
  templateUrl: './detailes.component.html',
  styleUrl: './detailes.component.css',
})
export class DetailesComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly postsService = inject(PostsService);
  private readonly userService = inject(UserService);
  private readonly toastr = inject(ToastrService);

  post: Post | null = null;
  postId = '';
  userPhoto = '';
  userName = '';
  isLoading = true;

  showLikesModal = false;
  likesList: User[] = [];
  isLoadingLikes = false;

  ngOnInit(): void {
    const user = this.userService.getCurrentUser();
    this.userPhoto = user?.photo ?? '/assets/user-icon.svg';
    this.userName = user?.name ?? '';

    this.activatedRoute.paramMap.subscribe((params) => {
      this.postId = params.get('id') ?? '';
      if (this.postId) {
        this.loadPost();
      }
    });
  }

  loadPost(): void {
    this.isLoading = true;
    this.postsService.getSinglePostById(this.postId).subscribe({
      next: (res) => {
        this.post = res.data?.post ?? res.data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  toggleLike(): void {
    if (!this.post) return;
    this.postsService.toggleLike(this.post._id).subscribe({
      next: (res) => {
        const updated = res.data?.post ?? res.data;
        if (updated && this.post) {
          this.post.likesCount = updated.likesCount;
          this.post.likes = updated.likes;
        }
      },
    });
  }

  isLiked(): boolean {
    const userId = this.userService.getCurrentUserId();
    return this.post?.likes?.includes(userId) ?? false;
  }

  toggleBookmark(): void {
    if (!this.post) return;
    this.postsService.toggleBookmark(this.post._id).subscribe({
      next: (res) => {
        const updated = res.data?.post ?? res.data;
        if (updated && this.post) {
          this.post.bookmarked = updated.bookmarked ?? !this.post.bookmarked;
        } else if (this.post) {
          this.post.bookmarked = !this.post.bookmarked;
        }
        if (this.post?.bookmarked) {
          this.toastr.success('Post saved to bookmarks');
        } else {
          this.toastr.info('Post removed from bookmarks');
        }
      },
    });
  }

  openLikesModal(): void {
    if (!this.postId) return;
    this.showLikesModal = true;
    this.isLoadingLikes = true;
    this.postsService.getPostLikes(this.postId).subscribe({
      next: (res) => {
        this.likesList = res.data?.users ?? res.data?.likes ?? res.data ?? [];
        this.isLoadingLikes = false;
      },
      error: () => {
        this.isLoadingLikes = false;
      }
    });
  }

  closeLikesModal(): void {
    this.showLikesModal = false;
    this.likesList = [];
  }
}
