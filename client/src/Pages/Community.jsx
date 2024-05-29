import React from "react";

const Community = () => {
  return (
    <>
      <div className="w-6xl mx-auto px-20 pt-20 flex gap-2 ">
        <div className="h-20 flex  border-2  ">
          <p className="h-10 w-10 rounded-full bg-black"></p>
        </div>
        <div className="h-20 border-2">
          <p className="h-10 w-10 bg-black rounded-full"></p>
        </div>
      </div>

      {/* Grid */}
      <div className="w-6xl mx-auto px-20 pt-20 justify-items-center grid grid-cols-2 gap-2 ">
        <div className="h-20  border-2 grid  ">
          <p className="h-10 w-10 rounded-full bg-black"></p>
        </div>
        <div className="h-20  border-2">
          <p className="h-10 w-10 bg-black rounded-full"></p>
        </div>
      </div>
    </>
  );
};

export default Community;
