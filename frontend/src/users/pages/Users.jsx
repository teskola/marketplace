import React from "react";

import UsersList from "../components/UsersList";

const DUMMY_USERS = [
  {
    id: 'asdsad',
    name: 'John Smith',
    email: 'john@smith.com'
  },{
    id: 'fdgfdgfd',
    name: 'John Wick',
    email: 'john@wick.com'
  },{
    id: 'nbvvbnbv',
    name: 'Tony Stark',
    email: 'tony@stark.com'
  }
];

const Users = () => {
  return <UsersList items={DUMMY_USERS} />;
};

export default Users;