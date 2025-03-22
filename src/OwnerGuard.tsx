import React, { useState, useEffect } from "react";

interface OwnerGuardProps {
  children: React.ReactNode;
}

const OwnerGuard: React.FC<OwnerGuardProps> = ({ children }) => {
  const [userPermission, setUserPermission] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentHomeId, setCurrentHomeId] = useState<string | null>(
    localStorage.getItem("currentHomeId")
  );

  // Listen for changes to localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const newHomeId = localStorage.getItem("currentHomeId");
      if (newHomeId !== currentHomeId) {
        setCurrentHomeId(newHomeId);
      }
    };

    // Set up event listener for storage changes
    window.addEventListener("storage", handleStorageChange);

    // Check for changes every second as a fallback
    // This helps when localStorage is modified in the same window
    const intervalId = setInterval(() => {
      const newHomeId = localStorage.getItem("currentHomeId");
      if (newHomeId !== currentHomeId) {
        setCurrentHomeId(newHomeId);
      }
    }, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(intervalId);
    };
  }, [currentHomeId]);

  // Fetch permission level whenever currentHomeId changes
  useEffect(() => {
    const fetchUserPermission = async () => {
      try {
        setLoading(true);

        // Get the auth token
        const token = localStorage.getItem("authToken");
        if (!token) {
          setLoading(false);
          return;
        }

        // Check if we have a current home ID
        if (!currentHomeId) {
          setLoading(false);
          return;
        }

        // Updated URL to match the correct endpoint in userRoutes.ts
        const response = await fetch(
          `https://homesync-production.up.railway.app/api/users/dwellers/permission/${currentHomeId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          console.error("Failed to fetch permission level");
          setLoading(false);
          return;
        }

        const data = await response.json();
        setUserPermission(data.permissionLevel);
      } catch (error) {
        console.error("Error fetching permission level:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPermission();
  }, [currentHomeId]);

  // Don't render anything while loading
  if (loading) {
    return null;
  }

  // Only render the children if the user is an OWNER
  return userPermission === "OWNER" ? <>{children}</> : null;
};

export default OwnerGuard;
