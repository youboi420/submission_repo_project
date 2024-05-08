import React, { memo } from 'react';
import L4ConvPanel from './L4ConvComp';

const MemoizedL4ConvPanel = memo(L4ConvPanel, (prevProps, currentProps) => {
  return (
    prevProps.convsDataArray === currentProps.convsDataArray &&
    prevProps.singleMode === currentProps.singleMode &&
    prevProps.proType === currentProps.proType
  );
});

export default MemoizedL4ConvPanel;
