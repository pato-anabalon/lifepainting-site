/**
 * Work gallery shuffle: the next set of photo indices to show, preferring the ones not on screen,
 * in random order. If fewer are hidden than shown, the rest is topped up from the current set.
 */
export function nextShown(total: number, shown: readonly number[], random: () => number = Math.random): number[] {
  const shuffle = (list: number[]) => {
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      const swap = list[i]!;
      list[i] = list[j]!;
      list[j] = swap;
    }
    return list;
  };
  const hidden = shuffle(Array.from({ length: total }, (_, i) => i).filter((i) => !shown.includes(i)));
  return [...hidden, ...shuffle([...shown])].slice(0, shown.length);
}
