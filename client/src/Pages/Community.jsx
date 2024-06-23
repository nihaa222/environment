import React from "react";

const Community = () => {
  return (
    <>
      <div className="max-w-7xl mx-auto border-2 p-10 sm:p-10">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
          <div className="h-20 w-44 justify-self-start lg:justify-self-end text-white text-center text-3xl  bg-black">
            {" "}
            1
          </div>
          <div className="h-20 w-full col-span-2 lg:col-span-1 text-white text-center order-1 lg:order-none text-3xl bg-black">
            2
          </div>
          <div className="h-20 w-44 justify-self-end lg:justify-self-start text-white text-center text-3xl bg-black">
            3
          </div>
        </div>
      </div>
    </>
  );
};

export default Community;
