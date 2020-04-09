<template>
  <div class="expenses">
    <div class="add">
      <div class="form">
        <div class="input-group">
          <input v-model="eDate" type="date">
        </div>
        <div class="input-group input-number">
          <label>$</label>
          <input v-model="eAmount" type="number" step="0.01" placeholder="0.00">
        </div>
        <div class="input-group input-text input-text-small">
          <input v-model="eCategory" placeholder="Category">
        </div>
        <div class="input-group input-text input-text-large">
          <input v-model="eDescription" placeholder="Description">
        </div>
        <div class="input-group input-text input-text-large">
          <input v-model="eOther" placeholder="Other">
        </div>
        <div class="input-group input-button">
          <button :disabled="canUpload" @click="createExpense">Create Expense</button>
        </div>
      </div>
    </div>
    <div class="edit" v-if="editExpense">
      <div class="form">
        <div class="input-group">
          <input v-model="editExpense.date" type="date">
        </div>
        <div class="input-group input-number">
          <label>$</label>
          <input v-model="editExpense.amount" type="number" step="0.01" placeholder="0.00">
        </div>
        <div class="input-group input-text input-text-small">
          <input v-model="editExpense.category" placeholder="Category">
        </div>
        <div class="input-group input-text input-text-large">
          <input v-model="editExpense.description" placeholder="Description">
        </div>
        <div class="input-group input-text input-text-large">
          <input v-model="editExpense.other" placeholder="Other">
        </div>
        <div class="input-group input-button">
          <button :disabled="canSubmit" @click="updateExpense">Update Expense</button>
        </div>
      </div>
    </div>
    <div class="display" v-if="addExpense">
      <div v-if="addExpense" class="display-element expense-element">
        <p class="display-element-field display-element-field-small">{{formatDate(addExpense.date)}}</p>
        <p class="display-element-field display-element-field-small">${{addExpense.amount}}</p>
        <p class="display-element-field display-element-field-medium">{{addExpense.category}}</p>
        <p class="display-element-field display-element-field-large">{{addExpense.description}}</p>
        <p class="display-element-field display-element-field-large">{{addExpense.other}}</p>
      </div>
    </div>
    <hr/>
    <div class="display">
      <div class="display-element expense-element" v-for="e in expenses" :key="e._id">
        <div class="display-element-group">
          <p class="display-element-field display-element-field-small">{{formatDate(e.date)}}</p>
          <p class="display-element-field display-element-field-small">${{e.amount}}</p>
          <p class="display-element-field display-element-field-medium">{{e.category}}</p>
          <p class="display-element-field display-element-field-large">{{e.description}}</p>
          <p class="display-element-field display-element-field-large">{{e.other}}</p>
        </div>
        <div class="sidplay-element">
          <button @click="selectExpense(e)">Edit</button>
          <button @click="deleteExpense(e)">Delete</button>
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
  name: 'Expenses',
  data() {
    return {
      eDate: null,
      eAmount: null,
      eCategory: "",
      eDescription: "",
      eOther: "",
      addExpense: null,
      editExpense: null,
      expenses: []
    }
  },
  created() {
    this.getExpenses();
  },
  computed: {
    canUpload() {
      return (this.eDate === "") || (this.eAmount === "") || (this.eCategory === "");
    },
    canSubmit() {
      return (this.editExpense.date === "") || (this.editExpense.amount === "") || (this.editExpense.category === "");
    }
  },
  methods: {
    selectExpense(expense) {
      this.addExpense = null;
      this.editExpense = {
        _id: expense._id,
        date: expense.date,
        amount: expense.amount,
        category: expense.category,
        description: expense.description,
        other: expense.other
      };
    },
    formatDate(dateString) {
      return moment(dateString).format('D MMM YYYY');
    },
    async getExpenses() {
      try {
        console.log("Getting expenses");
        let response = await axios.get('/api/expense');
        //let list = response.data.map(expense => {expense.date = new Date(expense.date); return expense;});
        this.expenses = response.data.sort((a, b) => new Date(a.date) < new Date(b.date));
        return true;
      }
      catch (error) {
        console.log(error);
      }
    },
    async createExpense() {
      console.log("Posting expense");
      try {
        let response = await axios.post('/api/expense', {
          date: this.eDate,
          amount: this.eAmount,
          category: this.eCategory,
          description: this.eDescription,
          other: this.eOther
        });
        this.eAmount = "";
        this.eDescription = "";
        this.eOther = "";
        this.addExpense = response.data;
        this.getExpenses();
        return true;
      }
      catch (error) {
        console.log(error);
      }
    },
    async updateExpense() {
      console.log("Updating expense");
      try {
        await axios.put('/api/expense/' + this.editExpense._id, {
          date: this.editExpense.date,
          amount: this.editExpense.amount,
          category: this.editExpense.category,
          description: this.editExpense.description,
          other: this.editExpense.other
        });
        this.addExpense = null;
        this.editExpense = null;
        this.getExpenses();
        return true;
      }
      catch (error) {
        console.log(error);
      }
    },
    async deleteExpense(expense) {
      console.log("Deleting expense");
      try {
        await axios.delete('/api/expense/' + expense._id);
        this.addExpense = null;
        this.editExpense = null;
        this.getExpenses();
        return true;
      }
      catch (error) {
        console.log(error);
      }
    }
  }
}
</script>
