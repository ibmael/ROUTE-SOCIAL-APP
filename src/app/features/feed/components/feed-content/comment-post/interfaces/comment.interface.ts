export interface CommentInterface {
  _id: string;
  content: string;
  commentCreator: CommentCreator;
  post: string;
  parentComment: any;
  likes: any[];
  createdAt: string;
  repliesCount: number;
  image: string;
}

export interface CommentCreator {
  _id: string;
  name: string;
  username: string;
  photo: string;
}
