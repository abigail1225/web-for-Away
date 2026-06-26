export const REQUIRED_ROOM_IDS = ['tarot', 'quiz', 'puzzle', 'photos'];
export const FLOW_ROOM_IDS = [...REQUIRED_ROOM_IDS, 'letters'];
export const COMPLETION_CUE_ID = 'gift';

export function isMailboxUnlocked(exploredRoomIds) {
  const explored = new Set(exploredRoomIds);
  return REQUIRED_ROOM_IDS.every((roomId) => explored.has(roomId));
}

export function markRoomExplored(exploredRoomIds, roomId) {
  if (!FLOW_ROOM_IDS.includes(roomId) || exploredRoomIds.includes(roomId)) {
    return exploredRoomIds;
  }

  return [...exploredRoomIds, roomId];
}

export function getNextCueId(exploredRoomIds) {
  const explored = new Set(exploredRoomIds);
  return FLOW_ROOM_IDS.find((roomId) => !explored.has(roomId)) || COMPLETION_CUE_ID;
}
