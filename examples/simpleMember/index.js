import { makeMemberHoax } from "react-hoax";

const getInitialState = () => {
  name: "";
};

const UserHoax = makeMemberHoax("user", { getInitialState });
const NameField = UserHoax.makeField("name", "text");

const UserForm = () => (
  <UserHoax.Provider>
    <NameField />
  </UserHoax.Provider>
);
