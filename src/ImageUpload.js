import { Button } from "@material-ui/core";
import React, { useState } from "react";
import { storage, db } from "./firebase";
import firebase from "firebase";
import "./ImageUpload.css";

function ImageUpload({ username }) {
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [caption, setCaption] = useState("");

  const handleChange = (e) => {
    if (e.target.files[0]) {
      //get the first file that you selected
      setImage(e.target.files[0]); //set your image in state to that
    }
  };

  const handleUpload = () => {
    //access the storage in firebase and get the reference to photo and store everything inside of it
    //image name is file name we selected
    //.put(image) putting the image that we grabbed into that point
    const uploadTask = storage.ref(`images/${image.name}`).put(image);

    uploadTask.on(
      //on state change give snapshot, asynchronous process , it doesn't happend immediately
      //so we want to keep track of it tso that we can tell user how long is it gonna take
      "state_changed",
      (snapshot) => {
        //progress function
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      //if anything went wrong during upload
      (error) => {
        //Error function
        console.log(error);
        alert(error.message);
      },
      //when the upload completes
      () => {
        //complete function
        storage
          .ref("images")
          .child(image.name)
          .getDownloadURL() //go to the image name child and get the download URL
          .then((url) => {
            //post the image inside of the database
            db.collection("posts").add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              //timestamp is based on the server where our code is living
              //timestamp is gonna allow us to sort all the posts by the correct timings
              caption: caption,
              imageUrl: url,
              username: username,
            });

            setProgress(0);
            setCaption("");
            setImage(null);
          });
      }
    );
  };

  return (
    <div className="imageUpload">
      <progress className="imageUpload__progress" value={progress} max="100" />
      <input
        type="text"
        placeholder="Enter a caption..."
        onChange={(event) => setCaption(event.target.value)}
        value={caption}
      />
      <input type="file" onChange={handleChange} />
      <Button onClick={handleUpload}>Upload</Button>
    </div>
  );
}

export default ImageUpload;
