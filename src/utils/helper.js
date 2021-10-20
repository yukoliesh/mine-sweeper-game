// Get random number 
export const getRandomNumber = (dimension) => {
  return Math.floor(Math.random() * 1000 + 1) % dimension;;
};