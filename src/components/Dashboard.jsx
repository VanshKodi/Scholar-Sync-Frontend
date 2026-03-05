import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { getProfile } from "../utils/supabase";
import OnboardingModal from "./Modal";

export default function Dashboard() {
  const [active, setActive] = useState("overview");
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      const data = await getProfile(); // Automatically handles session ID
      
      if (!data) {
        // No profile in the DB? Show the onboarding flow
        setShowOnboarding(true);
      } else {
        setProfile(data);
      }
      setLoading(false);
    }

    loadProfile();
  }, []);

  const handleOnboardingComplete = (newData) => {
    // Here you would typically perform your Supabase insert
    // For now, we update local state and close the modal
    setProfile({ ...newData });
    setShowOnboarding(false);
  };

  if (loading) return <div style={{ color: 'white', padding: '20px' }}>Loading...</div>;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#111827" }}>
      <Sidebar onSelect={setActive} />
      
      {/* Onboarding triggers if profile is missing */}
      <OnboardingModal 
        isOpen={showOnboarding} 
        onComplete={handleOnboardingComplete} 
      />

      <main style={{ flex: 1, padding: "24px", color: "white" }}>
        <header style={{ marginBottom: "2rem" }}>
          <h1>Welcome, {profile?.name || "User"}</h1>
          <p style={{ color: "#9ca3af" }}>Current Workspace: {active}</p>
        </header>

        <section style={{ 
          background: "#1f2937", 
          padding: "20px", 
          borderRadius: "8px",
          border: "1px solid #374151" 
        }}>
          {/* Content changes based on the sidebar selection */}
          {active === "overview" && <div>Overview Content for ScholarSync</div>}
          {active === "documents" && <div>Document Management View</div>}
          {active === "notifications" && <div>Your Notifications</div>}
        </section>
      </main>
    </div>
  );
}