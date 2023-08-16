/*
Copyright (c) 2020 Uber Technologies, Inc.

This source code is licensed under the MIT license found in the
LICENSE file in the root directory of this source tree.
*/
import * as React from 'react';
import {Editor as MonacoEditor} from '@monaco-editor/react';
import {useValueDebounce, TEditorProps} from '../index';
import {getStyles} from '../utils';

const Editor: React.FC<TEditorProps> = ({
  code: globalCode,
  onChange,
  placeholder,
  language,
  theme,
  ['data-testid']: testid,
  className,
  codeDebounceInterval,
}) => {
  const defaultCodeDebounceInterval = 250;
  const [code, setCode] = useValueDebounce<string>(
    globalCode,
    onChange,
    codeDebounceInterval || defaultCodeDebounceInterval
  );

  return (
    <div
      data-testid={testid}
      {...getStyles(
        {
          boxSizing: 'border-box',
          paddingLeft: '4px',
          paddingRight: '4px',
          maxWidth: 'auto',
          overflow: 'hidden',
          borderRadius: '5px',
        },
        className
      )}
    >
      <MonacoEditor
        width="100%"
        height="100%"
        defaultLanguage="javascript"
        language={language || 'javascript'}
        theme={theme || 'vs-dark'}
        options={{minimap: {enabled: false}, contextmenu: false}}
        defaultValue={code || placeholder || ''}
        onChange={(value: any) => setCode(value)}
      />
    </div>
  );
};
export default Editor;
