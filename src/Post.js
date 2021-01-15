import React from "react";
import "./Post.css";
import Avatar from "@material-ui/core/Avatar";

function Post({ username, caption, imageUrl }) {
  return (
    <div className="post">
      <div className="post__header">
        {/*header -> profile picture + username */}
        <Avatar
          className="post__avatar"
          alt="lucijabanek"
          src="/static/images/avatar/1.jpg"
        />
        <h3>{username}</h3>
      </div>
      {/*image */}
      <img className="post__image" src={imageUrl} alt="" />
      {/*username + caption */}
      <h4 className="post__text">
        <strong>{username}</strong> {caption}
      </h4>
    </div>
  );
}

export default Post;
