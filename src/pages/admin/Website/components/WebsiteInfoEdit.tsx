/**
 * 网点详情和编辑
 */
import React from 'react';
import type { ActionType } from '@ant-design/pro-table';
import type { SiteDataType } from '../data';
import { saveWebsite } from '../service';
import { Form, Input, message, Button } from 'antd';
type DrawerDetailAndEditDataProps = {
  currentRow: SiteDataType | undefined;
  actionRef: React.MutableRefObject<ActionType | undefined>;
};
const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

const WebsiteInfoEdit: React.FC<DrawerDetailAndEditDataProps> = (props) => {
  const { currentRow, actionRef } = props;
  const onSaveWebsiteInfo = async (values: any) => {
    let response = await saveWebsite({ id: currentRow?.id, ...values });
    if (!response) return;
    actionRef.current && actionRef.current.reload();
    message.success(`${currentRow?.id !== undefined ? '修改' : '添加'}成功`);
  };
  const validateMessages = {
    required: '${label} 是必填项!',
  };
  return (
    <Form
      { ...layout }
      name="nest-messages"
      onFinish={ onSaveWebsiteInfo }
      style={ { marginTop: '30px' } }
      validateMessages={ validateMessages }
    >
      <Form.Item
        name="siteName"
        label="网点名称"
        rules={ [ { required: true } ] }
        initialValue={ currentRow?.siteName }
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="personLiableName"
        label="网点责任人"
        rules={ [ { required: true } ] }
        initialValue={ currentRow?.personLiableName }
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="personLiableMobile"
        label="责任人电话"
        rules={ [ { required: true }, { pattern: /^1\d{10}$/, message: '请输入正确的手机号' } ] }
        initialValue={ currentRow?.personLiableMobile }
      >
        <Input />
      </Form.Item>
      <Form.Item label="省份">
        <Input disabled={ true } value={ currentRow?.provinceName } />
      </Form.Item>
      <Form.Item label="城市">
        <Input disabled={ true } value={ currentRow?.cityName } />
      </Form.Item>
      <Form.Item label="区域">
        <Input disabled={ true } value={ currentRow?.districtName } />
      </Form.Item>
      <Form.Item
        name="address"
        label="详细地址"
        initialValue={ currentRow?.address }
        rules={ [ { required: true } ] }
      >
        <Input.TextArea />
      </Form.Item>
      <Form.Item wrapperCol={ { ...layout.wrapperCol, offset: 6 } }>
        <Button type="primary" htmlType="submit">
          保存
        </Button>
      </Form.Item>
    </Form>
  );
};

export default WebsiteInfoEdit;
