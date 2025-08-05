export const typeWriter = (text, target, speed = 20) => {
  return new Promise((resolve) => {
    let i = 0;
    const type = () => {
      if (i < text.length) {
        target.textContent += text.charAt(i);
        i++;
        setTimeout(type, speed);
      } else {
        resolve();
      }
    };
    target.textContent = '';  // Reset target
    type();
  });
};