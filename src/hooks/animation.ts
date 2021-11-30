import { useRef, RefObject, useState } from "react";

type MilliSeconds = number;
type EasingFunction = (t: number) => number;
type AnimationState = "NOT_STARTED" | "PLAYING" | "COMPLETE";
type Keyframe = { [key: MilliSeconds]: Function };
type AnimationFunction = (callback?: Function | Keyframe) => (void);

interface AnimationOptions {
  node: RefObject<HTMLElement>;
  to: CSSStyleDeclaration;
  from?: CSSStyleDeclaration;
  duration: MilliSeconds;
  ease: EasingFunction;
  delay?: MilliSeconds;
};

interface CSSValueInterface {
  value: {
    number: number;
    unit?: string;
  };
  context: {
    prefix?: string;
    suffix?: string;
  };
};
interface toInterface extends CSSValueInterface, Record<'diff', number> {};

const is = {
  func: (q: any): boolean => q instanceof Function,
  obj: (q: any): boolean => q && q !== null && typeof q === 'object' && !(q instanceof Function),
};

const msToFrame = (t: MilliSeconds): number => t / 1000 * 60;

// Deconstructs CSS value strings (eg, rotate(30deg)) by isolating the number from its
// surrounding parts, stores each part in an object. Makes interpolation more
// straightforward in the animation function. See toInterface for usage.
const parseValue = (to: string | number): CSSValueInterface => {
  const toAsString = to.toString();

  // For values with units, like px, em, %, etc.
  // (-?[\d.]+) Grabs an optional "-" followed by digits or dots
  // ([a-z%]*)  Finds all letters or % signs that directly follow the number
  const valueParts = toAsString.match(/(-?[\d.]+)([a-z%]*)/);
  const value = {
    number: parseFloat((valueParts as RegExpMatchArray)[1]),
    unit: (valueParts as RegExpMatchArray)[2],
  };

  // For values wrapped in functions, like scale(), rotate(), etc.
  // Gets all string parts prior to and following the matched value above, if any exist, and stores them as prefix and suffix.
  const contextParts = toAsString.split(`${(valueParts as RegExpMatchArray)[1]}${(valueParts as RegExpMatchArray)[2]}`);
  const context = {
    prefix: contextParts[0],
    suffix: contextParts[1],
  };

  return { value, context };
};

const useAnimation = ({
  node,
  from,
  to,
  duration = 3000, // 3 seconds
  ease = (t: number): number => t, // Linear,
  delay,
}: AnimationOptions): [AnimationFunction, AnimationState] => {
  const frames = msToFrame(duration);
  const frame = useRef(0);

  const [animationState, setAnimationState] = useState<AnimationState>('NOT_STARTED');

  // An IIAF that sets up an object of objects for each property in to,
  // that will be used to construct animated values. See parseValue for more details.
  const toInterface = (() => {
    let output = {};

    for (const propertyName in to) {
      const toInterface = parseValue(to[propertyName]);
      output = { ...output, ...{ [propertyName]: { ...toInterface } } };
    };

    return output as Record<keyof typeof to, toInterface>;
  })();

  const fromInterface = (() => {
    if (from) {
      let output = {};

      for (const propertyName in from) {
        const fromInterface = parseValue(from[propertyName]);
        output = { ...output, ...{ [propertyName]: { ...fromInterface } } };
      };

      return output as Record<keyof typeof to, toInterface>;
    }
  })();

  const animation: AnimationFunction = (callback) => {
    if (node.current && toInterface) {

      // Set animation state, avoiding needless updates.
      if (animationState !== "PLAYING") {
        setAnimationState("PLAYING");
      }

      // Increment progress.
      frame.current += 1;

      if (is.obj(callback)) {
        // Construct a list of start times from the given keyframes.
        const cbStartTimes = Object.keys(callback as Keyframe).map((t) => parseInt(t));

        cbStartTimes.forEach((t) => {
          // Loop through start times to see if any match the current frame.
          // If one does, execute its callback.
          if (frame.current === msToFrame(t)) {
            (callback as Keyframe)[t]();
          };
        });
      };

      for (const propertyName in toInterface) {
        let currentValue;

        const { context, value: toValue } = toInterface[propertyName];

        if (fromInterface?.[propertyName]) {
          const { value: { number: fromNumber } } = fromInterface[propertyName];
          currentValue = fromNumber - ease(frame.current / frames) * (fromNumber - toValue.number);
        } else {
          currentValue = ease(frame.current / frames) * toValue.number;
        };

        node.current.style[propertyName] = `${context.prefix}${currentValue}${toValue.unit}${context.suffix}`;
      }

      // Continue the callback loop until complete. Make sure to keep passing the user callback!
      if (frame.current < frames) {

        // If delay is given and the animation has not begun.
        if (frame.current === 0 && delay) {
          setTimeout(() => window.requestAnimationFrame(() => animation(callback)), delay);
        } else {
          window.requestAnimationFrame(() => animation(callback));
        };
      };

      if (frame.current === frames) {
        // Update animation state.
        setAnimationState("COMPLETE");

        // When finished, execute the callback on the next frame.
        if (is.func(callback)) {
          window.requestAnimationFrame(() => (callback as Function)());
        };
      };
    } else {
      console.error("Error at frame " + frame.current + ": animation target element ref was null.");
    };
  };

  return [animation, animationState];
};

export default useAnimation;
