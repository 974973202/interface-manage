import { useEffect, useState } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { createRules, putRules, getRulesById } from '../rule/api';
import { rulesModalProps, rulesModalDataProps } from './type';

function RulesModal(props: rulesModalProps) {
  const { visible, interfaceList, setVisibleRules, editId, onOk } = props;
  const [form] = Form.useForm();
  const [ruleId, setRuleId] = useState<string>('');

  useEffect(() => {
    if (interfaceList?.length) {
      form.setFieldsValue({ interfaceList: interfaceList });
    } else {
      form.setFieldsValue({ interfaceList: [] });
    }
  }, [interfaceList]);

  useEffect(() => {
    if (editId) {
      setRuleId(editId);
      (async id => {
        const data = await getRulesById(id);
        form.setFieldsValue(data);
      })(editId);
    }
  }, [editId]);

  const onFinish = async (value: rulesModalDataProps) => {
    try {
      if (ruleId) {
        await putRules({ ...value, id: ruleId });
      } else {
        await createRules(value);
      }
      onOk && onOk();
      message.success(ruleId ? '编辑成功' : '新建成功');
      setVisibleRules(false);
    } catch (e: any) {
      message.error(e?.data?.message || '未知错误');
    }
  };

  return (
    <Modal
      title={editId ? '规则库编辑' : '规则库新建'}
      getContainer={false}
      open={visible}
      footer={null}
      onCancel={() => {
        setVisibleRules(false);
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
          label="规则名称"
          name="ruleName"
          rules={[{ required: true, message: '请输入规则名称' }]}
        >
          <Input placeholder="请输入规则名称" />
        </Form.Item>

        <Form.List name="interfaceList">
          {fields => (
            <>
              {fields.map(({ name, key, ...restField }, index) => (
                <Form.Item
                  key={index}
                  label={`步骤${index + 1}`}
                  name={[name, 'url']}
                  rules={[
                    { required: true, message: `步骤${index + 1}不能为空` },
                    () => ({
                      validator(_, value) {
                        if (value && !/^(https?|http?)?:\/\//.test(value)) {
                          return Promise.reject(
                            new Error('必须http://或https://开头')
                          );
                        }
                        return Promise.resolve();
                      },
                    }),
                  ]}
                  {...restField}
                >
                  <Input />
                </Form.Item>
              ))}
            </>
          )}
        </Form.List>

        <Form.Item label="规则备注" name="remarks">
          <Input placeholder="请输入规则备注" />
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

export default RulesModal;
