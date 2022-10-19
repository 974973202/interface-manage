import { Modal, Form, Select, Input, Button, message } from 'antd';
import { useEffect, useState } from 'react';
import { createInterface, putInterface } from './api';
import { getVersionDetail } from '../version/api';
import { versionByIdResponseResult } from '../version/type';
import type { FormInstance } from 'antd/es/form';
import { interfaceByIdResponseResult, interfaceModalDataProps } from './type';
import { moduleByIdResponseResult } from '../module/type';

const { Option } = Select;

interface CreateModalProps {
  versionList: versionByIdResponseResult[];
  visible: boolean;
  editId?: string;
  setVisible: (data: boolean) => void;
  searchForm: FormInstance;
  editRecord?: interfaceByIdResponseResult;
}

function CreateModal(props: CreateModalProps) {
  const { versionList, visible, editId, setVisible, searchForm, editRecord } =
    props;
  const [form] = Form.useForm();
  const [moduleList, setModuleList] = useState<moduleByIdResponseResult[]>([]);

  const handleEdit = async (
    record: interfaceByIdResponseResult | undefined
  ) => {
    if (record?.version) {
      const { module } = await getVersionDetail(record?.version?.[0]._id);
      setModuleList(module || []);
    }
    form.setFieldsValue({
      ...record,
      module: record?.module?.[0]?._id,
      version: record?.version?.[0]?._id,
    });
  };

  useEffect(() => {
    if (editId) {
      handleEdit(editRecord);
    }
  }, [editId]);

  const onFinish = async (value: interfaceModalDataProps) => {
    try {
      if (editId) {
        await putInterface({ ...value, id: editId });
      } else {
        await createInterface(value);
      }
      setModuleList([]);
      searchForm.resetFields();
      searchForm.submit();
      message.success(editId ? '编辑成功' : '新建成功');
      setVisible(false);
      form.resetFields();
    } catch (e: any) {
      message.error(e?.data?.message || '未知错误');
    }
  };

  return (
    <Modal
      title={editId ? '接口编辑' : '接口新建'}
      open={visible}
      footer={null}
      onCancel={() => {
        setVisible(false);
        setModuleList([]);
        form.resetFields();
      }}
      destroyOnClose
      maskClosable={false}
    >
      <Form
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 16 }}
        onFinish={onFinish}
        form={form}
        autoComplete="off"
      >
        <Form.Item
          label="适用版本"
          name="version"
          rules={[{ required: true, message: '请选择适用版本' }]}
        >
          <Select
            placeholder="请选择适用版本"
            showSearch
            allowClear
            filterOption={(input, option) =>
              (option?.children as unknown as string).includes(input)
            }
            onChange={async id => {
              if (id) {
                const { module } = await getVersionDetail(id);
                form.setFieldsValue({ module: '' });
                setModuleList(module || []);
              } else {
                setModuleList([]);
              }
            }}
          >
            {versionList?.map((item: versionByIdResponseResult) => (
              <Option key={item._id} value={item._id}>
                {item.version}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="所属模块"
          name="module"
          rules={[{ required: true, message: '请选择所属模块' }]}
        >
          <Select
            disabled={!moduleList.length}
            placeholder="请选择所属模块"
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

        <Form.Item
          label="接口地址"
          name="interfaceAddress"
          rules={[{ required: true, message: '请输入接口地址' }]}
        >
          <Input placeholder="请输入接口地址" />
        </Form.Item>
        <Form.Item label="接口参数" name="parameter">
          <Select placeholder="请输入接口参数" mode="tags"></Select>
        </Form.Item>
        <Form.Item label="接口用途" name="interfaceUse">
          <Input placeholder="请输入接口用途" />
        </Form.Item>
        <Form.Item label="接口备注" name="remarks">
          <Input placeholder="请输入接口备注" />
        </Form.Item>
        <Form.Item label="编辑人员" name="person">
          <Input />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 19, span: 16 }}>
          <Button type="primary" htmlType="submit">
            保存
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default CreateModal;
