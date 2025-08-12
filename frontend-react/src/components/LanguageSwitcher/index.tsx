import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dropdown, Menu, Button } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const menu = (
    <Menu
      onClick={({ key }) => changeLanguage(key)}
      selectedKeys={[i18n.language]}
    >
      <Menu.Item key="en">
        English
      </Menu.Item>
      <Menu.Item key="fr">
        Français
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menu} trigger={['click']}>
      <Button icon={<GlobalOutlined />}>
        {i18n.language.toUpperCase()}
      </Button>
    </Dropdown>
  );
};

export default LanguageSwitcher;
