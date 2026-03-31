import { Component, inject, OnInit } from '@angular/core';
import { PostsService } from '../../../../core/services/posts.service';
import { Post } from '../../../../core/models/post.interface';
import { NgClass } from '../../../../../../node_modules/@angular/common/common_module.d';

@Component({
  selector: 'app-feed-content',
  imports: [NgClass],
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
  userID: string = '';
  imgUrl: string | ArrayBuffer | null | undefined;
  ngOnInit(): void {
    this.getPostsData();
    this.userID = JSON.parse(localStorage.getItem('userId')!)?._id;
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
}
