<template>
  <div class="checkout">
    <h2>Shopping Cart</h2>
    <div v-if="totalItems > 0">
      <ul class="cart-items">
        <li v-for="(item, index) in cart" :key="index">
          <div class="item-info">
            <div class="item-img">
              <img :src="item.image" :alt="item.subject" width="50" height="50" />
            </div>
            <div class="item-details">
              <p>{{ item.subject }}</p>
              <p>Price: £{{ item.price }}</p>
              <p>Quantity: {{ item.quantity }}</p>
              <button @click="removeFromCart(index)">Remove</button>
            </div>
          </div>
        </li>
      </ul>
      <p>Total Price: £{{ totalPrice }}</p>
      <button @click="checkout" :disabled="totalItems === 0">Checkout</button>
    </div>
    <p v-else>Your cart is empty.</p>
  </div>
</template>

<script>
export default {
  props: {
    cart: {
      type: Array,
      required: true
    }
  },
  computed: {
    totalItems() {
      return this.cart.reduce((total, item) => total + item.quantity, 0)
    },
    totalPrice() {
      return this.cart.reduce((total, item) => total + item.price * item.quantity, 0)
    }
  },
  methods: {
    removeFromCart(index) {
      this.$emit('remove-from-cart', index)
    },
    checkout() {
      // Emit an event to inform the parent component to handle the checkout process
      this.$emit('checkout')
    }
  }
}
</script>
