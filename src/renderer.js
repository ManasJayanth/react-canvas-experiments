import ReactReconciler from "react-reconciler/persistent";

function draw(ctx, child) {
  const { props, type } = child;
  if (child.type === "arc") {
    const {
      cx,
      cy,
      r,
      fill,
      deg: { start, end }
    } = props;
    ctx.beginPath();
    ctx.arc(cx, cy, r, start, end);
    if (props.border) {
      ctx.strokeStyle = props.border.color;
    }
    ctx.stroke();
    if (fill) {
      ctx.fillStyle = fill;
      ctx.fill();
    }
  } else {
    const {
      cx,
      cy,
      rx,
      ry,
      rot,
      fill,
      deg: { start, end }
    } = props;
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, rot, start, end);
    if (props.border) {
      ctx.strokeStyle = props.border.color;
    }
    ctx.stroke();
    if (fill) {
      ctx.fillStyle = fill;
      ctx.fill();
    }
  }
}

const emptyObject = {};
const Reconciler = ReactReconciler({
  getRootHostContext() {
    return emptyObject;
  },

  getChildHostContext() {
    return emptyObject;
  },

  getPublicInstance(instance) {
    return instance;
  },

  createInstance(type, props): Instance {
    return {
      type,
      props
    };
  },

  appendInitialChild(parentInstance, child) {
    console.log("appendInitialChild", child);
  },

  finalizeInitialChildren(domElement, type, props) {
    return false;
  },

  prepareUpdate(instance, type, oldProps, newProps): null | {} {
    console.log("In prepare update", oldProps, newProps);
    return "newProps";
  },

  shouldSetTextContent(type, props) {
    return type === "text";
  },

  shouldDeprioritizeSubtree(type: string, props: Props): boolean {
    return false;
  },

  createTextInstance(
    text,
    rootContainerInstance,
    hostContext,
    internalInstanceHandle
  ): TextInstance {},

  scheduleDeferredCallback: window.requestIdleCallback,

  cancelDeferredCallback: window.cancelIdleCallback,

  prepareForCommit(): void {},

  resetAfterCommit(): void {},

  now(): number {
    return typeof performance === "object" &&
      typeof performance.now === "function"
      ? performance.now()
      : Date.now();
  },

  isPrimaryRenderer: true,
  supportsHydration: false,
  supportsMutation: false,
  supportsPersistence: true,
  /// persistent
  cloneInstance(
    instance,
    updatePayload,
    type,
    oldProps,
    newProps,
    internalInstanceHandle,
    keepChildren,
    recyclableInstance
  ): Instance {
    const clone = {
      type: type,
      props: newProps
    };
    console.log("cloneInstance", clone);
    return clone;
  },

  createContainerChildSet(container): Array<Instance | TextInstance> {
    console.log("createContainerChildSet");
    return [];
  },

  appendChildToContainerChildSet(childSet, child): void {
    console.log("appendChildToContainerChildSet", child);
    childSet.push(child);
  },

  finalizeContainerChildren(ctx, newChildren): void {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    newChildren.forEach(function(child) {
      draw(ctx, child);
    });
  },

  replaceContainerChildren(container, newChildren): void {
    container.children = newChildren;
  }
});

const ContainerMap = new WeakMap();

class Root {
  constructor(canvasContainer, renderer, isAsync, hydrate) {
    this.renderer = renderer;
    this.internalRoot = renderer.createContainer(
      canvasContainer,
      isAsync,
      hydrate
    );
  }

  render(children: ReactNodeList, cb: ?Function) {
    this.renderer.updateContainer(children, this.internalRoot, null, cb);

    return this.renderer.getPublicRootInstance(this.internalRoot);
  }

  unmount(cb: ?Function) {
    this.renderer.updateContainer(null, this.internalRoot, null, cb);
  }
}

export function render(elements, canvasContainer, callback) {
  let exitingRoot = ContainerMap.get(canvasContainer);
  if (exitingRoot) return exitingRoot.render(elements, callback);

  let root = new Root(canvasContainer, Reconciler, true, false);
  ContainerMap.set(canvasContainer, root);
  // Initial render only is unbatched
  return Reconciler.unbatchedUpdates(() => root.render(elements, callback));
}
