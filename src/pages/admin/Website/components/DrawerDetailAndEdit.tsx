/**
 * 网点详情和编辑
 */
import React from 'react';
import type { ActionType } from '@ant-design/pro-table';
import type { SiteDataType } from '../data';
import { Tabs } from 'antd';
import UserListBySiteId from './UserListBySiteId';
import WebsiteInfoEdit from './WebsiteInfoEdit';
import AreaAuthModal from './AreaAuthModal';
import { selectLableType } from '../index'
type DrawerDetailAndEditDataProps = {
  currentRow: SiteDataType | undefined;
  actionRef: React.MutableRefObject<ActionType | undefined>;
  provinceData: selectLableType[]
};

const { TabPane } = Tabs;
const DrawerDetailAndEdit: React.FC<DrawerDetailAndEditDataProps> = (props) => {
  const { currentRow, actionRef, provinceData } = props;
  return (
    <Tabs defaultActiveKey="1" type="card" size={ 'small' }>
      <TabPane tab="网点信息" key="1" style={ { overflowY: 'auto', height: 'calc(100vh - 100px)' } }>
        <WebsiteInfoEdit currentRow={ currentRow } actionRef={ actionRef } />
      </TabPane>
      <TabPane tab="区域授权" key="2" style={ { overflowY: 'auto', height: 'calc(100vh - 100px)' } }>
        <AreaAuthModal currentRow={ currentRow } actionRef={ actionRef } provinceData={ provinceData } />
      </TabPane>
      <TabPane tab="服务授权" key="3" style={ { overflowY: 'auto', height: 'calc(100vh - 100px)' } }>
        服务授权 2
      </TabPane>
      { currentRow?.id !== undefined && (
        <TabPane
          tab="网点人员"
          key="4"
          style={ { overflowY: 'auto', height: 'calc(100vh - 100px)' } }
        >
          <UserListBySiteId siteId={ currentRow.id } />
        </TabPane>
      ) }
    </Tabs>
  );
};

export default DrawerDetailAndEdit;
