import React, { useState } from 'react';
import { ConfigProvider, Layout, Menu, Space } from 'antd';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import HomePage from './pages/Home';
import UpsertModelPage from './pages/UpsertModel';
import ModelDetailsPage from './pages/ModelDetails';
import { NamespaceProvider } from './store/NamespaceContext';
import NamespaceSelector from './components/NamespaceSelector';
import Notifications from './components/Notifications';
import LanguageSwitcher from './components/LanguageSwitcher';

const { Header, Content, Footer } = Layout;

type Page = 'home' | 'upsert' | 'details';

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [pageContext, setPageContext] = useState<any>(null);

  const navigate = (page: Page, context?: any) => {
    setPageContext(context);
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage navigate={navigate} />;
      case 'upsert':
        return <UpsertModelPage modelData={pageContext} navigate={navigate} />;
      case 'details':
        return <ModelDetailsPage modelName={pageContext.name} namespace={pageContext.namespace} navigate={navigate} />;
      default:
        return <HomePage navigate={navigate} />;
    }
  };

  return (
    <Layout className="min-h-screen">
      <Header className="bg-white shadow-md px-6 flex items-center justify-between">
        <Space align="center">
          <div className="text-xl font-bold text-gray-800">models-web-app</div>
          <Menu
            mode="horizontal"
            selectedKeys={[currentPage]}
            onClick={(e) => navigate(e.key as Page)}
            style={{ borderBottom: 'none' }}
          >
            <Menu.Item key="home">Home</Menu.Item>
            <Menu.Item key="upsert">New Model</Menu.Item>
          </Menu>
        </Space>
        <Space align="center">
          <NamespaceSelector />
          <Notifications />
          <LanguageSwitcher />
        </Space>
      </Header>
      <Content className="p-6 bg-gray-50 flex-grow">
        {renderPage()}
      </Content>
      <Footer className="text-center text-gray-500 py-4">
        models-web-app ©2025 Created by Your Team
      </Footer>
    </Layout>
  );
};

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 6,
        },
        components: {
          Button: {
            colorPrimary: '#52c41a',
          },
        },
      }}
    >
      <NamespaceProvider>
        <AppContent />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </NamespaceProvider>
    </ConfigProvider>
  );
}

export default App;
