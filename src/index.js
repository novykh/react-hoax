/**
 * makeMemberHoax factory.
 * @namespace memberHoax
 * @see module:memberHoax.makeMemberProvider
 * @example
 *  import { makeMemberHoax } from "react-hoax";

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
 */
export { default as makeMemberHoax } from "./member";

/**
 * makeCollectionHoax factory.
 * @namespace collectionHoax
 * @see module:collectionHoax.makeCollectionProvider
 * @example
 *  import React, { useLayoutEffect, useEffect, Fragment } from "react";
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
  },
  idKey: 'title'
});

const MyCustomResourceName = ({title}) => {
  const [name, setName, error, setError] = useMember({resourceId: title, fieldKey: 'name'});

  return (
    <Fragment>
      {name}
      <button onClick={() => setName('FOO')}>change name to "FOO"</button>
    </Fragment>
  );
}

const MyCustomResourcesEntry = ({ children }) => {
  const startFetch = useAction("startFetch");
  const doneFetch = useAction("doneFetch");
  const [loaded, loading, ids] = useSelector(state => [state.loaded, state.loading, state.ids])
  const theDescriptionForGivenTitle = useResourceSelector('A title', state => state.description)

  useLayoutEffect(() => {
    if (!loaded) startFetch();
  }, [loaded]);

  useEffect(() => {
    if (loading) {
      promise.resolve([{title: 'A title', description: 'something'}])
        .then(data => doneFetch(data));
    }
  }, [loading])


  if (loading) return "Loading...";

  return <Fragment>{ids.map(title => <MyCustomResourceName key={id} title={title} />}</Fragment>;
};

const MyCustomResourcesProvider = () => (
  <Provider>
    <MyCustomResourcesEntry />
  </Provider>
);

export {
  useCollection,
  useMember,
  useSelector as useMyCustomResourcesSelector,
  useAction as useMyCustomResourceAction,
  useResourceSelector as useMyCustomResourceSelector
};
export { queries };
export default MyCustomResourcesProvider;
 */
export { default as makeCollectionHoax } from "./collection";

import * as hoaxActions from "./actions";
import * as hoaxResourceActions from "./collection/resource/actions";
export { hoaxActions, hoaxResourceActions };

import * as hoaxActionTypes from "./actionTypes";
import * as hoaxResourceActionTypes from "./collection/resource/actionTypes";
export { hoaxActionTypes, hoaxResourceActionTypes };
