"use client";

import { useEffect, useRef, useState } from "react";

export function OnlineStatusManager({ userId }: { userId: string }) {
  const [lastActivity, setLastActivity] = useState(Date.now());
  const lastUpdateRef = useRef(Date.now());
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;

    // Ajouter un appel immédiat pour mettre à jour le statut en ligne
    fetch("/api/me/online", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, online: true }),
    }).catch((error) => {
      console.error("Erreur lors de la mise à jour du statut initial:", error);
    });

    // Fonction pour mettre à jour le statut en ligne avec debounce
    let updateTimeout: NodeJS.Timeout;
    const debouncedUpdateStatus = async (isActive: boolean) => {
      clearTimeout(updateTimeout);
      updateTimeout = setTimeout(async () => {
        if (!isMountedRef.current) return;

        try {
          const response = await fetch("/api/me/online", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, online: isActive }),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          lastUpdateRef.current = Date.now();
        } catch (error) {
          console.error("Erreur lors de la mise à jour du statut:", error);
        }
      }, 1000);
    };

    // Fonction pour vérifier et mettre à jour le statut
    const checkAndUpdateStatus = () => {
      const now = Date.now();
      const inactiveThreshold = 5 * 60 * 1000; // 5 minutes
      const isActive = now - lastActivity < inactiveThreshold;

      if (now - lastUpdateRef.current >= 60000) {
        debouncedUpdateStatus(isActive);
      }
    };

    // Fonction pour mettre à jour le statut hors ligne
    const setOfflineStatus = async () => {
      if (!isMountedRef.current) return;

      try {
        const response = await fetch("/api/me/online", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, online: false }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } catch (error) {
        console.error(
          "Erreur lors de la mise à jour du statut hors ligne:",
          error
        );
      }
    };

    // Gestionnaire d'activité avec debounce
    let activityTimeout: NodeJS.Timeout;
    const handleActivity = () => {
      clearTimeout(activityTimeout);
      activityTimeout = setTimeout(() => {
        if (isMountedRef.current) {
          setLastActivity(Date.now());
          checkAndUpdateStatus();
        }
      }, 1000);
    };

    // Configurer l'intervalle de vérification
    const interval = setInterval(checkAndUpdateStatus, 60000);

    // Configurer les écouteurs d'événements pour détecter l'activité
    const events = ["mousemove", "keydown", "click", "scroll"];
    events.forEach((event) => window.addEventListener(event, handleActivity));

    // Configurer les écouteurs d'événements pour la déconnexion
    window.addEventListener("beforeunload", setOfflineStatus);
    window.addEventListener("pagehide", setOfflineStatus);

    // Nettoyer les effets lors du démontage
    return () => {
      isMountedRef.current = false;
      clearInterval(interval);
      clearTimeout(updateTimeout);
      clearTimeout(activityTimeout);

      events.forEach((event) =>
        window.removeEventListener(event, handleActivity)
      );

      window.removeEventListener("beforeunload", setOfflineStatus);
      window.removeEventListener("pagehide", setOfflineStatus);

      setOfflineStatus();
    };
  }, [userId, lastActivity]);

  return null;
}
