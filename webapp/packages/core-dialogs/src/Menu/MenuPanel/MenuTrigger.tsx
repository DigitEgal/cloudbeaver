/*
 * CloudBeaver - Cloud Database Manager
 * Copyright (C) 2020-2021 DBeaver Corp and others
 *
 * Licensed under the Apache License, Version 2.0.
 * you may not use this file except in compliance with the License.
 */

import { observer, useObserver } from 'mobx-react-lite';
import {
  forwardRef, Ref, useCallback, useEffect
} from 'react';
import {
  MenuButton,
  Menu, MenuItem, MenuStateReturn, useMenuState, MenuItemCheckbox, MenuItemRadio
} from 'reakit/Menu';
import styled, { use } from 'reshadow';

import { useObjectRef } from '@cloudbeaver/core-blocks';
import { useStyles, Style } from '@cloudbeaver/core-theming';

import type {
  IMenuItem, IMenuPanel, MenuTriggerProps
} from '../IMenuPanel';
import { MenuPanelItem } from './MenuPanelItem';
import { menuPanelStyles } from './menuPanelStyles';

/**
 * MenuTrigger
 */
export const MenuTrigger: React.FC<MenuTriggerProps> = function MenuTrigger({
  panel,
  children,
  style = [],
  placement,
  visible,
  onVisibleSwitch,
  modal,
  ...props
}) {
  const propsRef = useObjectRef({ onVisibleSwitch, visible }, { onVisibleSwitch });
  const menu = useMenuState({ modal, placement, visible });

  useEffect(() => {
    propsRef.onVisibleSwitch?.(menu.visible);
  }, [menu.visible]);

  return styled(useStyles(menuPanelStyles, ...style))(
    <>
      <MenuButton {...menu} {...props}>
        <box as='div'>
          {children}
        </box>
      </MenuButton>
      <MenuPanel panel={panel} menu={menu} style={style} />
    </>
  );
};

/**
 * MenuPanel
 */

interface MenuPanelProps {
  panel: IMenuPanel;
  menu: MenuStateReturn; // from reakit useMenuState
  style?: Style[];
}

const MenuPanel = observer(function MenuPanel({
  panel,
  menu,
  style = [],
}: MenuPanelProps) {
  const styles = useStyles(menuPanelStyles, ...style);

  if (!menu.visible) {
    return null;
  }

  return styled(styles)(
    <Menu {...menu} aria-label={panel.id} modal>
      {panel.menuItems.map(item => (
        <MenuPanelElement key={item.id} item={item} menu={menu} style={style} />
      ))}
    </Menu>
  );
});

/**
 * MenuPanelElement
 */

type MenuPanelElementProps = Omit<React.ButtonHTMLAttributes<any>, 'style'> & {
  item: IMenuItem;
  menu: MenuStateReturn; // from reakit useMenuState
  style?: Style[];
};

const MenuPanelElement = observer(function MenuPanelElement({
  item, menu, style = [],
}: MenuPanelElementProps) {
  const styles = useStyles(menuPanelStyles, ...style);
  const onClick = useCallback(() => {
    if (item.onClick) {
      item.onClick();
    }
    if (!item.panel) {
      menu.hide();
    }
  }, [item, menu]);

  if (item.panel) {
    return styled(styles)(
      <MenuItem
        {...menu}
        {...use({ hidden: item.isHidden })}
        aria-label={item.id}
        disabled={item.isDisabled}
        menuItem={item}
        style={style}
        onClick={onClick}
        {...{ as: MenuInnerTrigger }}
      />
    );
  }

  if (item.type === 'radio') {
    return styled(styles)(
      <MenuItemRadio
        {...menu}
        {...use({ hidden: item.isHidden })}
        aria-label={item.id}
        disabled={item.isDisabled}
        name={item.id}
        value={item.title}
        checked={item.isChecked}
        onClick={onClick}
      >
        <MenuPanelItem menuItem={item} style={style} />
      </MenuItemRadio>

    );
  }

  if (item.type === 'checkbox') {
    return styled(styles)(
      <MenuItemCheckbox
        {...menu}
        {...use({ hidden: item.isHidden })}
        aria-label={item.id}
        disabled={item.isDisabled}
        name={item.id}
        value={item.title}
        checked={item.isChecked}
        onClick={onClick}
      >

        <MenuPanelItem menuItem={item} style={style} />
      </MenuItemCheckbox>
    );
  }

  return styled(styles)(
    <MenuItem
      {...menu}
      {...use({ hidden: item.isHidden })}
      aria-label={item.id}
      disabled={item.isDisabled}
      onClick={onClick}
    >
      <MenuPanelItem menuItem={item} style={style} />
    </MenuItem>
  );
});

/**
 * MenuInnerTrigger
 */

type MenuInnerTriggerProps = Omit<React.ButtonHTMLAttributes<any>, 'style'> & {
  menuItem: IMenuItem;
  style?: Style[];
};

export const MenuInnerTrigger = forwardRef(function MenuInnerTrigger(
  props: MenuInnerTriggerProps,
  ref: Ref<HTMLButtonElement>
) {
  const {
    menuItem, style = [], ...rest
  } = props;
  const menu = useMenuState();
  const panel = useObserver(() => menuItem.panel);

  return styled(useStyles(menuPanelStyles, ...style))(
    <>
      <MenuButton ref={ref} {...menu} {...rest}>
        <box as='div'>
          <MenuPanelItem menuItem={menuItem} style={style} />
        </box>
      </MenuButton>
      <MenuPanel panel={panel!} menu={menu} style={style} />
    </>
  );
});
