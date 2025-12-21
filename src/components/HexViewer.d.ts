import React from 'react';

interface HexViewerProps {
  /**
   * 要显示的二进制数据
   */
  data: ArrayBuffer;
}

/**
 * 一个功能强大的React十六进制查看器组件，支持数据解析、字节选择和响应式设计
 */
declare const HexViewer: React.FC<HexViewerProps>;

export default HexViewer;
