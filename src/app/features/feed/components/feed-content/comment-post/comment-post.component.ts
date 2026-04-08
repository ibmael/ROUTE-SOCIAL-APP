import { Component, inject, Input, OnInit } from '@angular/core';
import { CommentsService } from './services/comments.service';
import { CommentInterface } from './interfaces/comment.interface';

@Component({
  selector: 'app-comment-post',
  imports: [],
  templateUrl: './comment-post.component.html',
  styleUrl: './comment-post.component.css',
})
export class CommentPostComponent implements OnInit {
  private readonly commentsService = inject(CommentsService);
  commentsList: CommentInterface[] = [];
  @Input() postId: string = '';
  ngOnInit(): void {
    if (this.postId) {
      this.getComments();
    }
  }
  getComments(): void {
    this.commentsService.getComments(this.postId).subscribe({
      next: (res) => {
        console.log(res);
        this.commentsList = res.data.comments;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
