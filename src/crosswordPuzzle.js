export const cellKey = (row, column) => `${row}-${column}`;

export function normalizeCrosswordInput(value) {
  const [letter = ''] = String(value).trim().toUpperCase();
  return /^[A-Z]$/.test(letter) ? letter : '';
}

export function getHiddenAnswer(data) {
  return data.hiddenAnswerCells
    .map(({ row, column }) => data.grid[row]?.[column])
    .filter((letter) => letter && letter !== '#')
    .join('');
}

export function checkCrosswordAnswers(data, letters) {
  const incorrectCells = [];

  data.grid.forEach((row, rowIndex) => {
    row.forEach((answer, columnIndex) => {
      if (answer === '#') {
        return;
      }

      const key = cellKey(rowIndex, columnIndex);
      const playerLetter = normalizeCrosswordInput(letters[key] || '');

      if (playerLetter !== answer) {
        incorrectCells.push(key);
      }
    });
  });

  return {
    solved: incorrectCells.length === 0,
    incorrectCells,
  };
}

export function isPlayableCell(data, row, column) {
  return data.grid[row]?.[column] && data.grid[row][column] !== '#';
}
