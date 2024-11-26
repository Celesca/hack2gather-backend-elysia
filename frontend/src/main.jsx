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
import EventDetail from './EventDetail';

import Dashboard from "./Dashboard";
import Hackathon from "./hackathon";
import AllUsers from "./all_user";
import Message from "./message";
import About_us from "./about_us";
import Rating from "./Rating";

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
  },
  {
    path: "/rating",
    element: (
      <>
        <Navbar />
        <Rating />
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
