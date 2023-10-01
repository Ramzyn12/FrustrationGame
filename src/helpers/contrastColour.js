function getContrastColor(color) {
  // Remove the hash from the color if it exists
  color = color.replace('#', '');

  // Convert the color to RGB
  let r = parseInt(color.substring(0, 2), 16);
  let g = parseInt(color.substring(2, 4), 16);
  let b = parseInt(color.substring(4, 6), 16);

  // Get the complementary color
  r = 255 - r;
  g = 255 - g;
  b = 255 - b;

  // Convert the RGB color back to a hex color
  let complementaryColor = ((r << 16) | (g << 8) | b).toString(16);

  // Pad the color with zeros if necessary
  while (complementaryColor.length < 6) {
      complementaryColor = '0' + complementaryColor;
  }

  // Return the complementary color
  return '#' + complementaryColor;
}

export default getContrastColor