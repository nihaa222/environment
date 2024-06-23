import { Button } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { initiativeJoined, initiativeJoinedRemoved } from "../redux/userSlice";

export const OneInitiative = () => {
  const [clicked, setClicked] = useState(false);
  const [join, setJoin] = useState(false);
  const [initiate, setInitiate] = useState(null);

  const { currentUser } = useSelector((state) => state.user);
  console.log(currentUser._id, initiate?.userId);
  const { postid } = useParams();
  console.log(postid);
  const { userid } = useParams();
  useEffect(() => {
    if (currentUser.joinedInitiativeId.includes(postid)) {
      setClicked(true);
    }
  }, []);

  // Initialize with null or an appropriate initial value

  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  // console.log(initiate?.userId, currentUser?._id);

  // console.log(initiate);
  const dispatch = useDispatch();

  const handleJoin = async () => {
    setClicked(true);
    try {
      const res = await fetch("/api/initiative/joining", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          initiative: initiate ? initiate : null,
          initiativeId: initiate?._id,
          creatorId: userid,
          userId: currentUser?._id, // Assuming currentUser contains user information
        }),
      });
      const data = await res.json();
      console.log(data);
      const joinedInitiate =
        data.updatedUser.joinedInitiativeId[
          data.updatedUser.joinedInitiativeId.length - 1
        ];
      console.log(joinedInitiate);
      dispatch(initiativeJoined(joinedInitiate));

      // Update join state to indicate user has joined
    } catch (error) {
      console.error("Error joining initiative:", error);
    }
  };
  // console.log(initiate?._userId);
  const handleNotJoin = async () => {
    setClicked(false);

    const res = await fetch("/api/initiative/notjoining", {
      method: "PUT",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        userId: currentUser?._id,
        initiativeId: initiate?._id,
      }),
    });
    dispatch(initiativeJoinedRemoved(initiate?._id));

    const data = await res.json();
    console.log(data);
    // Handle action when user decides not to join (optional)
  };

  useEffect(() => {
    const getInitiative = async () => {
      try {
        const res = await fetch(`/api/initiative/getainitiative/${postid}`);
        if (res.ok) {
          const data = await res.json();
          // console.log(
          //   "userfromdata",
          //   data.userId,
          //   "currentuser",
          //   currentUser?._id
          // );
          setInitiate(data);
        }
      } catch (error) {
        console.error("Error fetching initiative:", error);
      }
    };
    getInitiative();
  }, [postid]);

  useEffect(() => {
    if (initiate) {
      const checkUserJoin = async () => {
        try {
          const res = await fetch(
            `/api/initiative/joinornot/${initiate.userId}`
          );
          const data = await res.json();
          if (data.join === true) {
            setJoin(true); // Set join state based on server response
          }
        } catch (error) {
          console.error("Error checking user join status:", error);
        }
      };
      checkUserJoin();
    }
  }, [initiate]);

  useEffect(() => {
    if (initiate) {
      const startDate = new Date(initiate.startdate);
      const formattedStartDate = `${startDate.getDate()}/${
        startDate.getMonth() + 1
      }/${startDate.getFullYear()}`;

      const endDate = new Date(initiate.enddate);
      const formattedEndDate = `${endDate.getDate()}/${
        endDate.getMonth() + 1
      }/${endDate.getFullYear()}`;

      setStart(formattedStartDate);
      setEnd(formattedEndDate);
    }
  }, [initiate]);

  return (
    <>
      <div className="max-w-5xl mx-auto overflow-hidden flex justify-center mt-5 md:mt-10 p-10">
        <div className="grid max-w-4xl px-10 w-full grid-cols-1 justify-center">
          <div className="relative">
            <img
              src={initiate?.image}
              className="rounded-xl object-fit w-full h-60"
              alt="Initiative"
            />
            <div>
              <img
                src="/sideleaf3.png"
                className="absolute h-96 -top-4 -left-28"
                alt="Decoration"
              />
              <img
                src="/sideleaf3 (1).png"
                className="absolute h-96 -top-28 -right-28"
                alt="Decoration"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-5xl mx-auto flex justify-center">
        <div className="grid grid-cols-1 justify-center gap-y-5">
          <h1 className="font-semibold text-center text-2xl mt-5 whitespace-normal">
            {initiate?.projecttitle}
          </h1>
          <Button
            className="justify-self-center text-xs border-2 w-fit"
            color="success"
          >
            {initiate?.category}
          </Button>
          <p className="justify-self-center text-center whitespace-normal p-5">
            {initiate?.description}
          </p>
          <div className="flex justify-between px-5">
            <p>Start: {start}</p>
            <p>End: {end}</p>
          </div>
          <div className="px-5 mb-10">
            <p>Country: {initiate?.country}</p>
            <p>City: {initiate?.city}</p>
            <p>Locality: {initiate?.locality}</p>
          </div>
          {currentUser?._id !== initiate?.userId && currentUser ? (
            <Button
              size="xs"
              onClick={clicked ? handleNotJoin : handleJoin}
              className="w-fit justify-self-center  font-bold mt-5 mb-5 uppercase"
              gradientDuoTone="pinkToOrange"
            >
              {clicked ? "Joined" : "Click to Join"}
            </Button>
          ) : (
            ""
          )}
          {!currentUser && (
            <Button
              size="xs"
              className="w-fit justify-self-center -mt-5 font-bold uppercase"
              gradientDuoTone="pinkToOrange"
            >
              <Link to="/sign-in">Log In to Join</Link>
            </Button>
          )}
        </div>
      </div>
    </>
  );
};
