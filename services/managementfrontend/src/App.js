import './App.css';
import { Layout, Menu, Row, Typography } from 'antd';
import { DollarOutlined, HomeOutlined, UploadOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import {
  BrowserRouter as Router,
  Switch,
  Routes,
  Route,
  Link,
  useLocation
} from "react-router-dom";
import { VipsManagementView } from './views/vipsManagementView';
import { HomeView } from './views/homeView';
import { PlayersView } from './views/playersView';
import { LoginView } from './views/loginView';
import { PrivateOutlet } from './utilities/privateOutlet';
import { LogoutComponent } from './components/logoutComponent';

const { Header, Content, Footer, Sider } = Layout;

function App() {
  return (
    <Router>
      <BaseLayout></BaseLayout>
    </Router>
  );
}

function BaseLayout() {
  const location = useLocation();
  const isLoginPage = location?.pathname?.toLowerCase() === '/login';

  if (isLoginPage) {
    return (<Layout style={{ height: "100vh" }}>
      <Layout>
        <Header className="site-layout-sub-header-background" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}><Typography.Title style={{ fontSize: '24px' }}>BattleManager</Typography.Title></Header>
        <Content>
          <LoginView />
        </Content>
        <Footer style={{ textAlign: 'center' }}>BattleManager ©2022 Created by xfileFIN</Footer>
      </Layout>
    </Layout>)
  }

  return (
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
        <Header className="site-layout-sub-header-background" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}><Typography.Title style={{ fontSize: '24px' }}>BattleManager</Typography.Title></Header>
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
        <Header className="site-layout-sub-header-background" style={{ padding: 0 }}>
          <LogoutComponent></LogoutComponent>
        </Header>
        <Content>
          <Routes>
            <Route element={<PrivateOutlet />}>
              <Route path="/" element={<HomeView />} />
              <Route path="/vips" element={<VipsManagementView />} />
              <Route path="/players" element={<PlayersView />} />
            </Route>
          </Routes>
        </Content>
        <Footer style={{ textAlign: 'center' }}>BattleManager ©2022 Created by xfileFIN</Footer>
      </Layout>
    </Layout>
  )
}

export default App;
