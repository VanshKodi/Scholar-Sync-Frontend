import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { getProfile } from "../utils/supabase";
import OnboardingModal, { JoinUniversityModal, LeaveUniversityModal } from "./Modal";
import { request } from "../api";

export default function Dashboard() {
  const [active, setActive] = useState("overview");
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingError, setOnboardingError] = useState(null);

  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinError, setJoinError] = useState(null);

  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [leaveError, setLeaveError] = useState(null);

  const [notifications, setNotifications] = useState([]);
  const [notifLoading, setNotifLoading] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      const data = await getProfile();

      if (!data) {
        setShowOnboarding(true);
      } else {
        setProfile(data);
      }
      setLoading(false);
    }

    loadProfile();
  }, []);

  useEffect(() => {
    if (active !== "notifications") return;

    async function loadNotifications() {
      setNotifLoading(true);
      try {
        const data = await request("/notifications");
        setNotifications(data || []);
      } catch (err) {
        console.error("Failed to load notifications:", err);
      } finally {
        setNotifLoading(false);
      }
    }

    loadNotifications();
  }, [active]);

  const handleOnboardingComplete = async (newData) => {
    setOnboardingError(null);
    try {
      await request(
        "/set_profiles_name",
        { name: newData.displayName, university_id: newData.universityId },
        "POST"
      );
      const refreshed = await getProfile();
      setProfile(refreshed || { name: newData.displayName, university_id: newData.university_id });
      setShowOnboarding(false);
    } catch (err) {
      console.error("Failed to save profile:", err);
      setOnboardingError("Failed to save profile. Please try again.");
    }
  };

  const handleJoinUniversity = async (universityId) => {
    setJoinError(null);
    try {
      await request("/join_university", { university_id: universityId }, "POST");
      const refreshed = await getProfile();
      setProfile(refreshed);
      setShowJoinModal(false);
    } catch (err) {
      console.error("Failed to join university:", err);
      setJoinError("Failed to join university. Please check the ID and try again.");
    }
  };

  const handleLeaveUniversity = async () => {
    setLeaveError(null);
    try {
      await request("/leave_university", {}, "POST");
      const refreshed = await getProfile();
      setProfile(refreshed);
      setShowLeaveModal(false);
    } catch (err) {
      console.error("Failed to leave university:", err);
      setLeaveError("Failed to leave university. Please try again.");
    }
  };

  const handleCloseJoinModal = () => { setShowJoinModal(false); setJoinError(null); };
  const handleCloseLeaveModal = () => { setShowLeaveModal(false); setLeaveError(null); };

  const handleMarkRead = async (notifId) => {
    try {
      await request(`/notifications/${notifId}/read`, {}, "POST");
      setNotifications((prev) =>
        prev.map((n) => (n.notification_id === notifId ? { ...n, is_read: true } : n))
      );
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  if (loading) return <div style={{ color: "white", padding: "20px" }}>Loading...</div>;

  const displayName = profile?.name || "User";
  // University membership comes from the joined university_members relation
  const membership = profile?.university_members?.[0] ?? null;
  const memberRole = membership?.role ?? null;
  const university = membership?.university ?? null;
  const universityId = university?.university_id ?? null;
  const universityName = university?.university_name ?? null;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#111827" }}>
      <Sidebar onSelect={setActive} />

      <OnboardingModal
        isOpen={showOnboarding}
        onComplete={handleOnboardingComplete}
        error={onboardingError}
      />

      <JoinUniversityModal
        isOpen={showJoinModal}
        onSubmit={handleJoinUniversity}
        onClose={handleCloseJoinModal}
        error={joinError}
      />

      <LeaveUniversityModal
        isOpen={showLeaveModal}
        universityId={universityName || universityId}
        onConfirm={handleLeaveUniversity}
        onClose={handleCloseLeaveModal}
        error={leaveError}
      />

      <main style={{ flex: 1, padding: "24px", color: "white" }}>
        <header style={{ marginBottom: "2rem" }}>
          <h1 style={{ margin: 0 }}>Welcome, {displayName}</h1>
          <p style={{ color: "#9ca3af", marginTop: "4px" }}>Current Workspace: {active}</p>
        </header>

        {/* Profile Info Card */}
        <section style={cardStyle}>
          <h2 style={sectionTitle}>Your Profile</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "flex-start" }}>
            <div style={{ flex: 1, minWidth: "200px" }}>
              <InfoRow label="Display Name" value={displayName} />
              {profile?.email_id && <InfoRow label="Email" value={profile.email_id} />}
              {memberRole && (
                <InfoRow
                  label="Role"
                  value={memberRole.charAt(0).toUpperCase() + memberRole.slice(1)}
                />
              )}
            </div>
            <div style={{ flex: 1, minWidth: "200px" }}>
              {universityName && <InfoRow label="University" value={universityName} />}
              {universityId && <InfoRow label="University ID" value={universityId} />}
              {!universityId && (
                <p style={{ color: "#9ca3af", fontSize: "0.875rem" }}>Not affiliated with a university.</p>
              )}
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
            <button style={btnPrimary} onClick={() => setShowJoinModal(true)}>
              Join University
            </button>
            {universityId && (
              <button style={btnDanger} onClick={() => setShowLeaveModal(true)}>
                Leave University
              </button>
            )}
          </div>
        </section>

        {/* How-to / Info Section */}
        <section style={{ ...cardStyle, marginTop: "16px" }}>
          <h2 style={sectionTitle}>💡 How to Use ScholarSync</h2>
          <p style={{ color: "#d1d5db", lineHeight: 1.6 }}>
            ScholarSync is your all-in-one academic workspace. Use the sidebar to navigate between
            documents, attendance, grades, CLO, join requests, TA allotments, and more.
          </p>
          <p style={{ color: "#d1d5db", lineHeight: 1.6, marginTop: "8px" }}>
            <strong style={{ color: "#a5b4fc" }}>🤖 AI Assistant:</strong> Head to{" "}
            <em>Chat with ScholarSync</em> in the sidebar to ask our AI agent anything about the
            platform — it has full knowledge of how ScholarSync works and can guide you through any
            feature or workflow.
          </p>
        </section>

        {/* Main content area */}
        <section style={{ ...cardStyle, marginTop: "16px" }}>
          {active === "overview" && (
            <div>
              <h2 style={sectionTitle}>Overview</h2>
              <p style={{ color: "#d1d5db" }}>
                Welcome to ScholarSync! Use the sidebar to access your documents, academic records,
                and administration tools.
              </p>
            </div>
          )}
          {active === "documents" && <div>Document Management View</div>}
          {active === "notifications" && (
            <NotificationsView
              notifications={notifications}
              loading={notifLoading}
              onMarkRead={handleMarkRead}
            />
          )}
          {active !== "overview" && active !== "documents" && active !== "notifications" && (
            <div style={{ color: "#9ca3af" }}>
              Select a section from the sidebar to get started.
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div style={{ marginBottom: "8px" }}>
      <span style={{ color: "#9ca3af", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
        {label}
      </span>
      <p style={{ margin: "2px 0 0", fontWeight: 500 }}>{value}</p>
    </div>
  );
}

function NotificationsView({ notifications, loading, onMarkRead }) {
  if (loading) return <p style={{ color: "#9ca3af" }}>Loading notifications…</p>;
  if (!notifications.length) return <p style={{ color: "#9ca3af" }}>No notifications yet.</p>;

  return (
    <div>
      <h2 style={sectionTitle}>Notifications</h2>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {notifications.map((n) => (
          <li
            key={n.notification_id}
            style={{
              background: n.is_read ? "#111827" : "#1e3a5f",
              border: "1px solid #374151",
              borderRadius: "8px",
              padding: "12px 16px",
              marginBottom: "8px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              {n.title && <p style={{ margin: "0 0 4px", fontWeight: 600 }}>{n.title}</p>}
              {n.content && (
                <p style={{ margin: 0, color: "#d1d5db", fontSize: "0.9rem" }}>{n.content}</p>
              )}
              {n.created_at && (
                <p style={{ margin: "4px 0 0", color: "#6b7280", fontSize: "0.75rem" }}>
                  {new Date(n.created_at).toLocaleString()}
                </p>
              )}
            </div>
            {!n.is_read && (
              <button
                onClick={() => onMarkRead(n.notification_id)}
                style={{ ...btnPrimary, padding: "6px 12px", fontSize: "0.8rem", whiteSpace: "nowrap", marginLeft: "12px" }}
              >
                Mark read
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

const cardStyle = {
  background: "#1f2937",
  padding: "20px",
  borderRadius: "8px",
  border: "1px solid #374151",
};

const sectionTitle = {
  marginTop: 0,
  marginBottom: "12px",
  fontSize: "1.1rem",
  fontWeight: 600,
};

const btnPrimary = {
  background: "#5b6cff",
  color: "white",
  border: "none",
  padding: "8px 16px",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: 600,
  fontSize: "0.9rem",
};

const btnDanger = {
  background: "#dc2626",
  color: "white",
  border: "none",
  padding: "8px 16px",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: 600,
  fontSize: "0.9rem",
};