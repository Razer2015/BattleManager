import './App.css';
import { Layout, Menu, Typography } from 'antd';
import { DollarOutlined, HomeOutlined, UserOutlined, WechatOutlined } from '@ant-design/icons';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import { VipsManagementView } from './views/vipsManagementView';
import { HomeView } from './views/homeView';
import { PlayersView } from './views/playersView';
import { LoginView } from './views/loginView';
import { PrivateOutlet } from './utilities/privateOutlet';
import { LogoutComponent } from './components/logoutComponent';
import Auth, { AuthContext } from './components/authComponent';
import { UsersView } from './views/usersView';
import { useContext } from 'react';
import { NotFound } from './views/notFoundView';
import { ChatView } from './views/chatView';

const { Header, Content, Footer, Sider } = Layout;

function App() {
  return (
    <Router>
      <Auth>
        <BaseLayout />
      </Auth>
    </Router>
  );
}

function BaseLayout() {
  const location = useLocation();
  const isLoginPage = location?.pathname?.toLowerCase() === '/login';
  const { hasRole, isAuthenticated } = useContext(AuthContext);

  if (isLoginPage || !isAuthenticated) {
    return (<Layout style={{ height: "100vh" }}>
      <Header className="site-layout-sub-header-background" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}><Typography.Title style={{ fontSize: '24px' }}>BattleManager</Typography.Title></Header>
      <Content>
        <LoginView />
      </Content>
      <Footer style={{ textAlign: 'center' }}>BattleManager ©2022 Created by xfileFIN</Footer>
    </Layout>)
  }

  return (
    <Layout style={{ height: "100%", minHeight: '100vh' }}>
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
        <Menu theme="dark" mode="inline" defaultSelectedKeys={[location.pathname]}>
          {hasRole(['user', 'admin', 'super']) && (
            <Menu.Item key="/" icon={<HomeOutlined />}>
              <span>Home</span>
              <Link to="/" />
            </Menu.Item>
          )}
          {hasRole(['user', 'admin', 'super']) && (
            <Menu.Item key="/chat" icon={<WechatOutlined />}>
              <span>Chat</span>
              <Link to="/chat" />
            </Menu.Item>
          )}
          {hasRole(['admin', 'super']) && (
            <>
              <Menu.Item key="/vips" icon={<DollarOutlined />}>
                <span>Vips</span>
                <Link to="/vips" />
              </Menu.Item>
              <Menu.Item key="/players" icon={<UserOutlined />}>
                <span>Players</span>
                <Link to="/players" />
              </Menu.Item>
            </>
          )}
          {hasRole('super') && (
            <Menu.Item key="/users" icon={<UserOutlined />}>
              <span>Users</span>
              <Link to="/users" />
            </Menu.Item>
          )}
        </Menu>
      </Sider>
      <Layout>
        <Header className="site-layout-sub-header-background" style={{ padding: 0, paddingRight: 24, textAlign: 'right' }}>
          <LogoutComponent></LogoutComponent>
        </Header>
        <Content>
          <Routes>
            <Route element={<PrivateOutlet />}>
              {hasRole(['user', 'admin', 'super']) && (
                <Route path="/" element={<HomeView />} />
              )}
              {hasRole(['user', 'admin', 'super']) && (
                <Route path="/chat" element={<ChatView />} />
              )}
              {hasRole(['admin', 'super']) && (
                <>
                  <Route path="/vips" element={<VipsManagementView />} />
                  <Route path="/players" element={<PlayersView />} />
                </>
              )}
              {hasRole('super') && (
                <Route path="/users" element={<UsersView />} />
              )}
              <Route path='*' element={<NotFound />} />
            </Route>
          </Routes>
        </Content>
        <Footer style={{ textAlign: 'center' }}>BattleManager ©2022 Created by xfileFIN</Footer>
      </Layout>
    </Layout>
  )
}

export default App;
