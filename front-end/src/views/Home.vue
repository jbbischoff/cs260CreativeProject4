<template>
  <div class="home">
    <div class="summary">
      <table v-if="displaySummary">
        <tr>
          <th class="date-cell">Date</th>
          <th>Income</th>
          <th v-for="c in summary.categories" :key="c">{{c}}</th>
          <th>Expenses</th>
          <th class="total-cell">Total</th>
        </tr>
        <tr v-for="d in summary.dates" :key="d">
          <td class="date-cell">{{formatDate(d)}}</td>
          <td class="number-cell">${{summary.totals[d]['Income'].toFixed(2)}}</td>
          <td class="number-cell" v-for="c in summary.categories" :key="c">{{formatCurrency(summary.totals[d][c])}}</td>
          <td class="number-cell">${{summary.totals[d]['Expenses'].toFixed(2)}}</td>
          <td class="number-cell total-cell" v-bind:class="{'negative-num': (summary.totals[d]['Total'] < 0)}">${{summary.totals[d]['Total'].toFixed(2)}}</td>
        </tr>
      </table>
      <p v-else>There is not data to display</p>
    </div>
  </div>
</template>


<style scoped>
.summary {
  display: flex;
  justify-content: center;
}

th, td {
  width: 6rem;
  padding: 0.25rem 0.75rem;
}

.number-cell {
  text-align: right;
}

.negative-num {
  color: #f00;
}
</style>


<script>
import axios from 'axios';
import moment from 'moment';

export default {
  name: 'Home',
  data() {
    return {
      summary: null
    }
  },
  created() {
    this.getSummary()
  },
  computed: {
    displaySummary() {
      return (this.summary != null) && (this.summary.size > 0);
    }
  },
  methods: {
    formatDate(dateString) {
      return moment(dateString).format('MMM YYYY');
    },
    formatCurrency(num) {
      return '$' + ((num != null) ? num.toFixed(2) : '0.00');
    },
    async getSummary() {
      try {
        let expensesResult = await axios.get('/api/expense');
        let incomeResult = await axios.get('/api/income');

        let summary = {
          categories: new Set(),
          dates: new Set(),
          totals: {},
          size: 0
        };

        expensesResult.data.reduce((result, element) => {
            result.categories.add(element.category);
            let currDate = element.date.substring(0,7);
            if (!Object.prototype.hasOwnProperty.call(result.totals, currDate)) {
              result.dates.add(currDate);
              result.totals[currDate] = {};
              ++result.size;
              result.totals[currDate][element.category] = 0;
              result.totals[currDate]['Income'] = 0;
              result.totals[currDate]['Expenses'] = 0;
              result.totals[currDate]['Total'] = 0;
            }
            else {
              if (!Object.prototype.hasOwnProperty.call(result.totals[currDate], element.category)) {
                result.totals[currDate][element.category] = 0;
              }
            }

            result.totals[currDate][element.category] += element.amount;
            result.totals[currDate]['Expenses'] += element.amount;
            result.totals[currDate]['Total'] -= element.amount;

            return result;
          }, summary);

        incomeResult.data.reduce((result, element) => {
            let currDate = element.date.substring(0,7);
            if (!Object.prototype.hasOwnProperty.call(result.totals, currDate)) {
              result.dates.add(currDate);
              result.totals[currDate] = {};
              ++result.size;
              result.totals[currDate]['Income'] = 0;
              result.totals[currDate]['Expenses'] = 0;
              result.totals[currDate]['Total'] = 0;
            }

            result.totals[currDate]['Income'] += element.amount;
            result.totals[currDate]['Total'] += element.amount;

            return result;
          }, summary);

        summary.categories = Array.from(summary.categories).sort();
        summary.dates = Array.from(summary.dates).sort().reverse();
        this.summary = summary;
      }
      catch (error) {
        console.log(error);
      }
    }
  }
}
</script>
