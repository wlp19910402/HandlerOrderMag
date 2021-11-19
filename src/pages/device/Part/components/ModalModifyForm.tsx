/**
 * 备件列表 编辑 和 新增
 */
import React, { useState, useEffect, useRef } from 'react';
import type { ActionType } from '@ant-design/pro-table';
import { ModalForm, ProFormText, ProFormTextArea, ProFormSelect } from '@ant-design/pro-form';
import { savePart } from '../service';
import type { PartSaveDataType } from '../data.d';
import { message, Form, Row, Col, Spin } from 'antd'
import UploadImage from '@/components/Upload/index'
import { fetchDicTypeSelectParentIdObj } from '@/pages/admin/Dictionary/service'
import { setUploadUrlImage } from '@/components/Upload/service'
type ModalModifyFormDataProps = {
  createModalVisible: boolean;
  handleModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  actionRef: React.MutableRefObject<ActionType | undefined>;
  currentRow: PartSaveDataType | undefined;
  searchType: any
}
const ModalModifyForm: React.FC<ModalModifyFormDataProps> = (props) => {
  const { createModalVisible, handleModalVisible, actionRef, currentRow, searchType } = props
  const [ uploadImages, setUploadImages ] = useState<string[]>(currentRow?.imgUrls ? currentRow?.imgUrls : [])
  const [ searchModel, setSearchModel ] = useState<any>({});
  const [ loading, setLoading ] = useState<boolean>(false)
  const [ selectAnmaite, setSelectAnmaite ] = useState<any>({})
  const submitForm = async (value: PartSaveDataType) => {
    let params = currentRow?.id !== undefined ? { ...value, id: currentRow.id } : value;
    const response = await savePart({
      ...params,
      ...selectAnmaite,
      imgUrls: uploadImages.filter((item: any) => item !== '')
    })
    if (!response) return
    actionRef.current && actionRef.current.reload();
    handleModalVisible(false);
    message.success(`${currentRow?.id !== undefined ? '修改' : '添加'}成功`);
  }
  useEffect(() => {
    setUploadUrlImage(uploadImages, setUploadImages)
    if (currentRow?.type) {
      fetchDicTypeSelectParentIdObj(currentRow?.type).then(res => {
        setSearchModel(res);
      });
      setSelectAnmaite({ type: currentRow?.type, model: currentRow?.model })
    }
  }, [])
  const formRef = useRef<any | null>(null);
  return (
    <ModalForm
      modalProps={ {
        maskClosable: false,
        okText: "保存"
      } }
      title={ currentRow?.id !== undefined ? "备件编辑" : "备件新增" }
      width="600px"
      visible={ createModalVisible }
      onVisibleChange={ handleModalVisible }
      onFinish={ async (value: any) => {
        await submitForm(value)
      } }
      labelCol={ { span: 4 } }
      layout="horizontal"
      formRef={ formRef }
    >
      <ProFormText
        rules={ [
          {
            required: true,
            message: "请输入备件名称！"
          },
        ] }
        label="备件名称"
        name="name"
        placeholder="请输入备件名称"
        initialValue={ currentRow?.name }
      />
      <ProFormSelect
        name="type"
        rules={ [
          {
            required: true,
            message: "请选择备件类型！"
          },
        ] }
        label="备件类型"
        valueEnum={ { ...searchType } }
        placeholder="请选择备件类型"
        initialValue={ currentRow?.typeName }
        getValueFromEvent={ (arg) => {
          fetchDicTypeSelectParentIdObj(arg).then(async (res) => {
            await setLoading(true);
            await setSearchModel(res);
            setLoading(false);
            formRef.current.setFieldsValue({ "model": undefined })
            setSelectAnmaite({ type: arg, model: undefined })
          });
          return arg
        } }
      />
      <Spin spinning={ loading }>
        <ProFormSelect
          name="model"
          label="备件型号"
          rules={ [
            {
              required: true,
              message: "请选择备件型号！"
            },
          ] }
          valueEnum={ { ...searchModel } }
          placeholder="请选择备件型号"
          initialValue={ currentRow?.modelName }
          getValueFromEvent={ (arg) => {
            setSelectAnmaite({ type: selectAnmaite.type, model: arg })
            return arg
          } }
        />
      </Spin>
      <ProFormTextArea
        name="description"
        label="备件描述"
        placeholder="请输入备件描述"
        initialValue={ currentRow?.description }
        rules={ [
          {
            max: 100,
            message: `内容最多支持100个字符!`,
          },
        ] }
      />
      {/* //图片 */ }
      <Form.Item extra="外观图片（最多上传六张）带“删除”按钮" name="imgUrls" label="图片上传" valuePropName="checked">
        <Row gutter={ [ 16, 16 ] } >
          { uploadImages.map((item, index) => {
            return <Col key={ index }><UploadImage uploadId={ `uploadImagesId_${index}` } value={ item } onChange={ (url) => { setUploadUrlImage(uploadImages, setUploadImages, url, index) } } /></Col>
          }) }
        </Row>
      </Form.Item>
    </ModalForm >
  )
}

export default ModalModifyForm;