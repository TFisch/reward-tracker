// Applies reward value to transaction based on amount
export const calcReward = (transAmount) => {
  // If transaction is greater than 100
  if (transAmount > 100) {
    const diff = transAmount - 100;
    const reward = diff * 2 + 50;

    return reward.toFixed(2);
    // If transaction is greater than 50
  } else if (transAmount > 50 && transAmount <= 100) {
    const reward = transAmount - 50;
    return reward.toFixed(2);
  } else {
    // if transaction is less than 50
    return 0;
  }
};

// Formats string to date Format
export const formatDate = (date) => {
  const splitDate = date.split('');
  const year = parseInt(splitDate.slice(0, 4).join(''));
  const month = parseInt(splitDate.slice(5, 7).join('') - 1);
  const day = parseInt(splitDate.slice(8, 10).join(''));
  const timeStamp = new Date(year, month, day);
  const formattedDate = { timeStamp, year, quarter: formatQuarter(timeStamp) };
  return formattedDate;
};

export const formatQuarter = (timeStamp) => {
  const month = timeStamp.getMonth();
  if (month < 3) {
    return 'Q1';
  } else if (month >= 3 && month < 6) {
    return 'Q2';
  } else if (month >= 6 && month < 9) {
    return 'Q3';
  } else {
    return 'Q4';
  }
};

export const formatDisplayYear = (year) => {
  if (year < 100) {
    return 1900 + year;
  } else if (year >= 100) {
    return 2000 + (year - 100);
  } else {
    console.log('Sorry, our records only go as far back as 1900.');
  }
};

export const formatCurrency = (amount) => {
  const truncDec = Number(amount.toString().match(/^\d+(?:\.\d{0,2})?/));
  const stringVal = truncDec.toString();
  const decimal = stringVal.split('.')[1];
  const len = decimal && decimal.length > 2 ? decimal.length : 2;
  return Number(stringVal).toFixed(len);
};
