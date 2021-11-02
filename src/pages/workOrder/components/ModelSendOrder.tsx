import { ConsumableAddDataType } from '@/pages/archive/portfolio/data.d'
import { message, Spin, Alert, Divider } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { ModalForm, ProFormCheckbox, ProFormRadio } from '@ant-design/pro-form';
import { sendOrder } from '@/pages/workOrder/service'
import { queryList } from '@/pages/admin/Engineer/service';
import type { EngineerListDataType, } from "@/pages/admin/Engineer/data.d";
import { ENGINNER_STATUS } from '@/pages/admin/Engineer/data.d';
import style from "./sendOrder.less"
export type ColumnEditConsumableType = {
  consumableName: string;
  consumableNo: string;
  consumableTypeName: string;
  consumableModelName: string;
} & ConsumableAddDataType

type ModalModifyFormDataProps = {
  createModalVisible: boolean;
  handleModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  listReloadAndRest?: () => void;
  currentOrder?: any;
}
const ModelSendOrder: React.FC<ModalModifyFormDataProps> = ({ createModalVisible = false, handleModalVisible, listReloadAndRest, currentOrder }) => {
  const [ engineerData, setEngineerData ] = useState<any[] | []>([]);
  const [ currentEngineer, setCurrentEngineer ] = useState<string>(currentOrder.engineerName);
  const [ supporters, setSupporters ] = useState<string>(currentOrder.supporterNames);
  const currentEngineerId = currentOrder.engineerId
  const supportersId=currentOrder.supporterIds?currentOrder.supporterIds.split(",").map(item=>parseInt(item)):[]
  const [ loading, setLoading ] = useState<boolean>(true)
  const submitForm = async (record: any) => {
    await setLoading(true)
    //在工单列表中进行绑定档案
    let response = await sendOrder({
      id: currentOrder.id,
      engineerId: record.engineerId,
      supporterIds: record.supporterIds
    })
    await setLoading(false)
    if (!response) return
    message.success("派单成功");
    if (listReloadAndRest) listReloadAndRest();
    handleModalVisible(false);
  }
  const fetchQueryList = async () => {
    const response = await queryList({
      pageSize: 10000000,
      current: 1,
      status: ENGINNER_STATUS.ON
    })
    setLoading(false)
    if (!response) { setEngineerData([]); return }
    const { data } = response;
    conversionFormat(data.records)
  }
  const conversionFormat = (data: EngineerListDataType[]) => {
    let obj: any[] = []
    data.forEach(item => {
      obj.push({ value: item.id, label: `${item.realname}(${item.mobile})`, style: { "width": "240px", display: "inline-block", margin: "0" } })
    })
    setEngineerData(obj)
  }
  useEffect(() => {
    fetchQueryList()
  }, [])
  const formRef = useRef<any | null>(null)
  return (
    <Spin spinning={ loading }>
      <ModalForm
        modalProps={ {
          maskClosable: false,
          okText: "保存"
        } }
        title="派单"
        width="800px"
        visible={ createModalVisible }
        onVisibleChange={ handleModalVisible }
        onFinish={ async (value: any) => {
          await submitForm(value)
        } }
        labelCol={ { span: 4 } }
        layout="horizontal"
        formRef={ formRef }
      >
        <Alert message={ `工程师: ${currentEngineer}` } type="info" />
        <div className={ style.groupBox }>
          <div className={ style.groupBoxAuto } >
            {
              engineerData.length > 0 ? <ProFormRadio.Group
                name="engineerId"
                layout="vertical"
                label=""
                rules={ [ { required: true, message: "工程师必填!" } ] }
                radioType="radio"
                options={ [ ...engineerData ] }
                initialValue={ currentEngineerId }
                normalize={ (val, prevValue, all) => {
                  setCurrentEngineer(engineerData.find(item => item.value === val).label)
                  return val
                } }
              /> : "暂时无可用人员，请在新增工程师人员"
            }
          </div>
        </div>
        <Divider />
        <Alert message={ `支持人员: ${supporters}` } type="info" />
        <div className={ style.groupBox }>
          <div className={ style.groupBoxAuto } >
            { engineerData.length > 0 ? <ProFormCheckbox.Group
              name="supporterIds"
              layout="vertical"
              label=""
              options={ [ ...engineerData ] }
              initialValue={ supportersId }
              normalize={ (val, prevValue, all) => {
                let res = [];
                val.forEach((item: any) => {
                  res += engineerData.find(ite => ite.value === item).label + ";"
                });
                setSupporters(res)
                return val
              } }
            />
              : "暂时无可用人员，请在新增工程师人员" }
          </div>
        </div>
      </ModalForm >
    </Spin>
  );
};

export default ModelSendOrder