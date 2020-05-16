import React, { Component } from 'react';
import { getTransactionData } from '../api';
import { calcReward } from '../utilities/helpers';

class RewardsTracker extends Component {
  state = {
    formattedTransactions: [],
  };

  componentDidMount() {
    this.retrieveData();
  }

  retrieveData = async () => {
    const transactionData = await getTransactionData();
    const formattedTransactions = await this.applyRewardValue(transactionData);
    this.setState({ formattedTransactions }, () =>
      console.log(this.state.formattedTransactions)
    );
  };

  applyRewardValue = (transactionData) => {
    const formattedRewards = transactionData.map((trans) => {
      return {
        ...trans,
        reward: calcReward(trans.amount),
      };
    });
    return formattedRewards;
  };

  render() {
    return <div> textInComponent </div>;
  }
}

export default RewardsTracker;
