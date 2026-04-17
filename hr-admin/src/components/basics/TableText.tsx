import React from 'react';

interface TableTextProps {
  children: React.ReactNode;
  align?: 'left' | 'center' | 'right';
  tone?: 'default' | 'muted' | 'strong';
  style?: React.CSSProperties;
}

const toneColors = {
  default: 'var(--gray-700)',
  muted: 'var(--gray-500)',
  strong: 'var(--gray-800)',
} as const;

export const TableText: React.FC<TableTextProps> = ({
  children,
  align = 'left',
  tone = 'default',
  style,
}) => {
  return (
    <span
      style={{
        display: 'inline-block',
        width: '100%',
        textAlign: align,
        color: toneColors[tone],
        fontFamily: 'inherit',
        fontVariantNumeric: 'tabular-nums lining-nums',
        fontFeatureSettings: '"tnum" 1, "lnum" 1',
        letterSpacing: 0,
        ...style,
      }}
    >
      {children}
    </span>
  );
};

export default TableText;
