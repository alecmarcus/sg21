export const stringToNumber = input => {
  let output = input;

  if (isNaN(input)) {
    let idx = 0;
    const length = input.length;

    for (let position = 0; position < length; position++) {
      idx += (input.charCodeAt(position) - 64) * Math.pow(26, length - position - 1) - 1;
    }

    output = idx;
  }

  return output;
}

export const sanitizeCoords = coordinates => {
  return coordinates.map(coord => {
    let output = coord;

    output = stringToNumber(coord);

    return output;
  });
};
