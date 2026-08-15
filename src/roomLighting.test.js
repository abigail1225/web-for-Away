import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { toggleRoomLights } from './roomLighting.js';

describe('room lighting birthday moment', () => {
  it('shows the birthday moment only the first time the lights turn off', () => {
    const firstOff = toggleRoomLights({
      birthdayMomentSeen: false,
      lightsOff: false,
      showBirthdayMoment: false,
    });

    assert.deepEqual(firstOff, {
      birthdayMomentSeen: true,
      lightsOff: true,
      showBirthdayMoment: true,
    });

    const backOn = toggleRoomLights(firstOff);
    assert.deepEqual(backOn, {
      birthdayMomentSeen: true,
      lightsOff: false,
      showBirthdayMoment: false,
    });

    const secondOff = toggleRoomLights(backOn);
    assert.deepEqual(secondOff, {
      birthdayMomentSeen: true,
      lightsOff: true,
      showBirthdayMoment: false,
    });
  });
});
