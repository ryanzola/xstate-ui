import { Machine } from 'xstate'

export default new Machine(
  {
    id: 'sidenav',
    initial: 'close',
    states: {
      open: {
        on: {
          TOGGLE: 'close'
        }
      },
      close: {
        on: {
          TOGGLE: 'open'
        }
      }
    }
  })
