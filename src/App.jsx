import React, { useEffect, useState } from 'react';
import HexViewer from './components/HexViewer';
import './App.css';

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    // 创建测试数据（增加缓冲区大小以容纳所有数据）
    const buffer = new ArrayBuffer(264);
    const view = new DataView(buffer);
    
    // 添加一些测试数据
    view.setInt32(0, 123456);
    view.setInt32(4, -789012);
    view.setFloat32(8, 3.14159);
    view.setFloat64(12, 1.6180339887);
    view.setUint8(20, 255);
    view.setInt8(21, -128);
    view.setUint16(22, 65535);
    view.setInt16(24, -32768);
    
    // 添加一些随机数据
    for (let i = 26; i < 264; i++) {
      view.setUint8(i, Math.floor(Math.random() * 256));
    }
    
    setData(buffer);
  }, []);

  return (
    <div className="App">
      <h1>Hex Viewer Demo</h1>
      <div className="viewer-container">
        {data ? (
          <HexViewer data={data} />
        ) : (
          <p>Loading data...</p>
        )}
      </div>
    </div>
  );
}

export default App;
