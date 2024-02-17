<template>
  <header>
    <div class="flex">
      <h1 v-text="webappName"></h1>
      <!-- Toggle Cart (Show Cart of hide it's view) -->
      <input
        class="search"
        type="search"
        placeholder="Search for Lessons to book"
        v-model="searchQuery"
        v-if="!showCart"
      />
    </div>
    <div class="header__buttons">
      <!-- Cart button -->
      <div class="header__buttons--cart">
        <button @click="toggleShowCart" :disabled="totalItemsInTheCart === 0">
          <img src="./assets/imgs/cart.svg" alt="Cart Icon" />
          {{
            `${
              totalItemsInTheCart > 1
                ? totalItemsInTheCart + ' Items'
                : totalItemsInTheCart + ' Item'
            } in cart`
          }}
        </button>
        <button @click="resetCart" :disabled="totalItemsInTheCart === 0">
          <img src="./assets/imgs/trash.svg" alt="Trash Icon" />
          Reset Cart
        </button>
      </div>

      <!-- Sorting buttons [subject - location -  price - spaces] -->
      <div class="header__buttons--sorting" v-if="!showCart">
        <button @click="sortBySubject">Sort by Subject</button>
        <button @click="sortByLocation">Sort by Location</button>
        <button @click="sortByPrice">Sort by Price</button>
        <button @click="sortBySpaces">Sort by Spaces</button>
      </div>
    </div>
    <button class="backBtn" @click="toggleShowCart" v-if="showCart">
      ⇦ Back to Lessons
    </button>
  </header>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      sitename: 'Vue.js Pet Depot',
      cart: [],
      currentView: ProductList
    }
  },
  components: { ProductList, Checkout },
  methods: {
    showCheckout() {
      if (this.currentView === ProductList) {
        this.currentView = Checkout
      } else {
        this.currentView = ProductList
      }
      //this.cart.push({id: 1001})
    }
  }
}
</script>
