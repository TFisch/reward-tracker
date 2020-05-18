import React, { Component } from 'react';
import { getTransactionData, getCustomerData } from '../api';

import {
  calcReward,
  formatDate,
  formatDisplayYear,
  formatQuarter,
  formatCurrency
} from '../utilities/helpers';

import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import './styles.css';

class RewardsTracker extends Component {
  state = {
    formattedTransactions: [],
    yearsOnRecord: [],
    selectedYear: '',
    selectedQuarter: '',
    recordsSet: false,
    noRecords: false
  };

  componentDidMount() {
    this.retrieveData();
  }

  retrieveData = async () => {
    const transactionData = await getTransactionData();
    this.formatTransactionData(transactionData);
  };

  formatTransactionData = async (transactionData) => {
    const customerData = await getCustomerData();

    // Add reward value to transactions
    const formattedTransactions = transactionData.map((trans) => {
      return {
        ...trans,
        reward: calcReward(trans.amount),
        formattedDate: formatDate(trans.date)
      };
    });

    // Set default select values to present
    const presentDate = new Date();
    const presentYear = formatDisplayYear(presentDate.getYear());
    const presentQuarter = formatQuarter(presentDate);

    // Retreive all year values based on transaction records
    let yearsOnRecord = [];
    for (const trans of formattedTransactions) {
      const transYear = trans.formattedDate.timeStamp.getYear();

      if (!yearsOnRecord.includes(transYear)) {
        yearsOnRecord.push(transYear);
      }
    }

    yearsOnRecord.sort(function (a, b) {
      return b - a;
    });

    this.setState(
      {
        formattedTransactions,
        yearsOnRecord,
        customerData,
        selectedYear: presentYear,
        selectedQuarter: presentQuarter
      },
      () => this.setDisplayRecords()
    );
  };

  handleSelectChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value }, () => this.setDisplayRecords());
  };

  setDisplayRecords = () => {
    const { selectedQuarter, selectedYear, formattedTransactions } = this.state;
    // Show only results from selected year
    const filteredByYear = formattedTransactions.filter(
      (trans) => trans.formattedDate.year === JSON.parse(selectedYear)
    );

    // Show only results from selected quarter
    const filteredByQuarter = filteredByYear.filter(
      (trans) => trans.formattedDate.quarter === selectedQuarter
    );

    if (filteredByQuarter.length === 0) {
      this.setState({
        noRecords: true,
        recordsSet: true,
        transactionsByCustomerId: {}
      });
    } else {
      const transactionsByCustomerId = filteredByQuarter.reduce(
        (customerRecords, trans) => {
          if (!customerRecords[trans.customerId]) {
            customerRecords[trans.customerId] = [trans];
          } else {
            customerRecords[trans.customerId].push(trans);
          }
          return customerRecords;
        },
        {}
      );

      this.setState({
        recordsSet: true,
        noRecords: false,
        transactionsByCustomerId
      });
    }
  };

  render() {
    const {
      recordsSet,
      transactionsByCustomerId,
      noRecords,
      selectedQuarter,
      selectedYear
    } = this.state;

    // Populate options for year select menu
    const renderSelectYears = () => {
      const { yearsOnRecord } = this.state;
      return yearsOnRecord.map((year) => {
        let displayYear = formatDisplayYear(year);
        return (
          <option key={displayYear} value={displayYear}>
            {displayYear}
          </option>
        );
      });
    };

    // Render tables per customer
    const renderCustomerTables = () => {
      const allCustomerIds = Object.keys(transactionsByCustomerId);
      let displayTables = [];

      allCustomerIds.forEach((custId) => {
        const transactionsPerCustomer = Object.values(
          transactionsByCustomerId[custId]
        );

        const transTotal = transactionsPerCustomer.reduce((totalRew, trans) => {
          totalRew += JSON.parse(trans.amount);
          return totalRew;
        }, 0);

        const rewardsTotal = transactionsPerCustomer.reduce(
          (totalRew, trans) => {
            totalRew += JSON.parse(trans.reward);
            return totalRew;
          },
          0
        );

        displayTables.push(
          <div className="table-wrapper" key={custId}>
            <TableContainer component={Paper}>
              <Table aria-label="transaction-record-table">
                <TableHead>
                  <TableRow>
                    <TableCell align="right">Customer ID</TableCell>
                    <TableCell align="right">Transaction Date</TableCell>
                    <TableCell align="right">Transaction NO.</TableCell>
                    <TableCell align="right">Transaction Amount</TableCell>
                    <TableCell align="right">Rewards</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactionsPerCustomer.map((trans, index) => (
                    <TableRow key={trans.transactionId}>
                      <TableCell align="right">
                        {index === 0 && trans.customerId}
                      </TableCell>
                      <TableCell align="right">{trans.date}</TableCell>
                      <TableCell align="right">{trans.transactionId}</TableCell>
                      <TableCell align="right">{trans.amount}</TableCell>
                      <TableCell align="right">{trans.reward}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell align="right"></TableCell>
                    <TableCell align="right"></TableCell>
                    <TableCell align="right">Total</TableCell>
                    <TableCell align="right">
                      {formatCurrency(transTotal)}
                    </TableCell>
                    <TableCell align="right">
                      {formatCurrency(rewardsTotal)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        );
      });
      return displayTables;
    };

    return (
      <div>
        <div className="select-wrapper">
          <FormControl>
            <NativeSelect
              name="selectedQuarter"
              onChange={this.handleSelectChange}
              value={selectedQuarter}
              inputProps={{ 'aria-label': 'quarter' }}
            >
              <option value="" disabled>
                Select Quarter
              </option>
              <option value="Q1">Q1</option>
              <option value="Q2">Q2</option>
              <option value="Q3">Q3</option>
              <option value="Q4">Q4</option>
            </NativeSelect>
            <FormHelperText>Select Quarter</FormHelperText>
          </FormControl>
          <FormControl>
            <NativeSelect
              name="selectedYear"
              onChange={this.handleSelectChange}
              inputProps={{ 'aria-label': 'year' }}
              value={selectedYear}
            >
              <option value="" disabled>
                Select Year
              </option>
              {renderSelectYears()}
            </NativeSelect>
            <FormHelperText>Select Year</FormHelperText>
          </FormControl>
        </div>
        {noRecords && (
          <div class="no-records">
            <h4>No Records Found For This Quarter</h4>
          </div>
        )}
        {recordsSet && renderCustomerTables()}
      </div>
    );
  }
}

export default RewardsTracker;
