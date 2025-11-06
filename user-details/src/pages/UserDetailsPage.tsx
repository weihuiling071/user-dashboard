import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, fetchUserById, UserContext } from 'container/shared';
import UserForm from '../components/UserForm';
import { Layout, message, Spin } from 'antd';
const { Header, Footer, Sider, Content } = Layout;
import '../styles/index';
const UserDetailsPage: React.FC<{ internalUser?: User }> = ({ internalUser }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedUser, setSelectedUser, updateUser } = useContext(UserContext);
  const [user, setUser] = useState<User | null>(internalUser ?? selectedUser);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (internalUser) return;
    const load = async () => {
      if (!id) return;
      setLoading(true);
      const u = await fetchUserById(Number(id));
      if (!u) navigate('/');
      setUser(u ?? null);
      setSelectedUser(u ?? null);
      setLoading(false);
    };
    load();
    // eslint-disable-next-line
  }, [id]);

  const handleSave = useCallback(
    (u: User) => {
      updateUser(u);
      setUser(u);
    },
    [updateUser, navigate]
  );

  if (loading)
    return (
      <div className="text-center mt-20">
        <Spin size="large" />
      </div>
    );

  if (!user) return <div className="text-center">No user selected</div>;

  return (
    <Layout className="container">
      <Header className="title">
        <h1>User Details</h1>
      </Header>
      <Content>
        <UserForm user={user} onSave={handleSave} />
      </Content>
    </Layout>
  );
};

export default UserDetailsPage;
