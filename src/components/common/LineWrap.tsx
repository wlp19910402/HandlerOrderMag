import { Tooltip } from 'antd';
import React from 'react';
type PropTypes = {
  title: string;
  lineClampNum?: number;
  width?: string;
};

const LineWrap: React.FC<PropTypes> = (props) => {
  const { title, lineClampNum = 1, width = '80px' } = props;
  return (
    <Tooltip placement="topLeft" title={title}>
      <span
        style={{
          width,
          WebkitLineClamp: lineClampNum,
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          display: 'inline-block',
          marginBottom: '-5px',
        }}
      >
        {title}
      </span>
    </Tooltip>
  );
};

export default LineWrap;
