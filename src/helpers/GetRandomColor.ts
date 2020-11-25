const getRandomInt = (max: number) => {
  return Math.floor(Math.random() * Math.floor(max));
};

export const randomColor = () => {
  switch (getRandomInt(3)) {
    case 1: {
      return '#4285F4';
    }
    case 2: {
      return '#DB4437';
    }
    default: {
      return '#F4B400';
    }
  }
};
