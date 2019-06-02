<template>
  <div class="container">
    <Login />
  </div>
</template>

<script>
import sideMachine from '~/lib/sideMachine.js'

export default {
  name: 'Toggle',
  data() {
    return {
      sideCurrent: sideMachine.initialState
    }
  },
  methods: {
    // Send events to the service
    send(event) {
      this.toggleService.send(event)
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  height: 100vh;
  width: 100%;
  padding: 4.6rem 1rem 1rem;
  background-color: aliceblue;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
