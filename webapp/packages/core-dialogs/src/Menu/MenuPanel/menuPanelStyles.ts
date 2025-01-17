/*
 * CloudBeaver - Cloud Database Manager
 * Copyright (C) 2020-2021 DBeaver Corp and others
 *
 * Licensed under the Apache License, Version 2.0.
 * you may not use this file except in compliance with the License.
 */

import { css } from 'reshadow';

import { composes } from '@cloudbeaver/core-theming';

export const menuPanelStyles = composes(
  css`
    Menu {
      composes: theme-background-surface theme-text-on-surface from global;
    }
    MenuItem,
    MenuItemCheckbox,
    MenuItemRadio,
    MenuButton {
      composes: theme-ripple from global;
    }
    MenuItemElement {
      composes: theme-ripple from global;
    }
    menu-panel-item {
      composes: theme-border-color-background from global;
    }
  `,
  css`
    MenuButton {
      background: none;
      border: none;
      outline: none !important;
      color: inherit;
      cursor: pointer;
      & box {
        display: flex;
        align-items: center;
        flex: 1;
        height: inherit;
      }
    }
    Menu {
      composes: theme-typography--body2 theme-elevation-z5 from global;
      position: absolute;
      display: flex;
      min-width: 140px;
      flex-direction: column;
      padding: 12px 0;
      outline: none;
      z-index: 999;

      & Menu {
        margin-top: -12px;
      }
    }
    MenuItem, MenuItemCheckbox, MenuItemRadio {
      display: flex;
      align-items: center;
      border: none;
      padding: 0;
      background: none;
      text-align: left;
      outline: none;
      color: inherit;
      cursor: pointer;
      white-space: nowrap;
      
      &[use|hidden] {
        display: none;
      }

      &:hover, &:global([aria-expanded="true"]) {
        font-weight: 600;
        & Icon {
          opacity: 1;
        }
      }
    }

    menu-panel-item {
      flex: 1;
      display: flex;
      align-items: center;
      height: 30px;
      padding: 0 4px;
      &[|separator] {
        border-bottom: 1px solid;
      }
      & menu-item-text  {
        display: block;
        padding: 0 4px;
        flex: 1;
      }
      & menu-item-content {
        width: 24px;
        height: 24px;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      & Icon {
        width: 16px;
        height: 16px;
        opacity: 0.5;
        transform: rotate(-90deg);
      }
      & IconOrImage {
        width: 16px;
        height: 16px;
        object-fit: contain;
      }
    }
  `
);
