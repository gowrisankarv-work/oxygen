/**
 * Minimal, hand-written React 19 type declarations.
 *
 * Why: `@types/react` is not installed in this offline build environment (see DECISIONS.md).
 * These declarations cover exactly the React surface this project uses. If you later
 * install `@types/react` + `@types/react-dom`, delete `/types/react*` and the `paths`
 * entries in tsconfig*.json — the app code is written against the standard API.
 */

/* eslint-disable */
declare namespace React {
  type Key = string | number | bigint;

  interface ReactElement<P = unknown> {
    type: unknown;
    props: P;
    key: string | null;
  }

  type ReactNode =
    | ReactElement
    | string
    | number
    | bigint
    | boolean
    | null
    | undefined
    | Iterable<ReactNode>
    | Promise<ReactNode>;

  type JSXElementConstructor<P> = (props: P) => ReactNode;

  type ElementType<P = any> = keyof JSX.IntrinsicElements | JSXElementConstructor<P>;

  type ComponentType<P = {}> = (props: P) => ReactNode;
  type FC<P = {}> = (props: P) => ReactNode;

  type PropsWithChildren<P = unknown> = P & { children?: ReactNode };

  interface RefObject<T> {
    current: T;
  }
  type RefCallback<T> = (instance: T | null) => void | (() => void);
  type Ref<T> = RefCallback<T> | RefObject<T | null> | null;

  type Dispatch<A> = (value: A) => void;
  type SetStateAction<S> = S | ((prev: S) => S);
  type EffectCallback = () => void | (() => void);
  type DependencyList = readonly unknown[];
  type Reducer<S, A> = (prevState: S, action: A) => S;
  type TransitionFunction = () => void | Promise<void>;

  interface Context<T> {
    Provider: (props: { value: T; children?: ReactNode }) => ReactNode;
    Consumer: (props: { children: (value: T) => ReactNode }) => ReactNode;
    displayName?: string;
  }

  /* ---------------------------- Events ---------------------------- */
  interface SyntheticEvent<T = Element, E = Event> {
    nativeEvent: E;
    currentTarget: T;
    target: EventTarget;
    bubbles: boolean;
    defaultPrevented: boolean;
    type: string;
    timeStamp: number;
    preventDefault(): void;
    stopPropagation(): void;
    isDefaultPrevented(): boolean;
  }
  interface UIEvent<T = Element, E = Event> extends SyntheticEvent<T, E> {}
  interface FormEvent<T = Element> extends SyntheticEvent<T> {}
  interface ChangeEvent<T = Element> extends SyntheticEvent<T> {
    target: EventTarget & T;
  }
  interface FocusEvent<T = Element> extends SyntheticEvent<T, globalThis.FocusEvent> {
    relatedTarget: (EventTarget & Element) | null;
  }
  interface KeyboardEvent<T = Element> extends SyntheticEvent<T, globalThis.KeyboardEvent> {
    key: string;
    code: string;
    altKey: boolean;
    ctrlKey: boolean;
    metaKey: boolean;
    shiftKey: boolean;
    repeat: boolean;
  }
  interface MouseEvent<T = Element, E = globalThis.MouseEvent> extends SyntheticEvent<T, E> {
    button: number;
    altKey: boolean;
    ctrlKey: boolean;
    metaKey: boolean;
    shiftKey: boolean;
    clientX: number;
    clientY: number;
  }
  interface PointerEvent<T = Element> extends MouseEvent<T, globalThis.PointerEvent> {
    pointerType: string;
  }

  type EventHandler<E> = (event: E) => void;

  /* -------------------------- Attributes -------------------------- */
  type CSSProperties = { [key: string]: string | number | undefined };

  type Booleanish = boolean | 'true' | 'false';

  interface DOMAttributes<T> {
    children?: ReactNode;
    dangerouslySetInnerHTML?: { __html: string };
    onClick?: EventHandler<MouseEvent<T>>;
    onMouseDown?: EventHandler<MouseEvent<T>>;
    onMouseEnter?: EventHandler<MouseEvent<T>>;
    onMouseLeave?: EventHandler<MouseEvent<T>>;
    onPointerEnter?: EventHandler<PointerEvent<T>>;
    onPointerLeave?: EventHandler<PointerEvent<T>>;
    onPointerDown?: EventHandler<PointerEvent<T>>;
    onKeyDown?: EventHandler<KeyboardEvent<T>>;
    onKeyUp?: EventHandler<KeyboardEvent<T>>;
    onFocus?: EventHandler<FocusEvent<T>>;
    onBlur?: EventHandler<FocusEvent<T>>;
    onFocusCapture?: EventHandler<FocusEvent<T>>;
    onBlurCapture?: EventHandler<FocusEvent<T>>;
    onChange?: EventHandler<ChangeEvent<T>>;
    onInput?: EventHandler<FormEvent<T>>;
    onSubmit?: EventHandler<FormEvent<T>>;
    onReset?: EventHandler<FormEvent<T>>;
    onScroll?: EventHandler<UIEvent<T>>;
    onToggle?: EventHandler<SyntheticEvent<T>>;
    onClose?: EventHandler<SyntheticEvent<T>>;
    onCancel?: EventHandler<SyntheticEvent<T>>;
    onLoad?: EventHandler<SyntheticEvent<T>>;
    onError?: EventHandler<SyntheticEvent<T>>;
    onAnimationEnd?: EventHandler<SyntheticEvent<T>>;
    onTransitionEnd?: EventHandler<SyntheticEvent<T>>;
  }

  interface AriaAttributes {
    [key: `aria-${string}`]: string | number | boolean | undefined;
  }
  interface DataAttributes {
    [key: `data-${string}`]: string | number | boolean | undefined;
  }

  /** One permissive-but-typed attribute bag shared by all HTML elements. */
  interface HTMLAttributes<T> extends DOMAttributes<T>, AriaAttributes, DataAttributes {
    key?: Key | null;
    ref?: Ref<T>;
    id?: string;
    className?: string;
    style?: CSSProperties;
    title?: string;
    role?: string;
    tabIndex?: number;
    hidden?: boolean;
    lang?: string;
    dir?: string;
    inert?: boolean;
    translate?: 'yes' | 'no';
    draggable?: Booleanish;
    suppressHydrationWarning?: boolean;
    // anchors / links
    href?: string;
    target?: string;
    rel?: string;
    download?: string | boolean;
    hrefLang?: string;
    // forms
    action?: string | ((formData: FormData) => void | Promise<void>);
    method?: string;
    noValidate?: boolean;
    name?: string;
    value?: string | number | readonly string[];
    defaultValue?: string | number | readonly string[];
    checked?: boolean;
    defaultChecked?: boolean;
    disabled?: boolean;
    readOnly?: boolean;
    required?: boolean;
    placeholder?: string;
    type?: string;
    autoComplete?: string;
    autoFocus?: boolean;
    inputMode?: 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search';
    enterKeyHint?: string;
    pattern?: string;
    min?: number | string;
    max?: number | string;
    minLength?: number;
    maxLength?: number;
    step?: number | string;
    multiple?: boolean;
    rows?: number;
    cols?: number;
    htmlFor?: string;
    form?: string;
    spellCheck?: Booleanish;
    // media
    src?: string;
    srcSet?: string;
    sizes?: string;
    alt?: string;
    width?: number | string;
    height?: number | string;
    loading?: 'eager' | 'lazy';
    decoding?: 'async' | 'auto' | 'sync';
    fetchPriority?: 'high' | 'low' | 'auto';
    allow?: string;
    allowFullScreen?: boolean;
    referrerPolicy?: string;
    sandbox?: string;
    // misc
    open?: boolean;
    dateTime?: string;
    cite?: string;
    start?: number;
    reversed?: boolean;
    colSpan?: number;
    rowSpan?: number;
    scope?: string;
    content?: string;
    charSet?: string;
    property?: string;
    as?: string;
    crossOrigin?: '' | 'anonymous' | 'use-credentials';
    integrity?: string;
    async?: boolean;
    defer?: boolean;
    nonce?: string;
  }

  interface SVGAttributes<T> extends DOMAttributes<T>, AriaAttributes, DataAttributes {
    key?: Key | null;
    ref?: Ref<T>;
    id?: string;
    className?: string;
    style?: CSSProperties;
    role?: string;
    tabIndex?: number;
    focusable?: Booleanish | 'auto';
    xmlns?: string;
    viewBox?: string;
    preserveAspectRatio?: string;
    width?: number | string;
    height?: number | string;
    x?: number | string;
    y?: number | string;
    x1?: number | string;
    x2?: number | string;
    y1?: number | string;
    y2?: number | string;
    cx?: number | string;
    cy?: number | string;
    r?: number | string;
    rx?: number | string;
    ry?: number | string;
    d?: string;
    points?: string;
    fill?: string;
    fillOpacity?: number | string;
    fillRule?: 'nonzero' | 'evenodd' | 'inherit';
    clipRule?: 'nonzero' | 'evenodd' | 'inherit';
    stroke?: string;
    strokeWidth?: number | string;
    strokeLinecap?: 'butt' | 'round' | 'square' | 'inherit';
    strokeLinejoin?: 'miter' | 'round' | 'bevel' | 'inherit';
    strokeDasharray?: string | number;
    strokeOpacity?: number | string;
    opacity?: number | string;
    transform?: string;
    offset?: number | string;
    stopColor?: string;
    stopOpacity?: number | string;
    gradientUnits?: string;
    gradientTransform?: string;
    patternUnits?: string;
    clipPath?: string;
    mask?: string;
    textAnchor?: string;
    fontFamily?: string;
    fontSize?: number | string;
    fontWeight?: number | string;
    letterSpacing?: number | string;
    dominantBaseline?: string;
    href?: string;
  }
}

declare namespace JSX {
  type Element = React.ReactElement;
  interface ElementChildrenAttribute {
    children: {};
  }
  interface IntrinsicAttributes {
    key?: React.Key | null;
  }
  type ElementType = string | ((props: any) => React.ReactNode);
  type HTMLElements = {
    [K in keyof HTMLElementTagNameMap]: React.HTMLAttributes<HTMLElementTagNameMap[K]>;
  };
  type SVGElements = {
    [K in Exclude<keyof SVGElementTagNameMap, 'a' | 'script' | 'style' | 'title'>]: React.SVGAttributes<
      SVGElementTagNameMap[K]
    >;
  };
  interface IntrinsicElements extends HTMLElements, SVGElements {}
}

declare module 'react' {
  export = React;
}

declare namespace React {
  function createElement(type: unknown, props?: unknown, ...children: ReactNode[]): ReactElement;
  function cloneElement<P>(element: ReactElement<P>, props?: Partial<P>): ReactElement<P>;
  function isValidElement(value: unknown): value is ReactElement;
  function createContext<T>(defaultValue: T): Context<T>;
  function useContext<T>(context: Context<T>): T;
  function use<T>(usable: Promise<T> | Context<T>): T;

  function useState<S>(initial: S | (() => S)): [S, Dispatch<SetStateAction<S>>];
  function useState<S = undefined>(): [S | undefined, Dispatch<SetStateAction<S | undefined>>];
  function useReducer<S, A>(reducer: Reducer<S, A>, initialState: S): [S, Dispatch<A>];
  function useReducer<S, A, I>(reducer: Reducer<S, A>, initialArg: I, init: (arg: I) => S): [S, Dispatch<A>];
  function useEffect(effect: EffectCallback, deps?: DependencyList): void;
  function useLayoutEffect(effect: EffectCallback, deps?: DependencyList): void;
  function useInsertionEffect(effect: EffectCallback, deps?: DependencyList): void;
  function useRef<T>(initial: T): RefObject<T>;
  function useRef<T>(initial: T | null): RefObject<T | null>;
  function useRef<T = undefined>(): RefObject<T | undefined>;
  function useMemo<T>(factory: () => T, deps: DependencyList): T;
  function useCallback<T extends (...args: never[]) => unknown>(callback: T, deps: DependencyList): T;
  function useId(): string;
  function useDeferredValue<T>(value: T): T;
  function useSyncExternalStore<T>(
    subscribe: (onChange: () => void) => () => void,
    getSnapshot: () => T,
    getServerSnapshot?: () => T,
  ): T;
  function useTransition(): [boolean, (callback: TransitionFunction) => void];
  function startTransition(callback: TransitionFunction): void;
  function useActionState<State, Payload>(
    action: (state: Awaited<State>, payload: Payload) => State | Promise<State>,
    initialState: Awaited<State>,
    permalink?: string,
  ): [state: Awaited<State>, dispatch: (payload: Payload) => void, isPending: boolean];
  function useOptimistic<S>(passthrough: S): [S, (action: S) => void];

  function memo<P>(component: (props: P) => ReactNode): (props: P) => ReactNode;
  function lazy<P>(load: () => Promise<{ default: (props: P) => ReactNode }>): (props: P) => ReactNode;

  const Fragment: (props: { children?: ReactNode; key?: Key | null }) => ReactNode;
  const StrictMode: (props: { children?: ReactNode }) => ReactNode;
  const Suspense: (props: { children?: ReactNode; fallback?: ReactNode }) => ReactNode;
  const version: string;
}
