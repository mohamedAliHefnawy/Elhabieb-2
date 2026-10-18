"use client";

// REACT
import { useState } from "react";

// COMPONENTS
import NavBar from "@/Components/Dashboard/NavBar";
import SideBar from "@/Components/Dashboard/SideBar";
import SizeScreen from "@/Components/Dashboard/SizeScreen";
import PageAnalysis from "@/Components/Dashboard/reports/PageAnalysis";
import AddPerson from "@/Components/Dashboard/Persons/AddPerson";
import EditPerson from "@/Components/Dashboard/Persons/EditPerson";

export default function EditMarketer({ params }: { params: { slug: string } }) {
  return (
    <>
      <div className="w-full h-screen flex max-2xl:flex max-xl:flex lg:flex md:hidden sm:hidden max-sm:hidden">
        <div className="w-[84%] mr-1 flex flex-col">
          <NavBar />
          <EditPerson type={"Markter"} id={params.slug} />
        </div>
        <div className="w-[16%] flex flex-col">
          <SideBar />
        </div>
      </div>

      <SizeScreen />
    </>
  );
}
