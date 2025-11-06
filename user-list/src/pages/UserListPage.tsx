import React, { useCallback, useContext, useMemo, useState } from 'react';
import { Card, Input, Row, Spin, Col } from 'antd';
import UserTable from '../components/userTable';
import { UserContext } from 'container/shared';
import useDebounce from '../hooks/useDebounce';
import { useNavigate } from 'react-router-dom';

const { Search } = Input;

const UserListPage: React.FC = () => {
  const { users, loading, setSelectedUser } = useContext(UserContext);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const debounced = useDebounce(query, 300);
  const filtered = useMemo(() => {
    if (!debounced) return users;
    const q = debounced.toLowerCase();
    return users.filter((u) => `${u.name}${u.username}${u.email}`.toLowerCase().includes(q));
  }, [users, debounced]);

  const handleSelect = useCallback(
    (u: any) => {
      setSelectedUser(u);
      navigate(`/user/${u.id}`);
    },
    [setSelectedUser, navigate]
  );

  return (
    <Card>
      <Row>
        <Col xs={24} sm={24} md={12} lg={12} xxl={6}>
          <Search
            placeholder="Search user by name, username or email"
            onChange={(e) => setQuery(e.target.value)}
            allowClear
            className="mb-20 pb-20"
            size="large"
          />
        </Col>
      </Row>

      {loading ? (
        <div className="text-center mt-20">
          <Spin size="large" />
        </div>
      ) : (
        <UserTable users={filtered} onSelect={handleSelect} />
      )}
    </Card>
  );
};

export default UserListPage;
