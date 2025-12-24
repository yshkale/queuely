export const getBookGradient = (isTop = false) => {
  const gradients = [
    ["hsl(0 84% 20%)", "hsl(0 72% 51%)"], // red
    ["hsl(142 76% 20%)", "hsl(142 71% 45%)"], // green
    ["hsl(346 77% 25%)", "hsl(346 84% 61%)"], // rose
    ["hsl(262 83% 25%)", "hsl(262 83% 58%)"], // purple
    ["hsl(221 83% 25%)", "hsl(221 83% 53%)"], // blue
    ["hsl(24 95% 25%)", "hsl(24 95% 53%)"], // orange
    ["hsl(280 89% 25%)", "hsl(280 89% 60%)"], // fuchsia
    ["hsl(173 80% 20%)", "hsl(173 80% 40%)"], // teal
  ];

  const [bottom, top] = gradients[Math.floor(Math.random() * gradients.length)];
  return isTop ? top : bottom;
};
