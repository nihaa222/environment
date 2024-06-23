import { Button } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function Pagination() {
  const { currentUser } = useSelector((state) => state.user);
  const [page, setPage] = useState(1);
  const [limit] = useState(9);
  const [skip, setSkip] = useState((page - 1) * limit);
  const [data, setData] = useState([]);
  console.log(data);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `/api/initiative/getPeople?userId=${currentUser._id}&limit=${limit}&skip=${skip}`
        );

        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }

        const fetchedData = await res.json();
        setData(fetchedData);
      } catch (error) {
        console.error("Error fetching data:", error);
        // Optionally, set a default value or handle the error in UI
        setData([]);
      }
    };
    fetchData();
  }, [skip, limit]);

  const handleNextPage = () => {
    setPage((currentPage) => currentPage + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage((currentPage) => currentPage - 1);
    }
  };

  // Update skip whenever page changes
  useEffect(() => {
    setSkip((page - 1) * limit);
  }, [page, limit]);

  return (
    <div className="pagination-container">
      <div className="px-3">
        <p className="text-center p-5 text-gray font-bold">
          People Joined your initiatives
        </p>
      </div>
      <div className="pagination-buttons flex flex-col gap-4 px-20 justify-center">
        {data.map((item, index) => (
          <Button key={index} color="success">
            <div className="flex justify-center gap-20 items-center">
              <img className="h-6 w-6 rounded-full" src={item.image}></img>
              <div className="flex gap-2 ">
                <p>{item.named}</p>
                <p>{item.title}</p>
              </div>
            </div>
          </Button>
        ))}
        <p></p>
      </div>
    </div>
  );
}

export default Pagination;
