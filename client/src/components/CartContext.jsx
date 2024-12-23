let cartTotal = 0;

const subscribers = [];

export const getCartTotal = () => cartTotal;

export const updateCartTotal = (value) => {
  cartTotal += value;
  subscribers.forEach((callback) => callback(cartTotal));
};

export const subscribeToCart = (callback) => {
  subscribers.push(callback);
};