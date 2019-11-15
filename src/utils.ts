import * as React from 'react';
import {TProp, TPropValue} from './types';
import {codeFrameColumns} from '@babel/code-frame';

export function assertUnreachable(): never {
  throw new Error("Didn't expect to get here");
}

export const formatBabelError = (error: string) => {
  const isTemplate = error.includes('/* @babel/template */');
  return error
    .replace('1 | /* @babel/template */;', '')
    .replace(
      /\((\d+):(\d+)\)/,
      (_, line, col) => `(${parseInt(line, 10) - (isTemplate ? 1 : 0)}:${col})`
    )
    .replace('<>', '')
    .replace('</>', '')
    .replace(/(\d+) \|/g, (_, line) => {
      const lineNum = parseInt(line, 10);
      const newLineNum = lineNum - 1;
      const lenDiff = line.length - `${newLineNum}`.length;
      return `${' '.repeat(lenDiff)}${newLineNum} |`;
    });
};

export const frameError = (error: string, code: string) => {
  if (error) {
    const found = error.match(/\((\d+)\:(\d+)\)$/);
    if (found) {
      const location = {
        start: {line: parseInt(found[1], 10), column: parseInt(found[2], 10)},
      };
      return `${error}\n\n${codeFrameColumns(code, location)}`;
    }
  }
  return error;
};

export const buildPropsObj = (
  stateProps: {[key: string]: TProp},
  updatedPropValues: {[key: string]: TPropValue}
) => {
  const newProps: {
    [key: string]: TProp;
  } = {};
  Object.keys(stateProps).forEach(name => {
    newProps[name] = {...stateProps[name]};
  });
  Object.keys(updatedPropValues).forEach(name => {
    newProps[name] = {
      value: updatedPropValues[name] || stateProps[name].defaultValue,
      type: stateProps[name].type,
      options: stateProps[name].options,
      enumName: stateProps[name].enumName,
      description: stateProps[name].description,
      placeholder: stateProps[name].placeholder,
      hidden: stateProps[name].hidden,
      names: stateProps[name].names,
      sharedProps: stateProps[name].sharedProps,
      stateful: stateProps[name].stateful,
      propHook: stateProps[name].propHook,
      imports: stateProps[name].imports,
      defaultValue: stateProps[name].defaultValue,
    };
  });
  return newProps;
};

// creates a duplicate internal state, so we can preserve instant value editing
// while debouncing top-level state updates that are slow
export function useValueDebounce<T>(
  globalVal: T,
  globalSet: (val: T) => void
): [T, (val: T) => void] {
  const [val, set] = React.useState(globalVal);

  React.useEffect(() => {
    // begins a countdown when 'val' changes. if it changes before countdown
    // ends, clear the timeout avoids lodash debounce to avoid stale
    // values in globalSet.
    if (val !== globalVal) {
      const timeout = setTimeout(() => globalSet(val), 250);
      return () => clearTimeout(timeout);
    }
    return void 0;
  }, [val]);

  React.useEffect(() => {
    set(globalVal);
  }, [globalVal]);

  return [val, set];
}
