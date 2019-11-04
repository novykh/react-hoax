import { makeMemberHoax } from "react-hoax";

const initialState = {
  name: ""
};

const UserHoax = makeMemberHoax("user", { initialState });
const NameField = UserHoax.makeField("name", "text");

const UserForm = () => (
  <UserHoax.Provider>
    <NameField />
  </UserHoax.Provider>
);
