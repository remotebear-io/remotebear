import { useCallback, useEffect, useRef } from "react";

export function useDebouncedEffect(effect, deps, delay = 200) {
  const isFirstRenderRef = useRef(true); // Avoid running the callback on initial render
  const callback = useCallback(effect, deps);

  useEffect(() => {
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      return;
    }
    const handler = setTimeout(() => {
      callback();
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [callback, delay]);
}

/**
 * An infinite scroller based on effects.
 * Every time the loader is `N`px to be shown, invoke "onEndReached".
 * @param {Object} [options={}]
 * @param {number} options.currentPage The current page number. Used to avoid
 * invoking the callback multiple times for the same page.
 * @param {boolean} [options.enabled] The observer will disconnect if not enabled.
 * @param {number} [options.distance=250] When scrolling, the distance in pixels from the bottom to switch the page.
 */
export function useInfiniteScroll({
  enabled,
  currentPage,
  distance = 250,
  onEndReached,
}) {
  const loaderRef = useRef();
  const previousPageRef = useRef(currentPage);

  useEffect(() => {
    const loaderNode = loaderRef.current;
    const scrollContainerNode = window;
    if (!scrollContainerNode || !loaderNode || !enabled) return;

    const options = {
      root: null, // Defaults to window
      rootMargin: `0px 0px ${distance}px 0px`,
    };

    let previousY;
    let previousRatio = 0;

    const listener = (entries) => {
      entries.forEach(
        ({ isIntersecting, intersectionRatio, boundingClientRect = {} }) => {
          const { y } = boundingClientRect;
          if (
            isIntersecting &&
            intersectionRatio >= previousRatio &&
            (!previousY || y < previousY)
          ) {
            // FIXME: If the page is still being loaded and you change search
            // query, this check will probably be stuck.
            if (currentPage === 0 || previousPageRef.current !== currentPage) {
              previousPageRef.current = currentPage;
              onEndReached();
            }
          }
          previousY = y;
          previousRatio = intersectionRatio;
        }
      );
    };

    const observer = new IntersectionObserver(listener, options);
    observer.observe(loaderNode);

    return () => observer.disconnect();
  }, [enabled, distance, currentPage, onEndReached]);

  return { loaderRef };
}
