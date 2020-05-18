import { mockTransactionData, mockCustomerData } from '../testData';

// Fetch request to GET customer data
export const getTransactionData = async () => {
  try {
    // let response = await fetch(`endpointhere`);
    // let data = await response.json();
    let response = mockTransactionData;
    return response;
  } catch (error) {
    console.log('error: ', error);
  }
};

// Fetch request to GET customer data
export const getCustomerData = async () => {
  try {
    // let response = await fetch(`endpointhere`);
    // let data = await response.json();
    let response = mockCustomerData;
    return response;
  } catch (error) {
    console.log('error: ', error);
  }
};
