import React, { useState, useEffect } from "react";

interface OwnerGuardProps {
  children: React.ReactNode;
}

const OwnerGuard: React.FC<OwnerGuardProps> = ({ children }) => {
  const [userPermission, setUserPermission] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserPermission = async () => {
      try {
        // Get the auth token
        const token = localStorage.getItem("authToken");
        if (!token) {
          setLoading(false);
          return;
        }

        // Get the current home ID
        const currentHomeId = localStorage.getItem("currentHomeId");
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
  }, []);

  // Don't render anything while loading
  if (loading) {
    return null;
  }

  // Only render the children if the user is an OWNER
  return userPermission === "OWNER" ? <>{children}</> : null;
};

export default OwnerGuard;
