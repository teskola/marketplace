import { useQuery } from "react-query";
import { getUser } from "../../users/api/users";

export const useUser = (id) => {
    return useQuery(["userData" + id, id], () =>
    getUser(id)
  );
}