import { AuthContext } from "@/providers/auth-provider";
import { useContext } from "react";

function useAuth() {
  const auth = useContext(AuthContext);
  return auth;
}

export default useAuth;
