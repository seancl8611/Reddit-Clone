/*
 * Author: Sean Clarke
 * Description: This project is a simplified version of Reddit, allowing users to subscribe to subreddits, submit posts, upvote posts, 
 * comment on posts, and view their profile with subscribed subreddits and upvotes received.
 */

import React, { useState } from 'react';
import './index.css';

// Example data 
const initialPosts = [
  { 
    postId: 1, 
    title: 'First Post', 
    content: 'Content of the first post.', 
    upvotes: 0, 
    comments: [], 
    upvotedBy: []
  },
  { 
    postId: 2, 
    title: 'Second Post', 
    content: 'Content of the second post.', 
    upvotes: 0, 
    comments: [], 
    upvotedBy: []
  }
];

const initialUser = {
  userId: 1,
  username: 'example_user',
  subscribedSubreddits: ['r/reactjs', 'r/javascript'],
  upvotesReceived: [],
  posts: []
};

const App = () => {
  const [posts, setPosts] = useState(initialPosts);
  const [user, setUser] = useState(initialUser);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [postComments, setPostComments] = useState(posts.map(() => ''));

  // Handle upvoting or removing upvote from a post
  const handleUpvote = (postId) => {
    const postIndex = posts.findIndex(post => post.postId === postId);
    const isUpvoted = posts[postIndex].upvotedBy.includes(user.userId);
    const isOwnPost = user.posts.some(post => post.postId === postId);

    if (isUpvoted) {
      // Remove upvote
      const updatedUpvotedBy = posts[postIndex].upvotedBy.filter(id => id !== user.userId);
      const updatedPosts = [...posts];
      updatedPosts[postIndex] = { ...updatedPosts[postIndex], upvotes: updatedPosts[postIndex].upvotes - 1, upvotedBy: updatedUpvotedBy };
      setPosts(updatedPosts);

      // Remove from user's upvotesReceived only if it's their own post
      if (isOwnPost) {
        const updatedUpvotesReceived = user.upvotesReceived.filter(upvote => upvote.postId !== postId);
        setUser({ ...user, upvotesReceived: updatedUpvotesReceived });
      }
    } else {
      // Add upvote
      const updatedPosts = [...posts];
      updatedPosts[postIndex] = { ...updatedPosts[postIndex], upvotes: updatedPosts[postIndex].upvotes + 1, upvotedBy: [...updatedPosts[postIndex].upvotedBy, user.userId] };
      setPosts(updatedPosts);

      // Add to user's upvotesReceived only if it's their own post and not already upvoted
      if (isOwnPost && !user.upvotesReceived.some(upvote => upvote.postId === postId)) {
        const upvotedPost = { postId, title: updatedPosts[postIndex].title, upvotes: updatedPosts[postIndex].upvotes };
        setUser({ ...user, upvotesReceived: [...user.upvotesReceived, upvotedPost] });
      }
    }
  };

  // Handle commenting on a specific post
  const handleComment = (postId, comment) => {
    const postIndex = posts.findIndex(post => post.postId === postId);
    const updatedPosts = [...posts];
    updatedPosts[postIndex] = { ...updatedPosts[postIndex], comments: [...updatedPosts[postIndex].comments, { userId: user.userId, comment }] };
    setPosts(updatedPosts);

    // Clear the comment input for the specific post
    const updatedPostComments = [...postComments];
    updatedPostComments[postIndex] = '';
    setPostComments(updatedPostComments);
  };

  // Handle submitting a new post
  const handleSubmitPost = () => {
    if (newPostTitle && newPostContent) {
      const newPost = {
        postId: posts.length + 1,
        title: newPostTitle,
        content: newPostContent,
        upvotes: 0,
        comments: [],
        upvotedBy: []
      };

      setUser({
        ...user,
        posts: [...user.posts, newPost]
      });

      setPosts([...posts, newPost]);

      // Clear input fields after submission
      setNewPostTitle('');
      setNewPostContent('');
    }
  };

  // Handle subscribing to a subreddit
  const handleSubscribe = (subreddit) => {
    if (!user.subscribedSubreddits.includes(subreddit)) {
      setUser({
        ...user,
        subscribedSubreddits: [...user.subscribedSubreddits, subreddit]
      });
    }
  };

  // Handle unsubscribing from a subreddit
  const handleUnsubscribe = (subreddit) => {
    const updatedSubscribedSubreddits = user.subscribedSubreddits.filter(sub => sub !== subreddit);
    setUser({
      ...user,
      subscribedSubreddits: updatedSubscribedSubreddits
    });
  };

  return (
    <div className="App">
      <h1>Subreddit Timeline</h1>

      {/* Subscribe to Subreddit */}
      <div className="subreddit-subscribe">
        <h2>Subscribe to Subreddit:</h2>
        <button onClick={() => handleSubscribe('r/javascript')}>Subscribe to r/javascript</button>
        <button onClick={() => handleSubscribe('r/reactjs')}>Subscribe to r/reactjs</button>
      </div>

      {/* Submit Post Form */}
      <div className="submit-post">
        <h2>Submit a Post:</h2>
        <input
          type="text"
          placeholder="Enter post title"
          value={newPostTitle}
          onChange={(e) => setNewPostTitle(e.target.value)}
        />
        <textarea
          placeholder="Enter post content"
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
        />
        <button onClick={handleSubmitPost}>Submit Post</button>
      </div>

      {/* Subreddit Timeline */}
      <div className="subreddit-timeline">
        {posts.map((post, index) => (
          <div key={post.postId} className="post">
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            <button onClick={() => handleUpvote(post.postId)}>
              {post.upvotedBy.includes(user.userId) ? 'Remove Upvote' : 'Upvote'}
            </button>
            <p>Upvotes: {post.upvotes}</p>
            <div>
              <input
                type="text"
                placeholder="Add a comment"
                value={postComments[index]}
                onChange={(e) => {
                  const updatedPostComments = [...postComments];
                  updatedPostComments[index] = e.target.value;
                  setPostComments(updatedPostComments);
                }}
              />
              <button className="comment-button" onClick={() => handleComment(post.postId, postComments[index])}>Comment</button>
            </div>
            <ul>
              {post.comments.map((comment, idx) => (
                <li key={idx}>
                  <strong>User: </strong>
                  {comment.comment}
                </li>
              ))}
            </ul>
            <hr />
          </div>
        ))}
      </div>

      {/* User Profile */}
      <div className="user-profile">
        <h2>User Profile - {user.username}</h2>
        <h3>Subscribed Subreddits:</h3>
        <ul>
          {user.subscribedSubreddits.map(sub => (
            <li key={sub}>
              {sub}
              <button onClick={() => handleUnsubscribe(sub)}>Unsubscribe</button>
            </li>
          ))}
        </ul>
        <h3>Upvotes Received:</h3>
        <ul>
          {user.upvotesReceived.map(upvote => (
            <li key={upvote.postId}>
              {upvote.title}: Upvotes: {upvote.upvotes}
            </li>
          ))}
        </ul>
        <h3>Posts Submitted:</h3>
        <ul>
          {user.posts.map(post => (
            <li key={post.postId}>{post.title}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
