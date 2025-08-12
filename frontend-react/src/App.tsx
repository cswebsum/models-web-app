import React, { useState } from 'react';
import { ConfigProvider, Layout, Menu } from 'antd';
import Home from './pages/Home';
import NewModel from './pages/NewModel';
import ModelDetails from './pages/ModelDetails';

const { Header, Content, Footer } = Layout;

// This will be expanded as we migrate more pages
type Page = 'home' | 'new' | 'details';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  // In a real app, you'd pass props to ModelDetails
  // e.g., const [selectedModel, setSelectedModel] = useState(null);
  // and have a function like `navigateToDetails(model)`

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        // In a real app, the Home component would have a callback to navigate to details
        // e.g., <Home onNavigateToDetails={(model) => { setSelectedModel(model); setCurrentPage('details'); }} />
        return <Home />;
      case 'new':
        return <NewModel />;
      case 'details':
        return <ModelDetails />;
      default:
        return <Home />;
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
            onClick={(e) => setCurrentPage(e.key as Page)}
            className="flex-grow border-b-0"
          >
            <Menu.Item key="home">Home</Menu.Item>
            <Menu.Item key="new">New Model</Menu.Item>
            {/* We'll add a temporary menu item for details page for now for testing */}
            <Menu.Item key="details">Details (Temp)</Menu.Item>
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
