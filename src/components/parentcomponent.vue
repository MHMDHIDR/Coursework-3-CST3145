<template>
  <div id="app">
    <!-- Loading Before Lessons are done fetching -->
    <div id="loading" v-if="!fetchedLessons.length && !apiError">
      <div id="wrapper">
        <div id="mouse"></div>
        <div class="loader"></div>
        <div class="loading-bar">
          <div class="progress-bar"></div>
        </div>
        <div class="status">
          <div class="state"></div>
          <div class="percentage"></div>
        </div>
      </div>
    </div>
    <div class="container">
      <header>
        <div class="flex">
          <h1>{{ webappName }}</h1>
          <!-- Toggle Cart (Show Cart of hide it's view) -->
          <input
            class="search"
            type="search"
            placeholder="Search for Lessons to book"
            v-model="searchQuery"
            v-if="!showCart"
          />
        </div>
        <!-- Test Console and Its Functionalities -->
        <div class="header__buttons">
          <a v-bind:href="`${ELASTIC_BEANSTALK_API_URL}/lessons`" target="_blank">
            <button>🟢 HTTPS Test</button>
          </a>
          <button @click="deleteAllCaches">
            <img :src="trashIcon" alt="Trash Icon" width="15" />
            Delete All Caches
          </button>
          <button @click="unregisterAllServiceWorkers">
            🔄 Unregister All ServiceWorkers
          </button>
          <button @click="reloadPage" class="test-elem">♻️ Reload Page</button>
        </div>
        <div class="header__buttons">
          <!-- Cart button -->
          <div class="header__buttons--cart">
            <button @click="toggleShowCart" :disabled="totalItemsInTheCart === 0">
              <img :src="cartIcon" alt="Cart Icon" />
              {{
                `${
                  totalItemsInTheCart > 1
                    ? totalItemsInTheCart + ' Items'
                    : totalItemsInTheCart + ' Item'
                } in cart`
              }}
            </button>
            <button @click="resetCart" :disabled="totalItemsInTheCart === 0">
              <img :src="trashIcon" alt="Trash Icon" />
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
      <main>
        <component
          :is="currentUI"
          :cart="cart"
          @remove-from-cart="removeFromCart"
          @checkout="checkout"
          :ELASTIC_BEANSTALK_API_URL="ELASTIC_BEANSTALK_API_URL"
          :filteredLessons="filteredLessons"
          :fetchedLessons="fetchedLessons"
          @add-to-cart="addToCart"
        />
      </main>
    </div>
  </div>
</template>

<script>
import Lessons from './lessons.vue'
import Checkout from './checkout.vue'
import {
  addToCart,
  checkout,
  removeFromCart,
  resetCart,
  saveOrder
} from '../scripts/cart/index.js'
import cartIcon from '/cart.png'
import trashIcon from '/trash.png'

export default {
  data() {
    return {
      webappName: 'After School Booking',
      ELASTIC_BEANSTALK_API_URL: `https://afterschoolbookingsystem-env.eba-mczp9a9e.eu-west-2.elasticbeanstalk.com`,
      showCart: false,
      searchQuery: '',
      sortCriteria: 'subject',
      sortDescending: false,
      initialLessons: [],
      fetchedLessons: [],
      cart: [],
      checkoutForm: {
        name: '',
        phone: ''
      },
      LOAD_LESSONS_DELAY: 500,
      SEARCH_DELAY: 1000,
      lastSearchQuery: '',
      // when API is down or not respondant, this will be shown
      apiError: null,
      cartIcon,
      trashIcon
    }
  },
  components: {
    Lessons,
    Checkout
  },
  methods: {
    deleteAllCaches() {
      caches.keys().then(function (names) {
        for (let name of names) caches.delete(name)
      })
      console.log('✅ Deleted Cache Successfully!')
    },
    unregisterAllServiceWorkers() {
      navigator.serviceWorker.getRegistrations().then(function (registrations) {
        for (let registration of registrations) {
          registration.unregister()
        }
      })
      console.log('✅ Unregistered ServiceWorkers')
    },
    reloadPage() {
      window.location.reload()
    },
    addToCart,
    removeFromCart,
    resetCart: function () {
      resetCart(this.cart, this.loadLessons)
    },
    checkout: function (checkoutForm) {
      checkout(checkoutForm, this.cart, this.updateLessonsSpaces)
    },
    saveOrder: function () {
      saveOrder(this.checkoutForm, this.cart)
    },

    loadLessons: function () {
      const loadLessonsInterval = setInterval(async () => {
        try {
          const fetchLessons = await fetch(`${this.ELASTIC_BEANSTALK_API_URL}/lessons`)
          const fetchedLessons = await fetchLessons.json()

          // Set the fetched lessons
          this.fetchedLessons = fetchedLessons
          // copy the lessons array to initialLessons
          this.initialLessons = fetchedLessons.slice()
        } catch (error) {
          this.apiError = `Sorry, We're unable to Get the lessons at the moment! Please try again later.`
          console.error('Error fetching lessons: ', error)
        } finally {
          if (typeof loadingPage !== 'undefined' && loadingPage !== null) {
            loadingPage.remove()
          }

          clearInterval(loadLessonsInterval)
        }
      }, this.LOAD_LESSONS_DELAY)
    },

    toggleShowCart: function () {
      this.showCart = !this.showCart
    },

    /**
     * if it was ascending then it will be descending and vice versa
     */
    toggleSorting: function () {
      this.sortDescending = !this.sortDescending
    },

    /**
     * I'll make sorting by subject and call the toggleSorting method
     */
    sortBySubject: function () {
      this.sortCriteria = 'subject'
      this.toggleSorting()
    },

    /**
     * I'll make sorting using location and call the toggleSorting method
     */
    sortByLocation: function () {
      this.sortCriteria = 'location'
      this.toggleSorting()
    },

    /**
     * I'll make sorting using price and call the toggleSorting method
     */
    sortByPrice: function () {
      this.sortCriteria = 'price'
      this.toggleSorting()
    },

    /**
     * here will be sorting using spaces and call the toggleSorting method
     */
    sortBySpaces: function () {
      this.sortCriteria = 'spaces'
      this.toggleSorting()
    },

    /**
     * Debounce method used to delay the fetch request
     * the fetch request will be called after the
     * user stops typing for 1 second
     * @param {*} func
     * @param {*} delay
     * @returns {Function}
     */
    debounce: function (func, delay) {
      let timeoutId
      return function () {
        const context = this
        const args = arguments
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {
          func.apply(context, args)
        }, delay)
      }
    }
  },
  computed: {
    filteredLessons: function () {
      const searchQuery = this.searchQuery.trim().toLowerCase()

      // Use debounce to delay the fetch request
      const delayedFetch = this.debounce(() => {
        if (searchQuery !== this.lastSearchQuery) {
          // Using the last searchQuery if the user types too fast searchQuery hasn't changed
          this.lastSearchQuery = searchQuery
          if (searchQuery !== '') {
            fetch(
              `${this.ELASTIC_BEANSTALK_API_URL}/search?query=${encodeURIComponent(
                searchQuery
              )}`
            )
              .then(res => res.json())
              .then(lessons => {
                if (!lessons.length || lessons.length === 0) return

                this.fetchedLessons = lessons.map(lesson => {
                  /*
                   * if the lesson that is fetched was is already in the cart
                   * then update the spaces with the bookedClasses
                   */
                  const cartLesson = this.cart.find(item => item._id === lesson._id)
                  if (cartLesson) {
                    lesson.spaces -= cartLesson.bookedClasses
                  }
                  return lesson
                })
              })
              .catch(error => {
                console.error('Error fetching search results:', error)
              })
          } else {
            this.fetchedLessons = this.initialLessons
          }
        }
      }, this.SEARCH_DELAY)

      /**
       *  Call the delayedFetch to make the fetch request when the user stops typing
       * to avoid making too many requests
       */
      delayedFetch()

      // Return the filtered lessons based on the searchQuery
      return (
        this.fetchedLessons
          .filter(
            lesson =>
              lesson.subject.toLowerCase().includes(searchQuery) ||
              lesson.location.toLowerCase().includes(searchQuery) ||
              String(lesson.price).includes(searchQuery) ||
              String(lesson.spaces).includes(searchQuery)
          )
          // sorting by the criteria and the order
          .sort((a, b) => {
            const order = this.sortDescending ? -1 : 1
            const criteria = this.sortCriteria

            if (a[criteria] < b[criteria]) return -order
            if (a[criteria] > b[criteria]) return order
            return 0
          })
      )
    },
    //simple method that will count the items I have in the cart
    totalItemsInTheCart: function () {
      return this.cart.length
    },
    //I'll check if the name has more than 1 letter, and check if the phone number is valid (only numbers)
    isInputValid: function () {
      const { name, phone } = this.checkoutForm
      const isPhoneValid = phone.trim().length > 2 // has at least 3 numbers
      const isNameValid = /^[A-Za-z]+$/.test(name.trim()) && name.trim().length > 1 //  only letters and has at least 2 letters [spaces are NOT allowed]
      return isPhoneValid && isNameValid
    },
    //I'll calculate the total price of my cart
    totalCartPrice: function () {
      return this.cart.reduce((total, item) => total + item.totalPrice, 0)
    },
    currentUI: function () {
      return this.showCart ? 'checkout' : 'lessons'
    }
  },
  /**
   * I'll call the loadLessons method when the component
   * is created [when the page is loaded]
   */
  created() {
    this.loadLessons()
  }
}
</script>
