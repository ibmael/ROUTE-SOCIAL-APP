import { Component, inject, Input, OnInit } from '@angular/core';
import { CommentsService } from './services/comments.service';
import { CommentInterface } from './interfaces/comment.interface';
import { UserService } from '../../../../../core/services/user.service';

@Component({
  selector: 'app-comment-post',
  imports: [],
  templateUrl: './comment-post.component.html',
  styleUrl: './comment-post.component.css',
})
export class CommentPostComponent implements OnInit {
  private readonly commentsService = inject(CommentsService);
  private readonly userService = inject(UserService);

  commentsList: CommentInterface[] = [];
  @Input() postId = '';
  @Input() userPhoto = '';
  @Input() userName = '';
  isSubmitting = false;
  currentUserId = '';

  ngOnInit(): void {
    this.currentUserId = this.userService.getCurrentUserId();
    if (this.postId) {
      this.getComments();
    }
  }

  getComments(): void {
    this.commentsService.getComments(this.postId).subscribe({
      next: (res) => {
        this.commentsList = res.data.comments;
      },
    });
  }

  createComment(content: string, textarea: HTMLTextAreaElement): void {
    const trimmedContent = content.trim();
    if (!this.postId || !trimmedContent || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    this.commentsService.createComment(this.postId, { content: trimmedContent }).subscribe({
      next: () => {
        textarea.value = '';
        this.isSubmitting = false;
        this.getComments();
      },
      error: () => {
        this.isSubmitting = false;
      },
    });
  }

  toggleCommentLike(comment: CommentInterface): void {
    this.commentsService.toggleCommentLike(this.postId, comment._id).subscribe({
      next: (res) => {
        const updated = res.data?.comment ?? res.data;
        if (updated) {
          comment.likes = updated.likes ?? comment.likes;
        }
      },
    });
  }

  deleteComment(commentId: string): void {
    this.commentsService.deleteComment(this.postId, commentId).subscribe({
      next: () => {
        this.commentsList = this.commentsList.filter((c) => c._id !== commentId);
      },
    });
  }

  isCommentLiked(comment: CommentInterface): boolean {
    return comment.likes?.some((like) => like === this.currentUserId || like?._id === this.currentUserId);
  }

  canDeleteComment(comment: CommentInterface): boolean {
    return comment.commentCreator._id === this.currentUserId;
  }
}
