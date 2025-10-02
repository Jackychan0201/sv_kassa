"use client";

import { useEffect } from "react";

interface TimerNotificationProps {
  time: string;
}

export function TimerNotification({ time }: TimerNotificationProps) {
  useEffect(() => {
    if (!("Notification" in window)) {
      console.error("Your browser does not support push notifications");
      return;
    }

    Notification.requestPermission().then((permission) => {
      console.log("Permission:", permission);

      if (permission !== "granted") return;

      const now = new Date();
      const [hoursStr, minutesStr] = time.split(":");
      const target = new Date();

      target.setHours(parseInt(hoursStr, 10));
      target.setMinutes(parseInt(minutesStr, 10));
      target.setSeconds(0);
      target.setMilliseconds(0);

      if (target.getTime() <= now.getTime()) {
        target.setDate(target.getDate() + 1);
      }

      const delay = target.getTime() - now.getTime();

      console.log(`Notification scheduled in ${delay} ms`);

      setTimeout(() => {
        new Notification("Push Notification", {
          body: `It's ${time} now: close the day!`,
        });
      }, delay);
    });
  }, [time]);

  return null;
}
