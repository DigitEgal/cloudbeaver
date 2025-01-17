/*
 * CloudBeaver - Cloud Database Manager
 * Copyright (C) 2020-2021 DBeaver Corp and others
 *
 * Licensed under the Apache License, Version 2.0.
 * you may not use this file except in compliance with the License.
 */

import { observer } from 'mobx-react-lite';
import { useCallback, useContext } from 'react';
import styled, { use, css } from 'reshadow';

import { ComponentStyle, useStyles } from '@cloudbeaver/core-theming';

import type { ILayoutSizeProps } from '../Containers/ILayoutSizeProps';
import { baseFormControlStylesNew } from './baseFormControlStylesNew';
import { FormContext } from './FormContext';
import { isControlPresented } from './isControlPresented';

const INPUT_FIELD_STYLES = css`
  field-label {
    display: block;
    composes: theme-typography--body1 from global;
    font-weight: 500;
  }
  field-label:not(:empty) {
    padding-bottom: 10px;
  }
`;

type BaseProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'name' | 'value'> & ILayoutSizeProps & {
  description?: string;
  mod?: 'surface';
  ref?: React.Ref<HTMLInputElement>;
  style?: ComponentStyle;
};

type ControlledProps = BaseProps & {
  name?: string;
  value?: string | number;
  mapState?: (value: string | number) => string | number;
  mapValue?: (value: string | number) => string | number;
  onChange?: (value: string | number, name?: string) => any;
  state?: never;
  autoHide?: never;
};

type ObjectProps<TKey extends keyof TState, TState> = BaseProps & {
  name: TKey;
  state: TState;
  mapState?: (value: TState[TKey]) => TState[TKey] | string | number;
  mapValue?: (value: TState[TKey]) => TState[TKey];
  onChange?: (value: TState[TKey], name: TKey) => any;
  autoHide?: boolean;
  value?: never;
};

interface InputFieldType {
  (props: ControlledProps): React.ReactElement<any, any> | null;
  <TKey extends keyof TState, TState>(props: ObjectProps<TKey, TState>): React.ReactElement<any, any> | null;
}

export const InputFieldNew: InputFieldType = observer(function InputFieldNew({
  name,
  style,
  value: valueControlled,
  defaultValue,
  required,
  state,
  mapState,
  mapValue,
  children,
  className,
  description,
  mod,
  small,
  medium,
  large,
  autoHide,
  onChange,
  ...rest
}: ControlledProps | ObjectProps<any, any>, ref: React.Ref<HTMLInputElement>) {
  const styles = useStyles(baseFormControlStylesNew, INPUT_FIELD_STYLES, style);
  const context = useContext(FormContext);

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = mapValue?.(event.target.value) ?? event.target.value;

    if (state) {
      state[name] = value;
    }
    if (onChange) {
      onChange(value, name);
    }
    if (context) {
      context.change(value, name);
    }
  }, [state, name, context, onChange]);

  if (autoHide && !isControlPresented(name, state, defaultValue)) {
    return null;
  }

  let value: any = valueControlled ?? defaultValue ?? undefined;

  if (state && name !== undefined && name in state) {
    value = state[name];
  }

  if (mapState) {
    value = mapState(value);
  }

  return styled(styles)(
    <field as="div" className={className} {...use({ small, medium, large })}>
      <field-label as='label' title={rest.title}>{children}{required && ' *'}</field-label>
      <input
        ref={ref}
        role='new'
        {...rest}
        name={name}
        value={value ?? ''}
        onChange={handleChange}
        {...use({ mod })}
        required={required}
      />
      {description && (
        <field-description as='div'>
          {description}
        </field-description>
      )}
    </field>
  );
}, { forwardRef: true });
