<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Summary</router-link>
      <router-link to="/expenses">Expenses</router-link>
      <router-link to="/income">Income</router-link>
    </div>
    <div id="body">
      <router-view/>
    </div>
    <div id="foot">
      <a href="https://github.com/jbbischoff/cs260CreativeProject4.git">GitHub</a>
    </div>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #222;
}

#nav, #foot {
  padding: 20px;
  background-color: #ddd;
}

#nav a, #foot a {
  padding: 0.5rem 0.75rem;
  font-weight: bold;
  text-decoration: none;
  color: #000;
}

#nav a.router-link-exact-active {
  color: #00d;
}

#body {
  padding: 20px;
}
</style>
