import { BrowserRouter, Routes, Route } from "react-router-dom";

import React, { Suspense } from "react";

const Home = React.lazy(() => import("./pages/Home"));
const SignIn = React.lazy(() => import("./pages/SignIn"));
const SignUp = React.lazy(() => import("./pages/SignUp"));
const About = React.lazy(() => import("./pages/About"));
const Profile = React.lazy(() => import("./pages/Profile"));
const Header = React.lazy(() => import("./components/Header"));
const PrivateRoute = React.lazy(() => import("./components/PrivateRoute"));
const Student = React.lazy(() => import("./pages/Student"));
const Search = React.lazy(() => import("./pages/Search"));
import Loader from "./components/Loader";

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loader />}>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/about" element={<About />} />
          <Route path="/search" element={<Search />} />
          <Route path="/student-profile/:id" element={<Student />} />
          <Route element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
