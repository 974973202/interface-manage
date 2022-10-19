import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Button, Layout } from 'antd';
import './index.less';

const { Header, Sider, Content } = Layout;

function App() {
  return (
    <Layout>
      <Header
        style={{
          background: '#fff',
          borderBottom: '2px solid rgba(64, 169, 255, 0.6)',
        }}
      >
        <Button>
          <Link to={'/'}>接口管理</Link>
        </Button>
        <Button style={{ margin: '0 20px' }}>
          <Link to={'/version'}>版本管理</Link>
        </Button>
        <Button>
          <Link to={'/module'}>模块管理</Link>
        </Button>
        <Button style={{ margin: '0 20px' }}>
          <Link to={'/rule'}>规则库</Link>
        </Button>
      </Header>
      <Layout>
        {/* <Sider
          style={{
            height: 'calc(100vh - 64px)',
            background: '#fff',
            borderRight: '2px solid rgba(64, 169, 255, 0.6)',
          }}
        >
          Sider
        </Sider> */}
        <Content style={{ padding: '26px 50px', background: '#fff' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;
