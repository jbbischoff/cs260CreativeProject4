<template>
  <div class="FormDate" @keyup.capture="updateValue">
    <input v-if="showDay" ref="day" v-model="day" class="FormDate-input FormDate-input--day" type="number" placeholder="dd" @input="updateDay" @blur="day = day.padStart(2, 0)">
    <span v-if="showDay && showMonth" class="FormDate-divider" >/</span>
    <input v-if="showMonth" ref="month" v-model="month" class="FormDate-input FormDate-input--month" type="number" placeholder="mm" @input="updateMonth" @blur="month = month.padStart(2, 0)">
    <span v-if="showYear && (showDay || showMonth)" class="FormDate-divider">/</span>
    <input v-if="showYear" ref="year" v-model="year" class="FormDate-input FormDate-input--year" type="number" placeholder="yyyy" @blur="year = year.padStart(4, 0)">
  </div>
</template>

<style scoped>
.FormDate {
  display: inline-flex;
  position: relative;
  overflow: hidden;
  border: 1px solid #888;
  border-radius: 0.25em;
}

.FormDate-input {
  padding: 0.75em;
  padding-right: 0.375em;
  padding-left: 0.375em;
  border: none;
  text-align: center;
  -moz-appearance: textfield;
}

.FormDate-input::-webkit-inner-spin-button {
  display: none;
}

.FormDate-input::first-child {
  padding-left: 0.75em;
}

.FormDate-input::last-child {
  padding-right: 0.75em;
}

.FormDate-input::focus {
  outline: none;
}

.FormDate-input--day, .FormDate-input--month {
  width: 3em;
}

.FormDate-input--year {
  width: 4em;
}

.FormDate-divider {
  padding-top: 0.75em;
  padding-bottom: 0.75em;
  pointer-events: none;
}
</style>


<script>
export default {
  name: 'DateInput',
  props: {
    value: {
      type: Number,
      required: true,
    },
    showDay: {
      type: Boolean,
      default: true,
    },
    showMonth: {
      type: Boolean,
      default: true,
    },
    showYear: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      day: `${this.value ? new Date(this.value).getDate() : ''}`,
      month: `${this.value ? new Date(this.value).getMonth() + 1 : ''}`,
      year: `${this.value ? new Date(this.value).getFullYear() : ''}`,
    };
  },
  watch: {
    year(current, prev) {
      if (current > 9999) this.year = prev;
    },
  },
  methods: {
    updateDay() {
      if (!this.day.length || parseInt(this.day, 10) < 4) return;
      if (this.showMonth) this.$refs.month.select();
      else if (this.showYear) this.$refs.year.select();
    },
    updateMonth() {
      if (!this.month.length || parseInt(this.month, 10) < 2) return;
      if (this.showYear) this.$refs.year.select();
    },
    updateValue() {
      const date = new Date(this.year, this.month, this.date);

      if (Number.isNaN(date.getTime())) return;

      this.$emit('dateInput', date);
    },
  },
};
</script>
