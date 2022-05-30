import React from 'react';

interface Post {
  userId: number;
  id: number;
  title: string;
  body: String;
}

interface PostsProps {
  posts: Post[]
}

const Posts = (props: PostsProps) => {
  const { posts } = props;
  return posts.map((post :Post, index: number) => {
    return (
      <div className="card" key={index}>
        <div className="card-body">
          <h5 className="card-title">{post.title}</h5>
          <p className="card-text">{post.body}</p>
        </div>
      </div>
    )
  })
}

export default Posts;