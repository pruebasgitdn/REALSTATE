import { useState } from "react";

export const useListingCounter = () => {
  const [bathNumber, setBathNumber] = useState(0);
  const [guestNumber, setGuestNumber] = useState(0);
  const [roomNumber, setRoomNumber] = useState(0);
  const [bedNumber, setBedNumber] = useState(0);

  const increaseBaths = () => setBathNumber(bathNumber + 1);
  const minusBaths = () => setBathNumber(Math.max(0, bathNumber - 1));

  const increaseGuest = () => setGuestNumber(guestNumber + 1);
  const minusGuest = () => setGuestNumber(Math.max(0, guestNumber - 1));

  const increaseRoom = () => setRoomNumber(roomNumber + 1);
  const minusRoom = () => setRoomNumber(Math.max(0, roomNumber - 1));

  const increaseBed = () => setBedNumber(bedNumber + 1);
  const minusBed = () => setBedNumber(Math.max(0, bedNumber - 1));

  return {
    bathNumber,
    guestNumber,
    roomNumber,
    bedNumber,
    increaseBaths,
    minusBaths,
    increaseGuest,
    minusGuest,
    increaseRoom,
    minusRoom,
    increaseBed,
    minusBed,
  };
};
