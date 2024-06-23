import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

function Card({ data }) {
  const navigate = useNavigate();
  const handleClick = (id) => {
    navigate(`/initiative/${id}`);
  };
  return (
    <div className="border-2 rounded-xl">
      {data && data.image && (
        <>
          <div
            className="h-[300px] w-[320px]"
            onClick={() => {
              handleClick(data._id);
            }}
          >
            <img
              className="object-cover w-full rounded-xl h-[250px] shadow-md"
              src={data.image}
              alt="Card Image"
            />
            <p className="text-sm text-center whitespace-normal  mt-2 overflow-hidden">
              {data.category}
            </p>
          </div>
        </>
      )}
    </div>
  );
}

Card.propTypes = {
  data: PropTypes.shape({
    image: PropTypes.string.isRequired,
    // Add other prop validations for 'item' if needed
  }).isRequired,
};

export default Card;
