# @orby/core

**orby** is a small **experiment of functional components** based on virtual-dom.

```js
import {h,render} from "funco";

function App(props,{set,get}){
   return <button click={()=>set("Funco!")}>
       hello {get()||""}
   </button>
}

render(
   <App/>,
   document.querySelector("#app")
)
```

> All function with Funco, is a component with a micro state.

## Functional component

A component based on funco, can read 3 arguments.

1. props : Properties associated with the component.
2. state : Component status controller.
3. context : Context given to the component from a higher level.

```js
function Component(props,state,context){
   return <div>
       {props.children}
   </div>
}
```

> every time you run `state.set()`, it rerender the view associated only with the component.

### State

The state of each component is read by using `state.get ()` and is updated by using `state.set ()`.

```js
function Component(props,state,context){
   return <button click={()=>state.set("Funco!")}>
       hello {state.get()||""}
   </button>
}
```

> You can use `{set, get}` to directly access `state.set` and `state.get`.

Funco, allows an initial state definition externally, through the property `state = <any>`, associated to the component.

```js

function App(props , {get}){
    get()// [1,2,3,4,5]
    return <button>Hi!</button>;
}

<App state={[1,2,3,4,5]}/>
```

### Context

You can share states by using the `context=<any>` property, associated with the component.

```js
render(
   <App context={[1,2,3]}/>,
   document.querySelector("#app")
)
```

You can define an initial context simply as property.

```js
function App(){
   return <OtherComponent context={[1,2,3,4]}/>
}
```

You can modify the context simply by defining yourself as a property.

### Children

Unlike `React`, Funco forces every child associated with the component to be a virtual node.

As an author I do not find coherent the use of `props.children[0]`, to access a function.

```js
<App>
{()=>{
   /** It doesn't work **/
}}
</App>
```
I strongly recommend associating it with a property since, in the opinion of the author, I find it more readable, and adapts to the best definition and type checking.
```js
<App fun={()=>{

}}/>
```

### High order components

Funco uses `Map` on the nest, to store the function associated to the component, you can share between multiple components a specific node of the document without any problem.


> **Warning**, please do not try to create local components within the component, as this prevents the state of the component from being stored.



## Lifecycle

I've got some ideas from [Hyperapp](https://github.com/jorgebucaran/hyperapp) ❤️ Funco.

### create

It is executed once the tag is created.

```js
<h1 create={(target:HTMLElement)=>{
   /** any **/
}}>
   Hello!
</h1>
```

### remove

It runs once the label has been removed from the main node.

```js
<h1 remove={(target:HTMLElement)=>{
   /** any **/
}}>
   Hello!
</h1>
```


### update

It runs once the view associated with the tag is rendered, if update returns `false`, it will not propagate the change to its children.

```js
<h1 update={(props:Object, target:HTMLElement)=>{
   /** any **/
}}>
  Hello!
</h1>
```
```js
import {h,create,update,remove,property,state} from "wcomponent";

component("hello-tag",()=>{

    property("name");

    let {set,get} = state(()=>{

    });

    render((props)=><div>

    </div>);
});
```