import React, { useEffect, useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import Image from "next/image";

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
    setLoading(true);
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
        setLoading(false);
      })
      .catch((error) => {
        alert(error.message);
        setLoading(false);
      });
  }

  function getData() {
    setUserDataIsLoading(true);
    db.collection("users")
      .get()
      .then((querySnapshot) => {
        const dataArray = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          dataArray.push(data);
        });
        setUsers(dataArray);
        setUserDataIsLoading(false);
      })
      .catch((error) => {
        console.error("Error getting document:", error);
        setUserDataIsLoading(false);
      });
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <div>
        <h3>
          {" "}
          <span className="font-color">Note</span>: Created with Next.js API,
          Firestore DB, and the Vonage SMS Service, it sends SMS messages to
          only one specific number that I have registered due to using a
          free-tier account.
        </h3>
      </div>
      <div className="flex">
        <table>
          <thead>
            <tr>
              <td
                style={{
                  textAlign: "center",
                  minWidth: "50px",
                  border: "1px solid",
                }}
              >
                Sr.
              </td>
              <td
                style={{
                  textAlign: "center",
                  minWidth: "150px",
                  border: "1px solid",
                }}
              >
                User Name
              </td>
              <td
                style={{
                  textAlign: "center",
                  minWidth: "150px",
                  border: "1px solid",
                }}
              >
                Mobile
              </td>
            </tr>
          </thead>

          <tbody>
            {userDataIsLoading
              ? "User data is loading..."
              : users.map((user, index) => (
                  <tr key={index}>
                    <td style={{ border: "1px solid" }}>{index + 1}</td>
                    <td style={{ border: "1px solid" }}>{user.username}</td>
                    <td style={{ border: "1px solid" }}>{user.mobile}</td>
                  </tr>
                ))}
          </tbody>
        </table>

        <div className="image-container">
          <h4 className="h4-color">SMS received screenshot</h4>
          <Image
            src={"/sms-screenshort.jpeg"}
            width={250}
            height={500}
            alt="sms screenshort"
          />
        </div>
      </div>
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
        {loading ? "Loading..." : "Send Message to All Users"}
      </button>
    </>
  );
}
