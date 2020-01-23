import React, { useLayoutEffect } from "react";
import { makeCollectionHoax } from "react-hoax";

const {
  Provider,
  useCollection,
  useMember,
  useSelector,
  useAction,
  useResourceSelector
} = makeCollectionHoax("campaigns", {
  resourceOptions: {
    getInitialState: () => {
      title: "",
      description: "",
      keywords: [],
      industry: "",
      offer: ""
    }
  }
});

const CampaignsEntry = ({ children }) => {
  const startFetch = useAction("startFetch");
  const doneFetch = useAction("doneFetch");
  const failFetch = useAction("failFetch");

  const { loading } = useQuery(queries.getCampaigns, {
    variables: {},
    onCompleted: ({ campaigns }) => doneFetch(campaigns),
    onError: failFetch
  });

  useLayoutEffect(() => {
    if (loading) startFetch();
  }, [loading]);

  if (loading) return "Loading...";

  return children;
};

const CampaignsProvider = props => {
  return (
    <Provider>
      <CampaignsEntry {...props} />
    </Provider>
  );
};

export {
  useCollection,
  useMember,
  useSelector as useCampaignsSelector,
  useAction as useCampaignAction,
  useResourceSelector as useCampaignSelector
};
export { queries };
export default CampaignsProvider;
