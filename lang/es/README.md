# @orby/core

**Orby** es una pequeño experimento de componentes funcionales basados en JSX y virtual-dom.

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

> Toda function con Orby, es un componente con un micro estado.

## Componente funcional

Un componente a base de funco, puede leer 3 argumentos.

1. props : Propiedades asociadas al componente.
2. state : Controlador del estado del componente.
3. context : Contexto dado al componente desde un nivel superior.

```js
function Component(props,state,context){
   return <div>
       {props.children}
   </div>
}
```

> cada vez que ud ejecuta `state.set()`, repinta la vista asociada solo al componente.

### State

El estado de cada componente se lee mediante el uso de `state.get()` y se actualiza mediante el uso de `state.set()`.

```js
function Component(props,state,context){
   return <button click={()=>state.set("Funco!")}>
       hello {state.get()||""}
   </button>
}
```

> Puede usar `{set,get}` para acceder directamente a `state.set` y `state.get`.

Funco, permite una definición de estado inicial de forma externa, mediante la propiedad `state=<any>`, asociada al componente.

```js

function App(props , {get}){
    get()// [1,2,3,4,5]
    return <button>Hi!</button>;
}

<App state={[1,2,3,4,5]}/>
```


### Context

Ud puede compartir estados mediante el uso de la propiedad `context=<any>`, asociada al componente.

```js
render(
   <App context={[1,2,3]}/>,
   document.querySelector("#app")
)
```

Ud puede definir un contexto inicial simplemente como propiedad

```js
function App(){
   return <OtherComponent context={[1,2,3,4]}/>
}
```

Ud puede modificar el contexto simplemente definiéndolo como una propiedad.

### Children
A diferencia de `React`, Funco fuerza que todo hijo asociado al componente será un nodo virtual.

Como autor no encuentro coherente el uso de `props.children[0]`, para acceder a una función asociada al hijo.
```js
<App>
{()=>{
   /** no funcionara **/
}}
</App>
```
Recomiendo fuertemente asociarla a una propiedad ya que a juicio de autor encuentro más legible, y se adapta a la mejor a la definición y comprobación de tipos.
```js
<App fun={()=>{

}}/>
```

### Componentes de alto orden

Funco utiliza `Map` sobre el nodo, para almacenar la función asociada al componente, ud puede compartir entre múltiples componentes un nodo específico del documento sin problema alguno.


> **Advertencia**, favor no cree intente crear componentes locales dentro del componente, ya que esto impide que se almacene el estado del mismo.

## Ciclo de vida

He sacado algunas ideas de [Hyperapp](https://github.com/jorgebucaran/hyperapp) ❤️ Funco.

### create

Se ejecuta una vez que se crea el tag.

```js
<h1 create={(target:HTMLElement)=>{
   /** any **/
}}>
   hola!
</h1>
```

### remove

Se ejecuta una vez que ha sido eliminado del nodo principal la etiqueta.

```js
<h1 remove={(target:HTMLElement)=>{
   /** any **/
}}>
   hola!
</h1>
```


### update

Se ejecuta una vez que se rerenderea la vista asociada a la etiqueta, si update retorna `false`, no propagara el cambio a sus hijos.

```js
<h1 update={(props:Object, target:HTMLElement)=>{
   /** any **/
}}>
   hola!
</h1>
```



