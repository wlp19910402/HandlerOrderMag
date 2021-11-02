import { Settings as ProSettings } from '@ant-design/pro-layout';

type DefaultSettings = Partial<ProSettings> & {
  pwa: boolean;
};

const proSettings: DefaultSettings = {
  navTheme: 'light',
  // 拂晓蓝
  primaryColor: '#1B90FF',
  layout: 'side',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  title: '凌云博际',
  pwa: false,
  iconfontUrl: '',
};

export type { DefaultSettings };

export default proSettings;
