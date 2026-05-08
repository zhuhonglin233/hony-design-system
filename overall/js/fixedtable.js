import React from 'react';
import { Table } from 'antd';

// 定义表格的列配置（固定列、宽度、标题都在这里）
const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
    fixed: 'left', // 左边固定
    width: 120,
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
    width: 100,
  },
  {
    title: '地址1',
    dataIndex: 'address1',
    key: 'address1',
    width: 180,
  },
  {
    title: '地址2',
    dataIndex: 'address2',
    key: 'address2',
    width: 180,
  },
  {
    title: '地址3',
    dataIndex: 'address3',
    key: 'address3',
    width: 180,
  },
  {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
    fixed: 'right', // 右边固定
    width: 120,
    render: () => <a href="#">编辑</a>,
  },
];

// 模拟表格数据
const data = Array.from({ length: 20 }).map((_, i) => ({
  key: i,
  name: `用户${i}`,
  age: 20 + i,
  address1: '上海市浦东新区',
  address2: '北京市朝阳区',
  address3: '广州市天河区',
}));

const FixedTable = () => {
  return (
    <div style={{ padding: 20 }}>
      <Table
        columns={columns}
        dataSource={data}
        bordered
        pagination={{ pageSize: 10 }}
        // 核心配置：固定表头 + 横向滚动
        scroll={{
          x: 'max-content', // 横向滚动，列宽按配置来
          y: 360,           // 表头固定，内容区域高度 360px
        }}
      />
    </div>
  );
};

export default FixedTable;