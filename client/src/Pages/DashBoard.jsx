import { Button } from "flowbite-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  IoIosArrowDropleftCircle,
  IoIosArrowDroprightCircle,
} from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { deleteInitiative } from "../redux/userSlice";
import Pagination from "../components/Pagination";

function DashBoard() {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);

  const [joinedInitiative, setJoinedInitiative] = useState([]);
  console.log(joinedInitiative);
  const [initiative, setInitiative] = useState([]);
  console.log(initiative);

  const [peopleJoined, setPeopleJoined] = useState([]);
  const handleDeleteJoin = async () => {
    try {
      const response = await fetch(
        `/api/initiative/deletejoin/${currentUser._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error deleting joined initiatives:", error);
    }
  };

  const handleInitiativeDelete = async (id, e) => {
    e.preventDefault();
    try {
      // Delete the initiative on the server
      const res = await fetch(`/api/initiative/flowerInitiative`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser._id, initiativeId: id }),
      });

      if (!res.ok) {
        throw new Error("Failed to delete initiative");
      }

      const data = await res.json();

      // Dispatch the delete action to update Redux state
      dispatch(deleteInitiative(data.initiativeId));

      const filteredInitiatives = initiative.filter((item) => item._id !== id);
      setInitiative(filteredInitiatives);

      console.log("Initiative deleted successfully:", data);
    } catch (error) {
      console.error("Error deleting initiative:", error);
    }
  };

  useEffect(() => {
    const fetchInitiatives = async () => {
      try {
        const initiativePromise = currentUser.initiatives.map(async (id) => {
          const res = await fetch(`/api/initiative/getainitiative/${id}`);

          return res.json();
        });
        const initiaitvedata = await Promise.all(initiativePromise);
        setInitiative(initiaitvedata);
      } catch (err) {
        console.error("error fetching");
      }
    };
    fetchInitiatives();
  }, []);

  useEffect(() => {
    const fetchJoinedInitiatives = async () => {
      try {
        // Use Promise.all to wait for all fetch requests to complete
        const initiativesPromises = currentUser.joinedInitiativeId.map(
          async (id) => {
            const res = await fetch(`/api/initiative/getainitiative/${id}`);
            return res.json(); // Return the parsed JSON data
          }
        );

        // Resolve all promises
        const joinedinitiativesData = await Promise.all(initiativesPromises);
        console.log(joinedinitiativesData);
        // Update state with all fetched data
        setJoinedInitiative(joinedinitiativesData);
      } catch (err) {
        console.error("Error fetching initiatives:", err);
      }
    };

    fetchJoinedInitiatives();
  }, [currentUser.joinedInitiativeId]); // Ensure useEffect runs when joinedInitiativeId changes

  const message = `Save
the
Earth`;

  useEffect(() => {
    const initSlider = () => {
      const sliderButtons = document.querySelectorAll(".slide-button");
      const imageList = document.querySelector(".image-list");
      const itemWidth = 32;
      const maxScrollLeft = imageList.scrollWidth - imageList.clientWidth;

      sliderButtons.forEach((button) => {
        button.addEventListener("click", () => {
          const direction = button.id === "prev-slide" ? -1 : 1;
          const scrollAmount = itemWidth * 5 * direction;
          imageList.scrollBy({ left: scrollAmount, behavior: "smooth" });
        });
      });

      return () => {
        sliderButtons.forEach((button) => {
          button.removeEventListener("click", () => {});
        });
        imageList.removeEventListener("scroll", handleSlideButtons);
      };
    };

    initSlider();
  }, []);

  useEffect(() => {
    const initSlider2 = () => {
      const sliderButtons2 = document.querySelectorAll(".slide-button2");
      const imageList2 = document.querySelector(".image-list2");

      if (imageList2 && joinedInitiative.length > 0) {
        const maxScrollLeft2 = imageList2.scrollWidth - imageList2.clientWidth;
        const itemWidth = 32;

        sliderButtons2.forEach((button) => {
          button.addEventListener("click", () => {
            const direction = button.id === "prev-slide2" ? -1 : 1;
            const scrollAmount = itemWidth * 5 * direction;
            imageList2.scrollBy({ left: scrollAmount, behavior: "smooth" });
          });
        });

        // const handleSlideButtons2 = () => {
        //   sliderButtons2[0].style.display =
        //     imageList2.scrollLeft <= 0 ? "none" : "block";
        //   sliderButtons2[1].style.display =
        //     imageList2.scrollLeft >= maxScrollLeft2 ? "none" : "block";
        // };

        // handleSlideButtons2();

        // imageList2.addEventListener("scroll", handleSlideButtons2);

        // Clean up event listeners if needed
        return () => {
          sliderButtons2.forEach((button) => {
            button.removeEventListener("click", () => {});
          });
          imageList2.removeEventListener("scroll", handleSlideButtons2);
        };
      }
    };

    initSlider2();
  }, [joinedInitiative]); // Add joinedInitiative as a dependency
  return (
    <div className="bg-green-50 h-full mx-2 p-10 sm:px-10 lg:px-20 pb-10">
      <p className="font-semibold  text-gray-500 pb-2">
        Welcome {currentUser.username}
      </p>
      <div className="flex flex-col md:flex-row gap-5">
        <div className=" bg-white rounded-xl flex-1 p-10">
          <p className="font-semibold mb-2">Create and promote environment</p>
          <p className=" mb-3">
            Empower, Embrace, Excel: Cultivating a Positive Environment
            Together.
          </p>
          <div className="flex gap-6 md">
            <Button className="font-bold t" size="xs" color="success">
              Explore more
            </Button>
            <Button
              className="font-bold hidden md:inline-block"
              size="xs"
              color="light"
            >
              Explore more
            </Button>
          </div>
        </div>
        <div className="flex self-center">
          <div className="bg-green-300 rounded-xl w-44 flex ">
            <div className="flex-1  mt-2 ml-2 py-8">
              <p className="font-semibold ml-4">Joined</p>
              <p className="ml-4">{currentUser?.joinedInitiativeId.length}</p>
              <p className="font-semibold mt-2 ml-4">Created</p>
              <p className="ml-4">{currentUser?.initiatives.length}</p>
            </div>
            <div>
              <div className="relative left-2 bottom-8">
                <img className="h-44 w-32" src="/plant.png" alt="Plant" />
              </div>
            </div>
          </div>
          <div className=" w-44 ml-10 xs:hidden xss:flex md:hidden bg-green-200">
            <p className="p-10 text-center border-green-600 border-20 font-bold">
              {message}
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-12 z-10">
        {/* My Initiatives */}
        <div className="flex flex-col w-full md:w-8/12">
          <div className="container-img md:w-full mt-4 rounded-lg  overflow-auto relative">
            <p className=" px-5 py-2 block">My Initiatives</p>
            <button
              id="prev-slide"
              className="slide-button absolute left-2 top-32 "
            >
              <IoIosArrowDropleftCircle color="red" />
            </button>
            <div className="image-list overflow-auto ">
              {currentUser.initiatives && currentUser.initiatives.length > 0 ? (
                initiative.map((item, index) => (
                  <div
                    className="h-48 card flex-shrink-0 shadow-lg w-44 items-center justify-center flex gap-5 flex-col p-3 border-2"
                    key={index}
                  >
                    <Link
                      key={index}
                      to={`/initiative/${item._id}/${currentUser._id}`}
                    >
                      <img
                        className=""
                        src={item.image}
                        alt={`Image ${index}`}
                      />
                    </Link>

                    <Button
                      size="xs"
                      className="bg-red-500 w-fit"
                      color="danger"
                      onClick={(e) => handleInitiativeDelete(item._id, e)}
                    >
                      Delete
                    </Button>
                  </div>
                ))
              ) : (
                <div className="w-full p-16 border-2 flex flex-col  justify-center items-center">
                  <div className="">
                    <p>
                      Create Initiatives{" "}
                      <span className="mt-5">
                        <span className=" text-center  mx-auto">
                          <Link to="/initiatives">
                            <Button className="ml-10" size="xs" color="success">
                              New
                            </Button>
                          </Link>
                        </span>
                      </span>
                    </p>
                  </div>
                </div>
              )}
            </div>
            <button
              id="next-slide"
              className="slide-button absolute right-2 top-32  "
            >
              <IoIosArrowDroprightCircle color="red" />
            </button>
          </div>

          <div className="container-img2 md:w-full z-20 flex flex-col mt-4 rounded-lg overflow-auto relative  ">
            <p className=" px-5 py-2 block">Joined Initiatives</p>
            <button
              id="prev-slide2"
              className="slide-button2  absolute top-24  z-30"
            >
              <IoIosArrowDropleftCircle color="red" />
            </button>
            <div className="image-list2  overflow-auto">
              {currentUser.joinedInitiativeId &&
              currentUser.joinedInitiativeId.length > 0 ? (
                joinedInitiative.map((item, index) => (
                  <Link
                    key={index}
                    to={`/initiative/${item._id}/${item.userId}`}
                  >
                    <div
                      className="h-44 flex-shrink-0 shadow-lg w-44 p-3 border-2"
                      key={index}
                    >
                      <img
                        className=""
                        src={item.image}
                        alt={`Image ${index}`}
                      />
                    </div>
                  </Link>
                ))
              ) : (
                <div className="w-full p-20 border-2 flex flex-col gap-4 justify-center items-center">
                  <p>
                    Join Initiatives
                    <span>
                      <div className="ml-10 mt-2">
                        <Link to="/initiatives">
                          <Button size="xs" color="success">
                            join
                          </Button>
                        </Link>
                      </div>
                    </span>
                  </p>
                </div>
              )}
            </div>
            <button
              id="next-slide2"
              className="slide-button2 absolute right-0 top-24  "
            >
              <IoIosArrowDroprightCircle color="red" />
            </button>
          </div>
        </div>

        {/* Joined Initiatives */}

        {/* Placeholder for other content */}
        <div className="sliderdash md:flex-1 bg-green-200 mt-4 rounded-lg">
          <Pagination />
        </div>
      </div>
      {/* <Button onClick={handleDeleteJoin}>Delete</Button> */}
    </div>
  );
}

export default DashBoard;
