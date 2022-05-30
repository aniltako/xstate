import "./styles.css";
import React from "react";
import ReactDOM from "react-dom";
import { Machine, assign } from "xstate";
import { useMachine } from "@xstate/react";
import Posts from './posts.tsx';

export const fetchPostMachine = Machine(
  {
    id: 'counter',
    initial: 'active',
    context: {
     count: 0
    },
    states: {
      active: {
        on: {
          TOGGLE: 'inactive'
        }
      },
      inactive: {
        on: {
          TOGGLE: 'active'
        },
        onEntry: 'increment',
      }
    }
  },
  {
    actions: {
      increment: assign({ count: context => context.count + 1 })
    }
  }
);

function App() {

  const [currentState, send] = useMachine(fetchPostMachine);

  console.log(currentState.matches('active'));

  return (
    <div className="app">
      <button className="btn btn-primary btn-refresh" onClick={() => send('TOGGLE')}>
        {
          currentState.matches('active') ? 'Disable' : 'Enable'
        }
  
      </button>
      <div className="post-wrap">
        {currentState.context.count}
      </div>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
