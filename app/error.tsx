"use client";

import {FC} from "react";

interface ErrorProps {
  error: Error & {digest?: string};
  reset: () => void;
}

const Error: FC<ErrorProps> = ({error, reset}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h2 className="text-xl font-semibold text-red-600">
        Something went wrong 😢
      </h2>
      <p className="text-gray-700">{error.message}</p>
      <button
        onClick={reset}
        className="px-4 py-2 mt-2 text-white bg-red-500 rounded hover:bg-red-600"
      >
        Try again
      </button>
    </div>
  );
};

export default Error;
