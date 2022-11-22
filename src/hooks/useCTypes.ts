import { useEffect, useState } from "react";
import { ICType, ICTypeSchema } from "@kiltprotocol/sdk-js";
import { KiltCType } from "../components/types";

const prod = "https://credential-service.zkid.app/ctypes";
const dev = "https://credential-service.starks.network/ctypes";
export function useCTypes() {
  const [cTypes, setCTypes] = useState<KiltCType[]>();
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    setLoading(true);
    fetch(prod, {
      method: "GET",
    })
      .then((Response) => Response.json())
      .then((data) => {
        if (data.code === 200) setCTypes(data.data as KiltCType[]);
      })
      .then(() => setLoading(false));
  }, []);

  return { cTypes, loading };
}
