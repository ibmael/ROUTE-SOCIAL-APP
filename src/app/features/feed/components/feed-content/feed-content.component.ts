import { Component, inject, OnInit } from '@angular/core';
import { PostsService } from '../../../../core/services/posts.service';
import { Post, User } from '../../../../core/models/post.interface';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommentPostComponent } from './comment-post/comment-post.component';
import { RouterLink } from '@angular/router';
import { UserService } from '../../../../core/services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-feed-content',
  imports: [ReactiveFormsModule, CommentPostComponent, RouterLink],
  host: {
    class: 'col-span-1 md:col-span-2 lg:col-span-2 flex flex-col gap-4',
  },
  templateUrl: './feed-content.component.html',
  styleUrl: './feed-content.component.css',
})
export class FeedContentComponent implements OnInit {
  private readonly postsService = inject(PostsService);
  private readonly userService = inject(UserService);
  private readonly toastr = inject(ToastrService);

  postsList: Post[] = [];
  selectedFile!: File;
  content: FormControl = new FormControl('');
  privacy: FormControl = new FormControl('public');
  userID = '';
  userName = '';
  userPhoto = '';
  imgUrl: string | ArrayBuffer | null | undefined;
  expandedComments = new Set<string>();

  showLikesModal = false;
  likesList: User[] = [];
  isLoadingLikes = false;

  ngOnInit(): void {
    this.getPostsData();
    const user = this.userService.getCurrentUser();
    this.userID = user?._id ?? '';
    this.userName = user?.name ?? '';
    this.userPhoto = user?.photo ?? '/assets/user-icon.svg';
  }

  getPostsData(): void {
    this.postsService.getPosts().subscribe({
      next: (res) => {
        this.postsList = res.data.posts;
      },
    });
  }

  onFileChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.selectedFile = target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(this.selectedFile);
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.imgUrl = e.target?.result;
      };
    }
  }

  submitForm(e: Event, postForm: HTMLFormElement): void {
    e.preventDefault();
    if (!this.content.value?.trim() && !this.selectedFile) {
      return;
    }

    const formData = new FormData();
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }
    if (this.content.value) {
      formData.append('body', this.content.value);
    }
    if (this.privacy.value) {
      formData.append('privacy', this.privacy.value);
    }

    this.postsService.createPostRequest(formData).subscribe({
      next: () => {
        this.getPostsData();
        postForm.reset();
        this.content.reset('');
        this.privacy.reset('public');
        this.imgUrl = '';
        this.selectedFile = undefined!;
      },
    });
  }

  deletePost(postId: string): void {
    this.postsService.deletePost(postId).subscribe({
      next: (res) => {
        if (res.data?.success ?? res.success) {
          this.getPostsData();
        }
      },
    });
  }

  toggleLike(post: Post): void {
    this.postsService.toggleLike(post._id).subscribe({
      next: (res) => {
        const updated = res.data?.post ?? res.data;
        if (updated) {
          post.likesCount = updated.likesCount ?? post.likesCount;
          post.likes = updated.likes ?? post.likes;
        }
      },
    });
  }

  isLiked(post: Post): boolean {
    return post.likes?.includes(this.userID);
  }

  toggleComments(postId: string): void {
    if (this.expandedComments.has(postId)) {
      this.expandedComments.delete(postId);
    } else {
      this.expandedComments.add(postId);
    }
  }

  showComments(postId: string): boolean {
    return this.expandedComments.has(postId);
  }

  sharePost(post: Post): void {
    this.postsService.sharePost(post._id).subscribe({
      next: () => {
        post.sharesCount = (post.sharesCount ?? 0) + 1;
      },
    });
  }

  toggleBookmark(post: Post): void {
    this.postsService.toggleBookmark(post._id).subscribe({
      next: (res) => {
        const updated = res.data?.post ?? res.data;
        if (updated) {
          post.bookmarked = updated.bookmarked ?? !post.bookmarked;
        } else {
          post.bookmarked = !post.bookmarked;
        }
        if (post.bookmarked) {
          this.toastr.success('Post saved to bookmarks');
        } else {
          this.toastr.info('Post removed from bookmarks');
        }
      },
    });
  }

  openLikesModal(postId: string): void {
    this.showLikesModal = true;
    this.isLoadingLikes = true;
    this.postsService.getPostLikes(postId).subscribe({
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
