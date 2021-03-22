import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { Button, Input } from "@material-ui/core";
import PublishIcon from "@material-ui/icons/Publish";
import InstagramEmbed from "react-instagram-embed";

import "./App.css";
import Post from "./Post";
import { db, auth } from "./firebase";
import ImageUpload from "./ImageUpload";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  PublishIcon: {
    display: "flex",
    margin: "auto",
    fontSize: "50px",
    color: "#6082a3",
    "&:hover": { backgroundColor: "transparent", color: "black" },
    cursor: "pointer",
  },
  paper: {
    display: "flex",
    position: "absolute",
    justifyContent: "center",
    width: "300px",
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    margin: "auto",
  },
  Modal: {
    display: "flex",
    justifyContent: "center",
    height: "18%",
    margin: "auto",
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);

  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [OpenSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [openImageUpload, setOpenImageUpload] = useState(false);
  const clientAccessToken = `${process.env.REACT_APP_ID}|${process.env.REACT_APP_CLIENT_TOKEN}`;

  useEffect(() => {
    const unsubcribe = auth.onAuthStateChanged((authUser) => {
      console.log("IN USE EFFECT USER");
      //this keeps us logged in
      if (authUser) {
        //user has logged in
        console.log("AUTHUSER", authUser);
        setUser(authUser);
      } else {
        //user has logged out
        setUser(null);
      }
    });
    return unsubcribe; //once if the user fact fires again, perform some cleanup actions before, we're unsubcribing the listener
    //so it doesn't spam and it doesn't start
  }, [user, username]); //we using user and username, so we have to include their dependencies here
  //because everytime they change,they have to be fired off, every time we use a variable

  useEffect(() => {
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }))
        );
      });
  }, []);

  const signUp = (event) => {
    event.preventDefault();

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((error) => alert(error.message));

    setOpen(false);
  };

  const signIn = (event) => {
    event.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));

    setOpenSignIn(false);
  };

  const closeImageUpload = () => {
    setOpenImageUpload(false);
  };

  return (
    <div className="app">
      <Modal
        open={open}
        onClose={() => setOpen(false)} //inline function,  every time we click outside of
        //the modal, it's gonna set the state of the model to be false and closes
        //onClose is listening for any clicks outside of the modal
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img
                className="app__headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""
              />
            </center>
            <Input
              placeholder="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signUp}>
              Sign Up
            </Button>
          </form>
        </div>
      </Modal>

      <Modal
        open={OpenSignIn}
        onClose={() => setOpenSignIn(false)} //inline function,  every time we click outside of
        //the modal, it's gonna set the state of the model to be false and closes
        //onClose is listening for any clicks outside of the modal
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img
                className="app__headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""
              />
            </center>
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signIn}>
              Sign In
            </Button>
          </form>
        </div>
      </Modal>

      <div className="app__header">
        <img
          className="app__headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt=""
        />

        {user ? (
          <Button onClick={() => auth.signOut()}>Log out</Button>
        ) : (
          <div className="app__loginContainer">
            <Button onClick={() => setOpenSignIn(true)}>Sign in</Button>
            <Button onClick={() => setOpen(true)}>Sign up</Button>
          </div>
        )}
      </div>

      <div className="app__posts">
        <div className="app__postsLeft">
          {" "}
          {/*child*/}
          {posts.map(({ id, post }) => (
            <Post
              key={id}
              postId={id}
              user={user}
              username={post.username}
              caption={post.caption}
              imageUrl={post.imageUrl}
            />
          ))}
        </div>
        <div className="app__postsRight">
          {" "}
          {/*child*/}
          <InstagramEmbed
            url="https://www.instagram.com/p/CIOklFyJ8gn/"
            clientAccessToken={clientAccessToken}
            maxWidth={320}
            hideCaption={false}
            containerTagName="div"
            protocol=""
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          />
          <InstagramEmbed
            url="https://www.instagram.com/p/CIOklFyJ8gn/"
            clientAccessToken={clientAccessToken}
            maxWidth={320}
            hideCaption={false}
            containerTagName="div"
            protocol=""
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          />
          <InstagramEmbed
            url="https://www.instagram.com/p/CIOklFyJ8gn/"
            clientAccessToken={clientAccessToken}
            maxWidth={320}
            hideCaption={false}
            containerTagName="div"
            protocol=""
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          />
        </div>
      </div>

      {user ? (
        <div className="app__footer">
          <PublishIcon
            className={classes.PublishIcon}
            onClick={() => setOpenImageUpload(true)}
          ></PublishIcon>
          {openImageUpload ? (
            <Modal
              className={classes.Modal}
              open={openImageUpload}
              onClose={() => setOpenImageUpload(false)}
            >
              <ImageUpload
                username={user.displayName}
                close={closeImageUpload}
              />
            </Modal>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export default App;
