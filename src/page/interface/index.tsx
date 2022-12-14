import {
  Button,
  Divider,
  Form,
  Input,
  message,
  Popconfirm,
  Space,
  Spin,
  Table,
  Typography,
} from 'antd';
import dayjs from 'dayjs';
import type { ColumnsType } from 'antd/es/table';
import type { FormInstance } from 'antd/es/form';
import { useEffect, useState, createContext, useRef, useContext } from 'react';
import { getInterface, delInterface } from './api';
import { getVersion } from '../version/api';
import { getModule } from '../module/api';
import { v4 } from 'uuid';
import CreateModal from './create-modal';
import RulesModal from './rules-modal';
import SearchForm, { SearchValueType } from './search';
import { interfaceByIdResponseResult } from './type';
import { versionByIdResponseResult } from '../version/type';
import { moduleByIdResponseResult } from '../module/type';

const { Link } = Typography;

const EditableContext = createContext<FormInstance | null>(null);

const EditableRow: React.FC = ({ ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

interface AwaitListType extends interfaceByIdResponseResult {
  url: string;
}

interface Item {
  key: string;
  name: string;
  age: string;
  address: string;
}

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: keyof Item;
  record: Item;
  handleSave: (record: Item) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...rest
}: EditableCellProps) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<any>(null);
  const form = useContext(EditableContext);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form?.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    try {
      const values = await form?.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (error: any) {
      const err = error?.errorFields?.[0]?.errors?.[0] || '';
      message.error(err);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        noStyle
        name={dataIndex}
        rules={[
          { required: true, message: `??????/??????????????????` },
          () => ({
            validator(_, value) {
              if (value && !/^(https?|http?)?:\/\//.test(value)) {
                return Promise.reject(
                  new Error('??????/????????????http://???https://??????')
                );
              }
              return Promise.resolve();
            },
          }),
        ]}
      >
        <Input size="small" ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div className="editable-cell-value-wrap" onClick={toggleEdit}>
        {children}
      </div>
    );
  }

  return <td {...(rest as any)}>{childNode}</td>;
};

let CarryArr: Array<AwaitListType> = [];

function Interface() {
  const [searchForm] = Form.useForm();
  const [data, setData] = useState<interfaceByIdResponseResult[]>([]);
  const [visible, setVisible] = useState(false);
  const [editId, setEditId] = useState<undefined | string>(undefined);
  const [editRecord, setEditRecord] = useState<interfaceByIdResponseResult>();
  //
  const [versionList, setVersionList] = useState<versionByIdResponseResult[]>(
    []
  );
  const [moduleList, setModuleList] = useState<moduleByIdResponseResult[]>([]);
  // ?????????????????????
  const [awaitList, setAwaitList] = useState<Array<AwaitListType>>([]);
  // ????????????
  const [total, setTotal] = useState(0);
  // ????????????
  const [params, setParams] = useState({
    page: 0,
    size: 10,
  });
  // ???????????????
  const [visibleRules, setVisibleRules] = useState(false);
  const [interfaceList, setInterfaceList] = useState<
    Array<{
      _id: string;
      url: string;
    }>
  >([]);
  // spinning
  const [spinning, setSpinning] = useState(false);
  // ?????? loading
  const [tableLoading, setTableLoading] = useState(false);

  const columns: ColumnsType<interfaceByIdResponseResult> = [
    {
      title: '?????????',
      dataIndex: 'version',
      key: 'version',
      render: value => value?.[0]?.version || '',
    },
    {
      title: '??????',
      dataIndex: 'module',
      key: 'module',
      render: value => value?.[0]?.moduleName || '',
    },
    {
      title: '??????',
      dataIndex: 'interfaceUse',
      key: 'interfaceUse',
    },
    {
      title: '??????/??????',
      dataIndex: 'interfaceAddress',
      key: 'interfaceAddress',
      render: (value, record) => {
        let url = value;
        const urlParams: Array<string> = [];
        if (record?.parameter?.length) {
          url = /\?/g.test(url) ? `${value}&` : `${value}?`;
          record?.parameter.forEach(p => {
            urlParams.push(`${p}=xxx`);
          });
        }
        return url + urlParams.join('&');
      },
    },
    {
      title: '??????',
      dataIndex: 'remarks',
      key: 'remarks',
    },
    {
      title: '??????',
      dataIndex: 'person',
      key: 'person',
    },
    {
      title: '????????????',
      dataIndex: 'data',
      key: 'data',
      render: value => dayjs(value).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '??????',
      key: 'action',
      fixed: 'right',
      width: 150,
      render: (_, record) => (
        <Space key="action" size="middle">
          <a onClick={() => handleEdit(record)}>??????</a>
          <Popconfirm
            title={`????????????????????????${record.module?.[0]?.moduleName}`}
            onConfirm={async () => {
              await delInterface(record._id);
              getInterfaceList({
                page: 0,
                size: 10,
              });
            }}
            okText="??????"
            cancelText="??????"
          >
            <a>??????</a>
          </Popconfirm>
          <a onClick={() => add(record)}>??????</a>
        </Space>
      ),
    },
  ];

  const add = (record: interfaceByIdResponseResult) => {
    let url = record.interfaceAddress;
    const urlParams: Array<string> = [];
    if (record?.parameter?.length) {
      url = /\?/g.test(url) ? `${url}&` : `${url}?`;
      record?.parameter.forEach((p: string) => {
        urlParams.push(`${p}=xxx`);
      });
    }

    setAwaitList(
      awaitList.concat([
        {
          ...record,
          _id: v4(),
          url: url + urlParams.join('&'),
        },
      ])
    );
  };

  const columnsAwait: ColumnsType<interfaceByIdResponseResult> = [
    {
      title: '??????',
      render: (text, record, index) => `${index + 1}`,
    },
    {
      title: '??????',
      dataIndex: 'module',
      key: 'module',
      render: value => value?.[0]?.moduleName || '',
    },
    {
      title: '??????',
      dataIndex: 'interfaceUse',
      key: 'interfaceUse',
    },
    {
      title: '??????/??????',
      dataIndex: 'url',
      key: 'url',
    },
    {
      title: '??????',
      dataIndex: 'remarks',
      key: 'remarks',
    },
    {
      title: '??????',
      key: 'action',
      fixed: 'right',
      width: 150,
      render: (_, record, index) => (
        <Space key="action" size="middle">
          <Link
            disabled={index === 0}
            onClick={() => {
              const cloneAwaitList = JSON.parse(JSON.stringify(awaitList));
              const mark = cloneAwaitList[index - 1];
              cloneAwaitList[index - 1] = cloneAwaitList[index];
              cloneAwaitList[index] = mark;
              setAwaitList(cloneAwaitList);
            }}
          >
            ??????
          </Link>
          <Link
            disabled={index === awaitList.length - 1}
            onClick={() => {
              const cloneAwaitList = JSON.parse(JSON.stringify(awaitList));
              const mark = cloneAwaitList[index + 1];
              cloneAwaitList[index + 1] = cloneAwaitList[index];
              cloneAwaitList[index] = mark;
              setAwaitList(cloneAwaitList);
            }}
          >
            ??????
          </Link>
          <Link
            onClick={() =>
              setAwaitList(
                awaitList.filter(
                  (item: AwaitListType) => item._id !== record._id
                )
              )
            }
          >
            ??????
          </Link>
        </Space>
      ),
    },
  ];

  const getInterfaceList = async (
    params: {
      page: number;
      size: number;
    } & Partial<SearchValueType>
  ) => {
    try {
      setTableLoading(true);
      const { data, total } = await getInterface(params);
      setData(data);
      setTotal(total);
    } catch (error: any) {
      message.error(error?.data?.message || '????????????');
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      // ???????????????????????????
      setVersionList((await getVersion())?.data || []);
    })();

    (async () => {
      // ???????????????????????????
      setModuleList((await getModule())?.data || []);
    })();
  }, []);

  useEffect(() => {
    // ????????????????????????
    getInterfaceList(params);
  }, [params]);

  const handleEdit = async (record: interfaceByIdResponseResult) => {
    setEditId(record._id);
    setEditRecord(record);
    setVisible(true);
  };

  const onSearch = async (value: SearchValueType) => {
    getInterfaceList({ page: 0, size: 10, ...value });
  };

  const finalColumns = columnsAwait.map((col: any) => {
    if (col?.dataIndex !== 'url') {
      return col;
    }
    return {
      ...col,
      onCell: (record: interfaceByIdResponseResult) => ({
        record,
        editable: col.dataIndex === 'url',
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave: (row: any) => {
          const newData = [...awaitList];
          const index = newData.findIndex(item => row._id === item._id);
          const item = newData[index];
          newData.splice(index, 1, {
            ...item,
            ...row,
          });
          setAwaitList(newData);
        },
      }),
    };
  });

  let timeout: string | number | NodeJS.Timeout | undefined;
  const Implement = (data: Array<AwaitListType>) => {
    CarryArr = JSON.parse(JSON.stringify(data));
    setSpinning(true);
    const current = CarryArr.shift();
    if (current) {
      window.open(current.url);
    }
    if (CarryArr.length) {
      timeout = setTimeout(() => {
        Implement(CarryArr);
      }, 1000);
    } else {
      setSpinning(false);
      clearTimeout(timeout);
    }
  };

  return (
    <Spin tip="???????????????..." spinning={spinning}>
      <div style={{ marginBottom: 16 }}>
        <SearchForm
          onSearch={onSearch}
          searchForm={searchForm}
          versionList={versionList}
          moduleList={moduleList}
          setVisible={setVisible}
          setEditId={setEditId}
        />
      </div>
      <Table
        bordered
        size="small"
        columns={columns}
        dataSource={data}
        loading={tableLoading}
        pagination={{
          total,
          size: 'small',
          showTotal: total => `??????${total}?????????`,
          onChange: (page, pageSize) => {
            setParams({
              page: page - 1,
              size: pageSize,
            });
          },
        }}
        scroll={{ x: 'max-content' }}
      />
      <Divider orientation="left">??????????????????</Divider>
      <Table
        bordered
        size="small"
        columns={finalColumns}
        dataSource={awaitList}
        pagination={false}
        footer={() => (
          <div key="footer" style={{ display: 'flex', justifyContent: 'end' }}>
            <Button
              onClick={() => {
                if (awaitList.length) {
                  const list = awaitList.map((item: AwaitListType) => ({
                    _id: item._id,
                    url: item.url,
                  }));
                  setInterfaceList(list);
                  setVisibleRules(true);
                } else {
                  message.info('?????????????????????');
                }
              }}
              style={{ marginRight: 16 }}
              size="small"
            >
              ??????
            </Button>
            <Button size="small" onClick={() => Implement(awaitList)}>
              ??????
            </Button>
          </div>
        )}
        components={{
          body: {
            row: EditableRow,
            cell: EditableCell,
          },
        }}
        scroll={{ x: 'max-content' }}
      />
      {visible ? (
        <CreateModal
          visible={visible}
          editId={editId}
          editRecord={editRecord}
          setVisible={setVisible}
          searchForm={searchForm}
          versionList={versionList}
        />
      ) : null}
      {visibleRules ? (
        <RulesModal
          visible={visibleRules}
          interfaceList={interfaceList}
          setVisibleRules={setVisibleRules}
        />
      ) : null}
    </Spin>
  );
}

export default Interface;
