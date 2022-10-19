import { Popconfirm, Space, Spin, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import RulesModal from '../interface/rules-modal';
import { rulesByIdResponseResult } from '../interface/type';
import { getRules, delRules } from './api';

let CarryArr: Array<{
  _id: string;
  url: string;
}> = [];

function Rules() {
  const [data, setData] = useState<rulesByIdResponseResult[]>([]);
  const [editId, setEditId] = useState<undefined | string>(undefined);
  const [total, setTotal] = useState(0);
  const [params, setParams] = useState({
    page: 0,
    size: 10,
  });

  const [visibleRules, setVisibleRules] = useState(false);
  // spinning
  const [spinning, setSpinning] = useState(false);

  const columns: ColumnsType<rulesByIdResponseResult> = [
    {
      title: '编号',
      dataIndex: '_id',
      key: '_id',
    },
    {
      title: '规则名称',
      dataIndex: 'ruleName',
      key: 'ruleName',
    },
    {
      title: '规则步骤',
      dataIndex: 'interfaceList',
      key: 'interfaceList',
      render: value => {
        if (Array.isArray(value) && value.length) {
          return value.map(({ url }, index) => (
            <div key={index}>{`步骤${index + 1}: ${url}`}</div>
          ));
        } else {
          return '';
        }
      },
    },
    {
      title: '规则备注',
      dataIndex: 'remark',
      key: 'remark',
    },
    {
      title: '规则人员',
      dataIndex: 'person',
      key: 'person',
    },
    {
      title: '修改时间',
      dataIndex: 'data',
      key: 'data',
      render: value => dayjs(value).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 150,
      render: (_, record) => (
        <Space key="action" size="middle">
          <a onClick={() => handleEdit(record)}>修改</a>
          <Popconfirm
            title={`是否删除规则${record.ruleName}`}
            onConfirm={async () => {
              await delRules(record._id);
              getRulesList({
                page: 0,
                size: 10,
              });
            }}
            okText="确定"
            cancelText="取消"
          >
            <a>删除</a>
          </Popconfirm>
          <a onClick={() => Export(record?.interfaceList)}>导出</a>
        </Space>
      ),
    },
  ];

  let timeout: string | number | NodeJS.Timeout | undefined;
  const Export = (
    record: Array<{
      _id: string;
      url: string;
    }>
  ) => {
    CarryArr = JSON.parse(JSON.stringify(record || []));
    setSpinning(true);
    const current = CarryArr.shift();
    if (current) {
      window.open(current.url);
    }
    if (CarryArr.length) {
      timeout = setTimeout(() => {
        Export(CarryArr);
      }, 1000);
    } else {
      setSpinning(false);
      clearTimeout(timeout);
    }
  };

  const getRulesList = async (params: { page: number; size: number }) => {
    const { data, total } = await getRules(params);
    setData(data);
    setTotal(total);
  };

  useEffect(() => {
    getRulesList(params);
  }, [params]);

  const handleEdit = (record: rulesByIdResponseResult) => {
    setEditId(record._id);
    setVisibleRules(true);
  };

  return (
    <Spin tip="接口执行中..." spinning={spinning}>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={data}
        bordered
        pagination={{
          total,
          size: 'small',
          showTotal: total => `总共${total}条数据`,
          onChange: (page, pageSize) => {
            setParams({
              page: page - 1,
              size: pageSize,
            });
          },
        }}
        scroll={{ x: 'max-content' }}
      />
      {visibleRules ? (
        <RulesModal
          editId={editId}
          visible={visibleRules}
          setVisibleRules={setVisibleRules}
          onOk={() => {
            getRulesList({
              page: 0,
              size: 10,
            });
          }}
        />
      ) : null}
    </Spin>
  );
}

export default Rules;
