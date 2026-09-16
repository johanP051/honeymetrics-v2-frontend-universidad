import {
  GlobalStyles_default,
  capitalize_default,
  clsx_default,
  composeClasses,
  css,
  defaultTheme_default,
  generateUtilityClass,
  generateUtilityClasses,
  identifier_default,
  keyframes,
  outsetFocusRing,
  require_jsx_runtime,
  require_prop_types,
  resolveProps,
  rootShouldForwardProp_default,
  styled_default,
  unstable_memoTheme,
  useDefaultProps,
  useEnhancedEffect_default,
  useId,
  useTheme_default
} from "./chunk-PEB6WLBT.js";
import {
  __publicField,
  __toESM,
  require_react
} from "./chunk-AK4TLUUY.js";

// node_modules/@mui/material/Button/Button.mjs
var React20 = __toESM(require_react(), 1);
var import_prop_types9 = __toESM(require_prop_types(), 1);

// node_modules/@mui/material/SvgIcon/createSvgIcon.mjs
var React3 = __toESM(require_react(), 1);

// node_modules/@mui/material/SvgIcon/SvgIcon.mjs
var React2 = __toESM(require_react(), 1);
var import_prop_types2 = __toESM(require_prop_types(), 1);

// node_modules/@mui/material/styles/useTheme.mjs
var React = __toESM(require_react(), 1);
function useTheme() {
  const theme = useTheme_default(defaultTheme_default);
  if (true) {
    React.useDebugValue(theme);
  }
  return theme[identifier_default] || theme;
}

// node_modules/@mui/material/GlobalStyles/GlobalStyles.mjs
var import_prop_types = __toESM(require_prop_types(), 1);
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
function GlobalStyles(props) {
  return (0, import_jsx_runtime.jsx)(GlobalStyles_default, {
    ...props,
    defaultTheme: defaultTheme_default,
    themeId: identifier_default
  });
}
true ? GlobalStyles.propTypes = {
  // ┌────────────────────────────── Warning ──────────────────────────────┐
  // │ These PropTypes are generated from the TypeScript type definitions. │
  // │    To update them, edit the d.ts file and run `pnpm proptypes`.     │
  // └─────────────────────────────────────────────────────────────────────┘
  /**
   * The styles you want to apply globally.
   */
  styles: import_prop_types.default.oneOfType([import_prop_types.default.array, import_prop_types.default.func, import_prop_types.default.number, import_prop_types.default.object, import_prop_types.default.string, import_prop_types.default.bool])
} : void 0;

// node_modules/@mui/material/zero-styled/index.mjs
var import_jsx_runtime2 = __toESM(require_jsx_runtime(), 1);

// node_modules/@mui/material/utils/memoTheme.mjs
var memoTheme = unstable_memoTheme;
var memoTheme_default = memoTheme;

// node_modules/@mui/material/SvgIcon/svgIconClasses.mjs
function getSvgIconUtilityClass(slot) {
  return generateUtilityClass("MuiSvgIcon", slot);
}
var svgIconClasses = generateUtilityClasses("MuiSvgIcon", ["root", "colorPrimary", "colorSecondary", "colorAction", "colorError", "colorDisabled", "fontSizeInherit", "fontSizeSmall", "fontSizeMedium", "fontSizeLarge"]);

// node_modules/@mui/material/styles/reducedMotion.mjs
var defaultStyles = {
  transition: "none"
};
function resolveReducedMotionStyles(reducedMotion, styles) {
  if (reducedMotion === "always") {
    return styles;
  }
  if (reducedMotion === "system") {
    return {
      "@media (prefers-reduced-motion: reduce)": styles
    };
  }
  return null;
}

// node_modules/@mui/material/transitions/utils.mjs
var EMPTY_STYLE = {};
var DEFAULT_TRANSITION_PROPS = ["all"];
var EMPTY_OPTIONS = {};
function getReducedMotionStyles(theme, styles) {
  var _a;
  const resolvedStyles = styles ?? defaultStyles;
  return resolveReducedMotionStyles((_a = theme.motion) == null ? void 0 : _a.reducedMotion, resolvedStyles);
}
function getTransitionStyles(theme, props = DEFAULT_TRANSITION_PROPS, options = EMPTY_OPTIONS) {
  var _a, _b;
  const transition = (_b = (_a = theme.transitions) == null ? void 0 : _a.create) == null ? void 0 : _b.call(_a, props, options);
  const reducedMotionStyles = getReducedMotionStyles(theme);
  if (transition === void 0) {
    return reducedMotionStyles ?? EMPTY_STYLE;
  }
  const transitionStyles = {
    transition
  };
  return reducedMotionStyles ? {
    ...transitionStyles,
    ...reducedMotionStyles
  } : transitionStyles;
}

// node_modules/@mui/material/SvgIcon/SvgIcon.mjs
var import_jsx_runtime3 = __toESM(require_jsx_runtime(), 1);
var useUtilityClasses = (ownerState) => {
  const {
    color,
    fontSize,
    classes
  } = ownerState;
  const slots = {
    root: ["root", color !== "inherit" && `color${capitalize_default(color)}`, `fontSize${capitalize_default(fontSize)}`]
  };
  return composeClasses(slots, getSvgIconUtilityClass, classes);
};
var SvgIconRoot = styled_default("svg", {
  name: "MuiSvgIcon",
  slot: "Root",
  overridesResolver: (props, styles) => {
    const {
      ownerState
    } = props;
    return [styles.root, ownerState.color !== "inherit" && styles[`color${capitalize_default(ownerState.color)}`], styles[`fontSize${capitalize_default(ownerState.fontSize)}`]];
  }
})(memoTheme_default(({
  theme
}) => {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l;
  return {
    userSelect: "none",
    width: "1em",
    height: "1em",
    display: "inline-block",
    flexShrink: 0,
    ...getTransitionStyles(theme, "fill", {
      duration: (_b = (_a = (theme.vars ?? theme).transitions) == null ? void 0 : _a.duration) == null ? void 0 : _b.shorter
    }),
    variants: [
      {
        props: (props) => !props.hasSvgAsChild,
        style: {
          // the <svg> will define the property that has `currentColor`
          // for example heroicons uses fill="none" and stroke="currentColor"
          fill: "currentColor"
        }
      },
      {
        props: {
          fontSize: "inherit"
        },
        style: {
          fontSize: "inherit"
        }
      },
      {
        props: {
          fontSize: "small"
        },
        style: {
          fontSize: ((_d = (_c = theme.typography) == null ? void 0 : _c.pxToRem) == null ? void 0 : _d.call(_c, 20)) || "1.25rem"
        }
      },
      {
        props: {
          fontSize: "medium"
        },
        style: {
          fontSize: ((_f = (_e = theme.typography) == null ? void 0 : _e.pxToRem) == null ? void 0 : _f.call(_e, 24)) || "1.5rem"
        }
      },
      {
        props: {
          fontSize: "large"
        },
        style: {
          fontSize: ((_h = (_g = theme.typography) == null ? void 0 : _g.pxToRem) == null ? void 0 : _h.call(_g, 35)) || "2.1875rem"
        }
      },
      // TODO v5 deprecate color prop, v6 remove for sx
      ...Object.entries((theme.vars ?? theme).palette).filter(([, value]) => value && value.main).map(([color]) => {
        var _a2, _b2;
        return {
          props: {
            color
          },
          style: {
            color: (_b2 = (_a2 = (theme.vars ?? theme).palette) == null ? void 0 : _a2[color]) == null ? void 0 : _b2.main
          }
        };
      }),
      {
        props: {
          color: "action"
        },
        style: {
          color: (_j = (_i = (theme.vars ?? theme).palette) == null ? void 0 : _i.action) == null ? void 0 : _j.active
        }
      },
      {
        props: {
          color: "disabled"
        },
        style: {
          color: (_l = (_k = (theme.vars ?? theme).palette) == null ? void 0 : _k.action) == null ? void 0 : _l.disabled
        }
      },
      {
        props: {
          color: "inherit"
        },
        style: {
          color: void 0
        }
      }
    ]
  };
}));
var SvgIcon = React2.forwardRef(function SvgIcon2(inProps, ref) {
  const props = useDefaultProps({
    props: inProps,
    name: "MuiSvgIcon"
  });
  const {
    children,
    className,
    color = "inherit",
    component = "svg",
    fontSize = "medium",
    htmlColor,
    inheritViewBox = false,
    titleAccess,
    viewBox = "0 0 24 24",
    ...other
  } = props;
  const hasSvgAsChild = React2.isValidElement(children) && children.type === "svg";
  const ownerState = {
    ...props,
    color,
    component,
    fontSize,
    instanceFontSize: inProps.fontSize,
    inheritViewBox,
    viewBox,
    hasSvgAsChild
  };
  const more = {};
  if (!inheritViewBox) {
    more.viewBox = viewBox;
  }
  const classes = useUtilityClasses(ownerState);
  return (0, import_jsx_runtime3.jsxs)(SvgIconRoot, {
    as: component,
    className: clsx_default(classes.root, className),
    focusable: "false",
    color: htmlColor,
    "aria-hidden": titleAccess ? void 0 : true,
    role: titleAccess ? "img" : void 0,
    ref,
    ...more,
    ...other,
    ...hasSvgAsChild && children.props,
    ownerState,
    children: [hasSvgAsChild ? children.props.children : children, titleAccess ? (0, import_jsx_runtime3.jsx)("title", {
      children: titleAccess
    }) : null]
  });
});
true ? SvgIcon.propTypes = {
  // ┌────────────────────────────── Warning ──────────────────────────────┐
  // │ These PropTypes are generated from the TypeScript type definitions. │
  // │    To update them, edit the d.ts file and run `pnpm proptypes`.     │
  // └─────────────────────────────────────────────────────────────────────┘
  /**
   * Node passed into the SVG element.
   */
  children: import_prop_types2.default.node,
  /**
   * Override or extend the styles applied to the component.
   */
  classes: import_prop_types2.default.object,
  /**
   * @ignore
   */
  className: import_prop_types2.default.string,
  /**
   * The color of the component.
   * It supports both default and custom theme colors, which can be added as shown in the
   * [palette customization guide](https://mui.com/material-ui/customization/palette/#custom-colors).
   * You can use the `htmlColor` prop to apply a color attribute to the SVG element.
   * @default 'inherit'
   */
  color: import_prop_types2.default.oneOfType([import_prop_types2.default.oneOf(["inherit", "action", "disabled", "primary", "secondary", "error", "info", "success", "warning"]), import_prop_types2.default.string]),
  /**
   * The component used for the root node.
   * Either a string to use a HTML element or a component.
   */
  component: import_prop_types2.default.elementType,
  /**
   * The fontSize applied to the icon. Defaults to 24px, but can be configure to inherit font size.
   * @default 'medium'
   */
  fontSize: import_prop_types2.default.oneOfType([import_prop_types2.default.oneOf(["inherit", "large", "medium", "small"]), import_prop_types2.default.string]),
  /**
   * Applies a color attribute to the SVG element.
   */
  htmlColor: import_prop_types2.default.string,
  /**
   * If `true`, the root node will inherit the custom `component`'s viewBox and the `viewBox`
   * prop will be ignored.
   * Useful when you want to reference a custom `component` and have `SvgIcon` pass that
   * `component`'s viewBox to the root node.
   * @default false
   */
  inheritViewBox: import_prop_types2.default.bool,
  /**
   * The shape-rendering attribute. The behavior of the different options is described on the
   * [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/shape-rendering).
   * If you are having issues with blurry icons you should investigate this prop.
   */
  shapeRendering: import_prop_types2.default.string,
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: import_prop_types2.default.oneOfType([import_prop_types2.default.arrayOf(import_prop_types2.default.oneOfType([import_prop_types2.default.func, import_prop_types2.default.object, import_prop_types2.default.bool])), import_prop_types2.default.func, import_prop_types2.default.object]),
  /**
   * Provides a human-readable title for the element that contains it.
   * https://www.w3.org/TR/SVG-access/#Equivalent
   */
  titleAccess: import_prop_types2.default.string,
  /**
   * Allows you to redefine what the coordinates without units mean inside an SVG element.
   * For example, if the SVG element is 500 (width) by 200 (height),
   * and you pass viewBox="0 0 50 20",
   * this means that the coordinates inside the SVG will go from the top left corner (0,0)
   * to bottom right (50,20) and each unit will be worth 10px.
   * @default '0 0 24 24'
   */
  viewBox: import_prop_types2.default.string
} : void 0;
SvgIcon.muiName = "SvgIcon";

// node_modules/@mui/material/SvgIcon/createSvgIcon.mjs
var import_jsx_runtime4 = __toESM(require_jsx_runtime(), 1);

// node_modules/@mui/material/utils/useId.mjs
var useId_default = useId;

// node_modules/@mui/utils/useControlled/useControlled.mjs
var React4 = __toESM(require_react(), 1);

// node_modules/@mui/utils/useEventCallback/useEventCallback.mjs
var React5 = __toESM(require_react(), 1);
function useEventCallback(fn) {
  const ref = React5.useRef(fn);
  useEnhancedEffect_default(() => {
    ref.current = fn;
  });
  return React5.useRef((...args) => (
    // @ts-expect-error hide `this`
    (0, ref.current)(...args)
  )).current;
}
var useEventCallback_default = useEventCallback;

// node_modules/@mui/material/utils/useEventCallback.mjs
var useEventCallback_default2 = useEventCallback_default;

// node_modules/@mui/utils/useForkRef/useForkRef.mjs
var React6 = __toESM(require_react(), 1);
function useForkRef(...refs) {
  const cleanupRef = React6.useRef(void 0);
  const refEffect = React6.useCallback((instance) => {
    const cleanups = refs.map((ref) => {
      if (ref == null) {
        return null;
      }
      if (typeof ref === "function") {
        const refCallback = ref;
        const refCleanup = refCallback(instance);
        return typeof refCleanup === "function" ? refCleanup : () => {
          refCallback(null);
        };
      }
      ref.current = instance;
      return () => {
        ref.current = null;
      };
    });
    return () => {
      cleanups.forEach((refCleanup) => refCleanup == null ? void 0 : refCleanup());
    };
  }, refs);
  return React6.useMemo(() => {
    if (refs.every((ref) => ref == null)) {
      return null;
    }
    return (value) => {
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = void 0;
      }
      if (value != null) {
        cleanupRef.current = refEffect(value);
      }
    };
  }, refs);
}

// node_modules/@mui/material/utils/useForkRef.mjs
var useForkRef_default = useForkRef;

// node_modules/@mui/material/ButtonBase/ButtonBase.mjs
var React16 = __toESM(require_react(), 1);
var import_prop_types7 = __toESM(require_prop_types(), 1);

// node_modules/@mui/utils/refType/refType.mjs
var import_prop_types3 = __toESM(require_prop_types(), 1);
var refType = import_prop_types3.default.oneOfType([import_prop_types3.default.func, import_prop_types3.default.object]);
var refType_default = refType;

// node_modules/@mui/utils/elementTypeAcceptingRef/elementTypeAcceptingRef.mjs
var import_prop_types4 = __toESM(require_prop_types(), 1);
var React7 = __toESM(require_react(), 1);

// node_modules/@mui/utils/chainPropTypes/chainPropTypes.mjs
function chainPropTypes(propType1, propType2) {
  if (false) {
    return () => null;
  }
  return function validate(...args) {
    return propType1(...args) || propType2(...args);
  };
}

// node_modules/@mui/utils/elementTypeAcceptingRef/elementTypeAcceptingRef.mjs
function isClassComponent(elementType) {
  const {
    prototype = {}
  } = elementType;
  return Boolean(prototype.isReactComponent);
}
function elementTypeAcceptingRef(props, propName, componentName, location, propFullName) {
  const propValue = props[propName];
  const safePropName = propFullName || propName;
  if (propValue == null || // When server-side rendering React doesn't warn either.
  // This is not an accurate check for SSR.
  // This is only in place for emotion compat.
  // TODO: Revisit once https://github.com/react/react/issues/20047 is resolved.
  typeof window === "undefined") {
    return null;
  }
  let warningHint;
  if (typeof propValue === "function" && !isClassComponent(propValue)) {
    warningHint = "Did you accidentally provide a plain function component instead?";
  }
  if (propValue === React7.Fragment) {
    warningHint = "Did you accidentally provide a React.Fragment instead?";
  }
  if (warningHint !== void 0) {
    return new Error(`Invalid ${location} \`${safePropName}\` supplied to \`${componentName}\`. Expected an element type that can hold a ref. ${warningHint} For more information see https://mui.com/r/caveat-with-refs-guide`);
  }
  return null;
}
var elementTypeAcceptingRef_default = chainPropTypes(import_prop_types4.default.elementType, elementTypeAcceptingRef);

// node_modules/@mui/utils/isFocusVisible/isFocusVisible.mjs
function isFocusVisible(element) {
  try {
    return element.matches(":focus-visible");
  } catch (error) {
    if (!window.navigator.userAgent.includes("jsdom")) {
      console.warn(["MUI: The `:focus-visible` pseudo class is not supported in this browser.", "Some components rely on this feature to work properly."].join("\n"));
    }
  }
  return false;
}

// node_modules/@mui/material/ButtonBase/useButtonBase.mjs
var React9 = __toESM(require_react(), 1);

// node_modules/@mui/material/utils/useFocusableWhenDisabled.mjs
var React8 = __toESM(require_react(), 1);
function useFocusableWhenDisabled(parameters) {
  const {
    focusableWhenDisabled,
    disabled,
    composite = false,
    tabIndex: tabIndexProp = 0,
    isNativeButton
  } = parameters;
  const isFocusableComposite = composite && focusableWhenDisabled !== false;
  const isNonFocusableComposite = composite && focusableWhenDisabled === false;
  const props = React8.useMemo(() => {
    const additionalProps = {
      // allow Tabbing away from focusableWhenDisabled elements
      onKeyDown(event) {
        if (disabled && focusableWhenDisabled && event.key !== "Tab") {
          event.preventDefault();
        }
      }
    };
    if (!composite) {
      additionalProps.tabIndex = tabIndexProp;
      if (!isNativeButton && disabled) {
        additionalProps.tabIndex = focusableWhenDisabled ? tabIndexProp : -1;
      }
    }
    if (isNativeButton && (focusableWhenDisabled || isFocusableComposite) || !isNativeButton && disabled) {
      additionalProps["aria-disabled"] = disabled;
    }
    if (isNativeButton && (!focusableWhenDisabled || isNonFocusableComposite)) {
      additionalProps.disabled = disabled;
    }
    return additionalProps;
  }, [composite, disabled, focusableWhenDisabled, isFocusableComposite, isNonFocusableComposite, isNativeButton, tabIndexProp]);
  return props;
}

// node_modules/@mui/material/ButtonBase/useButtonBase.mjs
var EMPTY = {};
function useButtonBase(parameters) {
  const {
    nativeButton,
    nativeButtonProp,
    internalNativeButton = nativeButton,
    allowInferredHostMismatch = false,
    disabled,
    type,
    hasFormAction = false,
    tabIndex = 0,
    focusableWhenDisabled: focusableWhenDisabledParam,
    stopEventPropagation = false,
    onBeforeKeyDown,
    onBeforeKeyUp
  } = parameters;
  const rootRef = React9.useRef(null);
  const focusableWhenDisabled = focusableWhenDisabledParam === true;
  const focusableWhenDisabledProps = useFocusableWhenDisabled({
    focusableWhenDisabled,
    disabled,
    isNativeButton: nativeButton,
    tabIndex
  });
  if (true) {
    React9.useEffect(() => {
      const root = rootRef.current;
      if (root == null) {
        return;
      }
      const isButtonTag = root.tagName === "BUTTON";
      if (nativeButtonProp !== void 0) {
        if (nativeButtonProp && !isButtonTag) {
          const message = "MUI: A component that acts as a button expected a native <button> because the `nativeButton` prop is true. Rendering a non-<button> removes native button semantics, which can impact forms and accessibility. Render a real <button> or set `nativeButton` to `false`.";
          console.error(message);
        }
        if (!nativeButtonProp && isButtonTag) {
          const message = "MUI: A component that acts as a button expected a non-<button> because the `nativeButton` prop is false. Rendering a <button> keeps native behavior while additionally applies non-native attributes and handlers, which can add unintended extra attributes (such as `role` or `aria-disabled`). Render a non-<button> such as <div>, or set `nativeButton` to `true`.";
          console.error(message);
        }
        return;
      }
      if (allowInferredHostMismatch) {
        return;
      }
      if (internalNativeButton && !isButtonTag) {
        const message = "MUI: A component rendering a native <button> resolved to a non-<button> element, but `nativeButton={false}` was not specified and the resolved root is a non-<button>. When rendering a custom component, set `nativeButton={false}` explicitly or render a <button> element.";
        console.error(message);
      }
      if (!internalNativeButton && isButtonTag) {
        const message = "MUI: A component that acts as a non-native button resolved to a native <button> element, but `nativeButton={true}` was not specified. When rendering a custom component, set `nativeButton={true}` explicitly or render a non-<button> element.";
        console.error(message);
      }
    }, [allowInferredHostMismatch, internalNativeButton, nativeButtonProp]);
  }
  const hasNativeKeyboardActivation = React9.useCallback(() => {
    const root = rootRef.current;
    if (root == null) {
      return nativeButton;
    }
    if (root.tagName === "BUTTON") {
      return true;
    }
    return Boolean(root.tagName === "A" && root.href);
  }, [nativeButton]);
  const buttonProps = React9.useMemo(() => {
    const resolvedButtonProps = focusableWhenDisabled ? {} : {
      tabIndex: disabled ? -1 : tabIndex
    };
    if (nativeButton) {
      resolvedButtonProps.type = type === void 0 && !hasFormAction ? "button" : type;
      if (!focusableWhenDisabled) {
        resolvedButtonProps.disabled = disabled;
      }
    } else {
      resolvedButtonProps.role = "button";
      if (!focusableWhenDisabled && disabled) {
        resolvedButtonProps["aria-disabled"] = disabled;
      }
    }
    if (focusableWhenDisabled) {
      return {
        ...resolvedButtonProps,
        ...focusableWhenDisabledProps
      };
    }
    return resolvedButtonProps;
  }, [disabled, focusableWhenDisabled, focusableWhenDisabledProps, hasFormAction, nativeButton, tabIndex, type]);
  const getButtonProps = React9.useCallback((externalProps = EMPTY) => {
    const {
      onClick: externalOnClick,
      onKeyDown: externalOnKeyDown,
      onKeyUp: externalOnKeyUp,
      ...otherExternalProps
    } = externalProps;
    const handleClick = (event) => {
      if (stopEventPropagation) {
        event.stopPropagation();
      }
      if (disabled) {
        event.preventDefault();
        return;
      }
      externalOnClick == null ? void 0 : externalOnClick(event);
    };
    const handleKeyDown = (event) => {
      if (focusableWhenDisabled) {
        focusableWhenDisabledProps.onKeyDown(event);
      }
      if (disabled) {
        return;
      }
      onBeforeKeyDown == null ? void 0 : onBeforeKeyDown(event);
      externalOnKeyDown == null ? void 0 : externalOnKeyDown(event);
      if (event.target !== event.currentTarget || hasNativeKeyboardActivation()) {
        return;
      }
      if (event.key === " ") {
        event.preventDefault();
        return;
      }
      if (event.key === "Enter") {
        event.preventDefault();
        event.currentTarget.click();
      }
    };
    const handleKeyUp = (event) => {
      if (disabled) {
        return;
      }
      onBeforeKeyUp == null ? void 0 : onBeforeKeyUp(event);
      externalOnKeyUp == null ? void 0 : externalOnKeyUp(event);
      if (event.target === event.currentTarget && !hasNativeKeyboardActivation() && event.key === " " && !event.defaultPrevented) {
        event.currentTarget.click();
      }
    };
    return {
      ...buttonProps,
      ...otherExternalProps,
      onClick: handleClick,
      onKeyDown: handleKeyDown,
      onKeyUp: handleKeyUp
    };
  }, [buttonProps, disabled, focusableWhenDisabled, focusableWhenDisabledProps, hasNativeKeyboardActivation, onBeforeKeyDown, onBeforeKeyUp, stopEventPropagation]);
  return {
    getButtonProps,
    rootRef
  };
}

// node_modules/@mui/material/useLazyRipple/useLazyRipple.mjs
var React11 = __toESM(require_react(), 1);

// node_modules/@mui/utils/useLazyRef/useLazyRef.mjs
var React10 = __toESM(require_react(), 1);
var UNINITIALIZED = {};
function useLazyRef(init, initArg) {
  const ref = React10.useRef(UNINITIALIZED);
  if (ref.current === UNINITIALIZED) {
    ref.current = init(initArg);
  }
  return ref;
}

// node_modules/@mui/material/useLazyRipple/useLazyRipple.mjs
var LazyRipple = class _LazyRipple {
  constructor() {
    __publicField(this, "mountEffect", () => {
      if (this.shouldMount && !this.didMount) {
        if (this.ref.current !== null) {
          this.didMount = true;
          this.mounted.resolve();
        }
      }
    });
    this.ref = {
      current: null
    };
    this.mounted = null;
    this.didMount = false;
    this.shouldMount = false;
    this.setShouldMount = null;
  }
  /** React ref to the ripple instance */
  /** If the ripple component should be mounted */
  /** Promise that resolves when the ripple component is mounted */
  /** If the ripple component has been mounted */
  /** React state hook setter */
  static create() {
    return new _LazyRipple();
  }
  static use() {
    const ripple = useLazyRef(_LazyRipple.create).current;
    const [shouldMount, setShouldMount] = React11.useState(false);
    ripple.shouldMount = shouldMount;
    ripple.setShouldMount = setShouldMount;
    React11.useEffect(ripple.mountEffect, [shouldMount]);
    return ripple;
  }
  mount() {
    if (!this.mounted) {
      this.mounted = createControlledPromise();
      this.shouldMount = true;
      this.setShouldMount(this.shouldMount);
    }
    return this.mounted;
  }
  /* Ripple API */
  start(...args) {
    this.mount().then(() => {
      var _a;
      return (_a = this.ref.current) == null ? void 0 : _a.start(...args);
    });
  }
  stop(...args) {
    this.mount().then(() => {
      var _a;
      return (_a = this.ref.current) == null ? void 0 : _a.stop(...args);
    });
  }
  pulsate(...args) {
    this.mount().then(() => {
      var _a;
      return (_a = this.ref.current) == null ? void 0 : _a.pulsate(...args);
    });
  }
};
function useLazyRipple() {
  return LazyRipple.use();
}
function createControlledPromise() {
  let resolve;
  let reject;
  const p = new Promise((resolveFn, rejectFn) => {
    resolve = resolveFn;
    reject = rejectFn;
  });
  p.resolve = resolve;
  p.reject = reject;
  return p;
}

// node_modules/@mui/material/ButtonBase/TouchRipple.mjs
var React15 = __toESM(require_react(), 1);
var import_prop_types6 = __toESM(require_prop_types(), 1);

// node_modules/@mui/utils/useOnMount/useOnMount.mjs
var React12 = __toESM(require_react(), 1);
var EMPTY2 = [];
function useOnMount(fn) {
  React12.useEffect(fn, EMPTY2);
}

// node_modules/@mui/utils/useTimeout/useTimeout.mjs
var Timeout = class _Timeout {
  constructor() {
    __publicField(this, "currentId", null);
    __publicField(this, "clear", () => {
      if (this.currentId !== null) {
        clearTimeout(this.currentId);
        this.currentId = null;
      }
    });
    __publicField(this, "disposeEffect", () => {
      return this.clear;
    });
  }
  static create() {
    return new _Timeout();
  }
  /**
   * Executes `fn` after `delay`, clearing any previously scheduled call.
   */
  start(delay, fn) {
    this.clear();
    this.currentId = setTimeout(() => {
      this.currentId = null;
      fn();
    }, delay);
  }
};
function useTimeout() {
  const timeout = useLazyRef(Timeout.create).current;
  useOnMount(timeout.disposeEffect);
  return timeout;
}

// node_modules/@mui/material/ButtonBase/Ripple.mjs
var React13 = __toESM(require_react(), 1);
var import_prop_types5 = __toESM(require_prop_types(), 1);
var import_jsx_runtime5 = __toESM(require_jsx_runtime(), 1);
function Ripple(props) {
  const {
    className,
    classes,
    pulsate = false,
    rippleX,
    rippleY,
    rippleSize,
    in: inProp,
    onExited,
    timeout
  } = props;
  const [leaving, setLeaving] = React13.useState(false);
  const exitTimer = useTimeout();
  const exitTimerStartedRef = React13.useRef(false);
  const onExitedRef = React13.useRef(onExited);
  onExitedRef.current = onExited;
  const hasExitedCallback = onExited != null;
  const rippleClassName = clsx_default(className, classes.ripple, classes.rippleVisible, pulsate && classes.ripplePulsate);
  const rippleStyles = {
    width: rippleSize,
    height: rippleSize,
    top: -(rippleSize / 2) + rippleY,
    left: -(rippleSize / 2) + rippleX
  };
  const childClassName = clsx_default(classes.child, leaving && classes.childLeaving, pulsate && classes.childPulsate);
  if (!inProp && !leaving) {
    setLeaving(true);
  }
  React13.useEffect(() => {
    if (!inProp && hasExitedCallback) {
      if (!exitTimerStartedRef.current) {
        exitTimerStartedRef.current = true;
        exitTimer.start(timeout, () => {
          var _a;
          exitTimerStartedRef.current = false;
          (_a = onExitedRef.current) == null ? void 0 : _a.call(onExitedRef);
        });
      }
    } else {
      exitTimerStartedRef.current = false;
      exitTimer.clear();
    }
  }, [exitTimer, hasExitedCallback, inProp, timeout]);
  return (0, import_jsx_runtime5.jsx)("span", {
    className: rippleClassName,
    style: rippleStyles,
    children: (0, import_jsx_runtime5.jsx)("span", {
      className: childClassName
    })
  });
}
true ? Ripple.propTypes = {
  /**
   * Override or extend the styles applied to the component.
   */
  classes: import_prop_types5.default.object.isRequired,
  className: import_prop_types5.default.string,
  /**
   * @ignore - controlled by TouchRipple
   */
  in: import_prop_types5.default.bool,
  /**
   * @ignore - controlled by TouchRipple
   */
  onExited: import_prop_types5.default.func,
  /**
   * If `true`, the ripple pulsates, typically indicating the keyboard focus state of an element.
   */
  pulsate: import_prop_types5.default.bool,
  /**
   * Diameter of the ripple.
   */
  rippleSize: import_prop_types5.default.number,
  /**
   * Horizontal position of the ripple center.
   */
  rippleX: import_prop_types5.default.number,
  /**
   * Vertical position of the ripple center.
   */
  rippleY: import_prop_types5.default.number,
  /**
   * Exit delay.
   */
  timeout: import_prop_types5.default.number.isRequired
} : void 0;
var Ripple_default = Ripple;

// node_modules/@mui/material/ButtonBase/touchRippleClasses.mjs
var touchRippleClasses = generateUtilityClasses("MuiTouchRipple", ["root", "ripple", "rippleVisible", "ripplePulsate", "child", "childLeaving", "childPulsate"]);
var touchRippleClasses_default = touchRippleClasses;

// node_modules/@mui/material/transitions/useReducedMotion.mjs
var React14 = __toESM(require_react(), 1);
var MEDIA_QUERY = "(prefers-reduced-motion: reduce)";
var REDUCED_MOTION_DURATION = 0;
var REDUCED_MOTION_DELAY = "0ms";
var NOOP = () => {
};
var getDefaultSnapshot = () => false;
var getReducedMotionSnapshot = () => true;
var subscribeNoop = () => NOOP;
function useReducedMotionMediaQueryOld(enabled) {
  const [queryState, setQueryState] = React14.useState(() => ({
    enabled,
    matches: enabled ? null : false
  }));
  let matches = queryState.matches;
  if (queryState.enabled !== enabled) {
    matches = null;
    if (!enabled) {
      matches = false;
    }
  }
  useEnhancedEffect_default(() => {
    const setResolvedMatches = (nextMatches) => {
      setQueryState((previousState) => {
        if (previousState.enabled === enabled && previousState.matches === nextMatches) {
          return previousState;
        }
        return {
          enabled,
          matches: nextMatches
        };
      });
    };
    if (!enabled) {
      if (queryState.enabled) {
        setResolvedMatches(false);
      }
      return void 0;
    }
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      setResolvedMatches(false);
      return void 0;
    }
    const mediaQueryList = window.matchMedia(MEDIA_QUERY);
    const update = () => {
      setResolvedMatches(mediaQueryList.matches);
    };
    update();
    mediaQueryList.addEventListener("change", update);
    return () => {
      mediaQueryList.removeEventListener("change", update);
    };
  }, [enabled, queryState.enabled]);
  return matches;
}
var safeReact = {
  ...React14
};
var maybeReactUseSyncExternalStore = safeReact.useSyncExternalStore;
function useReducedMotionMediaQueryNew(enabled) {
  const getServerSnapshot = enabled ? getReducedMotionSnapshot : getDefaultSnapshot;
  const [getSnapshot, subscribe] = React14.useMemo(() => {
    if (!enabled || typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return [getDefaultSnapshot, subscribeNoop];
    }
    const mediaQueryList = window.matchMedia(MEDIA_QUERY);
    return [() => mediaQueryList.matches, (notify) => {
      mediaQueryList.addEventListener("change", notify);
      return () => {
        mediaQueryList.removeEventListener("change", notify);
      };
    }];
  }, [enabled]);
  return maybeReactUseSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
var useReducedMotionMediaQuery = maybeReactUseSyncExternalStore !== void 0 ? useReducedMotionMediaQueryNew : useReducedMotionMediaQueryOld;
function useReducedMotion(mode, disablePrefersReducedMotion) {
  const prefersReducedMotion = useReducedMotionMediaQuery(!disablePrefersReducedMotion && mode === "system");
  const shouldReduceMotion = !disablePrefersReducedMotion && (mode === "always" || mode === "system" && prefersReducedMotion !== false);
  return React14.useMemo(() => ({
    shouldReduceMotion,
    getTransitionTiming(timing) {
      if (!shouldReduceMotion) {
        return timing;
      }
      return {
        duration: REDUCED_MOTION_DURATION,
        delay: REDUCED_MOTION_DELAY
      };
    }
  }), [shouldReduceMotion]);
}

// node_modules/@mui/material/ButtonBase/TouchRipple.mjs
var import_jsx_runtime6 = __toESM(require_jsx_runtime(), 1);
var DURATION = 550;
var DELAY_RIPPLE = 80;
var EMPTY_OBJ = {};
var EMPTY_ARRAY = [];
var NOOP2 = () => {
};
function mergeRippleOrder(prevOrder, nextActiveKeys) {
  const nextKeySet = new Set(nextActiveKeys);
  const nextKeysPending = /* @__PURE__ */ new Map();
  let pendingKeys = [];
  for (const prevKey of prevOrder) {
    if (nextKeySet.has(prevKey)) {
      if (pendingKeys.length > 0) {
        nextKeysPending.set(prevKey, pendingKeys);
        pendingKeys = [];
      }
    } else {
      pendingKeys.push(prevKey);
    }
  }
  const nextOrder = [];
  for (const nextKey of nextActiveKeys) {
    const pendingBefore = nextKeysPending.get(nextKey);
    if (pendingBefore) {
      nextOrder.push(...pendingBefore);
    }
    nextOrder.push(nextKey);
  }
  nextOrder.push(...pendingKeys);
  return nextOrder;
}
function computeRippleState({
  event,
  element,
  center
}) {
  const rect = element ? element.getBoundingClientRect() : {
    width: 0,
    height: 0,
    left: 0,
    top: 0
  };
  let rippleX;
  let rippleY;
  if (center || event === void 0 || event.clientX === 0 && event.clientY === 0 || !event.clientX && !event.touches) {
    rippleX = Math.round(rect.width / 2);
    rippleY = Math.round(rect.height / 2);
  } else {
    const {
      clientX,
      clientY
    } = event.touches && event.touches.length > 0 ? event.touches[0] : event;
    rippleX = Math.round(clientX - rect.left);
    rippleY = Math.round(clientY - rect.top);
  }
  let rippleSize;
  if (center) {
    rippleSize = Math.sqrt((2 * rect.width ** 2 + rect.height ** 2) / 3);
    if (rippleSize % 2 === 0) {
      rippleSize += 1;
    }
  } else {
    const sizeX = Math.max(Math.abs((element ? element.clientWidth : 0) - rippleX), rippleX) * 2 + 2;
    const sizeY = Math.max(Math.abs((element ? element.clientHeight : 0) - rippleY), rippleY) * 2 + 2;
    rippleSize = Math.sqrt(sizeX ** 2 + sizeY ** 2);
  }
  return {
    rippleX,
    rippleY,
    rippleSize
  };
}
var enterKeyframe = keyframes`
  0% {
    transform: scale(0);
    opacity: 0.1;
  }

  100% {
    transform: scale(1);
    opacity: 0.3;
  }
`;
var exitKeyframe = keyframes`
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
`;
var pulsateKeyframe = keyframes`
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(0.92);
  }

  100% {
    transform: scale(1);
  }
`;
function getAnimationStyles(theme) {
  if (theme.motion.reducedMotion === "always") {
    return null;
  }
  const styles = css`
    &.${touchRippleClasses_default.rippleVisible} {
      animation-name: ${enterKeyframe};
      animation-duration: ${DURATION}ms;
      animation-timing-function: ${theme.transitions.easing.easeInOut};
    }

    &.${touchRippleClasses_default.ripplePulsate} {
      animation-duration: ${theme.transitions.duration.shorter}ms;
    }

    & .${touchRippleClasses_default.childLeaving} {
      animation-name: ${exitKeyframe};
      animation-duration: ${DURATION}ms;
      animation-timing-function: ${theme.transitions.easing.easeInOut};
    }

    & .${touchRippleClasses_default.childPulsate} {
      animation-name: ${pulsateKeyframe};
      animation-duration: 2500ms;
      animation-timing-function: ${theme.transitions.easing.easeInOut};
      animation-iteration-count: infinite;
      animation-delay: 200ms;
    }
  `;
  if (theme.motion.reducedMotion === "system") {
    return css`
      @media (prefers-reduced-motion: no-preference) {
        ${styles}
      }
    `;
  }
  return styles;
}
var TouchRippleRoot = styled_default("span", {
  name: "MuiTouchRipple",
  slot: "Root"
})({
  overflow: "hidden",
  pointerEvents: "none",
  position: "absolute",
  zIndex: 0,
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  borderRadius: "inherit"
});
var TouchRippleRipple = styled_default(Ripple_default, {
  name: "MuiTouchRipple",
  slot: "Ripple"
})`
  opacity: 0;
  position: absolute;

  &.${touchRippleClasses_default.rippleVisible} {
    opacity: 0.3;
    transform: scale(1);
  }

  /*
   * Order matters: 'child', 'childLeaving' and 'childPulsate' apply to the same
   * element with equal specificity, so the later rule wins. 'child' must come
   * before 'childLeaving' so the leaving 'opacity: 0' takes precedence. A focus
   * (pulsate) ripple keeps 'pulsateKeyframe' (no opacity animation) on exit, so
   * it relies on this static 'opacity: 0' to disappear on blur instead of
   * lingering until removal.
   */
  & .${touchRippleClasses_default.child} {
    opacity: 1;
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: currentColor;
  }

  & .${touchRippleClasses_default.childLeaving} {
    opacity: 0;
  }

  & .${touchRippleClasses_default.childPulsate} {
    position: absolute;
    /* @noflip */
    left: 0px;
    top: 0;
  }

  ${({
  theme
}) => getAnimationStyles(theme)}
`;
var TouchRipple = React15.forwardRef(function TouchRipple2(inProps, ref) {
  const props = useDefaultProps({
    props: inProps,
    name: "MuiTouchRipple"
  });
  const theme = useTheme();
  const reducedMotion = useReducedMotion(theme.motion.reducedMotion, false);
  const {
    center: centerProp = false,
    classes = EMPTY_OBJ,
    className,
    ...other
  } = props;
  const [rippleState, setRippleState] = React15.useState({
    items: EMPTY_ARRAY,
    order: EMPTY_ARRAY
  });
  const ripples = rippleState.items;
  const nextKey = React15.useRef(0);
  const rippleCallback = React15.useRef(null);
  const mountedRef = React15.useRef(false);
  useOnMount(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  });
  React15.useEffect(() => {
    if (rippleCallback.current) {
      rippleCallback.current();
      rippleCallback.current = null;
    }
  }, [ripples]);
  const ignoringMouseDown = React15.useRef(false);
  const startTimer = useTimeout();
  const startTimerCommit = React15.useRef(null);
  const container = React15.useRef(null);
  const handleExited = useEventCallback_default2((key) => {
    if (!mountedRef.current) {
      return;
    }
    setRippleState((prevState) => {
      const nextItems = prevState.items.filter((ripple) => ripple.key !== key);
      const nextOrder = mergeRippleOrder(prevState.order.filter((rippleKey) => rippleKey !== key), nextItems.filter((ripple) => !ripple.exiting).map((ripple) => ripple.key));
      return {
        items: nextItems,
        order: nextOrder
      };
    });
  });
  const startCommit = useEventCallback_default2((params) => {
    const {
      pulsate: pulsate2,
      rippleX,
      rippleY,
      rippleSize,
      cb
    } = params;
    const key = nextKey.current;
    nextKey.current += 1;
    setRippleState((prevState) => {
      const nextItems = [...prevState.items, {
        key,
        pulsate: pulsate2,
        rippleX,
        rippleY,
        rippleSize,
        exiting: false
      }];
      return {
        items: nextItems,
        order: mergeRippleOrder(prevState.order, nextItems.filter((ripple) => !ripple.exiting).map((ripple) => ripple.key))
      };
    });
    rippleCallback.current = cb;
  });
  const start = useEventCallback_default2((event = EMPTY_OBJ, options = EMPTY_OBJ, cb = NOOP2) => {
    const {
      pulsate: pulsate2 = false,
      center = centerProp || options.pulsate,
      fakeElement = false
      // Used only by tests.
    } = options;
    if ((event == null ? void 0 : event.type) === "mousedown" && ignoringMouseDown.current) {
      ignoringMouseDown.current = false;
      return;
    }
    if ((event == null ? void 0 : event.type) === "touchstart") {
      ignoringMouseDown.current = true;
    }
    const element = fakeElement ? null : container.current;
    const {
      rippleX,
      rippleY,
      rippleSize
    } = computeRippleState({
      event,
      element,
      center
    });
    if (event == null ? void 0 : event.touches) {
      if (startTimerCommit.current === null) {
        startTimerCommit.current = () => {
          startCommit({
            pulsate: pulsate2,
            rippleX,
            rippleY,
            rippleSize,
            cb
          });
        };
        startTimer.start(DELAY_RIPPLE, () => {
          if (startTimerCommit.current) {
            startTimerCommit.current();
            startTimerCommit.current = null;
          }
        });
      }
    } else {
      startCommit({
        pulsate: pulsate2,
        rippleX,
        rippleY,
        rippleSize,
        cb
      });
    }
  });
  const pulsate = useEventCallback_default2(() => {
    start(EMPTY_OBJ, {
      pulsate: true
    });
  });
  const stop = useEventCallback_default2((event, cb) => {
    startTimer.clear();
    if ((event == null ? void 0 : event.type) === "touchend" && startTimerCommit.current) {
      startTimerCommit.current();
      startTimerCommit.current = null;
      startTimer.start(0, () => {
        stop(event, cb);
      });
      return;
    }
    startTimerCommit.current = null;
    setRippleState((prevState) => {
      const firstActiveIndex = prevState.items.findIndex((ripple) => !ripple.exiting);
      if (firstActiveIndex === -1) {
        return prevState;
      }
      const nextItems = prevState.items.slice();
      nextItems[firstActiveIndex] = {
        ...nextItems[firstActiveIndex],
        exiting: true
      };
      return {
        items: nextItems,
        order: mergeRippleOrder(prevState.order, nextItems.filter((ripple) => !ripple.exiting).map((ripple) => ripple.key))
      };
    });
    rippleCallback.current = cb;
  });
  React15.useImperativeHandle(ref, () => ({
    pulsate,
    start,
    stop
  }), [pulsate, start, stop]);
  const rippleByKey = new Map(ripples.map((ripple) => [ripple.key, ripple]));
  const orderedRipples = rippleState.order.map((rippleKey) => rippleByKey.get(rippleKey)).filter(Boolean);
  return (0, import_jsx_runtime6.jsx)(TouchRippleRoot, {
    className: clsx_default(touchRippleClasses_default.root, classes.root, className),
    ref: container,
    ...other,
    children: orderedRipples.map((ripple) => (0, import_jsx_runtime6.jsx)(TouchRippleRipple, {
      classes: {
        ripple: clsx_default(classes.ripple, touchRippleClasses_default.ripple),
        rippleVisible: clsx_default(classes.rippleVisible, touchRippleClasses_default.rippleVisible),
        ripplePulsate: clsx_default(classes.ripplePulsate, touchRippleClasses_default.ripplePulsate),
        child: clsx_default(classes.child, touchRippleClasses_default.child),
        childLeaving: clsx_default(classes.childLeaving, touchRippleClasses_default.childLeaving),
        childPulsate: clsx_default(classes.childPulsate, touchRippleClasses_default.childPulsate)
      },
      timeout: reducedMotion.shouldReduceMotion ? 0 : DURATION,
      pulsate: ripple.pulsate,
      rippleX: ripple.rippleX,
      rippleY: ripple.rippleY,
      rippleSize: ripple.rippleSize,
      in: !ripple.exiting,
      onExited: () => handleExited(ripple.key)
    }, ripple.key))
  });
});
true ? TouchRipple.propTypes = {
  /**
   * If `true`, the ripple starts at the center of the component
   * rather than at the point of interaction.
   */
  center: import_prop_types6.default.bool,
  /**
   * Override or extend the styles applied to the component.
   */
  classes: import_prop_types6.default.object,
  /**
   * @ignore
   */
  className: import_prop_types6.default.string
} : void 0;
var TouchRipple_default = TouchRipple;

// node_modules/@mui/material/ButtonBase/buttonBaseClasses.mjs
function getButtonBaseUtilityClass(slot) {
  return generateUtilityClass("MuiButtonBase", slot);
}
var buttonBaseClasses = generateUtilityClasses("MuiButtonBase", ["root", "disabled", "focusVisible"]);
var buttonBaseClasses_default = buttonBaseClasses;

// node_modules/@mui/material/ButtonBase/ButtonBase.mjs
var import_jsx_runtime7 = __toESM(require_jsx_runtime(), 1);
var useUtilityClasses2 = (ownerState) => {
  const {
    disabled,
    focusVisible,
    focusVisibleClassName,
    suppressFocusVisible,
    classes
  } = ownerState;
  const slots = {
    root: ["root", disabled && "disabled", focusVisible && !suppressFocusVisible && "focusVisible"]
  };
  const composedClasses = composeClasses(slots, getButtonBaseUtilityClass, classes);
  if (focusVisible && !suppressFocusVisible && focusVisibleClassName) {
    composedClasses.root += ` ${focusVisibleClassName}`;
  }
  return composedClasses;
};
var ButtonBaseRoot = styled_default("button", {
  name: "MuiButtonBase",
  slot: "Root"
})(memoTheme_default(({
  theme
}) => ({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
  boxSizing: "border-box",
  WebkitTapHighlightColor: "transparent",
  backgroundColor: "transparent",
  // Reset default value
  // We disable the focus ring for mouse, touch and keyboard users.
  outline: 0,
  border: 0,
  margin: 0,
  // Remove the margin in Safari
  borderRadius: 0,
  padding: 0,
  // Remove the padding in Firefox
  cursor: "pointer",
  userSelect: "none",
  verticalAlign: "middle",
  MozAppearance: "none",
  // Reset
  WebkitAppearance: "none",
  // Reset
  textDecoration: "none",
  // So we take precedent over the style of a native <a /> element.
  color: "inherit",
  "&::-moz-focus-inner": {
    borderStyle: "none"
    // Remove Firefox dotted outline.
  },
  [`&.${buttonBaseClasses_default.disabled}`]: {
    pointerEvents: "none",
    // Disable link interactions
    cursor: "default"
  },
  "@media print": {
    colorAdjust: "exact"
  },
  variants: [{
    props: {
      internalDisabledThemeFocusVisible: false
    },
    style: theme.focusVisible && {
      ...outsetFocusRing,
      [`&.${buttonBaseClasses_default.focusVisible}`]: theme.focusVisible
    }
  }]
})));
var ButtonBase = React16.forwardRef(function ButtonBase2(inProps, ref) {
  const props = useDefaultProps({
    props: inProps,
    name: "MuiButtonBase"
  });
  const {
    action,
    centerRipple = false,
    children,
    className,
    component = "button",
    disabled = false,
    disableRipple = false,
    disableTouchRipple = false,
    focusRipple = false,
    focusVisibleClassName,
    /* eslint-disable react/prop-types */
    // replaces internal handling in Chip, other components can opt-in individually to use this in the future
    focusableWhenDisabled,
    // escape hatch to suppress the focusVisible state and callback
    // used by anchored <Menu>s to to suppress focus visible styling when opened with a pointer
    suppressFocusVisible = false,
    // private prop to allow native vs non-native button props to be resolved before mount
    internalNativeButton: internalNativeButtonProp,
    // private prop to let a parent (like SwitchBase) control its own focus visible style
    internalDisabledThemeFocusVisible = false,
    /* eslint-enable react/prop-types */
    LinkComponent = "a",
    nativeButton: nativeButtonProp,
    onBlur,
    onClick: onClickProp,
    onContextMenu,
    onDragLeave,
    onFocus,
    onFocusVisible,
    onKeyDown: onKeyDownProp,
    onKeyUp: onKeyUpProp,
    onMouseDown,
    onMouseLeave,
    onMouseUp,
    onTouchEnd,
    onTouchMove,
    onTouchStart,
    tabIndex = 0,
    TouchRippleProps,
    touchRippleRef,
    type,
    ...other
  } = props;
  const isLink = Boolean(other.href || other.to);
  const hasFormAction = Boolean(other.formAction);
  let ComponentProp = component;
  if (ComponentProp === "button" && isLink) {
    ComponentProp = LinkComponent;
  }
  const internalNativeButton = typeof ComponentProp === "string" ? ComponentProp === "button" : internalNativeButtonProp ?? false;
  const nativeButton = nativeButtonProp ?? internalNativeButton;
  const ripple = useLazyRipple();
  const handleRippleRef = useForkRef_default(ripple.ref, touchRippleRef);
  const [focusVisible, setFocusVisible] = React16.useState(false);
  if ((disabled || suppressFocusVisible) && focusVisible) {
    setFocusVisible(false);
  }
  const handleBeforeKeyDown = useEventCallback_default2((event) => {
    if (focusRipple && !event.repeat && focusVisible && event.key === " ") {
      ripple.stop(event, () => {
        ripple.start(event);
      });
    }
  });
  const handleBeforeKeyUp = useEventCallback_default2((event) => {
    if (focusRipple && event.key === " " && focusVisible && !event.defaultPrevented) {
      ripple.stop(event, () => {
        ripple.pulsate(event);
      });
    }
  });
  const {
    getButtonProps,
    rootRef: buttonRef
  } = useButtonBase({
    nativeButton,
    nativeButtonProp,
    internalNativeButton,
    allowInferredHostMismatch: isLink || typeof ComponentProp === "string",
    disabled,
    type,
    hasFormAction,
    tabIndex,
    onBeforeKeyDown: handleBeforeKeyDown,
    onBeforeKeyUp: handleBeforeKeyUp
  });
  const {
    onClick,
    onKeyDown,
    onKeyUp,
    ...buttonProps
  } = getButtonProps({
    onClick: onClickProp,
    onKeyDown: onKeyDownProp,
    onKeyUp: onKeyUpProp
  });
  React16.useImperativeHandle(action, () => ({
    focusVisible: () => {
      setFocusVisible(true);
      buttonRef.current.focus();
    }
  }), [buttonRef]);
  const enableTouchRipple = ripple.shouldMount && !disableRipple && !disabled;
  React16.useEffect(() => {
    if (focusVisible && focusRipple && !disableRipple) {
      ripple.pulsate();
    }
  }, [disableRipple, focusRipple, focusVisible, ripple]);
  const handleMouseDown = useRippleHandler(ripple, "start", onMouseDown, disableTouchRipple);
  const handleContextMenu = useRippleHandler(ripple, "stop", onContextMenu, disableTouchRipple);
  const handleDragLeave = useRippleHandler(ripple, "stop", onDragLeave, disableTouchRipple);
  const handleMouseUp = useRippleHandler(ripple, "stop", onMouseUp, disableTouchRipple);
  const handleMouseLeave = useRippleHandler(ripple, "stop", (event) => {
    if (focusVisible) {
      event.preventDefault();
    }
    if (onMouseLeave) {
      onMouseLeave(event);
    }
  }, disableTouchRipple);
  const handleTouchStart = useRippleHandler(ripple, "start", onTouchStart, disableTouchRipple);
  const handleTouchEnd = useRippleHandler(ripple, "stop", onTouchEnd, disableTouchRipple);
  const handleTouchMove = useRippleHandler(ripple, "stop", onTouchMove, disableTouchRipple);
  const handleBlur = useRippleHandler(ripple, "stop", (event) => {
    if (!isFocusVisible(event.target)) {
      setFocusVisible(false);
    }
    if (onBlur) {
      onBlur(event);
    }
  }, false);
  const handleFocus = useEventCallback_default2((event) => {
    if (!buttonRef.current) {
      buttonRef.current = event.currentTarget;
    }
    if (!suppressFocusVisible && isFocusVisible(event.target)) {
      setFocusVisible(true);
      if (onFocusVisible) {
        onFocusVisible(event);
      }
    }
    if (onFocus) {
      onFocus(event);
    }
  });
  const linkProps = {};
  if (isLink) {
    linkProps.tabIndex = disabled ? -1 : tabIndex;
    if (disabled) {
      linkProps["aria-disabled"] = disabled;
    }
    linkProps.type = type;
  }
  const handleRef = useForkRef_default(ref, buttonRef);
  const ownerState = {
    ...props,
    centerRipple,
    component,
    disabled,
    disableRipple,
    disableTouchRipple,
    focusRipple,
    suppressFocusVisible,
    tabIndex,
    focusVisible,
    internalDisabledThemeFocusVisible
  };
  const classes = useUtilityClasses2(ownerState);
  return (0, import_jsx_runtime7.jsxs)(ButtonBaseRoot, {
    as: ComponentProp,
    className: clsx_default(classes.root, className),
    ownerState,
    onBlur: handleBlur,
    onClick,
    onContextMenu: handleContextMenu,
    onFocus: handleFocus,
    onKeyDown,
    onKeyUp,
    onMouseDown: handleMouseDown,
    onMouseLeave: handleMouseLeave,
    onMouseUp: handleMouseUp,
    onDragLeave: handleDragLeave,
    onTouchEnd: handleTouchEnd,
    onTouchMove: handleTouchMove,
    onTouchStart: handleTouchStart,
    ref: handleRef,
    ...isLink ? linkProps : buttonProps,
    ...other,
    children: [children, enableTouchRipple ? (0, import_jsx_runtime7.jsx)(TouchRipple_default, {
      ref: handleRippleRef,
      center: centerRipple,
      ...TouchRippleProps
    }) : null]
  });
});
function useRippleHandler(ripple, rippleAction, eventCallback, skipRippleAction = false) {
  return useEventCallback_default2((event) => {
    if (eventCallback) {
      eventCallback(event);
    }
    if (!skipRippleAction) {
      ripple[rippleAction](event);
    }
    return true;
  });
}
true ? ButtonBase.propTypes = {
  // ┌────────────────────────────── Warning ──────────────────────────────┐
  // │ These PropTypes are generated from the TypeScript type definitions. │
  // │    To update them, edit the d.ts file and run `pnpm proptypes`.     │
  // └─────────────────────────────────────────────────────────────────────┘
  /**
   * A ref for imperative actions.
   * It currently only supports `focusVisible()` action.
   */
  action: refType_default,
  /**
   * If `true`, the ripples are centered.
   * They won't start at the cursor interaction position.
   * @default false
   */
  centerRipple: import_prop_types7.default.bool,
  /**
   * The content of the component.
   */
  children: import_prop_types7.default.node,
  /**
   * Override or extend the styles applied to the component.
   */
  classes: import_prop_types7.default.object,
  /**
   * @ignore
   */
  className: import_prop_types7.default.string,
  /**
   * The component used for the root node.
   * Either a string to use a HTML element or a component.
   */
  component: elementTypeAcceptingRef_default,
  /**
   * If `true`, the component is disabled.
   * @default false
   */
  disabled: import_prop_types7.default.bool,
  /**
   * If `true`, the ripple effect is disabled.
   *
   * ⚠️ Without a ripple there is no styling for :focus-visible by default. Be sure
   * to highlight the element by applying separate styles with the `.Mui-focusVisible` class.
   * @default false
   */
  disableRipple: import_prop_types7.default.bool,
  /**
   * If `true`, the touch ripple effect is disabled.
   * @default false
   */
  disableTouchRipple: import_prop_types7.default.bool,
  /**
   * If `true`, the base button will have a keyboard focus ripple.
   * @default false
   */
  focusRipple: import_prop_types7.default.bool,
  /**
   * This prop can help identify which element has keyboard focus.
   * The class name will be applied when the element gains the focus through keyboard interaction.
   * It's a polyfill for the [CSS :focus-visible selector](https://drafts.csswg.org/selectors-4/#the-focus-visible-pseudo).
   * The rationale for using this feature [is explained here](https://github.com/WICG/focus-visible/blob/HEAD/explainer.md).
   * A [polyfill can be used](https://github.com/WICG/focus-visible) to apply a `focus-visible` class to other components
   * if needed.
   */
  focusVisibleClassName: import_prop_types7.default.string,
  /**
   * @ignore
   */
  formAction: import_prop_types7.default.oneOfType([import_prop_types7.default.func, import_prop_types7.default.string]),
  /**
   * @ignore
   */
  href: import_prop_types7.default.any,
  /**
   * The component used to render a link when the `href` prop is provided.
   * @default 'a'
   */
  LinkComponent: import_prop_types7.default.elementType,
  /**
   * Whether the custom component is expected to render a native `<button>` element
   * when passing a React component to the `component` or `slots` prop.
   */
  nativeButton: import_prop_types7.default.bool,
  /**
   * @ignore
   */
  onBlur: import_prop_types7.default.func,
  /**
   * @ignore
   */
  onClick: import_prop_types7.default.func,
  /**
   * @ignore
   */
  onContextMenu: import_prop_types7.default.func,
  /**
   * @ignore
   */
  onDragLeave: import_prop_types7.default.func,
  /**
   * @ignore
   */
  onFocus: import_prop_types7.default.func,
  /**
   * Callback fired when the component is focused with a keyboard.
   * We trigger a `onFocus` callback too.
   */
  onFocusVisible: import_prop_types7.default.func,
  /**
   * @ignore
   */
  onKeyDown: import_prop_types7.default.func,
  /**
   * @ignore
   */
  onKeyUp: import_prop_types7.default.func,
  /**
   * @ignore
   */
  onMouseDown: import_prop_types7.default.func,
  /**
   * @ignore
   */
  onMouseLeave: import_prop_types7.default.func,
  /**
   * @ignore
   */
  onMouseUp: import_prop_types7.default.func,
  /**
   * @ignore
   */
  onTouchEnd: import_prop_types7.default.func,
  /**
   * @ignore
   */
  onTouchMove: import_prop_types7.default.func,
  /**
   * @ignore
   */
  onTouchStart: import_prop_types7.default.func,
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: import_prop_types7.default.oneOfType([import_prop_types7.default.arrayOf(import_prop_types7.default.oneOfType([import_prop_types7.default.func, import_prop_types7.default.object, import_prop_types7.default.bool])), import_prop_types7.default.func, import_prop_types7.default.object]),
  /**
   * @default 0
   */
  tabIndex: import_prop_types7.default.number,
  /**
   * Props applied to the `TouchRipple` element.
   */
  TouchRippleProps: import_prop_types7.default.object,
  /**
   * A ref that points to the `TouchRipple` element.
   */
  touchRippleRef: import_prop_types7.default.oneOfType([import_prop_types7.default.func, import_prop_types7.default.shape({
    current: import_prop_types7.default.shape({
      pulsate: import_prop_types7.default.func.isRequired,
      start: import_prop_types7.default.func.isRequired,
      stop: import_prop_types7.default.func.isRequired
    })
  })]),
  /**
   * The HTML [`type`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/button#type)
   * attribute applied to `button` and `a` elements.
   * Ignored when rendering non-native buttons.
   * @default 'button'
   */
  type: import_prop_types7.default.string
} : void 0;
var ButtonBase_default = ButtonBase;

// node_modules/@mui/material/CircularProgress/CircularProgress.mjs
var React17 = __toESM(require_react(), 1);
var import_prop_types8 = __toESM(require_prop_types(), 1);

// node_modules/@mui/material/utils/createSimplePaletteValueFilter.mjs
function hasCorrectMainProperty(obj) {
  return typeof obj.main === "string";
}
function checkSimplePaletteColorValues(obj, additionalPropertiesToCheck = []) {
  if (!hasCorrectMainProperty(obj)) {
    return false;
  }
  for (const value of additionalPropertiesToCheck) {
    if (!obj.hasOwnProperty(value) || typeof obj[value] !== "string") {
      return false;
    }
  }
  return true;
}
function createSimplePaletteValueFilter(additionalPropertiesToCheck = []) {
  return ([, value]) => value && checkSimplePaletteColorValues(value, additionalPropertiesToCheck);
}

// node_modules/@mui/material/CircularProgress/circularProgressClasses.mjs
function getCircularProgressUtilityClass(slot) {
  return generateUtilityClass("MuiCircularProgress", slot);
}
var circularProgressClasses = generateUtilityClasses("MuiCircularProgress", ["root", "determinate", "indeterminate", "colorPrimary", "colorSecondary", "svg", "track", "circle", "circleDisableShrink"]);

// node_modules/@mui/material/CircularProgress/CircularProgress.mjs
var import_jsx_runtime8 = __toESM(require_jsx_runtime(), 1);
var SIZE = 44;
var warnedMinMaxWithoutVariant = false;
var warnedInvalidMinMaxValue = false;
var circularRotateKeyframe = keyframes`
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
`;
var circularDashKeyframe = keyframes`
  0% {
    stroke-dasharray: 1px, 200px;
    stroke-dashoffset: 0;
  }

  50% {
    stroke-dasharray: 100px, 200px;
    stroke-dashoffset: -15px;
  }

  100% {
    stroke-dasharray: 1px, 200px;
    stroke-dashoffset: -126px;
  }
`;
var rotateAnimation = typeof circularRotateKeyframe !== "string" ? css`
        animation: ${circularRotateKeyframe} 1.4s linear infinite;
      ` : null;
var dashAnimation = typeof circularDashKeyframe !== "string" ? css`
        animation: ${circularDashKeyframe} 1.4s ease-in-out infinite;
      ` : null;
var useUtilityClasses3 = (ownerState) => {
  const {
    classes,
    variant,
    color,
    disableShrink
  } = ownerState;
  const slots = {
    root: ["root", variant, `color${capitalize_default(color)}`],
    svg: ["svg"],
    track: ["track"],
    circle: ["circle", disableShrink && "circleDisableShrink"]
  };
  return composeClasses(slots, getCircularProgressUtilityClass, classes);
};
var CircularProgressRoot = styled_default("span", {
  name: "MuiCircularProgress",
  slot: "Root",
  overridesResolver: (props, styles) => {
    const {
      ownerState
    } = props;
    return [styles.root, styles[ownerState.variant], styles[`color${capitalize_default(ownerState.color)}`]];
  }
})(memoTheme_default(({
  theme
}) => {
  const reducedMotionAnimationStyles = getReducedMotionStyles(theme, {
    animation: "none"
  });
  return {
    display: "inline-block",
    variants: [{
      props: {
        variant: "determinate"
      },
      style: {
        ...getTransitionStyles(theme, "transform")
      }
    }, {
      props: {
        variant: "indeterminate"
      },
      style: rotateAnimation || {
        animation: `${circularRotateKeyframe} 1.4s linear infinite`
      }
    }, ...reducedMotionAnimationStyles ? [{
      props: {
        variant: "indeterminate"
      },
      style: reducedMotionAnimationStyles
    }] : [], ...Object.entries(theme.palette).filter(createSimplePaletteValueFilter()).map(([color]) => ({
      props: {
        color
      },
      style: {
        color: (theme.vars || theme).palette[color].main
      }
    }))]
  };
}));
var CircularProgressSVG = styled_default("svg", {
  name: "MuiCircularProgress",
  slot: "Svg"
})({
  display: "block"
  // Keeps the progress centered
});
var CircularProgressCircle = styled_default("circle", {
  name: "MuiCircularProgress",
  slot: "Circle",
  overridesResolver: (props, styles) => {
    const {
      ownerState
    } = props;
    return [styles.circle, ownerState.disableShrink && styles.circleDisableShrink];
  }
})(memoTheme_default(({
  theme
}) => {
  const reducedMotionAnimationStyles = getReducedMotionStyles(theme, {
    animation: "none"
  });
  return {
    stroke: "currentColor",
    variants: [{
      props: {
        variant: "determinate"
      },
      style: {
        ...getTransitionStyles(theme, "stroke-dashoffset")
      }
    }, {
      props: {
        variant: "indeterminate"
      },
      style: {
        // Some default value that looks fine while waiting for the animation to kick in.
        strokeDasharray: "80px, 200px",
        strokeDashoffset: 0
        // Add the unit to fix a Edge 16 and below bug.
      }
    }, {
      props: ({
        ownerState
      }) => ownerState.variant === "indeterminate" && !ownerState.disableShrink,
      style: dashAnimation || {
        // At runtime for Pigment CSS, `dashAnimation` will be null and the generated keyframe will be used.
        animation: `${circularDashKeyframe} 1.4s ease-in-out infinite`
      }
    }, ...reducedMotionAnimationStyles ? [{
      props: ({
        ownerState
      }) => ownerState.variant === "indeterminate" && !ownerState.disableShrink,
      style: reducedMotionAnimationStyles
    }] : []]
  };
}));
var CircularProgressTrack = styled_default("circle", {
  name: "MuiCircularProgress",
  slot: "Track"
})(memoTheme_default(({
  theme
}) => ({
  stroke: "currentColor",
  opacity: (theme.vars || theme).palette.action.activatedOpacity
})));
var CircularProgress = React17.forwardRef(function CircularProgress2(inProps, ref) {
  const props = useDefaultProps({
    props: inProps,
    name: "MuiCircularProgress"
  });
  const {
    className,
    color = "primary",
    disableShrink = false,
    enableTrackSlot = false,
    min: minProp,
    max: maxProp,
    size = 40,
    style,
    thickness = 3.6,
    value = props.min ?? 0,
    variant = "indeterminate",
    ...other
  } = props;
  if (true) {
    if (!warnedMinMaxWithoutVariant && variant === "indeterminate" && (minProp !== void 0 || maxProp !== void 0)) {
      console.warn(`MUI: You have provided the \`min\` or \`max\` props with an 'indeterminate' variant. These props will have no effect.`);
      warnedMinMaxWithoutVariant = true;
    }
  }
  const min = minProp ?? 0;
  const max = maxProp ?? 100;
  const ownerState = {
    ...props,
    color,
    disableShrink,
    size,
    thickness,
    value,
    variant,
    enableTrackSlot
  };
  const classes = useUtilityClasses3(ownerState);
  const circleStyle = {};
  const rootStyle = {};
  const rootProps = {};
  if (variant === "determinate") {
    const circumference = 2 * Math.PI * ((SIZE - thickness) / 2);
    if (true) {
      if (!warnedInvalidMinMaxValue && (value < min || value > max || min >= max)) {
        console.error(`MUI: The min, max, and value props in CircularProgress should be numbers where min < max and min <= value <= max. Received min=${min}, max=${max}, value=${value}.`);
        warnedInvalidMinMaxValue = true;
      }
    }
    const range = max - min;
    circleStyle.strokeDasharray = circumference.toFixed(3);
    circleStyle.strokeDashoffset = range > 0 ? `${((max - value) / range * circumference).toFixed(3)}px` : `${circumference.toFixed(3)}px`;
    rootStyle.transform = "rotate(-90deg)";
    rootProps["aria-valuenow"] = value;
    rootProps["aria-valuemin"] = min;
    rootProps["aria-valuemax"] = max;
  }
  return (0, import_jsx_runtime8.jsx)(CircularProgressRoot, {
    className: clsx_default(classes.root, className),
    style: {
      width: size,
      height: size,
      ...rootStyle,
      ...style
    },
    ownerState,
    ref,
    role: "progressbar",
    ...rootProps,
    ...other,
    children: (0, import_jsx_runtime8.jsxs)(CircularProgressSVG, {
      className: classes.svg,
      ownerState,
      viewBox: `${SIZE / 2} ${SIZE / 2} ${SIZE} ${SIZE}`,
      children: [enableTrackSlot ? (0, import_jsx_runtime8.jsx)(CircularProgressTrack, {
        className: classes.track,
        ownerState,
        cx: SIZE,
        cy: SIZE,
        r: (SIZE - thickness) / 2,
        fill: "none",
        strokeWidth: thickness,
        "aria-hidden": "true"
      }) : null, (0, import_jsx_runtime8.jsx)(CircularProgressCircle, {
        className: classes.circle,
        style: circleStyle,
        ownerState,
        cx: SIZE,
        cy: SIZE,
        r: (SIZE - thickness) / 2,
        fill: "none",
        strokeWidth: thickness
      })]
    })
  });
});
true ? CircularProgress.propTypes = {
  // ┌────────────────────────────── Warning ──────────────────────────────┐
  // │ These PropTypes are generated from the TypeScript type definitions. │
  // │    To update them, edit the d.ts file and run `pnpm proptypes`.     │
  // └─────────────────────────────────────────────────────────────────────┘
  /**
   * Override or extend the styles applied to the component.
   */
  classes: import_prop_types8.default.object,
  /**
   * @ignore
   */
  className: import_prop_types8.default.string,
  /**
   * The color of the component.
   * It supports both default and custom theme colors, which can be added as shown in the
   * [palette customization guide](https://mui.com/material-ui/customization/palette/#custom-colors).
   * @default 'primary'
   */
  color: import_prop_types8.default.oneOfType([import_prop_types8.default.oneOf(["inherit", "primary", "secondary", "error", "info", "success", "warning"]), import_prop_types8.default.string]),
  /**
   * If `true`, the shrink animation is disabled.
   * This only works if variant is `indeterminate`.
   * @default false
   */
  disableShrink: chainPropTypes(import_prop_types8.default.bool, (props) => {
    if (props.disableShrink && props.variant && props.variant !== "indeterminate") {
      return new Error("MUI: You have provided the `disableShrink` prop with a variant other than `indeterminate`. This will have no effect.");
    }
    return null;
  }),
  /**
   * If `true`, a track circle slot is mounted to show a subtle background for the progress.
   * The `size` and `thickness` apply to the track slot to be consistent with the progress circle.
   * @default false
   */
  enableTrackSlot: import_prop_types8.default.bool,
  /**
   * The maximum value for the progress indicator for the determinate variant.
   * @default 100
   */
  max: import_prop_types8.default.number,
  /**
   * The minimum value for the progress indicator for the determinate variant.
   * @default 0
   */
  min: import_prop_types8.default.number,
  /**
   * The size of the component.
   * If using a number, the pixel unit is assumed.
   * If using a string, you need to provide the CSS unit, for example '3rem'.
   * @default 40
   */
  size: import_prop_types8.default.oneOfType([import_prop_types8.default.number, import_prop_types8.default.string]),
  /**
   * @ignore
   */
  style: import_prop_types8.default.object,
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: import_prop_types8.default.oneOfType([import_prop_types8.default.arrayOf(import_prop_types8.default.oneOfType([import_prop_types8.default.func, import_prop_types8.default.object, import_prop_types8.default.bool])), import_prop_types8.default.func, import_prop_types8.default.object]),
  /**
   * The thickness of the circle.
   * @default 3.6
   */
  thickness: import_prop_types8.default.number,
  /**
   * The value of the progress indicator for the determinate variant.
   * Value between `min` and `max`.
   * @default props.min ?? 0
   */
  value: import_prop_types8.default.number,
  /**
   * The variant to use.
   * Use indeterminate when there is no progress value.
   * @default 'indeterminate'
   */
  variant: import_prop_types8.default.oneOf(["determinate", "indeterminate"])
} : void 0;
var CircularProgress_default = CircularProgress;

// node_modules/@mui/material/Button/buttonClasses.mjs
function getButtonUtilityClass(slot) {
  return generateUtilityClass("MuiButton", slot);
}
var buttonClasses = generateUtilityClasses("MuiButton", ["root", "text", "outlined", "contained", "disableElevation", "focusVisible", "disabled", "colorInherit", "colorPrimary", "colorSecondary", "colorSuccess", "colorError", "colorInfo", "colorWarning", "sizeMedium", "sizeSmall", "sizeLarge", "fullWidth", "startIcon", "endIcon", "icon", "loading", "loadingWrapper", "loadingIconPlaceholder", "loadingIndicator", "loadingPositionCenter", "loadingPositionStart", "loadingPositionEnd"]);
var buttonClasses_default = buttonClasses;

// node_modules/@mui/material/ButtonGroup/ButtonGroupContext.mjs
var React18 = __toESM(require_react(), 1);
var ButtonGroupContext = React18.createContext({});
if (true) {
  ButtonGroupContext.displayName = "ButtonGroupContext";
}
var ButtonGroupContext_default = ButtonGroupContext;

// node_modules/@mui/material/ButtonGroup/ButtonGroupButtonContext.mjs
var React19 = __toESM(require_react(), 1);
var ButtonGroupButtonContext = React19.createContext(void 0);
if (true) {
  ButtonGroupButtonContext.displayName = "ButtonGroupButtonContext";
}
var ButtonGroupButtonContext_default = ButtonGroupButtonContext;

// node_modules/@mui/material/Button/Button.mjs
var import_jsx_runtime9 = __toESM(require_jsx_runtime(), 1);
var useUtilityClasses4 = (ownerState) => {
  const {
    color,
    disableElevation,
    fullWidth,
    size,
    variant,
    loading,
    loadingPosition,
    classes
  } = ownerState;
  const slots = {
    root: ["root", loading && "loading", variant, `size${capitalize_default(size)}`, `color${capitalize_default(color)}`, disableElevation && "disableElevation", fullWidth && "fullWidth", loading && `loadingPosition${capitalize_default(loadingPosition)}`],
    startIcon: ["icon", "startIcon"],
    endIcon: ["icon", "endIcon"],
    loadingIndicator: ["loadingIndicator"],
    loadingWrapper: ["loadingWrapper"]
  };
  const composedClasses = composeClasses(slots, getButtonUtilityClass, classes);
  return {
    ...classes,
    // forward the focused, disabled, etc. classes to the ButtonBase
    ...composedClasses
  };
};
var commonIconStyles = [{
  props: {
    size: "small"
  },
  style: {
    "& > *:nth-of-type(1)": {
      fontSize: 18
    }
  }
}, {
  props: {
    size: "medium"
  },
  style: {
    "& > *:nth-of-type(1)": {
      fontSize: 20
    }
  }
}, {
  props: {
    size: "large"
  },
  style: {
    "& > *:nth-of-type(1)": {
      fontSize: 22
    }
  }
}];
var ButtonRoot = styled_default(ButtonBase_default, {
  shouldForwardProp: (prop) => rootShouldForwardProp_default(prop) || prop === "classes",
  name: "MuiButton",
  slot: "Root",
  overridesResolver: (props, styles) => {
    const {
      ownerState
    } = props;
    return [styles.root, styles[ownerState.variant], styles[`size${capitalize_default(ownerState.size)}`], ownerState.color === "inherit" && styles.colorInherit, ownerState.disableElevation && styles.disableElevation, ownerState.fullWidth && styles.fullWidth, ownerState.loading && styles.loading];
  }
})(memoTheme_default(({
  theme
}) => {
  var _a, _b;
  const inheritContainedBackgroundColor = theme.palette.mode === "light" ? theme.palette.grey[300] : theme.palette.grey[800];
  const inheritContainedHoverBackgroundColor = theme.palette.mode === "light" ? theme.palette.grey.A100 : theme.palette.grey[700];
  return {
    ...theme.typography.button,
    minWidth: 64,
    padding: "6px 16px",
    border: 0,
    borderRadius: (theme.vars || theme).shape.borderRadius,
    ...getTransitionStyles(theme, ["background-color", "box-shadow", "border-color", "color"], {
      duration: theme.transitions.duration.short
    }),
    "&:hover": {
      textDecoration: "none"
    },
    [`&.${buttonClasses_default.disabled}`]: {
      color: (theme.vars || theme).palette.action.disabled
    },
    variants: [{
      props: {
        variant: "contained"
      },
      style: {
        color: `var(--variant-containedColor)`,
        backgroundColor: `var(--variant-containedBg)`,
        boxShadow: (theme.vars || theme).shadows[2],
        "&:hover": {
          boxShadow: (theme.vars || theme).shadows[4],
          // Reset on touch devices, it doesn't add specificity
          "@media (hover: none)": {
            boxShadow: (theme.vars || theme).shadows[2]
          }
        },
        "&:active": {
          boxShadow: (theme.vars || theme).shadows[8]
        },
        [`&.${buttonClasses_default.focusVisible}`]: {
          ...theme.focusVisible,
          boxShadow: ((_a = theme.focusVisible) == null ? void 0 : _a.boxShadow) ? `${(theme.vars || theme).shadows[6]}, ${theme.focusVisible.boxShadow}` : (theme.vars || theme).shadows[6]
        },
        [`&.${buttonClasses_default.disabled}`]: {
          color: (theme.vars || theme).palette.action.disabled,
          boxShadow: (theme.vars || theme).shadows[0],
          backgroundColor: (theme.vars || theme).palette.action.disabledBackground
        }
      }
    }, {
      props: {
        variant: "outlined"
      },
      style: {
        padding: "5px 15px",
        border: "1px solid currentColor",
        borderColor: `var(--variant-outlinedBorder, currentColor)`,
        backgroundColor: `var(--variant-outlinedBg)`,
        color: `var(--variant-outlinedColor)`,
        [`&.${buttonClasses_default.disabled}`]: {
          border: `1px solid ${(theme.vars || theme).palette.action.disabledBackground}`
        }
      }
    }, {
      props: {
        variant: "text"
      },
      style: {
        padding: "6px 8px",
        color: `var(--variant-textColor)`,
        backgroundColor: `var(--variant-textBg)`
      }
    }, ...Object.entries(theme.palette).filter(createSimplePaletteValueFilter()).map(([color]) => ({
      props: {
        color
      },
      style: {
        "--variant-textColor": (theme.vars || theme).palette[color].main,
        "--variant-outlinedColor": (theme.vars || theme).palette[color].main,
        "--variant-outlinedBorder": theme.alpha((theme.vars || theme).palette[color].main, 0.5),
        "--variant-containedColor": (theme.vars || theme).palette[color].contrastText,
        "--variant-containedBg": (theme.vars || theme).palette[color].main,
        "@media (hover: hover)": {
          "&:hover": {
            "--variant-containedBg": (theme.vars || theme).palette[color].dark,
            "--variant-textBg": theme.alpha((theme.vars || theme).palette[color].main, (theme.vars || theme).palette.action.hoverOpacity),
            "--variant-outlinedBorder": (theme.vars || theme).palette[color].main,
            "--variant-outlinedBg": theme.alpha((theme.vars || theme).palette[color].main, (theme.vars || theme).palette.action.hoverOpacity)
          }
        }
      }
    })), {
      props: {
        color: "inherit"
      },
      style: {
        color: "inherit",
        borderColor: "currentColor",
        "--variant-containedBg": theme.vars ? theme.vars.palette.Button.inheritContainedBg : inheritContainedBackgroundColor,
        "@media (hover: hover)": {
          "&:hover": {
            "--variant-containedBg": theme.vars ? theme.vars.palette.Button.inheritContainedHoverBg : inheritContainedHoverBackgroundColor,
            "--variant-textBg": theme.alpha((theme.vars || theme).palette.text.primary, (theme.vars || theme).palette.action.hoverOpacity),
            "--variant-outlinedBg": theme.alpha((theme.vars || theme).palette.text.primary, (theme.vars || theme).palette.action.hoverOpacity)
          }
        }
      }
    }, {
      props: {
        size: "small",
        variant: "text"
      },
      style: {
        padding: "4px 5px",
        fontSize: theme.typography.pxToRem(13)
      }
    }, {
      props: {
        size: "large",
        variant: "text"
      },
      style: {
        padding: "8px 11px",
        fontSize: theme.typography.pxToRem(15)
      }
    }, {
      props: {
        size: "small",
        variant: "outlined"
      },
      style: {
        padding: "3px 9px",
        fontSize: theme.typography.pxToRem(13)
      }
    }, {
      props: {
        size: "large",
        variant: "outlined"
      },
      style: {
        padding: "7px 21px",
        fontSize: theme.typography.pxToRem(15)
      }
    }, {
      props: {
        size: "small",
        variant: "contained"
      },
      style: {
        padding: "4px 10px",
        fontSize: theme.typography.pxToRem(13)
      }
    }, {
      props: {
        size: "large",
        variant: "contained"
      },
      style: {
        padding: "8px 22px",
        fontSize: theme.typography.pxToRem(15)
      }
    }, {
      props: {
        disableElevation: true
      },
      style: {
        boxShadow: "none",
        "&:hover": {
          boxShadow: "none"
        },
        [`&.${buttonClasses_default.focusVisible}`]: {
          boxShadow: ((_b = theme.focusVisible) == null ? void 0 : _b.boxShadow) ?? "none"
        },
        "&:active": {
          boxShadow: "none"
        },
        [`&.${buttonClasses_default.disabled}`]: {
          boxShadow: "none"
        }
      }
    }, {
      props: {
        fullWidth: true
      },
      style: {
        width: "100%"
      }
    }, {
      props: {
        loadingPosition: "center"
      },
      style: {
        ...getTransitionStyles(theme, ["background-color", "box-shadow", "border-color"], {
          duration: theme.transitions.duration.short
        }),
        [`&.${buttonClasses_default.loading}`]: {
          color: "transparent"
        }
      }
    }]
  };
}));
var ButtonStartIcon = styled_default("span", {
  name: "MuiButton",
  slot: "StartIcon",
  overridesResolver: (props, styles) => {
    const {
      ownerState
    } = props;
    return [styles.startIcon, ownerState.loading && styles.startIconLoadingStart];
  }
})(({
  theme
}) => ({
  display: "inherit",
  alignItems: "center",
  marginRight: 8,
  marginLeft: -4,
  "&::before": {
    content: '"\\200b"',
    width: 0,
    overflow: "hidden"
  },
  variants: [{
    props: {
      size: "small"
    },
    style: {
      marginLeft: -2
    }
  }, {
    props: {
      loadingPosition: "start",
      loading: true
    },
    style: {
      ...getTransitionStyles(theme, ["opacity"], {
        duration: theme.transitions.duration.short
      }),
      opacity: 0
    }
  }, {
    props: {
      loadingPosition: "start",
      loading: true,
      fullWidth: true
    },
    style: {
      marginRight: -8
    }
  }, ...commonIconStyles]
}));
var ButtonEndIcon = styled_default("span", {
  name: "MuiButton",
  slot: "EndIcon",
  overridesResolver: (props, styles) => {
    const {
      ownerState
    } = props;
    return [styles.endIcon, ownerState.loading && styles.endIconLoadingEnd];
  }
})(({
  theme
}) => ({
  display: "inherit",
  marginRight: -4,
  marginLeft: 8,
  variants: [{
    props: {
      size: "small"
    },
    style: {
      marginRight: -2
    }
  }, {
    props: {
      loadingPosition: "end",
      loading: true
    },
    style: {
      ...getTransitionStyles(theme, ["opacity"], {
        duration: theme.transitions.duration.short
      }),
      opacity: 0
    }
  }, {
    props: {
      loadingPosition: "end",
      loading: true,
      fullWidth: true
    },
    style: {
      marginLeft: -8
    }
  }, ...commonIconStyles]
}));
var ButtonLoadingIndicator = styled_default("span", {
  name: "MuiButton",
  slot: "LoadingIndicator"
})(({
  theme
}) => ({
  display: "none",
  position: "absolute",
  visibility: "visible",
  variants: [{
    props: {
      loading: true
    },
    style: {
      display: "flex"
    }
  }, {
    props: {
      loadingPosition: "start"
    },
    style: {
      left: 14
    }
  }, {
    props: {
      loadingPosition: "start",
      size: "small"
    },
    style: {
      left: 10
    }
  }, {
    props: {
      variant: "text",
      loadingPosition: "start"
    },
    style: {
      left: 6
    }
  }, {
    props: {
      loadingPosition: "center"
    },
    style: {
      left: "50%",
      transform: "translate(-50%)",
      color: (theme.vars || theme).palette.action.disabled
    }
  }, {
    props: {
      loadingPosition: "end"
    },
    style: {
      right: 14
    }
  }, {
    props: {
      loadingPosition: "end",
      size: "small"
    },
    style: {
      right: 10
    }
  }, {
    props: {
      variant: "text",
      loadingPosition: "end"
    },
    style: {
      right: 6
    }
  }, {
    props: {
      loadingPosition: "start",
      fullWidth: true
    },
    style: {
      position: "relative",
      left: -10
    }
  }, {
    props: {
      loadingPosition: "end",
      fullWidth: true
    },
    style: {
      position: "relative",
      right: -10
    }
  }]
}));
var ButtonLoadingIconPlaceholder = styled_default("span", {
  name: "MuiButton",
  slot: "LoadingIconPlaceholder"
})({
  display: "inline-block",
  width: "1em",
  height: "1em"
});
var Button = React20.forwardRef(function Button2(inProps, ref) {
  const contextProps = React20.useContext(ButtonGroupContext_default);
  const buttonGroupButtonContextPositionClassName = React20.useContext(ButtonGroupButtonContext_default);
  const resolvedProps = resolveProps(contextProps, inProps);
  const props = useDefaultProps({
    props: resolvedProps,
    name: "MuiButton"
  });
  const {
    children,
    color = "primary",
    component = "button",
    className,
    disabled = false,
    disableElevation = false,
    disableFocusRipple = false,
    endIcon: endIconProp,
    focusVisibleClassName,
    fullWidth = false,
    id: idProp,
    loading = null,
    loadingIndicator: loadingIndicatorProp,
    loadingPosition = "center",
    size = "medium",
    startIcon: startIconProp,
    type,
    variant = "text",
    ...other
  } = props;
  const loadingId = useId_default(idProp);
  const loadingIndicator = loadingIndicatorProp ?? (0, import_jsx_runtime9.jsx)(CircularProgress_default, {
    "aria-labelledby": loadingId,
    color: "inherit",
    size: 16
  });
  const ownerState = {
    ...props,
    color,
    component,
    disabled,
    disableElevation,
    disableFocusRipple,
    fullWidth,
    loading,
    loadingIndicator,
    loadingPosition,
    size,
    type,
    variant
  };
  const classes = useUtilityClasses4(ownerState);
  const startIcon = (startIconProp || loading && loadingPosition === "start") && (0, import_jsx_runtime9.jsx)(ButtonStartIcon, {
    className: classes.startIcon,
    ownerState,
    children: startIconProp || (0, import_jsx_runtime9.jsx)(ButtonLoadingIconPlaceholder, {
      className: classes.loadingIconPlaceholder,
      ownerState
    })
  });
  const endIcon = (endIconProp || loading && loadingPosition === "end") && (0, import_jsx_runtime9.jsx)(ButtonEndIcon, {
    className: classes.endIcon,
    ownerState,
    children: endIconProp || (0, import_jsx_runtime9.jsx)(ButtonLoadingIconPlaceholder, {
      className: classes.loadingIconPlaceholder,
      ownerState
    })
  });
  const positionClassName = buttonGroupButtonContextPositionClassName || "";
  const loader = typeof loading === "boolean" ? (
    // use plain HTML span to minimize the runtime overhead
    (0, import_jsx_runtime9.jsx)("span", {
      className: classes.loadingWrapper,
      style: {
        display: "contents"
      },
      children: loading && (0, import_jsx_runtime9.jsx)(ButtonLoadingIndicator, {
        className: classes.loadingIndicator,
        ownerState,
        children: loadingIndicator
      })
    })
  ) : null;
  const {
    root,
    ...forwardedClasses
  } = classes;
  return (0, import_jsx_runtime9.jsxs)(ButtonRoot, {
    ownerState,
    className: clsx_default(contextProps.className, classes.root, className, positionClassName),
    component,
    disabled: disabled || loading,
    focusRipple: !disableFocusRipple,
    focusVisibleClassName: clsx_default(classes.focusVisible, focusVisibleClassName),
    ref,
    internalNativeButton: true,
    type,
    id: loading ? loadingId : idProp,
    ...other,
    classes: forwardedClasses,
    children: [startIcon, loadingPosition !== "end" && loader, children, loadingPosition === "end" && loader, endIcon]
  });
});
true ? Button.propTypes = {
  // ┌────────────────────────────── Warning ──────────────────────────────┐
  // │ These PropTypes are generated from the TypeScript type definitions. │
  // │    To update them, edit the d.ts file and run `pnpm proptypes`.     │
  // └─────────────────────────────────────────────────────────────────────┘
  /**
   * The content of the component.
   */
  children: import_prop_types9.default.node,
  /**
   * Override or extend the styles applied to the component.
   */
  classes: import_prop_types9.default.object,
  /**
   * @ignore
   */
  className: import_prop_types9.default.string,
  /**
   * The color of the component.
   * It supports both default and custom theme colors, which can be added as shown in the
   * [palette customization guide](https://mui.com/material-ui/customization/palette/#custom-colors).
   * @default 'primary'
   */
  color: import_prop_types9.default.oneOfType([import_prop_types9.default.oneOf(["inherit", "primary", "secondary", "success", "error", "info", "warning"]), import_prop_types9.default.string]),
  /**
   * The component used for the root node.
   * Either a string to use a HTML element or a component.
   */
  component: import_prop_types9.default.elementType,
  /**
   * If `true`, the component is disabled.
   * @default false
   */
  disabled: import_prop_types9.default.bool,
  /**
   * If `true`, no elevation is used.
   * @default false
   */
  disableElevation: import_prop_types9.default.bool,
  /**
   * If `true`, the  keyboard focus ripple is disabled.
   * @default false
   */
  disableFocusRipple: import_prop_types9.default.bool,
  /**
   * If `true`, the ripple effect is disabled.
   *
   * ⚠️ Without a ripple there is no styling for :focus-visible by default. Be sure
   * to highlight the element by applying separate styles with the `.Mui-focusVisible` class.
   * @default false
   */
  disableRipple: import_prop_types9.default.bool,
  /**
   * Element placed after the children.
   */
  endIcon: import_prop_types9.default.node,
  /**
   * @ignore
   */
  focusVisibleClassName: import_prop_types9.default.string,
  /**
   * If `true`, the button will take up the full width of its container.
   * @default false
   */
  fullWidth: import_prop_types9.default.bool,
  /**
   * The URL to link to when the button is clicked.
   * If defined, an `a` element will be used as the root node.
   */
  href: import_prop_types9.default.string,
  /**
   * @ignore
   */
  id: import_prop_types9.default.string,
  /**
   * If `true`, the loading indicator is visible and the button is disabled.
   * If `true | false`, the loading wrapper is always rendered before the children to prevent [Google Translation Crash](https://github.com/mui/material-ui/issues/27853).
   * @default null
   */
  loading: import_prop_types9.default.bool,
  /**
   * Element placed before the children if the button is in loading state.
   * The node should contain an element with `role="progressbar"` with an accessible name.
   * By default, it renders a `CircularProgress` that is labeled by the button itself.
   * @default <CircularProgress color="inherit" size={16} />
   */
  loadingIndicator: import_prop_types9.default.node,
  /**
   * The loading indicator can be positioned on the start, end, or the center of the button.
   * @default 'center'
   */
  loadingPosition: import_prop_types9.default.oneOf(["center", "end", "start"]),
  /**
   * The size of the component.
   * `small` is equivalent to the dense button styling.
   * @default 'medium'
   */
  size: import_prop_types9.default.oneOfType([import_prop_types9.default.oneOf(["small", "medium", "large"]), import_prop_types9.default.string]),
  /**
   * Element placed before the children.
   */
  startIcon: import_prop_types9.default.node,
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: import_prop_types9.default.oneOfType([import_prop_types9.default.arrayOf(import_prop_types9.default.oneOfType([import_prop_types9.default.func, import_prop_types9.default.object, import_prop_types9.default.bool])), import_prop_types9.default.func, import_prop_types9.default.object]),
  /**
   * @ignore
   */
  type: import_prop_types9.default.string,
  /**
   * The variant to use.
   * @default 'text'
   */
  variant: import_prop_types9.default.oneOfType([import_prop_types9.default.oneOf(["contained", "outlined", "text"]), import_prop_types9.default.string])
} : void 0;
var Button_default = Button;
export {
  buttonClasses_default as buttonClasses,
  Button_default as default,
  getButtonUtilityClass
};
//# sourceMappingURL=@mui_material_Button.js.map
