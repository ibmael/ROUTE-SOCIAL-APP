import { Component, inject, OnInit } from '@angular/core';
import { PostsService } from '../../../../core/services/posts.service';
import { Post } from '../../../../core/models/post.interface';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommentPostComponent } from './comment-post/comment-post.component';

@Component({
  selector: 'app-feed-content',
  imports: [ReactiveFormsModule, CommentPostComponent],
  host: {
    class: 'col-span-1 md:col-span-2 lg:col-span-2 flex flex-col gap-4',
  },
  templateUrl: './feed-content.component.html',
  styleUrl: './feed-content.component.css',
})
export class FeedContentComponent implements OnInit {
  private readonly postsService = inject(PostsService);
  postsList: Post[] = [];
  selectedFile!: File;
  content: FormControl = new FormControl('');
  privacy: FormControl = new FormControl('public');
  userID: string = '';
  userName: string = '';
  userPhoto: string = '';
  imgUrl: string | ArrayBuffer | null | undefined;
  ngOnInit(): void {
    this.getPostsData();
    const user = JSON.parse(localStorage.getItem('userId')!);
    this.userID = user?._id;
    this.userName = user?.name ?? '';
    this.userPhoto = user?.photo ?? '';
  }

  getPostsData(): void {
    this.postsService.getPosts().subscribe({
      next: (res) => {
        console.log(res.data.posts);
        this.postsList = res.data.posts;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  onFileChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      console.log(target.files[0]);
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
    console.log(this.content.value);
    console.log(this.privacy.value);
    // selectedFile
    console.log(this.selectedFile);
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
      next: (res) => {
        console.log(res);
        this.getPostsData();
        postForm.reset();
        this.imgUrl = '';
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  deletePost(postId: string): void {
    this.postsService.deletePost(postId).subscribe({
      next: (res) => {
        console.log(res);
        if (res.data.success) {
          this.getPostsData();
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
