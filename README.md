<img src="assets/logo.png" width="280px"/> 

Orby is a small and minimalist library to create modern interfaces based on JSX, Virtual-Dom and Functions.

[<img src="assets/counter.png" width="100%"/>](https://codesandbox.io/s/20k8jm0x0r)

## Index

1. [Motivation](#motivation)
2. [JSX](#jsx)
3. [Component](#component)
    1. [Properties of the component](#properties-of-the-component)
    2. [Control of component status](#control-of-component-status)
    3. [Control of the context of the component](#control-of-the-context-of-the-component)
4. [Lifecycle](#lifecycle)
    1. [onCreate](#onCreate)
    2. [onCreated](#onCreated)
    3. [onRemove](#onRemove)
    4. [onRemoved](#onRemoved)
    5. [onUpdate](#onUpdate)
    6. [onUpdated](#onUpdated)
5. [Hooks](#hooks)
    1. [useState](#useState)
    2. [useEffect](#useEffect)
    3. [useReducer](#useReducer)
    4. [useContext](#useContext)
6. [Special properties](#special-properties)
    1. [key](#key)
    2. [scoped](#scoped)
    3. [context](#context)
7. [Examples](#examples)
7. [Utils](#utils)

## Motivation

Simplify the creation and maintenance of components, limiting its scope only functions, avoiding the use of classes, with the aim of simplifying the learning curve centered only on the use of functions, life cycle associated with nodes, hooks and Jsx.

Another motivation is the use of shadow-dom, as part of the process of detecting changes. Example of this is the creation of a component with style scope thanks to the use of **shadow-dom**, please see the following example and note the definition of the property [scoped](#scoped).

```jsx
function Button(props){
    return <button scoped>
        <style>{`
            :host{
                padding : .5rem 1rem;
                border:none;
                background:black;
                color:white
            }
        `}</style>   
        {props.children}
    </button>
}
```

The `<Button/>` component will be isolated in the Dom tree, this will define a closed scope of css styles.

## JSX

[JSX](https://reactjs.org/docs/introducing-jsx.html) is defined as an extension of the JavaScript syntax, this allows to maintain a readable union between HTML and JS, and then be used for example in the manipulation of nodes, assignment of events, mutation of attributes and more.

When working with Orby, please consider the following differences with other libraries, such as React, in:

**Without fragment support**, Orby's components are more attached to the definition of a tree always maintaining a root node, this is how it is expressed in the [Lifecycle](#lifecycle).


## Component

The functional Orbison components and you can manipulate the state of the nodes either through the [Lifecycle](#lifecycle) associated with the virtual-dom or through the use of [hooks](#hooks).

### Properties of the component

Like any functional component, the first argument of the component will always be its properties.

```jsx
export function	Button(props){
    return <button onclick={props.click}>{props.children}</button>
}
```

The design pattern of purely functional components does not change if you were only limited to the use of Props.

### Control of the context of the component

The context allows you to share a defined object at a higher level, it will be very useful if you look for interaction between 2 components.

```jsx
export function	Button(props,context){
    return <button>{context.message}</button>
}
```

Another important point is that context management can be defined by using the `context` property external to the component.

```jsx
import {h,render} from "@orby/core";
import App from "./app";

render(
    <App context={{message:"hi! Orby"}}/>,
    document.querySelector("#app")
);
```

## Lifecycle

The life cycle manifests itself on the virtual-dom in the creation, updating and elimination of the nodes, this is similar to how it operates in [Hyperapp](https://github.com/jorgebucaran/hyperapp).

```jsx
export function Button(){
    return <button onCreate={handlerWithCreate}>Hi! Orby</button>
}
```

The DIFF process will invoke the `onCreate` properties only when the `<button/>`node is created in the dom tree. You can add the life cycle properties to the nodes you deem convenient.

### onCreate

The `onCreate` property is invoked when the node is added in the dom tree.

```jsx
export function Button(){
    return <button onCreate={(target:HTMLElement)=>{
    	/**algorithm**/
	}}>Hi! Orby</button>
}
```

### onCreated

The `onCreated` property is invoked after the node was added to the dom tree and propagated the changes to its children.

```jsx
export function Button(){
    return <button onCreated={(target:HTMLElement)=>{
    	/**algorithm**/
	}}>Hi! Orby</button>
}
```

### onRemove

The `onRemove` property is invoked when removing the node from the dom tree.

```jsx
export function Button(){
    return <button onRemove={(target:HTMLElement)=>{
    	/**algorithm**/
	}}>Hi! Orby</button>
}
```

### onRemoved

The `onRemoved` property is invoked after removing the node from the dom tree and propagating the changes to its children.

```jsx
export function Button(){
    return <button onRemoved={(target:HTMLElement)=>{
    	/**algorithm**/
	}}>Hi! Orby</button>
}
```

### onUpdate

The `onUpdate` property is invoked before propagating from the node of the dom tree. **return`false` to avoid such propagation**

```jsx
export function Button(){
    return <button onUpdate={(target:HTMLElement, prevProps:Object, nextProps:Object)=>{
    	/**algorithm**/
	}}>Hi! Orby</button>
}
```

### onUpdated

The `onUpdated` property is invoked after propagating from the node of the dom tree.

```jsx
export function Button(){
    return <button onUpdated={(target:HTMLElement)=>{
    	/**algorithm**/
	}}>Hi! Orby</button>
}
```


## Hooks

Hooks are a powerful way to extend the behavior of a functional component created with **Orby**, this is a small implementation based on the [React Hooks](https://reactjs.org/docs/hooks-intro.html), consider also knowing the benefits of this pattern and [rules associated with the use of Hooks](https://reactjs.org/docs/hooks-rules.html)

### ¿Why hooks?

Hooks are a powerful way to separate logic from the functional component, you can create custom effects that are linked to the component only with the invocation, it is such a link that these effects manage to control the state of the component without the need to know the same component.

### useState

It allows using a state and associating it with the component, by default the components in Orby do not have status since they are functions, if you require a component that can manipulate changes based on a state you can use `useState` within the component as many times as you deem appropriate. `useState` append the status control only when it is invoked within the component

> Unlike `useState` of React, this returns in the array a 3 argument, this one has the purpose of obtaining the state in asynchronous behaviors, its use is optional.

```jsx
import {h,useState} from "@orby/core";
export function Button(){
    let [state,useState] = useState();
}
```

Note that `useState` returns an array, which you can use with [Destructuring assignment](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) to associate A variable, `useState` also supports a first argument that defines the initial state.

```jsx
import {h,useState} from "@orby/core";

export function Button(){
    let [count,setCount] = useState(0);
}
```

if this first argument is a function, it is executed only when initializing the state of the component.

```jsx
import {h,useState} from "@orby/core";
function createState(){
    return {data:[]};
}
export function Button(){
    let [state,useState] = useState(createState);
}
```

### useEffect	

It allows the execution of a function so many times the component is executed, this function is executed after the rendering process associated with patching the changes of the node.

It is easier to understand the execution of `useEffect` by associating it with the life cycle methods of virtual-dom [onCreated](#onCreated) and [onUpdated](#onUpdated) and [onRemove](#onRemove).

```jsx
import {h,useEffect} from "@orby/core";

export function Button(){
    const [count, setCount] = useState(0);
    useEffect(()=>{
       document.title = `clicked ${count}`;
    });
    return <button click={()=>setCount(count+1)}>increment</button>;
}
```

If you try to assimilate the execution of the event [onRemove](#onRemove) of the virtual-dom within `useEffect`, the function associated with `useEffect` must return a function.

```jsx
export function Button(props,context){
 	const [count, setCount] = useState(0);
    useEffect(()=>{
       document.title = `clicked ${count}`;
        return ()=>{
            document.title = `component remove`;
        }
    });
    return <button click={()=>setCount(count+1)}>increment</button>;   
}
```

`useEffect` also receives a second argument, this gives the ability to limit the execution of the effect only to the changes associated with the second argument. The following example shows how to limit the execution of the effect only to a first instance.

```jsx
export function Button(props,context){
 	useEffect(()=>{
       console.log("component created")
        return ()=>{
            console.log("component remove")
        }
    },[true]);
    return <button click={()=>setCount(count+1)}>increment</button>;   
}
```

### useReducer

small implementation [use React](https://reactjs.org/docs/hooks-reference.html)

```jsx
const initialState = {count: 0};

function reducer(state, action) {
  switch (action.type) {
    case 'reset':
      return {count: action.payload};
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    default:
      // A reducer must always return a valid state.
      // Alternatively you can throw an error if an invalid action is dispatched.
      return state;
  }
}

function Counter({initialCount}) {
  const [state, dispatch] = useReducer(
    reducer,
    initialState,
    {type: 'reset', payload: initialCount},
  );

  return (
    <div>
      Count: {state.count}
      <button
        onClick={() => dispatch({type: 'reset', payload: initialCount})}>
        Reset
      </button>
      <button onClick={() => dispatch({type: 'increment'})}>+</button>
      <button onClick={() => dispatch({type: 'decrement'})}>-</button>
    </div>
  );
}
```



### useContext

It allows to recover the context of the component, unlike React's `useContext`, it returns the whole context if it does not have an argument.

```jsx
const context = useContext(Context);
```

Context is the return of the `createContext` instance of the library [@orby/context](https://github.com/orbyjs/context), this homologous behavior of `React.createContext`.

## Special properties

### key

It allows to define the identifier on the virtual-dom, to link it to a previous state, regardless of its order. The use of keys allows for example:

1. Maintain an associative state of virtual-dom and a node indifferent to its order.
2. Reduce the amount of manipulations associated with sun.

### scoped

the `scoped` property allows to enable the use of `shadow-dom` on the node, when defining scoped as true, the DIFF process will understand that the nodes will be mounted in the `shadowRoot` of the node.

```jsx
export function Button(props){
    return <button scoped>
        <style>{`:host{background:crimson}`}</style>	
        {props.children}
    </button>
}
```

### context

The `context` property allows you to add new properties to the context.

```jsx
<ParentComponent context={{title:"Hi! Orby"}}>
    <ChildComponent></ChildComponent>
</ParentComponent>
```

The example component `ChildComponent` can make use of the context defined in a superior way. Note that it is not necessary to enter the component to create contexts.

## Examples

| Title   | Description                  | link |
|---------|------------------------------|------------------------------------------------|
| Counter | shows the use of `useState` | [🔗 link](https://codesandbox.io/s/x308nz8mrp) |
| Counter with Reducer | shows the use of `useState`| [🔗 link](https://codesandbox.io/s/2ww3ylj5wp) | 
| Hooks Router | show how to use `useRouter` and `useRedirect`| [🔗 link](https://codesandbox.io/s/p7vzn8xx57) | 

## Utilities

| Title  | Description                                         | Repo                                           |
|---------|-----------------------------------------------------|------------------------------------------------|
| Router  | Manage your routes in a simple and declarative way  | [🔗 link](https://github.com/orbyjs/router)    |
| Context | A small implementation of `React.createContext`     | [🔗 link](https://github.com/orbyjs/context)   |