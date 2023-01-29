import { useLazyQuery } from "@apollo/client";
import { useState, useEffect } from "react";
import { PRIOR_AUTH_LIST } from "./fetchPriorAuthList";
import { useSearchParams } from "react-router-dom";
import Preview from "./preview";
import PriodAuthTable from "./priorAuthTable";

interface DataType {
  tag: string;
  appointmentId: string;
  patientId: number;
  appointmentStart: string;
  appointmentStatus: string;
  isPriorAuthSubmissionEnabled: boolean;
  patientName: string;
}
const PriorAuthList = (props: any) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [
    fetchPriorAuthList,
    { loading, data, refetch },
  ] = useLazyQuery(PRIOR_AUTH_LIST);

  const [selectedItem, selectItem] = useState<DataType>();
  const [pageNumber, setPageNumber] = useState<number>();
  const [limitNumber, setLimitNumber] = useState<number>();

  useEffect(() => {
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "5");
    const appointmentStatus = searchParams.get("appointmentStatus") || null;
    const authStatus = searchParams.get("authStatus") || null;

    fetchPriorAuthList({
      variables: {
        tenant: "940e8edf-edd9-401d-a21a-10f866fbdb3f",
        page,
        limit,
        authStatus,
        appointmentStatus,
      },
      fetchPolicy: "network-only",
      notifyOnNetworkStatusChange: true,
    });
  }, [searchParams]);

  return (
    <div>
        <div className="prioAuthcontainer">
          <div className="filterContainer"></div>
          <PriodAuthTable
            data={data?.priorAuthList}
            selectPatient={selectItem}
            setSearchParams={setSearchParams}
            pageNumber={pageNumber}
            limitNumber={limitNumber}
            loading={loading}
          />
          {selectedItem ? <Preview selectedItem={selectedItem} /> : <></>}
        </div>
    </div>
  );
};

export default PriorAuthList;
