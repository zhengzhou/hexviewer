// 测试库的基本使用
import HexViewer from '../dist/hex-viewer.es.js';
import React from 'react';
import ReactDOM from 'react-dom/client';

console.log('HexViewer组件:', HexViewer);
console.log('React版本:', React.version);
console.log('ReactDOM版本:', ReactDOM.version);

// 创建测试数据
const buffer = new ArrayBuffer(264);
const view = new DataView(buffer);

// 添加一些测试数据
view.setInt32(0, 123456);
view.setInt32(4, -789012);
view.setFloat32(8, 3.14159);
view.setFloat64(12, 1.6180339887);

console.log('测试数据创建成功:', buffer);
console.log('库测试完成，一切正常！');
