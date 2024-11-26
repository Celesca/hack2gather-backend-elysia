import * as React from "react";
import * as ReactDOM from "react-dom";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css';
import App from "./App";
import ErrorPage from "./error-page";
import Navbar from "./components/Navbar";
import Swipe from "./Swipe";
import Register from "./Register";
import LoginForm from "./LoginForm";
import Profile from "./profile";
<<<<<<< HEAD
import EventDetail from "./EventDetail";
import Rating from "./Rating";

=======
import EventDetail from './EventDetail';
import Personal from "./personal";
import Dashboard from "./Dashboard";
>>>>>>> 5521b039446a9f7478fdef2608edf8cee2c02c3b
import Hackathon from "./hackathon";
import AllUsers from "./all_user";
import Message from "./message";
import About_us from "./about_us";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Navbar />
        <App />
      </>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/Swipe",
    element: (
      <>
        <Navbar />
        <Swipe />
      </>
    ),
    errorElement: <ErrorPage />,
  },
  { 
    path: "/register",
    element: (
      <>
        <Navbar />
        <Register />
      </>
    ),
    errorElement: <ErrorPage />,  
  },
  { 
    path: "/login",
    element: (
      <>
        <Navbar />
        <LoginForm />
      </>
    ),
    errorElement: <ErrorPage />,  
  },
  {
    path: "/profile",
    element: (
      <>
        <Navbar />
        <Profile />
      </>
    ),
    errorElement: <ErrorPage />
  },
  {
    path: "/EventDetail/:HackathonID" ,
    element: (
      <>
        <Navbar />
        <EventDetail />
      </>
    ),
    errorElement: <ErrorPage />
  },
  {
    path: "/Hackathon",
    element: (
      <>
        <Navbar />
        <Hackathon />
      </>
    ),
    errorElement: <ErrorPage />
  },
  {
    path: "/Rating",
    element: (
      <>
        <Navbar />
        <Rating />
      </>
    ),
    errorElement: <ErrorPage />
  },
  {
    path: "/dashboard",
    element: (
      <>
        <Navbar />
        <Dashboard />
      </>
    ),
    errorElement: <ErrorPage />
  },
  {
    path: "/AllUsers",
    element: (
      <>
        <Navbar />
        <AllUsers />
      </>
    ),
    errorElement: <ErrorPage />
  },
  {
    path: "/message",
    element: (
      <>
        <Navbar />
        <Message />
      </>
    ),
    errorElement: <ErrorPage />
  },
  {
    path: "/about_us",
    element: (
      <>
        <Navbar />
        <About_us />
      </>
    ),
    errorElement: <ErrorPage />
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
