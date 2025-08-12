import React from 'react';
import { Dropdown, Menu, Badge, Avatar, List } from 'antd';
import { BellOutlined, CheckCircleTwoTone, ExclamationCircleTwoTone } from '@ant-design/icons';
import { formatDistanceToNow } from 'date-fns';

// Mocked notification data
const mockNotifications = [
  {
    id: 1,
    type: 'success',
    title: 'Deployment successful',
    description: 'Model "my-resnet-v2" was deployed successfully.',
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    read: false,
  },
  {
    id: 2,
    type: 'error',
    title: 'Deployment failed',
    description: 'Model "my-xgboost-v1" failed to deploy due to an error.',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    read: false,
  },
  {
    id: 3,
    type: 'success',
    title: 'Canary rollout complete',
    description: 'Canary for "my-resnet-v3" is complete. 100% traffic routed.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    read: true,
  },
];

const notificationIcons: { [key: string]: React.ReactNode } = {
  success: <CheckCircleTwoTone twoToneColor="#52c41a" />,
  error: <ExclamationCircleTwoTone twoToneColor="#eb2f96" />,
};

const menu = (
  <Menu style={{ width: 350 }}>
    <Menu.ItemGroup title="Notifications">
      <List
        itemLayout="horizontal"
        dataSource={mockNotifications}
        renderItem={item => (
          <List.Item style={{ padding: '8px 12px', borderBottom: '1px solid #f0f0f0' }}>
            <List.Item.Meta
              avatar={<Avatar icon={notificationIcons[item.type]} />}
              title={<span style={{ fontWeight: item.read ? 'normal' : 'bold' }}>{item.title}</span>}
              description={
                <div>
                  <div>{item.description}</div>
                  <div style={{ fontSize: '0.75em', color: '#aaa', marginTop: 4 }}>
                    {formatDistanceToNow(item.timestamp, { addSuffix: true })}
                  </div>
                </div>
              }
            />
          </List.Item>
        )}
      />
    </Menu.ItemGroup>
    <Menu.Divider />
    <Menu.Item key="all" style={{ textAlign: 'center' }}>
      View all notifications
    </Menu.Item>
  </Menu>
);

const Notifications: React.FC = () => {
  const unreadCount = mockNotifications.filter(n => !n.read).length;

  return (
    <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
      <Badge count={unreadCount}>
        <BellOutlined style={{ fontSize: '20px', cursor: 'pointer' }} />
      </Badge>
    </Dropdown>
  );
};

export default Notifications;
