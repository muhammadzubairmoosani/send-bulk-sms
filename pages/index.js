import React, { useEffect, useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

firebase.initializeApp({
  apiKey: "AIzaSyCbX9eN4VLOeic75Tag_F67i6-rH2Px8d4",
  authDomain: "project01-d1257.firebaseapp.com",
  projectId: "project01-d1257",
});


export default function Home() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userDataIsLoading, setUserDataIsLoading] = useState(false);

  const db = firebase.firestore();

  function postData() {
    setLoading(true)
    const data = users.map((user) => user.mobile);
    fetch("/api/send-bulk-message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((result) => {
        alert(result.message);
        setLoading(false)
      })
      .catch((error) => {
        alert(error.message);
        setLoading(false)
      });
  }

  function getData() {
    setUserDataIsLoading(true)
    db.collection("users")
      .get()
      .then((querySnapshot) => {
        const dataArray = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          dataArray.push(data);
        });
        setUsers(dataArray);
        setUserDataIsLoading(false)
      })
      .catch((error) => {
        console.error("Error getting document:", error);
        setUserDataIsLoading(false)
      });
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
    <div>
      <h3> <span style={{color: 'red'}}>Note</span>: Created with Next.js API, Firestore DB, and Vonage SMS Service, it's send sms only one number which i have been registered, because using free-tier account.</h3>
    </div>
      <table>
        <thead>
          <tr>
            <td style={{ textAlign: "center", minWidth: "50px" }}>Sr.</td>
            <td style={{ textAlign: "center", minWidth: "150px" }}>
              User Name
            </td>
            <td style={{ textAlign: "center", minWidth: "150px" }}>Mobile</td>
          </tr>
        </thead>

        <tbody>
          {userDataIsLoading ? 'User data is loading...' : users.map((user, index) => (
            <tr key={index}>
              <td style={{ border: "1px solid" }}>{index + 1}</td>
              <td style={{ border: "1px solid" }}>{user.username}</td>
              <td style={{ border: "1px solid" }}>{user.mobile}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <br />
      <br />
      <br />
      <button
        onClick={postData}
        disabled={!users.length}
        style={{
          padding: "1rem",
          borderRadius: "10px",
          cursor: "pointer",
          background: "lightGreen",
        }}
      >
        {loading ? 'Loading...' : 'Send Message to All Users'}
      </button>
    </>
  );
}
