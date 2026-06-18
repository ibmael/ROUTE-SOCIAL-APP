import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { UsersService } from '../../core/services/users.service';
import { UserService } from '../../core/services/user.service';
import { User, Post } from '../../core/models/post.interface';
import { ToastrService } from 'ngx-toastr';
import { PostsService } from '../../core/services/posts.service';

@Component({
  selector: 'app-profile',
  imports: [RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  private readonly usersService = inject(UsersService);
  private readonly userService = inject(UserService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly toastr = inject(ToastrService);
  private readonly postsService = inject(PostsService);

  profile: User | null = null;
  posts: Post[] = [];
  stats = { posts: 0, followers: 0, following: 0 };
  isLoading = true;
  isOwnProfile = true;
  isFollowing = false;
  profileUserId = '';

  showUserListModal = false;
  userListTitle = '';
  usersList: User[] = [];
  isLoadingUsers = false;

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      const paramId = params.get('userId');
      const currentId = this.userService.getCurrentUserId();
      this.profileUserId = paramId ?? currentId;
      this.isOwnProfile = !paramId || paramId === currentId;
      this.loadProfile();
    });
  }

  loadProfile(): void {
    this.isLoading = true;
    const profileRequest = this.isOwnProfile
      ? this.usersService.getProfileData()
      : this.usersService.getUserProfile(this.profileUserId);

    profileRequest.subscribe({
      next: (res) => {
        const data = res.data;
        this.profile = data.user ?? data;
        this.stats = {
          posts: data.postsCount ?? data.posts?.length ?? 0,
          followers: data.followersCount ?? 0,
          following: data.followingCount ?? 0,
        };
        this.isFollowing = data.isFollowing ?? false;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });

    this.usersService.getUserPosts(this.profileUserId).subscribe({
      next: (res) => {
        this.posts = res.data?.posts ?? res.data ?? [];
        this.stats.posts = this.posts.length;
      },
    });
  }

  onPhotoSelected(event: Event): void {
    if (!this.isOwnProfile) return;
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.usersService.uploadPhoto(file).subscribe({
      next: (res) => {
        const photo = res.data?.user?.photo ?? res.data?.photo;
        if (photo && this.profile) {
          this.profile.photo = photo;
          const current = this.userService.getCurrentUser();
          if (current) {
            this.userService.setCurrentUser({ ...current, photo });
          }
        }
        this.toastr.success('Profile photo updated');
      },
    });
  }

  onCoverSelected(event: Event): void {
    if (!this.isOwnProfile) return;
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      if (this.profile && e.target?.result) {
        this.profile.coverPhoto = e.target.result as string;
        // Optionally save to backend if there is an endpoint
        this.toastr.success('Cover photo updated locally');
      }
    };
    reader.readAsDataURL(file);
  }

  followUser(): void {
    if (this.isOwnProfile || !this.profileUserId) return;
    this.usersService.followUser(this.profileUserId).subscribe({
      next: () => {
        this.isFollowing = true;
        this.stats.followers += 1;
        this.toastr.success('You are now following this user');
      },
    });
  }

  openFollowersList(): void {
    if (!this.profileUserId) return;
    this.showUserListModal = true;
    this.userListTitle = 'Followers';
    this.isLoadingUsers = true;
    this.usersService.getFollowers(this.profileUserId).subscribe({
      next: (res) => {
        this.usersList = res.data?.users ?? res.data ?? [];
        this.isLoadingUsers = false;
      },
      error: () => {
        this.isLoadingUsers = false;
      }
    });
  }

  openFollowingList(): void {
    if (!this.profileUserId) return;
    this.showUserListModal = true;
    this.userListTitle = 'Following';
    this.isLoadingUsers = true;
    this.usersService.getFollowing(this.profileUserId).subscribe({
      next: (res) => {
        this.usersList = res.data?.users ?? res.data ?? [];
        this.isLoadingUsers = false;
      },
      error: () => {
        this.isLoadingUsers = false;
      }
    });
  }

  closeUserListModal(): void {
    this.showUserListModal = false;
    this.usersList = [];
  }

  deletePost(postId: string): void {
    if (!confirm('Are you sure you want to delete this post?')) return;
    this.postsService.deletePost(postId).subscribe({
      next: () => {
        this.posts = this.posts.filter((p) => p._id !== postId);
        this.stats.posts = this.posts.length;
        this.toastr.success('Post deleted successfully');
      },
      error: () => {
        this.toastr.error('Failed to delete post');
      }
    });
  }
}
