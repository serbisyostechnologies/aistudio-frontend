import { useEffect } from "react";
import NetInfo from "@react-native-community/netinfo";
import { useDispatch } from "react-redux";
import { setNetworkStatus } from "../../src/redux/slices/networkSlice";

export default function useNetworkStatus() {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      dispatch(setNetworkStatus(state.isConnected));
    });

    return () => unsubscribe();
  }, []);
}