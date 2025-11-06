import React from 'react';
import { Button, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { User } from 'container/shared';

const getColumns = (onSelect: (u: User) => void): ColumnsType<User> => [
  { title: 'Name', dataIndex: 'name', key: 'name', sorter: (a, b) => a.name.localeCompare(b.name) },
  { title: 'Username', dataIndex: 'username', key: 'username', responsive: ['md'] },
  { title: 'Email', dataIndex: 'email', key: 'email', responsive: ['md'] },
  { title: 'Phone', dataIndex: 'phone', key: 'phone', responsive: ['md'] },
  {
    title: 'Company',
    dataIndex: 'company',
    key: 'company',
    responsive: ['md'],
    render: (company) => company.name,
  },
  {
    title: 'Action',
    dataIndex: 'operation',
    key: 'operation',
    render: (_: any, record: User) => (
      <Button
        type="primary"
        size="small"
        onClick={(e) => {
          onSelect(record);
        }}
      >
        View
      </Button>
    ),
  },
];

const UserTable: React.FC<{ users: User[]; onSelect: (u: User) => void }> = ({
  users,
  onSelect,
}) => {
  return (
    <Table
      dataSource={users}
      columns={getColumns(onSelect)}
      rowKey="id"
      pagination={{ pageSize: 5 }}
      onRow={(record) => ({ onClick: () => onSelect(record) })}
      style={{ cursor: 'pointer' }}
    />
  );
};

export default UserTable;
