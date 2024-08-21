import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/dashboard/Dashboard";
import Login from "./pages/login/Login";
import Users from "./pages/users/Users";
import Products from "./pages/products/Products";
import Profile from "./pages/profile/Profile";
import Hello from "./components/Hello";
import PrivateRoute from "./components/PrivateRoute"; 

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Dashboard />}>
            <Route index element={<DashboardHome />} />
            <Route path="users" element={<Users />} />
            <Route path="products" element={<Products />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

// DashboardHome Component
const DashboardHome: React.FC = () => (
  <div>
    <Hello />
  </div>
);

export default App;
