import { useSelector } from "react-redux";
import {
  selectIsSessionLoading,
  selectSession,
  setIsSessionLoading,
  setSession
} from "features/auth";

export const useSession = () => {
  const session = useSelector(selectSession);
  const isSessionLoading = useSelector(selectIsSessionLoading);

  return {
    data: session,
    loading: isSessionLoading,
    setSession,
    setIsSessionLoading
  };
};
