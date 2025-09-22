import React from "react";
import { Outlet } from "react-router-dom";
import Header from "@/components/header";

const AppLayout = () => {
  return (
    <div>
      <div className="grid-background"></div>
      <main className="min-h-screen container px-16">
        <Header />
        <Outlet /> {/* This is where the child routes will be rendered */}
      </main>
      <div className="p-10 text-center bg-gray-800 mt-10">
        Made with 💗 by Bryan AKA Ja'Crispy
      </div>
    </div>
  );
};

export default AppLayout;
