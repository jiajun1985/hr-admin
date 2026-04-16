import React, { useState } from 'react';
import { PageHeader } from '../components/composites/PageHeader';
import { Button } from '../components/basics/Button';
import { Input } from '../components/basics/Input';
import { Icon } from '../components/basics/Icon';
import { Modal } from '../components/basics/Modal';
import { DEMO_STORAGE_KEYS } from '../hooks/demoStorage';
import { useLocalStorageState } from '../hooks/useLocalStorageState';

interface BannerItem {
  id: string;
  imageUrl: string;
  linkUrl: string;
}

interface ConfigItem {
  key: string;
  label: string;
  icon: string;
}

const configItems: ConfigItem[] = [
  { key: 'banner', label: '首页Banner', icon: 'announcement' },
  { key: 'theme', label: '主题色设置', icon: 'config' },
  { key: 'modules', label: '模块开关', icon: 'settings' },
  { key: 'announcement', label: '企业公告', icon: 'announcement' },
  { key: 'points-rule', label: '积分规则', icon: 'points' },
];

const themeColors = [
  { label: '品质橙', value: '#EA580C', color: '#EA580C' },
  { label: '科技蓝', value: '#2563EB', color: '#2563EB' },
  { label: '活力绿', value: '#16A34A', color: '#16A34A' },
  { label: '优雅紫', value: '#7C3AED', color: '#7C3AED' },
];

const moduleOptions = [
  { key: 'insurance', label: '保险模块', enabled: true },
  { key: 'medical', label: '体检模块', enabled: true },
  { key: 'points', label: '积分模块', enabled: true },
  { key: 'birthday', label: '生日祝福', enabled: true },
  { key: 'anniversary', label: '司龄祝福', enabled: false },
  { key: 'gift', label: '年节福利', enabled: true },
];

interface InterfaceConfigProps {}

const InterfaceConfig: React.FC<InterfaceConfigProps> = () => {
  const [activeConfig, setActiveConfig] = useState('banner');
  const [banners, setBanners] = useLocalStorageState<BannerItem[]>(DEMO_STORAGE_KEYS.interfaceBanners, [
    { id: '1', imageUrl: 'https://picsum.photos/750/320?random=1', linkUrl: 'https://example.com/1' },
    { id: '2', imageUrl: 'https://picsum.photos/750/320?random=2', linkUrl: 'https://example.com/2' },
  ]);
  const [selectedTheme, setSelectedTheme] = useLocalStorageState(DEMO_STORAGE_KEYS.interfaceTheme, '#EA580C');
  const [modules, setModules] = useLocalStorageState(DEMO_STORAGE_KEYS.interfaceModules, moduleOptions);
  const [previewOpen, setPreviewOpen] = useState(false);

  const handleAddBanner = () => {
    const newBanner: BannerItem = {
      id: Date.now().toString(),
      imageUrl: 'https://picsum.photos/750/320?random=' + Date.now(),
      linkUrl: '',
    };
    setBanners([...banners, newBanner]);
  };

  const handleDeleteBanner = (id: string) => {
    setBanners(banners.filter(b => b.id !== id));
  };

  const handleToggleModule = (key: string) => {
    setModules(modules.map(m => 
      m.key === key ? { ...m, enabled: !m.enabled } : m
    ));
  };

  const renderConfigContent = () => {
    switch (activeConfig) {
      case 'banner':
        return (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--gray-700)', marginBottom: '4px' }}>
                首页Banner配置
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--gray-400)' }}>
                最多上传 5 张轮播图，建议尺寸 750×320
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
              {banners.map((banner, index) => (
                <div
                  key={banner.id}
                  style={{
                    width: '160px',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    border: '1px solid var(--gray-200)',
                    position: 'relative',
                  }}
                >
                  <img
                    src={banner.imageUrl}
                    alt={`Banner ${index + 1}`}
                    style={{ width: '100%', height: '80px', objectFit: 'cover' }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '4px',
                    right: '4px',
                    display: 'flex',
                    gap: '4px',
                  }}>
                    <button
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        border: 'none',
                        color: '#fff',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      onClick={() => handleDeleteBanner(banner.id)}
                    >
                      <Icon name="close" size={12} />
                    </button>
                  </div>
                  <div style={{
                    position: 'absolute',
                    top: '4px',
                    left: '4px',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    color: '#fff',
                    fontSize: '10px',
                    padding: '2px 6px',
                    borderRadius: '4px',
                  }}>
                    {index + 1}
                  </div>
                </div>
              ))}
              {banners.length < 5 && (
                <button
                  onClick={handleAddBanner}
                  style={{
                    width: '160px',
                    height: '80px',
                    border: '2px dashed var(--gray-200)',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    color: 'var(--gray-400)',
                    transition: 'all 0.15s',
                  }}
                >
                  <Icon name="plus" size={24} />
                  <span style={{ fontSize: '12px' }}>上传图片</span>
                </button>
              )}
            </div>

            <div style={{ border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
              <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--gray-700)', marginBottom: '12px' }}>
                链接配置
              </h4>
              {banners.map((banner, index) => (
                <div key={banner.id} style={{ marginBottom: index < banners.length - 1 ? '12px' : 0 }}>
                  <label style={{ fontSize: '12px', color: 'var(--gray-500)', marginBottom: '4px', display: 'block' }}>
                    图片{index + 1}链接
                  </label>
                  <Input
                    placeholder="请输入跳转链接"
                    value={banner.linkUrl}
                    onChange={(e) => {
                      const newBanners = [...banners];
                      newBanners[index].linkUrl = e.target.value;
                      setBanners(newBanners);
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        );

      case 'theme':
        return (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--gray-700)', marginBottom: '4px' }}>
                主题色设置
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--gray-400)' }}>
                选择员工端的主题颜色，修改后实时生效
              </p>
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              {themeColors.map((theme) => (
                <div
                  key={theme.value}
                  onClick={() => setSelectedTheme(theme.value)}
                  style={{
                    width: '120px',
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    border: `2px solid ${selectedTheme === theme.value ? theme.color : 'var(--gray-200)'}`,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  <div style={{
                    width: '100%',
                    height: '48px',
                    backgroundColor: theme.color,
                    borderRadius: 'var(--radius-sm)',
                    marginBottom: '8px',
                  }} />
                  <div style={{ fontSize: '13px', color: 'var(--gray-700)', textAlign: 'center' }}>
                    {theme.label}
                  </div>
                  {selectedTheme === theme.value && (
                    <div style={{ textAlign: 'center', marginTop: '4px' }}>
                      <Icon name="check" size={14} color={theme.color} />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div style={{ marginTop: '24px' }}>
              <label style={{ fontSize: '13px', color: 'var(--gray-600)', marginBottom: '8px', display: 'block' }}>
                自定义颜色
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <input
                  type="color"
                  value={selectedTheme}
                  onChange={(e) => setSelectedTheme(e.target.value)}
                  style={{ width: '40px', height: '32px', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}
                />
                <Input
                  value={selectedTheme}
                  onChange={(e) => setSelectedTheme(e.target.value)}
                  style={{ width: '120px' }}
                />
              </div>
            </div>
          </div>
        );

      case 'modules':
        return (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--gray-700)', marginBottom: '4px' }}>
                模块开关
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--gray-400)' }}>
                控制员工端各模块的显示与隐藏
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {modules.map((module) => (
                <div
                  key={module.key}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    backgroundColor: 'var(--gray-50)',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '14px', color: 'var(--gray-700)', fontWeight: 500 }}>
                      {module.label}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--gray-400)', marginTop: '2px' }}>
                      员工端首页显示此模块入口
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggleModule(module.key)}
                    style={{
                      width: '44px',
                      height: '24px',
                      borderRadius: '12px',
                      backgroundColor: module.enabled ? 'var(--primary-500)' : 'var(--gray-300)',
                      border: 'none',
                      cursor: 'pointer',
                      position: 'relative',
                      transition: 'background-color 0.2s',
                    }}
                  >
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      backgroundColor: '#fff',
                      position: 'absolute',
                      top: '2px',
                      left: module.enabled ? '22px' : '2px',
                      transition: 'left 0.2s',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    }} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <PageHeader
        breadcrumb={[
          { label: '首页', path: '/' },
          { label: '运营管理' },
          { label: '界面配置' },
        ]}
        title="界面配置"
        description="配置员工端 (C端) 展示内容，修改后实时生效"
        actions={[
          { buttonType: 'secondary', label: '预览效果', icon: 'eye', onClick: () => setPreviewOpen(true) },
          { buttonType: 'primary', label: '保存配置', icon: 'check', onClick: () => {} },
        ]}
      />

      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{
          width: '200px',
          backgroundColor: 'var(--gray-0)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 0',
          flexShrink: 0,
        }}>
          <div style={{ padding: '8px 16px', fontSize: '13px', color: 'var(--gray-500)', marginBottom: '8px' }}>
            配置项
          </div>
          {configItems.map((item) => (
            <div
              key={item.key}
              onClick={() => setActiveConfig(item.key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 16px',
                fontSize: '13px',
                color: activeConfig === item.key ? 'var(--primary-600)' : 'var(--gray-600)',
                backgroundColor: activeConfig === item.key ? 'var(--primary-50)' : 'transparent',
                cursor: 'pointer',
                borderLeft: activeConfig === item.key ? '3px solid var(--primary-600)' : '3px solid transparent',
                transition: 'all 0.15s',
              }}
            >
              <Icon name={item.icon as any} size={16} />
              {item.label}
            </div>
          ))}
        </div>

        <div style={{
          flex: 1,
          backgroundColor: 'var(--gray-0)',
          borderRadius: 'var(--radius-md)',
          padding: '20px',
        }}>
          {renderConfigContent()}
        </div>
      </div>

      <Modal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title="效果预览"
        size="lg"
        footer={[
          <Button key="close" type="secondary" onClick={() => setPreviewOpen(false)}>
            关闭
          </Button>
        ]}
      >
        <div style={{
          backgroundColor: 'var(--gray-100)',
          borderRadius: 'var(--radius-md)',
          padding: '20px',
          textAlign: 'center',
        }}>
          <div style={{
            backgroundColor: '#fff',
            borderRadius: 'var(--radius-md)',
            padding: '40px 20px',
            maxWidth: '375px',
            margin: '0 auto',
          }}>
            <div style={{
              width: '100%',
              height: '120px',
              backgroundColor: 'var(--gray-200)',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--gray-400)',
            }}>
              Banner 预览区域
            </div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--gray-800)', marginBottom: '12px' }}>
              员工端首页效果
            </div>
            <p style={{ fontSize: '12px', color: 'var(--gray-400)' }}>
              这是员工端界面在移动端的预览效果
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default InterfaceConfig;
