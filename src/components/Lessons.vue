<template>
  <div class="main bd-grid grid-wrapper">
    <!-- Show Error when lessons not found! -->
    <p class="errorMsg" v-if="apiError">{{ apiError }}</p>
    <!-- Lessons view -->
    <article class="lesson card" v-for="lesson in filteredLessons" :key="lesson._id" v-if="fetchedLessons.length">
      <div class="card__img">
        <img :src="`${ELASTIC_BEANSTALK_API_URL}/images/${lesson.image}`" :alt="lesson.subject" width="150" height="150">
        <small>{{ lesson.subject }}</small>
      </div>
      <div class="card__name">
        <small>{{ lesson.subject }}</small>
        <span class="card__info--location">Location: {{ lesson.location }}</span>
      </div>
      <div class="card__info">
        <div>
          <small class="card__info--spaces">
            {{
            lesson.spaces === 0 ? 'Fully Booked'
            : lesson.spaces === 1 ? '1 Last Seat'
            : `Spaces: ${lesson.spaces}`
            }}
          </small>
          <span class="card__info--location">Location: {{ lesson.location }}</span>
        </div>

        <div>
          <span class="card__info--price">£{{ lesson.price }}</span>
        </div>
        <button class="card__icon" @click="addToCart(lesson)" :title="'Add ' + lesson.subject + ' to the Cart'" :disabled="lesson.spaces === 0">
          <img :src="cartIcon" alt="Cart Icon" :title="'Add ' + lesson.subject + ' to the Cart'">
        </button>
      </div>
    </article>
    <!-- Search for lessons NOT found! -->
    <div class="errorMsg" v-else>
      <p>Sorry, the lessons you are looking for cannot be found.</p>
      <p>Please try a different search or reset your filters.</p>
    </div>
  </div>
</template>

<script>
import { addToCart } from '../scripts/cart/index.js'
import cartIcon from '../../public/cart.png'

export default {
  props: {
    filteredLessons: {
      type: Array,
      required: true
    },
    fetchedLessons: {
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
      apiError: null,
      cartIcon
    }
  },
  methods: {
    addToCart(lesson) {
      this.$emit('add-to-cart', lesson)
    }
  }
}
</script>
