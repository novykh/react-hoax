# React Hoax

Idiomatic resourceful context.

## Installation

React Hoax requires **React 16.8.3 or later.**

```
npm install --save react-hoax
```

This assumes that you’re using [npm](http://npmjs.com/) package manager with a module bundler like [Webpack](https://webpack.js.org/) or [Browserify](http://browserify.org/) to consume [CommonJS modules](https://webpack.js.org/api/module-methods/#commonjs).

If you don’t yet use [npm](http://npmjs.com/) or a modern module bundler, and would rather prefer a single-file [UMD](https://github.com/umdjs/umd) build that makes `react-hoax` available as a global object, you can grab a pre-built version from [cdnjs](https://cdnjs.com/libraries/react-hoax). We _don’t_ recommend this approach for any serious application, as most of the libraries complementary to React Hoax are only available on [npm](http://npmjs.com/).

## Introduction

React Hoax itself is a small state management library. It includes some opinionated patterns that help you use React context more effectively.

It helps simplify a lot of common use cases in the React world, including providers setup, creating reducers and selectors.

It also helps with state normalization for resources.

#### For multiple resources [here](https://novykh.github.io/react-hoax/collectionHoax.html)
The `byId` pattern is persuaded, check the [initialState](https://novykh.github.io/react-hoax/collectionHoax.html#.initialState).

Example,
```
  import { makeCollectionHoax } from "react-hoax";

  const {
    Provider,
    useCollection,
    useMember,
    useSelector,
    useAction,
    useResourceSelector
  } = makeCollectionHoax("myCustomResource", {
    resourceOptions: {
      initialState: {
        title: "",
        description: "",
        keywords: [],
        industry: "",
        offer: ""
      }
    }
  });
```
As you can see, React Hoax provides you with the essentials to start coding right away.
This will create a Context provider, with the state:
```
{
  loading: true,
  loaded: false,
  processing: false,
  byId: {},
  ids: []
}
```
Which works for multiple resources of the same type.
Adding a resource of `id=1`, will change the state to:
```
{
  loading: false,
  loaded: true,
  processing: false,
  byId: {
    1: {
      loading: true,
      loaded: false,
      processing: false,
      errors: {},
      pristine: {},
      
      // plus our custom attributes needed
      title: "",
      description: "",
      keywords: [],
      industry: "",
      offer: ""
    }
  },
  ids: [1]
}
```

#### For a single resource [here](file:///Users/johnnyklironomos/Projects/react-hoax/docs/memberHoax.html)
It keeps it simple, check the [initialState](https://novykh.github.io/react-hoax/memberHoax.html#.initialState).

Example,
```
import { makeMemberHoax } from "react-hoax";

const initialState = {
  name: ""
};

const UserHoax = makeMemberHoax("user", { initialState });
const NameField = UserHoax.Field.Input({fieldKey: "name"});

const UserForm = () => (
  <UserHoax.Provider>
    <NameField />
  </UserHoax.Provider>
);
```

## Actions

React Hoax provides global actions for the everyday needs:
```
initialize
update
updateBatch
updateOnChange
reset
resetPristine
resetPristineKey
startFetch
doneFetch
failFetch
startProcess
doneProcess
```
but you can add more yourself. _documentation is coming soon..._

## Reducers

React Hoax provides opinionated reducers for member and collection resources.
They make use the global actions, but also, are extendable.

## Hooks

Hooks provided by the React Hoax, are of two flavors.

#### Selectors
For performant retrieving part of state (or all of it) of a resource. (i.e. `useResourceSelector`, `useSelector`)
But, also, for getting the action needed for dispatch from the resource's context. (i.e. `useAction`)

#### useMember & useCollection
Are you bored of passing down the components tree props and actions for simple CRUD operations on the state?
Those two selector hooks on steroids will save you the time and the sanity!

Check the API of `useMember`:
```
const [value, setValue, error, seError] = useMember({fieldKey: 'keyOnYourState'});
```
How fun is that?

Now check the API of `useCollection` _(it's basically helping with values on state that are arrays)_
```
const {collection, setCollection, add, push, edit, remove, reorder, error, setError} = useCollection({fieldKey: 'keyOnYourState'});
```

## Fields
_COMING SOON_

## Should You Use React Hoax?

Well yes! Just kidding, of course, [check Redux](https://redux.js.org/introduction/getting-started#should-you-use-redux) - same applies here, more or less.
Enjoy!

## License

[MIT](LICENSE.md)
