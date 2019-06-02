<template>
  <form ref="app" class="ui-modal" data-state="" autocomplete="off" @submit="onSubmit">
    <div class="ui-icon">
      <div class="ui-lock" />
    </div>
    <div class="ui-title">
      This link is password-protected
    </div>
    <div class="ui-subtitle">
      <span data-show="idle">
        Please enter the password to view this link.
      </span>
      <span data-show="validating">
        Validating...
      </span>
      <span data-show="error" class="ui-error">
        Invalid password
      </span>
      <span data-show="success">
        <a class="ui-link" href="http://www.ryanzola.com/" target="_blank">http://www.ryanzola.com</a>
      </span>
    </div>

    <div class="ui-password">
      <input ref="ui-password-input" type="password" class="ui-password-input" placeholder="the password is password">
    </div>

    <button ref="ui-submit" class="ui-submit">
      Submit
    </button>
    <button ref="ui-reset" class="ui-reset" type="button" title="Reset" @click="onReset">
      &times;
    </button>
  </form>
</template>

<script>
import { interpret } from 'xstate'
import passwordMachine from '@/lib/validationMachine.js'

function activate(state) {
  document.querySelector('.ui-modal').dataset.state = state.value

  // When the overall state matches a [data-show="..."] state, the element should have the data-active attribute.
  document.querySelectorAll('[data-active]').forEach(el => {
    el.removeAttribute('data-active')
  })

  document.querySelectorAll(`[data-show~="${state.value}"]`).forEach(el => {
    el.setAttribute('data-active', true)
  })
}

const service = interpret(passwordMachine)
  .onTransition(activate)

const { send } = service

export default {
  data() {
    return {
      state: passwordMachine.initialState
    }
  },
  mounted() {
    activate(passwordMachine.initialState)
    service.start()

    document.querySelector('.ui-password-input').addEventListener('input', e => {
      send({ type: 'CHANGE', value: e.target.value })
    })
  },
  methods: {
    onSubmit(e) {
      send('SUBMIT')
      e.preventDefault()
    },
    onReset(e) {
      send('RESET')
      this.$refs['ui-password-input'].value = ''
      e.preventDefault()
    }
  }
}
</script>

<style lang="scss" scoped>
$easing: cubic-bezier(.5, 0, .5, 1);

[data-show] {
  opacity: 0;

  &[data-active] {
    opacity: 1;
  }
}

[data-state~="idle"] {
  animation: reset 1s $easing both;
  .ui-icon {
    --bg: #f0f8ff;
    --color: var(--color-primary);
  }

  .ui-password {
    &:before {
      background-color: var(--color-primary);
      transform: translateX(-100%);
    }

    &:focus-within:before {
      transform: none;
    }
  }
}

[data-state~="validating"] {
  .ui-icon {
    --bg: #f0f8ff;
    --color: var(--color-primary);
  }
  .ui-password {
    &:before {
      transform-origin: left center;
      background-color: var(--color-primary);
      animation: password-validating 1s infinite;
    }
  }
  .ui-submit {
    opacity: 0.5;
    pointer-events: none;
  }
}

[data-state~="error"] {
  .ui-icon {
    background-color: #FAD0D8;
    --color: var(--color-error);
    animation: icon-error 1s cubic-bezier(.5, 0, .5, 1) both;
  }
  .ui-password {
    &:before {
      animation: slide-right .5s $easing both;
      background-color: #E2294E;
    }
  }
}

[data-state~="success"] {
  .ui-icon {
    --bg: var(--color-success);
    --color: var(--color-success);

    &:before {
      animation: icon-bg-success .5s ease-out both;
    }
  }
  .ui-password {
    &:before {
      animation: slide-right .5s $easing both;
      background-color: var(--color-success);
    }
  }
}

[data-state]:not([data-state~="idle"]) {
  .ui-password-input {
    pointer-events: none;
    cursor: not-allowed;
    opacity: 0.5;
  }
  .ui-submit {
    opacity: 0.5;
  }
}

.ui-modal {
  --color-primary: #1e90ff;
  --color-error: #E0294C;
  --color-success: #0DBE65;
  background-color: #fff;
  padding: 2rem 4rem;
  max-width: 414px;
  border-radius: .5rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  box-shadow: 0 4px 10px rgba(black, 0.26);
}

.ui-icon {
  height: 3rem;
  width: 3rem;
  border-radius: 50%;
  margin-bottom: 1rem;

  &:before {
    content: '';
    position: absolute;
    display: block;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: inherit;
    background: var(--bg);
    will-change: transform;
  }

  > .ui-lock {
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    &:before, &:after {
      content: '';
      position: absolute;
    }

    &:after {
      background-color: var(--color);
      height: 32%;
      width: 45%;
      transform: translateY(25%);
      border-radius: 2px;
    }

    &:before {
      width: 30%;
      height: 50%;
      transform: translateY(-5%);
      border-radius: 1rem;
      border: 4px solid var(--color);
    }
  }
}

.ui-title {
  font-size: 1rem;
  line-height: 2rem;
}

.ui-subtitle {
  font-size: 0.75rem;
  height: 1rem;
  margin-bottom: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #9A9CA2;

  > span {
    line-height: 1rem;
    position: absolute;
    white-space: nowrap;

    &.ui-error {
      font-weight: bold;
      color: var(--color-error);
    }
  }
}

.ui-password {
  appearance: none;
  background: none;
  border: none;
  padding-bottom: 2px;
  margin-bottom: 2rem;
  overflow: hidden;

  &:before, &:after {
    content: '';
    position: absolute;
    height: 2px;
    width: 100%;
    bottom: 0;
    left: 0;
    z-index: 1;
  }

  &:after {
    background-color: #E8E9F0;
    z-index: 0;
  }
}

.ui-password-input {
  appearance: none;
  background: none;
  border: none;
  height: 2rem;
  width: 15rem;

  &:focus {
    outline: none;
  }
}

.ui-submit {
  appearance: none;
  padding: 0 1.5rem;
  height: 2rem;
  border-radius: .5rem;
  border: 1px solid #d1d1d1;
  font-size: 0.75rem;
  color: white;
  background-color: var(--color-primary);

  &:active {
    transform: scale(0.9);
    transition-duration: .2s;
  }

  &:focus {
    outline: none;
  }
}

.ui-link {
  color: var(--color-primary);
  text-decoration: none;
}

.ui-reset {
  appearance: none;
  background: none;
  border: none;
  position: absolute;
  top: 0;
  right: 0;
  padding: 1rem;
  font-size: 1.3rem;

  &:focus {
    outline: none;
  }
}

@keyframes password-validating {
  from {
    transform: translateX(-100%) scaleX(.5);
  }
  to {
    transform: translateX(100%) scaleX(.5);
  }
}

@keyframes slide-right {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: none;
  }
}

@keyframes icon-error {
  from, 85%, to {
    transform: none;
  }
  20%, 50% {
    transform-origin: right center;
    transform: translateX(-30%) scaleX(1.1);
  }
  35%, 65% {
    transform-origin: left center;
    transform: translateX(30%) scaleX(1.1);
  }
}

@keyframes icon-bg-success {
  from {
    transform: scale(1);
    opacity: .5;
  }
  to {
    transform: scale(4);
    opacity: 0;
  }
}
</style>
