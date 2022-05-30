import "./styles.css";
import React from "react";
import ReactDOM from "react-dom";
import { Machine, assign } from "xstate";
import { useMachine } from "@xstate/react";
import Posts from './posts.tsx';

export const fetchPostMachine = Machine(
  {
    id: 'fetchPost',
    initial: 'idle',
    context: {
      posts: [],
      error: undefined,
      count: 0
    },
    states: {
      idle: {
        on: {
          '': 'loading'
          // FETCH: 'loading'
        }
      },
      loading: {
        invoke: {
            id: 'getPosts',
            src: (context, event) => {},
            onDone: {
              target: 'success',
              actions: assign({posts: (context, event) => event.data}),
            },
            onError: {
              target: 'failure',
              actions: assign({error: (context, event) =>event.data.message })
            },
            onEntry: 'clearError'
        }  
      },
      success: {
        type: 'final',
       
      },
      failure: {
        type: 'final',
     
      }
    }
  },
  {
    actions: {
      clearError: assign({ error: context => undefined })
    },
  

  }
);

const fetchPosts = () =>
  fetch(`https://jsonplaceholder.typicode.com/posts`)
  .then(response => {
    return response.json()
    // throw new Error('Something went wrong.')
  })
  .catch(error => {
    throw new Error(error);
  }); 

// const fetchPosts = () => {
//   return new Promise((resolve, reject) => {
//     reject('Something went wrong!')
//   })
// }

function App() {

  const [currentState, send] = useMachine(fetchPostMachine);

  // console.log(currentState.states)
  // console.log(currentState.context)
  // console.log(currentState.nextEvents)
  // console.log(currentState.changed)
  console.log(currentState.context.posts)

  // console.log(currentState.matches('idle'))


  return (
    <div className="app">
      <button className="btn btn-primary btn-refresh" onClick={() => {
          if ( currentState.matches('failure') || currentState.matches('success')) {
            send('RETRY')
          } else {
            send('FETCH')
          }
        }
      }>
        {
          currentState.matches('idle') ? 'Fetch Data' : 'Refresh Data'
        }
      </button>
      <div className="post-wrap">
        {
          currentState.matches('loading') &&
          <div className='loading'></div>
        }
        {
          currentState.matches('failure') &&
          <div className='error'>{currentState.context.error}</div>
        }
        <Posts posts={currentState.context.posts} />
      </div>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
