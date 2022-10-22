import { Button, Form, Select } from 'antd';
import { moduleByIdResponseResult } from '../module/type';
import { versionByIdResponseResult } from '../version/type';
import type { FormInstance } from 'antd/es/form';

const { Option } = Select;

export interface SearchValueType {
  version: string;
  module: string;
}

interface SearchProps {
  onSearch: (data: SearchValueType) => void;
  searchForm: FormInstance;
  versionList: versionByIdResponseResult[];
  moduleList: moduleByIdResponseResult[];
  setVisible: (data: boolean) => void;
  setEditId: (data: string | undefined) => void;
}

function Search(props: SearchProps) {
  const {
    onSearch,
    searchForm,
    versionList,
    setVisible,
    setEditId,
    moduleList,
  } = props;
  const [form] = Form.useForm();

  return (
    <Form
      initialValues={{ remember: true }}
      onFinish={onSearch}
      layout="inline"
      form={searchForm}
      autoComplete="off"
    >
      <Form.Item label="版本" name="version">
        <Select
          placeholder="请选择版本"
          showSearch
          allowClear
          filterOption={(input, option) =>
            (option?.children as unknown as string).includes(input)
          }
          style={{ width: 150 }}
          // onChange={async id => {
          //   if (id) {
          //     const { module } = await getVersionDetail(id);
          //     setModuleList(module || []);
          //   } else {
          //     searchForm.resetFields();
          //     setModuleList([]);
          //   }
          // }}
        >
          {versionList?.map((item: versionByIdResponseResult) => (
            <Option key={item._id} value={item._id}>
              {item.version}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label="模块" name="module">
        <Select
          style={{ width: 150 }}
          // disabled={!moduleList.length}
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

      <Form.Item>
        <div style={{ display: 'flex' }}>
          <Button type="primary" htmlType="submit">
            查询
          </Button>
          <Button
            style={{ margin: '0 16px' }}
            onClick={() => {
              searchForm.resetFields();
              searchForm.submit();
            }}
          >
            重置
          </Button>
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
      </Form.Item>
    </Form>
  );
}

export default Search;
