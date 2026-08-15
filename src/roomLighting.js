export function toggleRoomLights({ birthdayMomentSeen, lightsOff, showBirthdayMoment }) {
  const nextLightsOff = !lightsOff;
  const shouldStartBirthdayMoment = nextLightsOff && !birthdayMomentSeen;

  return {
    birthdayMomentSeen: birthdayMomentSeen || shouldStartBirthdayMoment,
    lightsOff: nextLightsOff,
    showBirthdayMoment: shouldStartBirthdayMoment ? true : nextLightsOff && showBirthdayMoment,
  };
}
