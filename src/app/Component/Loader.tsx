import { CircularProgress } from "@mui/material";
import React from "react";

const Loader = () => {
  return (
    <div className="h-screen bg-black/25 w-full flex items-center justify-center">
      <CircularProgress />
    </div>
  );
};

export default Loader;
