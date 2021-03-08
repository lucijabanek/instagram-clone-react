import React, { useState, useEffect } from "react";
import "./Post.css";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import { Button } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import DeleteIcon from "@material-ui/icons/Delete";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import InsertCommentOutlinedIcon from "@material-ui/icons/InsertCommentOutlined";
import { db } from "./firebase";
import firebase from "firebase";

const useStyles = makeStyles(() => ({
  DeleteIcon: {
    fontSize: "25px",
    display: "flex",
  },
  MoreVertIcon: {
    fontSize: "20px",
    display: "flex",
  },
  FavoriteBorderIcon: {
    fontSize: "30px",
    display: "flex",
    padding: "3px",
  },
  InsertCommentOutlinedIcon: {
    fontSize: "30px",
    display: "flex",
    padding: "3px",
  },
  DeleteIconComment: {
    fontSize: "18px",
    display: "flex",
    paddingTop: "2px",
  },
}));

function Post({ postId, user, username, caption, imageUrl }) {
  const classes = useStyles();
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const deletePost = (event) => {
    if (postId) {
      db.collection("posts").doc(postId).delete();
    }
  };

  useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()));
        });
    }
    //listener for specific post

    return () => {
      unsubscribe();
    };
  }, [postId]);

  const postComment = (event) => {
    event.preventDefault();

    db.collection("posts").doc(postId).collection("comments").add({
      text: comment,
      username: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setComment("");
  };

  return (
    <div className="post">
      <div className="post__header">
        {/*header -> profile picture + username */}
        <div className="post__username">
          <Avatar
            className="post__avatar"
            alt="avatar"
            src="/static/images/avatar/1.jpg"
          />
          <h3>{username}</h3>
        </div>
        {user.displayName === username ? (
          <DeleteIcon
            className={classes.DeleteIcon}
            onClick={deletePost}
          ></DeleteIcon>
        ) : null}
      </div>
      {/*image */}
      <img className="post__image" src={imageUrl} alt="" />
      {/*username + caption */}
      {user ? (
        <div className="post__likeComment">
          <FavoriteBorderIcon
            className={classes.FavoriteBorderIcon}
          ></FavoriteBorderIcon>
          <InsertCommentOutlinedIcon
            className={classes.InsertCommentOutlinedIcon}
          ></InsertCommentOutlinedIcon>
        </div>
      ) : null}
      <div className="post__caption">
        <h4 className="post__text">
          <strong>{username}</strong> {caption}
        </h4>
        {user.displayName === username ? (
          <MoreVertIcon className={classes.MoreVertIcon}></MoreVertIcon>
        ) : null}
      </div>

      {comments.map((comment) => (
        <div className="post__comments">
          <div className="post__userCaption">
            <strong>{comment.username}</strong> {comment.text}{" "}
          </div>
          {user.displayName === username ? (
            <div className="post__deleteComment">
              <DeleteIcon className={classes.DeleteIconComment}></DeleteIcon>
            </div>
          ) : null}
        </div>
      ))}

      {/*not logged in*/}
      {user && (
        <form className="post__commentBox">
          <input
            className="post__input"
            type="text"
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            disabled={!comment} //disable if there is no comment
            className="post__button"
            type="submit"
            onClick={postComment}
          >
            Post
          </button>
        </form>
      )}
    </div>
  );
}

export default Post;
