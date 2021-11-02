import { Tooltip, Tag } from 'antd';
import type { Settings as ProSettings } from '@ant-design/pro-layout';
import { QuestionCircleOutlined } from '@ant-design/icons';
import React from 'react';
import type { ConnectProps } from 'umi';
import { connect } from 'umi';
import type { ConnectState } from '@/models/connect';
import Avatar from './AvatarDropdown';
import styles from './index.less';

export type GlobalHeaderRightProps = {
  theme?: ProSettings[ 'navTheme' ] | 'realDark';
} & Partial<ConnectProps> & Partial<ProSettings>

const ENVTagColor = {
  dev: 'orange',
  test: 'green',
  pre: '#87d068',
};

const GlobalHeaderRight: React.SFC<GlobalHeaderRightProps> = (props) => {
  const { theme, layout } = props;
  let className = styles.right;

  if (theme === 'dark' && layout === 'top') {
    className = ` ${styles.right}  ${styles.dark}`;
  }

  return (
    <div className={ className } style={ { position: "fixed", width: "100%",boxShadow: "0 1px 4px rgb(0 21 41 / 8%)", left: "0", height: "48px" } }>
      <div style={ { display: "flex", marginLeft: "auto", marginRight: "16px" } }>
        <Avatar />
        { REACT_APP_ENV && (
          <span>
            <Tag color={ ENVTagColor[ REACT_APP_ENV ] }>{ REACT_APP_ENV }</Tag>
          </span>
        ) }
      </div>
    </div>
  );
};

export default connect(({ settings }: ConnectState) => ({
  theme: settings.navTheme,
  layout: settings.layout,
}))(GlobalHeaderRight);
