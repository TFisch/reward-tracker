// Applies reward value to transaction based on amount
export const calcReward = (transAmount) => {
  console.log('===============');
  console.log('amount: ', transAmount);
  // If transaction is greater than 100
  if (transAmount > 100) {
    const diff = transAmount - 100;
    const reward = diff * 2 + 50;
    console.log(reward.toFixed(2));
    console.log('===============');
    return reward;
    // If transaction is greater than 50
  } else if (transAmount > 50 && transAmount <= 100) {
    const reward = transAmount - 50;
    console.log(reward.toFixed(2));
    console.log('===============');
    return reward;
    // if transaction is less than 50
  } else {
    console.log('0');
    console.log('===============');
    return 0;
  }
};
