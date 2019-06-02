<template>
  <section>
    <header>
      <button @click="flipSide">
        &times;
      </button>
    </header>

    <div ref="backdrop" class="backdrop" :data-state="sideCurrent.value" data-show="open" @click.self="flipSide">
      <aside data-show="open">
        <button @click="flipSide">
          &times;
        </button>
      </aside>
    </div>
  </section>
</template>

<style lang="scss" scoped>
  header {
    position: fixed;
    top: 0;
    height: 4rem;
    width: 100%;
    padding: 1rem;
    background-color: white;
    box-shadow: 0 4px 8px rgba(black, 0.26);
    z-index: 999;

    button {
      float: right;
      height: 100%;
      border: none;
      background-color: transparent;
      font-size: 1.3rem;
      cursor: pointer;

      @media screen and (min-width: 768px) {
        display: none;
      }
    }
  }

  .backdrop {
  position: absolute;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100%;
  background-color: rgba(black, 0.6);
  opacity: 0;
  transition: opacity 200ms ease-in-out;
  pointer-events: none;
  z-index: 1000;

  &[data-active] {
    opacity: 1;
    pointer-events: all;
  }
}

aside {
  position: fixed;
  top: 0;
  right: -100%;
  height: 100vh;
  width: 30rem;
  max-width: 80%;
  padding: 1rem;
  background-color: white;
  transition: right 200ms ease-in-out;
  box-shadow: -4px 0 10px rgba(black, 0.26);
  pointer-events: none;

  &[data-active] {
    right: 0;
    pointer-events: all;
  }

  button {
    float: right;
    border: none;
    background-color: transparent;
    font-size: 1.3rem;
    cursor: pointer;
  }
}
</style>

<script>
import sideMachine from '~/lib/sideMachine.js'

export default {
  data() {
    return {
      sideCurrent: sideMachine.initialState
    }
  },
  created() {

  },
  methods: {
    flipSide() {
      this.sideCurrent = sideMachine.transition(this.sideCurrent, 'TOGGLE')
      this.setSidenavState(this.sideCurrent.value)
    },
    setSidenavState(state) {
      // change data-state attribute
      this.$refs.backdrop.dataset.state = state
      console.log(this.$refs)

      // remove any active data-attributes
      document.querySelectorAll(`[data-active]`).forEach(el => {
        delete el.dataset.active
      })

      // add active data-attributes to proper elements
      document.querySelectorAll(`[data-show~="${state}"], [data-hide]:not([data-hide~="${state}"])`)
        .forEach(el => {
          el.dataset.active = true
        })
    }
  }
}
</script>
