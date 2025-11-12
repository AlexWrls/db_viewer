import React from 'react';
import { Layout, Result, Button, Space } from 'antd';
import { HomeOutlined, RollbackOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Content } = Layout;

const NotFoundPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Content style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: '#fff'
            }}>
                <Result
                    status="404"
                    title="404 - Страница не найдена"
                    subTitle="Возможно, страница была перемещена или удалена."
                    extra={
                        <Space>
                            <Button
                                type="primary"
                                icon={<HomeOutlined />}
                                onClick={() => navigate('/')}
                            >
                                На главную
                            </Button>
                            <Button
                                icon={<RollbackOutlined />}
                                onClick={() => navigate(-1)}
                            >
                                Назад
                            </Button>
                        </Space>
                    }
                />
            </Content>
        </Layout>
    );
};

export default NotFoundPage;