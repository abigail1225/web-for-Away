export const birthdayConfettiColors = ['#ff8f9f', '#ffe27a', '#b8dcff', '#d9c2ff', '#9ff0d0', '#ffbf73'];

export function blowBirthdayCandle({ candleBlownOut = false, confettiBurst = 0 }) {
  return {
    candleBlownOut: true,
    confettiBurst: confettiBurst + 1,
  };
}

export function createBirthdayConfettiPieces(count = 120) {
  return Array.from({ length: count }, (_, index) => ({
    delay: `${index * 16}ms`,
    rot: `${index * 29}deg`,
    left: `${(index * 37) % 100}vw`,
    top: `${-12 - (index % 9) * 6}vh`,
    drift: `${((index % 13) - 6) * 18}px`,
    fall: `${112 + (index % 6) * 8}vh`,
    w: `${7 + (index % 3) * 2}px`,
    h: `${12 + (index % 4) * 4}px`,
    duration: `${2200 + (index % 7) * 180}ms`,
  }));
}
