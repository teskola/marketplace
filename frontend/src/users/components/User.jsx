import LoadingSpinner from "../../shared/components/loadingspinner/LoadingSpinner";
import { useUser } from "../../shared/queries/useUser";

const User = (props) => {
  const { isLoading, error, data } = useUser(props.id);

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
          <tbody>
          <tr>
            <th>email:</th>
            <td>{data.email}</td>
          </tr>
          <tr>
            <th>phone:</th>
            <td>{data.phone ? data.phone : "N/A"}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default User;
