import {
  Button,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';
import { getVersion, createVersion, putVersion, delVersion } from './api';
import { getModule } from '../module/api';
import dayjs from 'dayjs';
import { versionByIdResponseResult, versionModalDataProps } from './type';
import { moduleByIdResponseResult } from '../module/type';

const { Option } = Select;

function Version() {
  const columns: ColumnsType<versionByIdResponseResult> = [
    {
      title: '版本号',
      dataIndex: 'version',
      key: 'version',
    },
    {
      title: '包含模块',
      dataIndex: 'module',
      key: 'module',
      render(value) {
        const text: Array<string> = [];
        value.forEach((e: moduleByIdResponseResult) => {
          text.push(e.moduleName);
        });
        return text.join(' / ');
      },
    },
    {
      title: '人员',
      dataIndex: 'person',
      key: 'person',
    },
    {
      title: '备注',
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
        <Space size="middle">
          <a onClick={() => handleEdit(record)}>修改</a>
          <Popconfirm
            title={`是否删除版本号${record.version}`}
            onConfirm={async () => {
              await delVersion(record._id);
              getVersionList();
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
  const [data, setData] = useState<versionByIdResponseResult[]>([]);
  const [moduleList, setModuleList] = useState<Array<moduleByIdResponseResult>>(
    []
  );
  const [visible, setVisible] = useState(false);
  const [editId, setEditId] = useState<undefined | string>(undefined);
  const [total, setTotal] = useState(0);
  const [params, setParams] = useState({
    page: 0,
    size: 10,
  });

  const getVersionList = async () => {
    const { data, total } = await getVersion(params);
    setData(data);
    setTotal(total);
  };

  useEffect(() => {
    getVersionList();

    (async () => {
      setModuleList((await getModule())?.data || []);
    })();
  }, []);

  const handleEdit = (record: versionByIdResponseResult) => {
    const { _id, module, ...rest } = record;
    setEditId(_id);
    form.setFieldsValue({
      ...rest,
      module: module?.map(e => e._id) || [],
    });
    setVisible(true);
  };

  const onFinish = async (value: versionModalDataProps) => {
    try {
      if (editId) {
        await putVersion({ ...value, id: editId });
        console.log(data, 'put');
      } else {
        await createVersion(value);
      }
      message.success(editId ? '编辑成功' : '新建成功');
      getVersionList();
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
            setEditId(undefined);
          }}
        >
          添加
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={data}
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
        title={editId ? '版本编辑' : '版本新建'}
        open={visible}
        footer={null}
        // onOk={handleOk}
        onCancel={() => {
          form.resetFields();
          setVisible(false);
        }}
        destroyOnClose
      >
        <Form
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ module: [] }}
          onFinish={onFinish}
          form={form}
          autoComplete="off"
        >
          <Form.Item
            label="版本号"
            name="version"
            rules={[{ required: true, message: '请输入版本号' }]}
          >
            <Input placeholder="请输入版本号" />
          </Form.Item>

          <Form.Item label="包含模块" name="module">
            <Select
              mode="multiple"
              placeholder="请选择模块"
              showSearch
              allowClear
              filterOption={(input, option) =>
                (option?.children as unknown as string).includes(input)
              }
            >
              {moduleList?.map((item: moduleByIdResponseResult) => (
                <Option key={item._id} value={item._id}>
                  {item.moduleName}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="版本人员" name="person">
            <Input />
          </Form.Item>

          <Form.Item label="版本备注" name="remarks">
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

export default Version;
