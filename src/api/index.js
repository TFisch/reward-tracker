import { mockCustomerData } from '../testData';

// Fetch request to GET customer data
export const getTransactionData = async () => {
  try {
    // let response = await fetch(`endpointhere`);
    // let data = await response.json();
    let response = mockCustomerData;
    return response;
  } catch (error) {
    console.log('error: ', error);
  }
};
