<img src="../../assets/logo.png" width="280px"/> 

Orby es una pequeña y minimalista librería para crear interfaces modernas a base de JSX, Virtual-Dom y Funciones.

[<img src="../../assets/counter.png" width="100%"/>](https://codesandbox.io/s/20k8jm0x0r)

## Índice

1. [Motivacion](#motivación)
2. [JSX](#jsx)
3. [Componente](#componente)
    1. [Propiedades del componente](#propiedades-del-componente)
    2. [Estado del componente](#estado-del-componente)
    3. [Contexto en componente](#contexto-en-componente)
4. [Ciclo de vida](#ciclo-de-vida)
    1. [oncreate](#oncreate)
    2. [oncreated](#oncreated)
    3. [onremove](#onremove)
    4. [onremoved](#onremoved)
    5. [onupdate](#onupdate)
    6. [onupdated](#onupdated)
5. [Hooks](#hooks)
    1. [useState](#useState)
    2. [useEffect](#useEffect)
6. [Propiedades especiales](#propiedades-especiales)
    1. [key](#key)
    2. [scoped](#scoped)
    3. [context](#context)
7. [Ejemplos](#ejemplos)

## Motivación

Simplificar la creación y mantención de componentes, limitando su alcance solo funciones, evitando la utilización de clases, con el objetivo de simplificar la curva de aprendizaje centrada solo en el uso de funciónes y Jsx.

Otra motivación es el aprovechamiento del shadow-dom, como parte del proceso de detección de cambios. Ejemplo de esto es la creación de un componente con alcance de estilo gracias al uso del **shadow-dom**, favor vea el siguiente ejemplo y note la definición de la propiedad [scoped](#scoped).

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

El componente `<Button/>` quedara asilado en el árbol de Dom, esto definirá un alcance cerrado de estilos css. 

## JSX

[JSX](https://reactjs.org/docs/introducing-jsx.html) se define como una extensión de la sintaxis de JavaScript, esta permite mantener una unión legible entre el HTML y JS, para luego ser usada por ejemplo en la manipulación de nodos, asignación de eventos, mutación de atributos y más.

Al momento de trabajar con Orby, por favor considere las siguientes diferencias con otras bibliotecas como React, en :

**Sin soporte a fragmentos**, los componentes de Orby se apegan mas a la definición de un árbol manteniendo siempre un nodo de raiz, esto es por como se expresa el [ciclo de vida](#ciclo-de-vida) del mismo arbol.



## Componente

Los componentes en Orby son funcionales y ud puede manipular el estado de los nodos sea mediante el [ciclo de vida](#ciclo-de-vida) asociado al virtual-dom o mediante el uso de [hooks](#hooks)

### Propiedades del componente

Al igual que cualquier componente funcional, el primer argumento del componente siempre serán sus propiedades

```jsx
export function	Button(props){
    return <button onclick={props.click}>{props.children}</button>
}
```

El patrón de diseño de componentes puramente funcionales no cambia si ud solo se limitara al uso de Props

### Contexto en componente

El contexto permite compartir un objeto definido a nivel superior, le resultara sumamente útil si busca interacción entre 2 componentes.

```jsx
export function	Button(props,context){
    return <button>{context.message}</button>
}
```

Otro punto importante es que el manejo del contexto puede ser definido mediante el uso de la propiedad `context` de forma externa al componente.

```jsx
import {h,render} from "@orby/core";
import App from "./app";

render(
    <App context={{message:"hi! Orby"}}/>,
    document.querySelector("#app")
);
```

## Ciclo de vida

El ciclo de vida  se manifiesta sobre el virtual-dom en la creación, actualización y eliminación de los nodos creados, esto es similar a como opera en [Hyperapp](https://github.com/jorgebucaran/hyperapp).

```jsx
export function Button(){
    return <button create={handlerWithCreate}>Hi! Orby</button>
}
```

El proceso de DIFF invocara la propiedades `oncreate` solo cuando el nodo `<button/>` se cree en el árbol de dom. Ud puede añadir las propiedad de ciclo de vida a los nodos que estime conveniente.

### oncreate

La propiedad `oncreate`  se invoca  cuando el nodo se añade en el árbol de dom.

```jsx
export function Button(){
    return <button oncreate={(target:HTMLElement)=>{
    	/**algorithm**/
	}}>Hi! Orby</button>
}
```

### oncreated

La propiedad `oncreated`  se invoca  luego de que el nodo se añadió al árbol de dom y propago los cambios hacia sus hijos.

```jsx
export function Button(){
    return <button oncreated={(target:HTMLElement)=>{
    	/**algorithm**/
	}}>Hi! Orby</button>
}
```

### onremove

La propiedad `onremove`  se invoca  al eliminar el nodo del arbol de dom.

```jsx
export function Button(){
    return <button onremove={(target:HTMLElement)=>{
    	/**algorithm**/
	}}>Hi! Orby</button>
}
```

### onremoved

La propiedad `onremoved`  se invoca  luego de eliminar el nodo del arbol de dom y propagar los cambios hacia sus hijos.

```jsx
export function Button(){
    return <button onremoved={(target:HTMLElement)=>{
    	/**algorithm**/
	}}>Hi! Orby</button>
}
```

### onupdate

La propiedad `onupdate` se invoca  antes de propagar del nodo del arbol de dom. **retorne`false` para evitar tal propagación**

```jsx
export function Button(){
    return <button onupdate={(target:HTMLElement, prevProps:Object, nextProps:Object)=>{
    	/**algorithm**/
	}}>Hi! Orby</button>
}
```

### onupdated

La propiedad `onupdated` se invoca  luego de propagar del nodo del arbol de dom. 

```jsx
export function Button(){
    return <button onupdated={(target:HTMLElement)=>{
    	/**algorithm**/
	}}>Hi! Orby</button>
}
```

## Hooks

Los hooks son una poderosa forma de extender el comportamiento de un componente funcional creado con **Orby**, esta es una pequeña implementación basada en  los [Hooks de React](https://reactjs.org/docs/hooks-intro.html), considere también conocer bien las [reglas asociadas al uso de Hooks](https://reactjs.org/docs/hooks-rules.html)

### ¿Por que hooks?

Los hooks son una poderosa forma de independizar lógica del componente funcional, ud puede crear efectos personalizados que se vinculen al componente solo con la invocación, es tal la vinculación que dichos efectos logran controlar el estado del componente sin la necesidad de conocer al mismo.

### useState

Permite usar un estado y asociarlo al componente, por defecto los componentes en Orby no poseen estado  ya que son funciones, si ud requiere un componente que pueda manipular cambios a base de un estado puede usar `useState` dentro del componente tantas veces estime conveniente. `useState` anexara  el control de estado solo cuando este se invoque dentro del componente

> A diferencia de `useState` de React, este retorna en el arreglo un 3 argumento, este posee la finalidad de obtener el estado en comportamientos asíncronos, su uso es opcional.

```jsx
import {h,useState} from "@orby/core";
export function Button(){
    let [state,useState,getState] = useState();
}
```

Note que `useState` retorna un arreglo, el que ud mediante el uso de [Destructuring assignment](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) puede asociar a una variable,  `useState` también admite un primer argumento el que define el estado inicial.

```jsx
import {h,useState} from "@orby/core";

export function Button(){
    let [count,setCount] = useState(0);
}
```

si este primer argumento es una función, se ejecutara solo al inicializar el estado del componente.

```jsx
import {h,useState} from "@orby/core";
function createState(){
    return {data:[]};
}
export function Button(){
    let [state,useState,getState] = useState(createState);
}
```



### useEffect	

Permite la ejecución de una función tantas veces se ejecute el componente, esta función se ejecuta luego del proceso de render asociado a parchar los cambios del nodo. 

Es mas fácil entender a la ejecución de `useEffect` asociándola a los métodos de ciclo de vida del virtual-dom [oncreated](#created) y [onupdated](#onupdated) y [onremove](#onremove).

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

si ud busca asimilar la ejecución del evento  [onremove](#remove) del virtual-dom dentro de `useEffect`, la función asociada a `useEffect` deberá retornar una función.

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

`useEffect` también recibe un segundo argumentó, este le entrega la capacidad de limitar la ejecución del efecto solo ante los cambios asociados al segundo argumento. el siguiente ejemplo enseña como limitar la ejecución del efecto solo a una primera instancia. 

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



## Propiedades especiales

### key

Permite definir identificador sobre el virtual-dom, para vincularlo a un estado anterior, indiferente a su orden. El uso de keys permite por ejemplo : 

1.  Mantener un estado asociativo del virtual-dom y un nodo indiferente a su orden.
2. Reducir la cantidad de manipulaciones asociadas al dom.

### scoped

la propiedad `scoped` permite habilitar el uso de `shadow-dom` sobre el nodo, al definir scoped como verdadero, el proceso de DIFF, entenderá que los nodos se montaran en el `shadowRoot` del nodo.

```jsx
export function Button(props){
    return <button scoped>
        <style>{`:host{background:crimson}`}</style>	
        {props.children}
    </button>
}
```

### context

la propiedad `context`, permite añadir nuevas propiedades al contexto.

```jsx
<ParentComponent context={{title:"Hi! Orby"}}>
    <ChildComponent></ChildComponent>
</ParentComponent>
```

El componente  de ejemplo `ChildComponent`, puede hacer uso del contexto definido de forma superior. Note que no es necesario ingresar al componente para crear contextos. 

## Ejemplos

|Titulo | link |
|-------|------|
|Counter | [🔗 link](https://codesandbox.io/s/20k8jm0x0r) |