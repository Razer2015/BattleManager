import './App.css';
import { Layout, Menu, Typography } from 'antd';
import { DollarOutlined, HomeOutlined, UploadOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import {
  BrowserRouter as Router,
  Switch,
  Routes,
  Route,
  Link
} from "react-router-dom";
import { VipsManagementView } from './views/vipsManagementView';
import { HomeView } from './views/homeView';
import { PlayersView } from './views/playersView';

const { Header, Content, Footer, Sider } = Layout;

function App() {
  return (
    <Router>
      <Layout style={{ height: "100vh" }}>
        <Sider
          breakpoint="lg"
          collapsedWidth="0"
          onBreakpoint={broken => {
            console.log(broken);
          }}
          onCollapse={(collapsed, type) => {
            console.log(collapsed, type);
          }}
        >
          <Header className="site-layout-sub-header-background" style={{ padding: '0px', paddingTop: '10px', textAlign: 'center' }}><Typography.Title style={{ fontSize: '24px' }}>BattleManager</Typography.Title></Header>
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['4']}>
            <Menu.Item key="1" icon={<HomeOutlined />}>
              <span>Home</span>
              <Link to="/" />
            </Menu.Item>
            <Menu.Item key="2" icon={<DollarOutlined />}>
              <span>Vips</span>
              <Link to="/vips" />
            </Menu.Item>
            <Menu.Item key="3" icon={<UserOutlined />}>
              <span>Players</span>
              <Link to="/players" />
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header className="site-layout-sub-header-background" style={{ padding: 0 }} />
          <Content>
            <Routes>
              <Route path="/" element={<HomeView />} />
              <Route path="/vips" element={<VipsManagementView />} />
              <Route path="/players" element={<PlayersView />} />
            </Routes>
          </Content>
          <Footer style={{ textAlign: 'center' }}>BattleManager ©2022 Created by xfileFIN</Footer>
        </Layout>
      </Layout>
    </Router>
  );
}

export default App;
