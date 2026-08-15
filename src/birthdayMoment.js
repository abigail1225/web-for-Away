export const birthdayConfettiColors = ['#ff8f9f', '#ffe27a', '#b8dcff', '#d9c2ff', '#9ff0d0', '#ffbf73'];

export function blowBirthdayCandle({ candleBlownOut = false, confettiBurst = 0 }) {
  return {
    candleBlownOut: true,
    confettiBurst: confettiBurst + 1,
  };
}

export function createBirthdayConfettiPieces(count = 42) {
  return Array.from({ length: count }, (_, index) => ({
    delay: `${index * 22}ms`,
    rot: `${index * 29}deg`,
    x: `${44 + (index % 14) * 12 + Math.floor(index / 14) * 10}px`,
    y: `${-24 - (index % 6) * 18 - Math.floor(index / 7) * 10}px`,
    w: `${7 + (index % 3) * 2}px`,
    h: `${12 + (index % 4) * 4}px`,
    duration: `${760 + (index % 5) * 70}ms`,
  }));
}
