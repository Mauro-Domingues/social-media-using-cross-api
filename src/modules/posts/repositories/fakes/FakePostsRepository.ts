/* eslint-disable @typescript-eslint/no-explicit-any */
import IObjectDTO from '@dtos/IObjectDTO';
import IPostDTO from '@modules/posts/dtos/IPostDTO';
import Post from '@modules/posts/entities/Post';
import IPostsRepository from '@modules/posts/repositories/IPostsRepository';
import { v4 as uuid } from 'uuid';

export default class FakePostsRepository implements IPostsRepository {
  private posts: Post[] = [];

  public async findBy(
    postData: IObjectDTO | IObjectDTO[],
  ): Promise<Post | null> {
    let findPost: Post | undefined;
    if (postData && Array.isArray(postData)) {
      postData.forEach((data: IObjectDTO) => {
        Object.keys(data).forEach((key: string) => {
          findPost = this.posts.find(
            (post: any) => post[key] === data[key],
          );
        });
      });
    } else if (postData) {
      Object.keys(postData).forEach((key: string) => {
        findPost = this.posts.find(
          (post: any) => post[key] === postData[key],
        );
      });
    }

    if (!findPost) {
      return null;
    }
    return findPost;
  }

  public async findAll(
    page: number,
    limit: number,
    conditions?: IObjectDTO | IObjectDTO[],
  ): Promise<{ posts: Post[]; amount: number }> {
    const filterPosts: Post[] = [];
    if (conditions && Array.isArray(conditions)) {
      conditions.forEach((condition: IObjectDTO) => {
        Object.keys(condition).forEach((key: string) => {
          const applyFilter: Post[] = this.posts.filter(
            (post: any) => post[key] === condition[key],
          );

          applyFilter.forEach((post: Post) => filterPosts.push(post));
        });
      });
    } else if (conditions) {
      let applyFilter: Post[] = this.posts;
      Object.keys(conditions).forEach((key: string) => {
        applyFilter = applyFilter.filter(
          (post: any) => post[key] === conditions[key],
        );
      });

      applyFilter.forEach((post: Post) => filterPosts.push(post));
    } else {
      this.posts.forEach((post: Post) => filterPosts.push(post));
    }

    const filtredPosts = filterPosts.slice((page - 1) * limit, page * limit);

    return { posts: filtredPosts, amount: filterPosts.length };
  }

  public async create(postData: IPostDTO): Promise<Post> {
    const post: Post = new Post();

    Object.assign(post, { id: uuid() }, postData);
    this.posts.push(post);

    return post;
  }

  public async update(postData: Post): Promise<Post> {
    const findPost: number = this.posts.findIndex(
      post => post.id === postData.id,
    );

    this.posts[findPost] = postData;

    return postData;
  }

  public async delete(postData: Post | IObjectDTO): Promise<void> {
    if (postData instanceof Post) {
      const findPost: number = this.posts.findIndex(
        post => post.id === postData.id,
      );

      this.posts.splice(findPost, 1);
    } else {
      Object.keys(postData).forEach((key: string) => {
        const findPost: Post[] = this.posts.filter(
          (post: any) => post[key] === postData[key],
        );

        findPost.forEach(eachPost => {
          const postIndex: number = this.posts.findIndex(
            post => post.id === eachPost.id,
          );

          this.posts.splice(postIndex, 1);
        });
      });
    }
  }

  public async softDelete(postData: Post | IObjectDTO): Promise<void> {
    if (postData instanceof Post) {
      const findPost: number = this.posts.findIndex(
        (post: any) => post.id === postData.id,
      );

      this.posts[findPost].deleted_at = new Date();
    } else {
      Object.keys(postData).forEach((key: string) => {
        const findPost: Post[] = this.posts.filter(
          (post: any) => post[key] === postData[key],
        );

        findPost.forEach(eachPost => {
          const postIndex: number = this.posts.findIndex(
            post => post.id === eachPost.id,
          );

          this.posts[postIndex].deleted_at = new Date();
        });
      });
    }
  }
}
