<template>
  <div class="income">
    <div class="add">
      <div class="form">
        <div class="input-group">
          <input v-model="iDate" type="date">
        </div>
        <div class="input-group input-number">
          <label>$</label>
          <input v-model="iAmount" type="number" step="0.01" placeholder="0.00">
        </div>
        <div class="input-group input-text input-text-large">
          <input v-model="iDescription" placeholder="Description">
        </div>
        <div class="input-group input-text input-text-large">
          <input v-model="iOther" placeholder="Other">
        </div>
        <div class="input-group input-button">
          <button :disabled="canUpload" @click="createIncome">Create Income</button>
        </div>
      </div>
    </div>
    <div class="edit" v-if="editIncome">
      <div class="form">
        <div class="input-group">
          <input v-model="editIncome.date" type="date">
        </div>
        <div class="input-group input-number">
          <label>$</label>
          <input v-model="editIncome.amount" type="number" step="0.01" placeholder="0.00">
        </div>
        <div class="input-group input-text input-text-large">
          <input v-model="editIncome.description" placeholder="Description">
        </div>
        <div class="input-group input-text input-text-large">
          <input v-model="editIncome.other" placeholder="Other">
        </div>
        <div class="input-group input-button">
          <button :disabled="canSubmit" @click="updateIncome">Update Income</button>
        </div>
      </div>
    </div>
    <div v-if="addIncome" class="display">
      <div v-if="addIncome" class="display-element income-element">
        <p class="display-element-field display-element-field-small">{{formatDate(addIncome.date)}}</p>
        <p class="display-element-field display-element-field-small">${{addIncome.amount}}</p>
        <p class="display-element-field display-element-field-large">{{addIncome.description}}</p>
        <p class="display-element-field display-element-field-large">{{addIncome.other}}</p>
      </div>
    </div>
    <hr/>
    <div class="display">
      <div class="display-element income-element" v-for="i in income" :key="i._id">
        <div class="display-element-group">
          <p class="display-element-field display-element-field-small">{{formatDate(i.date)}}</p>
          <p class="display-element-field display-element-field-small">${{i.amount}}</p>
          <p class="display-element-field display-element-field-large">{{i.description}}</p>
          <p class="display-element-field display-element-field-large">{{i.other}}</p>
        </div>
        <div class="sidplay-element">
          <button @click="selectIncome(i)">Edit</button>
          <button @click="deleteIncome(i)">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
hr {
  width: 24rem;
  margin: 0 auto;
}

.add, .edit {
  display: flex;
  justify-content: center;
}

.form {
  display: flex;
  justify-content: flex-start;
}

.input-group {
  margin: 0.5rem 0.75rem;
}

.input-number input {
  width: 6rem;
}

.input-text-small input {
  width: 10rem;
}

.display {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.display-element {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.25rem;
  border-top: 1px solid #666;
}

.display-element:last-of-type {
  border-bottom: 1px solid #666;
}

.display-element-group {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.display-element-field {
  margin: 0.5rem 0.75rem;
  text-align: left;
}

.display-element-field-small {
  width: 6rem;
}

.display-element-field-medium {
  width: 7rem;
}

.display-element-field-large {
  width: 10rem;
}
</style>


<script>
import axios from 'axios';
import moment from 'moment';

export default {
  name: 'Income',
  data() {
    return {
      iDate: "",
      iAmount: "",
      iDescription: "",
      iOther: "",
      addIncome: null,
      editIncome: null,
      income: []
    }
  },
  created() {
    this.getIncome();
  },
  computed: {
    canUpload() {
      return (this.iDate === "") || (this.iAmount === "");
    },
    canSubmit() {
      return (this.editIncome.date === "") || (this.editIncome.amount === "");
    }
  },
  methods: {
    selectIncome(income) {
      this.addIncome = null;
      this.editIncome = {
        _id: income._id,
        date: income.date,
        amount: income.amount,
        description: income.description,
        other: income.other
      };
    },
    formatDate(dateString) {
      return moment(new Date(dateString)).format('D MMM YYYY');
    },
    async getIncome() {
      try {
        console.log("Getting income");
        let response = await axios.get('/api/income');
        //let list = response.data.map(income => {income.date = new Date(income.date); return income;});
        this.income = response.data.sort((a, b) => a.date < b.date);
        return true;
      }
      catch (error) {
        console.log(error);
      }
    },
    async createIncome() {
      console.log("Posting income");
      try {
        let response = await axios.post('/api/income', {
          date: this.iDate,
          amount: this.iAmount,
          description: this.iDescription,
          other: this.iOther
        });
        this.iAmount = "";
        this.iDescription = "";
        this.iOther = "";
        this.addIncome = response.data;
        this.getIncome();
        return true;
      }
      catch (error) {
        console.log(error);
      }
    },
    async updateIncome() {
      console.log("Updating income");
      try {
        await axios.put('/api/income/' + this.editIncome._id, {
          date: this.editIncome.date,
          amount: this.editIncome.amount,
          description: this.editIncome.description,
          other: this.editIncome.other
        });
        this.addIncome = null;
        this.editIncome = null;
        this.getIncome();
        return true;
      }
      catch (error) {
        console.log(error);
      }
    },
    async deleteIncome(income) {
      console.log("Deleting income");
      try {
        await axios.delete('/api/income/' + income._id);
        this.addIncome = null;
        this.editIncome = null;
        this.getIncome();
        return true;
      }
      catch (error) {
        console.log(error);
      }
    }
  }
}
</script>
