import { useQuery } from "react-query";
import LoadingSpinner from "../../shared/components/loadingspinner/LoadingSpinner";
import { getUser } from "../api/users";
import "./User.css";

const User = (props) => {
  const { isLoading, error, data } = useQuery(["userData", props.id], () =>
    getUser(props.id)
  );

  if (isLoading)
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );

  if (error) return "An error has occurred: " + error.message;

  return (
    <div>
      <h2>{data.name}</h2>
      <div className="userInfo">
        <table>
          <tr>
            <th>email:</th>
            <td>{data.email}</td>
          </tr>
          <tr>
            <th>phone:</th>
            <td>{data.phone ? data.phone : "N/A"}</td>
          </tr>
        </table>
      </div>
    </div>
  );
};

export default User;
