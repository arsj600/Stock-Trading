
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import StockImage1 from "../assets/StockImage1.svg";
import Stock from "../assets/Stock.svg";
import Learn from "../assets/Learn.svg";

export const Home = () => {
  const navigate = useNavigate();

  
  const [loggedIn, setLoggedIn] = useState(false);


  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (user || localStorage.getItem("token")) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  }, [user]);

  const handleSignUp = () => navigate("/login");
  const handleMarket = () => navigate("/stocklist");
  const handleLearn = () => navigate("/edu");

  return (
    <div>
      {/* Section 1 */}
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <img
          src={StockImage1}
          className="w-8/12 max-w-xl min-w-[120px] h-auto mb-6 transition-all duration-300 sm:w-3/5 md:w-2/4 lg:w-1/2"
        />
        <p className="text-2xl font-semibold text-gray-800 mb-4 text-center">
          Start Investing today
        </p>

        {!loggedIn ? (
          <button
            onClick={handleSignUp}
            className="px-6 py-2 bg-blue-800 text-white rounded-lg shadow hover:bg-blue-400 transition"
          >
            Sign Up
          </button>
        ) : (
          <p className="text-lg text-green-700 font-medium">
            Welcome {user?.name || "Trader"} 🎉
          </p>
        )}
      </div>

      {/* Section 2 */}
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <img
          src={Stock}
          className="w-8/12 max-w-xl min-w-[120px] h-auto mb-6 transition-all duration-300 sm:w-3/5 md:w-2/4 lg:w-1/2"
        />
        <p className="text-2xl font-semibold text-gray-800 mb-4 text-center">
          Explore Possible Options
        </p>
        <button
          onClick={handleMarket}
          className="px-6 py-2 bg-blue-800 text-white rounded-lg shadow hover:bg-blue-400 transition"
        >
          Market
        </button>
      </div>

      {/* Section 3 */}
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <img
          src={Learn}
          className="w-8/12 max-w-xl min-w-[120px] h-auto mb-6 transition-all duration-300 sm:w-3/5 md:w-2/4 lg:w-1/2"
        />
        <p className="text-2xl font-semibold text-gray-800 mb-4 text-center">
          Learn Best Practice for the Market
        </p>
        <button
          onClick={handleLearn}
          className="px-6 py-2 bg-blue-800 text-white rounded-lg shadow hover:bg-blue-400 transition"
        >
          Learn
        </button>
      </div>

      <hr />
    </div>
  );
};
