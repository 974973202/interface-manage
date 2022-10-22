import {
  Button,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Space,
  Table,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { getModule, createModule, putModule, delModule } from './api';
import { moduleByIdResponseResult, moduleModalDataProps } from './type';

function Module() {
  const columns: ColumnsType<moduleByIdResponseResult> = [
    {
      title: '模块名称',
      dataIndex: 'moduleName',
      key: 'moduleName',
    },
    {
      title: '模块人员',
      dataIndex: 'person',
      key: 'person',
    },
    {
      title: '模块备注',
      dataIndex: 'remarks',
      key: 'remarks',
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
      width: 110,
      render: (_, record) => (
        <Space key="action" size="middle">
          <a onClick={() => handleEdit(record)}>修改</a>
          <Popconfirm
            title={`是否删除模块${record.moduleName}`}
            onConfirm={async () => {
              await delModule(record._id);
              getModuleList({
                page: 0,
                size: 10,
              });
            }}
            okText="确定"
            cancelText="取消"
          >
            <a>删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const [form] = Form.useForm();
  const [data, setData] = useState<Array<moduleByIdResponseResult>>([]);
  const [visible, setVisible] = useState(false);
  const [editId, setEditId] = useState<null | string>(null);
  const [total, setTotal] = useState(0);
  const [params, setParams] = useState({
    page: 0,
    size: 10,
  });
  // 表格 loading
  const [tableLoading, setTableLoading] = useState(false);

  const getModuleList = async (params: { page: number; size: number }) => {
    try {
      setTableLoading(true);
      const { data, total } = await getModule(params);
      setData(data);
      setTotal(total);
    } catch (error: any) {
      message.error(error?.data?.message || '未知错误');
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    getModuleList(params);
  }, [params]);

  const handleEdit = (record: moduleByIdResponseResult) => {
    setEditId(record._id);
    form.setFieldsValue(record);
    setVisible(true);
  };

  const onFinish = async (value: moduleModalDataProps) => {
    try {
      if (editId) {
        await putModule({ ...value, id: editId });
      } else {
        await createModule(value);
      }
      getModuleList({
        page: 0,
        size: 10,
      });
      message.success(editId ? '编辑成功' : '新建成功');
      setVisible(false);
      form.resetFields();
    } catch (error: any) {
      message.error(error?.data?.message || '未知错误');
    }
  };

  return (
    <>
      <div>
        <Button
          onClick={() => {
            setVisible(true);
            form.resetFields();
            setEditId(null);
          }}
        >
          添加
        </Button>
      </div>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={data}
        loading={tableLoading}
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
      <Modal
        title={editId ? '模板编辑' : '模板新建'}
        open={visible}
        footer={null}
        onCancel={() => {
          setVisible(false);
          form.resetFields();
        }}
        destroyOnClose
      >
        <Form
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          form={form}
          autoComplete="off"
        >
          <Form.Item
            label="模块名称"
            name="moduleName"
            rules={[{ required: true, message: '请输入模块名称' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="模块人员" name="person">
            <Input />
          </Form.Item>

          <Form.Item label="模块备注" name="remarks">
            <Input />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 19, span: 16 }}>
            <Button type="primary" htmlType="submit">
              保存
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default Module;
