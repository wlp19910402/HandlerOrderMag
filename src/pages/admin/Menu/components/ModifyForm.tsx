/**
 * 用户列表 编辑 和 新增
 */
import React from 'react';
import { Button, Row, Col, Form, Input, Radio } from 'antd'
import type { MenuDataType, TypeFormType } from '../data.d';
import { menuDefault } from '../data.d';
import type { Dispatch } from 'umi'

const formItemLayout = {
  labelCol: {
    span: 4
  },
  wrapperCol: {
    xs: { span: 16 },
    sm: { span: 16 },
  },
};
type ModifyFormDataProps = {
  typeFormType: TypeFormType;
  currentRow: MenuDataType;
  flatMenuData: MenuDataType[];
  setTypeFormType: React.Dispatch<React.SetStateAction<TypeFormType>>;
  dispatch: Dispatch;
  editDisable: boolean | undefined;
  setParentRow: React.Dispatch<React.SetStateAction<MenuDataType | undefined>>;
  fetchMenu: () => void;
}
const ModifyForm: React.FC<ModifyFormDataProps> = (props) => {
  const { typeFormType, currentRow = menuDefault, flatMenuData, setTypeFormType, dispatch, editDisable = true, setParentRow, fetchMenu } = props
  const [ form ] = Form.useForm();
  const onFinish = async (value: any) => {
    await dispatch({
      type: 'menu/saveMenu',
      payload: value,
      callback: async () => {
        setParentRow(undefined)
        await fetchMenu();
      }
    })
  }
  return (
    <Form
      { ...formItemLayout }
      form={ form }
      layout="horizontal"
      initialValues={ { typeFormType } }
      onFinish={ onFinish }
    >
      <Form.Item name="parentId" hidden initialValue={ currentRow.parentId || 0 } >
        <Input />
      </Form.Item>
      {currentRow.id ? <Form.Item name="id" hidden initialValue={ currentRow.id }><Input /></Form.Item> : "" }
      <Form.Item label="类型：" name="type" initialValue={ currentRow.type }>
        <Radio.Group onChange={ (e) => { setTypeFormType(e.target.value) } } disabled={ editDisable }>
          <Radio.Button value={ 0 }>目录</Radio.Button>
          <Radio.Button value={ 1 }>菜单</Radio.Button>
          <Radio.Button value={ 2 }>按钮</Radio.Button>
        </Radio.Group>
      </Form.Item>
      <Form.Item label="名称" initialValue={ currentRow.name } name="name" required>
        <Input disabled={ editDisable } placeholder="请输入名称" />
      </Form.Item>
      <Form.Item label="上级菜单">
        <Input disabled value={ flatMenuData?.find(item => item.id === currentRow.parentId)?.name } />
      </Form.Item>
      <Form.Item hidden={ typeFormType === 0 } initialValue={ currentRow.url } label="菜单地址" name="url" >
        <Input placeholder="请输入菜单地址" disabled={ editDisable } />
      </Form.Item>
      {
        (typeFormType === 1 || typeFormType === 2) &&
        <Form.Item label="授权标识" initialValue={ currentRow.perms } name="perms" >
          <Input placeholder="请输入授权标识" disabled={ editDisable } />
        </Form.Item>
      }
      {
        (typeFormType === 1 || typeFormType === 0) && <>
          <Form.Item label="排序号：" initialValue={ currentRow.orderNum || 1 } name="orderNum" >
            <Input type="number" disabled={ editDisable } />
          </Form.Item>
          <Form.Item label="图标：" initialValue={ currentRow.icon } name="icon">
            <Input placeholder="请输入图标" disabled={ editDisable } />
          </Form.Item>
        </>
      }
      {
        !editDisable && currentRow.id !== 0 &&
        <Form.Item >
          <Row>
            <Col span={ 6 } offset={ 6 }><Button type="default" onClick={ () => form.resetFields() }>取消</Button></Col>
            <Col span={ 6 } offset={ 1 }><Button type="primary" htmlType="submit">保存</Button>
            </Col>
          </Row>
        </Form.Item>
      }
    </Form >
  )
}

export default ModifyForm;
