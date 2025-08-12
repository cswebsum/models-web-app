import React, { useState } from 'react';
import { ConfigProvider, Layout, Menu } from 'antd';
import HomePage from './pages/Home';
import UpsertModelPage from './pages/UpsertModel';
import ModelDetailsPage from './pages/ModelDetails';

const { Header, Content, Footer } = Layout;

type Page = 'home' | 'upsert' | 'details';

function App() {
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
        return <UpsertModelPage modelData={pageContext} />;
      case 'details':
        return <ModelDetailsPage modelName={pageContext.name} namespace={pageContext.namespace} navigate={navigate} />;
      default:
        return <HomePage navigate={navigate} />;
    }
  };

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
      <Layout className="min-h-screen">
        <Header className="bg-white shadow-md px-6 flex items-center">
          <div className="text-xl font-bold text-gray-800 mr-8">models-web-app</div>
          <Menu
            mode="horizontal"
            selectedKeys={[currentPage]}
            onClick={(e) => navigate(e.key as Page)}
            className="flex-grow border-b-0"
          >
            <Menu.Item key="home">Home</Menu.Item>
            <Menu.Item key="upsert">New Model</Menu.Item>
          </Menu>
        </Header>
        <Content className="p-6 bg-gray-50 flex-grow">
          {renderPage()}
        </Content>
        <Footer className="text-center text-gray-500 py-4">
          models-web-app ©2025 Created by Your Team
        </Footer>
      </Layout>
    </ConfigProvider>
  );
}

export default App;
