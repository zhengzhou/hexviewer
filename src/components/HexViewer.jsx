import React, { useState, useEffect } from 'react';
import './HexViewer.css';

const HexViewer = ({ data }) => {
  const [hexData, setHexData] = useState([]);
  const [selectedBytes, setSelectedBytes] = useState([]);
  const [isLittleEndian, setIsLittleEndian] = useState(true);
  const [parsedValues, setParsedValues] = useState({});
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // 切换侧边栏折叠状态
  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // 将ArrayBuffer转换为十六进制数据数组
  useEffect(() => {
    if (!data || !(data instanceof ArrayBuffer)) return;

    const bytes = new Uint8Array(data);
    const hexArray = Array.from(bytes).map(byte => byte.toString(16).padStart(2, '0'));
    setHexData(hexArray);
  }, [data]);

  // 处理字节选择
  const handleByteClick = (index) => {
    setSelectedBytes([index]);
  };

  // 处理范围选择
  const handleByteMouseDown = (startIndex) => {
    setSelectedBytes([startIndex]);

    const handleMouseMove = (e) => {
      const endIndex = parseInt(e.target.dataset.index);
      if (isNaN(endIndex)) return;

      const start = Math.min(startIndex, endIndex);
      const end = Math.max(startIndex, endIndex);
      const range = Array.from({ length: end - start + 1 }, (_, i) => start + i);
      setSelectedBytes(range);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // 解析选中的字节（所有支持的数据类型）
  useEffect(() => {
    if (selectedBytes.length === 0 || !data) {
      setParsedValues({});
      return;
    }

    const start = Math.min(...selectedBytes);
    const end = Math.max(...selectedBytes);
    const byteLength = end - start + 1;
    const dataView = new DataView(data, start, byteLength);

    const values = {};
    
    // 定义支持的数据类型
    const dataTypes = [
      { name: 'uint8', size: 1, method: 'getUint8' },
      { name: 'int8', size: 1, method: 'getInt8' },
      { name: 'uint16', size: 2, method: 'getUint16' },
      { name: 'int16', size: 2, method: 'getInt16' },
      { name: 'uint32', size: 4, method: 'getUint32' },
      { name: 'int32', size: 4, method: 'getInt32' },
      { name: 'float32', size: 4, method: 'getFloat32' },
      { name: 'uint64', size: 8, method: 'getBigUint64' },
      { name: 'int64', size: 8, method: 'getBigInt64' },
      { name: 'float64', size: 8, method: 'getFloat64' }
    ];

    try {
      dataTypes.forEach(type => {
        if (byteLength >= type.size) {
          values[type.name] = dataView[type.method](0, isLittleEndian);
        } else {
          values[type.name] = '--';
        }
      });
    } catch (error) {
      dataTypes.forEach(type => {
        values[type.name] = 'Parse error';
      });
    }

    setParsedValues(values);
  }, [selectedBytes, isLittleEndian, data]);

  // 将字节转换为ASCII字符
  const byteToAscii = (byte) => {
    const charCode = parseInt(byte, 16);
    return charCode >= 32 && charCode <= 126 ? String.fromCharCode(charCode) : '.';
  };

  // 渲染十六进制数据（带行号和ASCII文本）
  const renderHexData = () => {
    const BYTES_PER_LINE = 16;
    const lines = [];
    
    for (let i = 0; i < hexData.length; i += BYTES_PER_LINE) {
      const lineBytes = hexData.slice(i, i + BYTES_PER_LINE);
      const asciiChars = lineBytes.map(byteToAscii);
      
      lines.push(
        <div key={i} className="hex-line">
          <div className="line-number">{i.toString(16).padStart(4, '0')}:</div>
          <div className="line-bytes">
            {lineBytes.map((hex, j) => {
              const index = i + j;
              const elements = [];
              // 添加字节元素
              elements.push(
                <div
                  key={index}
                  className={`byte ${selectedBytes.includes(index) ? 'selected' : ''}`}
                  data-index={index}
                  onClick={() => handleByteClick(index)}
                  onMouseDown={() => handleByteMouseDown(index)}
                >
                  {hex}
                </div>
              );
              
              // 在第8个字节后添加额外间距（索引7，因为从0开始）
              if (j === 7) {
                elements.push(
                  <div key={`spacing-${index}`} className="byte-spacing"></div>
                );
              }
              
              return elements;
            })}
          </div>
          <div className="line-ascii">
            {lineBytes.map((hex, j) => {
              const index = i + j;
              const char = byteToAscii(hex);
              const elements = [];
              
              // 添加ASCII字符元素
              elements.push(
                <div
                  key={index}
                  className={`ascii-char ${selectedBytes.includes(index) ? 'selected' : ''}`}
                  data-index={index}
                  onClick={() => handleByteClick(index)}
                  onMouseDown={() => handleByteMouseDown(index)}
                >
                  {char}
                </div>
              );
              
              // 在第8个字符后添加额外间距（索引7，因为从0开始）
              if (j === 7) {
                elements.push(
                  <div key={`ascii-spacing-${index}`} className="ascii-spacing"></div>
                );
              }
              
              return elements;
            })}
          </div>
        </div>
      );
    }
    
    return lines;
  };

  return (
    <div className="hex-viewer">
      <div className="hex-content">
        <div className="hex-header">
          <h3>Hex Viewer</h3>
        </div>
        <div className="hex-display">
          {renderHexData()}
        </div>
      </div>
      
      <div className={`hex-sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <button className="toggle-button" onClick={toggleSidebar}>
            {isSidebarCollapsed ? '▶' : '◀'}
          </button>
          <h4>Info</h4>
        </div>
        
        {!isSidebarCollapsed && (
          <>
            <div className="selection-info">
              <h4>Selected Bytes</h4>
              <p>Count: {selectedBytes.length}</p>
              {selectedBytes.length > 0 && (
                <p>Range: {Math.min(...selectedBytes)} - {Math.max(...selectedBytes)}</p>
              )}
            </div>
            
            <div className="endianness-selector">
              <h4>Endianness</h4>
              <div className="checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={isLittleEndian}
                    onChange={(e) => setIsLittleEndian(e.target.checked)}
                  />
                  <span>Little Endian</span>
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={!isLittleEndian}
                    onChange={(e) => setIsLittleEndian(!e.target.checked)}
                  />
                  <span>Big Endian</span>
                </label>
              </div>
            </div>
            
            <div className="parsed-values">
              <h4>Parsed Values</h4>
              {Object.keys(parsedValues).length > 0 ? (
                <div className="values-grid">
                  {Object.entries(parsedValues).map(([type, value]) => (
                    <div key={type} className="value-item">
                      <span className="value-type">{type}:</span>
                      <span className="value-data">{value.toString()}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p>Select bytes to parse</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HexViewer;