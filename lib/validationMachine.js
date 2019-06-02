import { Machine, assign } from 'xstate'

export default Machine(
  {
    context: {
      password: ''
    },
    initial: 'idle',
    states: {
      idle: {
        onEntry: 'clearPassword',
        on: {
          SUBMIT: {
            target: 'validating',
            cond: 'passwordEntered'
          },
          CHANGE: {
            target: 'idle',
            actions: 'updatePassword',
            internal: true // this prevents onEntry from running again
          }
        }
      },
      validating: {
        invoke: {
          src: 'validatePassword',
          onDone: {
            target: 'success'
          },
          onError: {
            target: 'error'
          }
        }
      },
      error: {
        after: {
          2000: 'idle'
        }
      },
      success: {}
    },
    on: {
      RESET: '.idle'
    }
  },
  {
    actions: {
      updatePassword: assign({
        password: (_, event) => {
          console.log(event.value)
          return event.value
        }
      }),
      clearPassword: () => {
        return { password: '' }
      }
    },
    guards: {
      passwordEntered: context => context.password && context.password.length
    },
    services: {
      validatePassword: context => {
        const promise = new Promise((resolve, reject) => {
          setTimeout(() => {
            if (context.password === 'password') {
              resolve('VALID')
            } else {
              reject(new Error('oopsie! 401'))
            }
          }, 2000)
        })

        return promise
      }
    }
  }
)
