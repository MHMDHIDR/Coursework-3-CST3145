<template>
  <div class="lessons">
    <article
      class="lesson card"
      v-for="lesson in filteredLessons"
      :key="lesson._id"
      v-if="fetchedLessons.length"
    >
      <div class="card__img">
        <img
          :src="`${ELASTIC_BEANSTALK_API_URL}/images/` + lesson.image"
          :alt="lesson.subject"
          width="150"
          height="150"
        />
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
              lesson.spaces === 0
                ? 'Fully Booked'
                : lesson.spaces === 1
                ? '1 Last Seat'
                : `Spaces: ${lesson.spaces}`
            }}
          </small>
          <span class="card__info--location">Location: {{ lesson.location }}</span>
        </div>

        <div>
          <span class="card__info--price">£{{ lesson.price }}</span>
        </div>
        <button
          class="card__icon"
          @click="addToCart(lesson)"
          :title="'Add ' + lesson.subject + ' to the Cart'"
          :disabled="lesson.spaces === 0"
        >
          <img
            src="./assets/imgs/cart.svg"
            alt="Cart Icon"
            :title="'Add ' + lesson.subject + ' to the Cart'"
          />
        </button>
      </div>
    </article>
    <!-- Search for lessons NOT found! -->
    <div class="errorMsg" v-if="fetchedLessons.length && fetchedLessons.length === 0">
      <p>Sorry, the lessons you are looking for cannot be found.</p>
      <p>Please try a different search or reset your filters.</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    fetchedLessons: {
      type: Array,
      required: true
    },
    ELASTIC_BEANSTALK_API_URL: {
      type: String,
      required: true
    }
  },
  methods: {
    addToCart(lesson) {
      this.$emit('add-to-cart', lesson)
    }
  }
}
</script>
