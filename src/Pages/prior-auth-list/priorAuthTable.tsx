import { Table, Tag, Space, Select } from "antd";
import type { ColumnsType } from "antd/es/table";
import { CalendarTwoTone } from "@ant-design/icons";
import "./styles.css";
import { useState, useEffect } from "react";
import { authStatus, appointmentStatus } from "../../utils/constants";
import { useSearchParams } from "react-router-dom";

interface DataType {
  tag: string;
  appointmentId: string;
  patientId: number;
  appointmentStart: string;
  appointmentStatus: string;
  isPriorAuthSubmissionEnabled: boolean;
  patientName: string;
}

interface FilterType {
  appointmentStatus: string;
  authStatus: string;
}

const columns: ColumnsType<DataType> = [
  {
    title: "Patient Name",
    dataIndex: "patientName",
    key: "patientName",
    render: (_, { patientName, patientId }) => {
      return (
        <>
          <h4>{patientName}</h4>
          <p>{patientId}</p>
        </>
      );
    },
  },
  {
    title: "Appointment Start",
    dataIndex: "appointmentStart",
    key: "appointmentStart",
    render: (text) => {
      return text ? (
        <>
          <h4>
            <CalendarTwoTone style={{ marginRight: "7px" }} />
            {text}
          </h4>
        </>
      ) : (
        <></>
      );
    },
  },
  {
    title: "Appointment Status",
    dataIndex: "appointmentStatus",
    key: "appointmentStatus",
    render: (_, { appointmentStatus, appointmentId }) => (
      <>
        <Tag color={"blue"} key={appointmentId}>
          {appointmentStatus}
        </Tag>
      </>
    ),
  },
  {
    title: "Workflow Status",
    key: "tag",
    dataIndex: "tag",
    render: (_, { tag }) => (
      <>
        <Tag color={"red"} key={tag}>
          {tag}
        </Tag>
      </>
    ),
  },
];

const TableComp = ({
  data = {},
  selectPatient = () => {},
  limitNumber = 5,
  pageNumber = 1,
  setSearchParams,
  appointmentStatus: appointmentStatusFromParams,
  authStatus: authStatusFromParams,
}: any) => {
  const [page, setPage] = useState<number>(pageNumber);
  const [limit, setLimit] = useState<number>(limitNumber);
  const [filter, setFilter] = useState<FilterType>({
    appointmentStatus: appointmentStatusFromParams,
    authStatus: authStatusFromParams,
  });
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const newPage = parseInt(searchParams.get("page") || "1");
    const newLimit = parseInt(searchParams.get("limit") || "5");
    const newAppointmentStatus = searchParams.get("appointmentStatus") || "";
    const newAuthStatus = searchParams.get("authStatus") || "";
    setPage(newPage);
    setLimit(newLimit);
    setFilter({
      appointmentStatus: newAppointmentStatus,
      authStatus: newAuthStatus,
    });
  }, [searchParams]);

  const handleFilterChange = (key: string, value: string) => {
    let params: any = {
      page: 1,
      limit,
    };
    if (value) {
      params = {
        ...params,
        ...(filter?.authStatus && { authStatus: filter.authStatus }),
        ...(filter?.appointmentStatus && {
          appointmentStatus: filter.appointmentStatus,
        }),
        [key]: value,
      };
    } else {
      if (key === "appointmentStatus" && filter?.authStatus) {
        params.authStatus = filter.authStatus;
      } else if (key === "authStatus" && filter?.appointmentStatus) {
        params.appointmentStatus = filter.appointmentStatus;
      }
    }
    setSearchParams(params);
  };
  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      if (selectedRows?.length) {
        selectPatient({ ...selectedRows[selectedRows.length - 1] });
      } else {
        selectPatient(undefined);
      }
    },
    getCheckboxProps: (record: any) => ({
      name: record.patientName,
    }),
  };
  const { resources = [], pages = 1 } = data;
  const tableList: any[] = [];
  resources.forEach((doc: any) => {
    tableList.push({
      patientName: `${doc?.patientRead?.resource?.firstName || ""} ${
        doc?.patientRead?.resource?.lastName || ""
      }`,
      appointmentId: doc?.appointmentId,
      patientId: doc?.patientId,
      appointmentStart: doc?.appointmentStart,
      appointmentStatus: doc?.appointmentStatus,
      tag: doc?.tag,
      key: doc?.appointmentId
    });
  });

  const handleChange = (
    newPage: number = pageNumber,
    newLimit: number = limitNumber
  ) => {
    setSearchParams({
      page: newPage,
      limit: newLimit,
      ...(filter?.authStatus && { authStatus: filter.authStatus }),
      ...(filter?.appointmentStatus && {
        appointmentStatus: filter.appointmentStatus,
      }),
    });
  };

  return tableList?.length ? (
    <div className="priorAuthTable">
      <h1>Prio Auth</h1>
      <Space wrap>
        <Select
          placeholder="Appointment Status"
          style={{ width: 250, margin: 20 }}
          value={filter.appointmentStatus || null}
          allowClear
          onChange={(value) => handleFilterChange("appointmentStatus", value)}
          options={appointmentStatus.map((status: string) => ({
            value: status,
            label: status,
          }))}
        />
        <Select
          placeholder="Auth Status"
          style={{ width: 250, margin: 20 }}
          allowClear
          value={filter.authStatus || null}
          onChange={(value) => handleFilterChange("authStatus", value)}
          options={authStatus.map((status: string) => ({
            value: status,
            label: status,
          }))}
        />
      </Space>
      <Table
        rowSelection={{
          type: "checkbox",
          ...rowSelection,
        }}
        columns={columns}
        dataSource={tableList}
        pagination={{
          pageSize: limit,
          current: page,
          total: pages,
          onChange: handleChange,
        }}
      />
    </div>
  ) : (
    <></>
  );
};

export default TableComp;
