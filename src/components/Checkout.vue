<template>
  <div>
    <h2>Shopping Cart</h2>
    <div v-if="totalItemsInTheCart > 0">
      <ul class="cart-added-items">
        <li v-for="(item, index) in cart" :key="item._id + '-' + index">
          <img :src="`${ELASTIC_BEANSTALK_API_URL}/images/` + item.image" :alt="item.subject" width="50" height="50" />
          <p>
            [ {{ item.bookedClasses }} classes booked ] - {{ item.subject }}
            <span>- Total Price: <strong>£{{ Math.round(item.totalPrice) }}</strong> </span>
          </p>
          <button @click="removeFromCart(item)">Remove</button>
        </li>
      </ul>
      <p>Your total price for all classes booked = £{{ Math.round(totalCartPrice) }}</p>
      <form name="checkout">
        <div class="input-group">
          <label for="#name">Please Enter Your Name</label>
          <input type="text" id="name" :disabled="cart.length === 0" v-model="checkoutForm.name" />
        </div>
        <div class="input-group">
          <label for="#phone">Please Enter Your Phone Number</label>
          <input type="number" id="phone" :disabled="cart.length === 0" v-model="checkoutForm.phone" />
        </div>
      </form>
      <button @click="checkout" :disabled="cart.length === 0 || !isInputValid">Checkout</button>
    </div>
    <p class="errorMsg" v-else>
      Your Cart is empty, click <u>Back to Lessons</u> button to view the lessons
    </p>
  </div>
</template>

<script>
export default {
  props: {
    cart: {
      type: Array,
      required: true
    },
    ELASTIC_BEANSTALK_API_URL: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      checkoutForm: {
        name: '',
        phone: ''
      }
    };
  },
  computed: {
    totalItemsInTheCart() {
      return this.cart.length;
    },
    totalCartPrice() {
      return this.cart.reduce((total, item) => total + item.totalPrice, 0);
    },
    isInputValid() {
      const { name, phone } = this.checkoutForm;
      /** has at least 3 numbers */
      const isPhoneValid = phone.trim().length > 2;
      /** only letters and has at least 2 letters [spaces are NOT allowed] */
      const isNameValid =
        /^[A-Za-z]+$/.test(name.trim()) && name.trim().length > 1;
      return isPhoneValid && isNameValid;
    }
  },
  methods: {
    removeFromCart(item) {
      this.$emit('remove-from-cart', item);
    },
    checkout() {
      this.$emit('checkout');
    }
  }
};
</script>
