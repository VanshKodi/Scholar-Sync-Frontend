import { useState } from "react";
import Sidebar from "./Sidebar";
import { getProfile } from "../utils/supabase";
export default function Dashboard() {
  const [active, setActive] = useState("overview");
  const profile = getProfile(); // Replace with actual user ID logic
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar onSelect={setActive} />


      <main style={{ flex: 1, padding: "16px" }}>
        <h1>Dashboard</h1>
        <p>Active section: {active}</p>
      </main>
    </div>
  );
}